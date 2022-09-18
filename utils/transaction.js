import { Category, Transaction } from "../models";
import moment from "moment";

const transactionRecords = {
  async getAmountByType(filter) {
    let amountByType = {};
    const result = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { category: "$categoryId" },
          expenseTotal: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: ["$type", "expense"],
                    },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
          incomeTotal: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: ["$type", "income"],
                    },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    let expenseTotal = 0;
    let incomeTotal = 0;
    result.forEach((el) => {
      expenseTotal = expenseTotal + el.expenseTotal;
      incomeTotal = incomeTotal + el.incomeTotal;
      amountByType["expense"] = expenseTotal;
      amountByType["income"] = incomeTotal;
    });

    return amountByType;
  },

  async getAmountByCategory(filter) {
    let amountByCategory = {};
    const result = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { category: "$categoryId" },
          count: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    let categoryList = await Category.find({ type: "expense" }).lean().exec();

    result.forEach((el) => {
      let id = el._id.category;
      amountByCategory[id] = el.count;
    });

    const categoryObject = Object.assign(
      ...categoryList.map((category) => ({
        [category.name]: amountByCategory[category._id] || 0,
      }))
    );
    categoryList.forEach((category) => {
      category.amount = categoryObject[category.name];
    });
    return categoryObject;
  },

  getDateType(dateType) {
    switch (dateType) {
      case "today":
        return {
          $gte: moment().startOf("day").format(),
          $lte: moment().endOf("day").format(),
        };
      case "yesterday":
        return {
          $gte: moment().subtract(1, "days").startOf("day").format(),
          $lte: moment().subtract(1, "days").endOf("day").format(),
        };
      case "thisMonth":
        return {
          $gte: moment().startOf("month").format(),
          $lte: moment().endOf("month").format(),
        };
      case "lastMonth":
        return {
          $gte: moment().subtract(1, "months").startOf("month").format(),
          $lte: moment().subtract(1, "months").startOf("month").format(),
        };
      default:
        return {
          $gte: moment().startOf("day").format(),
          $lte: moment().endOf("day").format(),
        };
    }
  },

  getStartAndEndDate(startDate, endDate = "") {
    if (!endDate) {
      return {
        $gte: moment(startDate).startOf("day").format(),
        $lte: moment(startDate).endOf("day").format(),
      };
    }

    if (startDate && endDate) {
      return {
        $gte: moment(startDate).startOf("day").format(),
        $lte: moment(endDate).endOf("day").format(),
      };
    }
  },
};

export default transactionRecords;
