import db from "../../config/mongoose";
import Category from "../Category/CategoryModel";
import categoryList from "./categories.json";

// Success
db.once("open", () => {
  const categories = [];
  categoryList.results.forEach((category) => {
    categories.push(category);
  });
  Category.create(categories)
    .then(() => {
      console.log("insert data done...");
      return db.close();
    })
    .then(() => console.log("database connection close"));
});
