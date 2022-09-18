import Joi from "joi";
import { CustomErrorHandler } from "../../middlewares";
import { Category, Transaction } from "../../models";
import mongoose from "mongoose";
import transactionRecords from "../../utils/transaction";
import moment from "moment";

const transactionController = {
  async addTransaction(req, res, next) {
    const {
      type = "",
      date = new Date(),
      categoryId = "",
      amount = "",
      notes = "",
    } = req.body;

    const transactionSchema = Joi.object({
      type: Joi.string().valid("income", "expense").required(),
      date: Joi.date().iso().required(),
      categoryId: Joi.string().required(),
      amount: Joi.string().max(6).required(),
      notes: Joi.string().optional(),
    });

    const { error } = transactionSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const category = await Category.findOne({ _id: categoryId });

      if (!category) {
        return next(CustomErrorHandler.notFound(404));
      }

      const transaction = new Transaction({
        type,
        date,
        categoryId,
        amount,
        notes,
        userId: req.user._id,
      });

      await transaction.save();

      res.status(201).json(transaction);
    } catch (err) {
      return next(err);
    }
  },

  async getReport(req, res, next) {
    const { type = "", categoryName = "" } = req.query;
    const userId = req.user._id;

    let filter = type
      ? { userId: mongoose.Types.ObjectId(userId), type }
      : { userId: mongoose.Types.ObjectId(userId) };

    let amountByMonth = {};

    let categoryList = await Category.find({ name: categoryName })
      .lean()
      .exec();

    // Add query string to filter
    if (categoryName) {
      const category = categoryList.find(
        (category) => category.name === categoryName
      );
      filter.categoryId = category._id;
    }

    // console.log(filter);

    try {
      const result = await Transaction.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: { year: { $year: "$date" }, month: { $month: "$date" } },
            count: {
              $sum: "$amount",
            },
          },
        },
        {
          $sort: {
            "_id.year": -1,
            "_id.month": -1,
          },
        },
      ]);

      result.forEach((el) => {
        let date = Object.values(el._id).join("-");
        amountByMonth[date] = el.count;
      });

      const recordByType = await transactionRecords.getAmountByType(filter);

      const recordByCategory = await transactionRecords.getAmountByCategory(
        filter
      );

      res.json({
        amountByMonth,
        ammountByType: recordByType,
        ammountByCategory: recordByCategory,
      });
    } catch (error) {
      return next(error);
    }
  },
  async getTransaction(req, res, next) {
    try {
      const {
        type = "today",
        startDate = "",
        endDate = "",
        transactionType = "",
        categoryId = "",
      } = req.query;

      const pageNumber = Number(req.query.page) || 1;
      const PAGE_LIMIT = 2;
      const offset = (pageNumber - 1) * PAGE_LIMIT;
      let getType;
      if (type) {
        getType = transactionRecords.getDateType(type);
      }

      let getStartAndEndDate;
      if (startDate) {
        getStartAndEndDate = transactionRecords.getStartAndEndDate(
          startDate,
          endDate
        );
      }

      let andExpr = [];
      if (type) {
        andExpr.push({ date: getType });
      }

      if (startDate) {
        andExpr.push({ date: getStartAndEndDate });
      }

      if (transactionType) {
        andExpr.push({ type: transactionType });
      }

      if (categoryId) {
        andExpr.push({ categoryId: mongoose.Types.ObjectId(categoryId) });
      }

      const total = await Transaction.countDocuments({
        userId: req.user._id,
        $and: andExpr,
      });

      const transaction = await Transaction.find({
        userId: req.user._id,
        $and: andExpr,
      })
        .skip(offset)
        .limit(PAGE_LIMIT);

      res.json({
        msg: "success",
        transaction,
        page: pageNumber,
        limit: PAGE_LIMIT,
        total,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default transactionController;
