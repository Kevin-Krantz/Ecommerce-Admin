import { ICategory } from "@/types/ICategory";
import { Schema, Document, model, Model, models, Types } from "mongoose";

interface ICategoryDocument extends ICategory, Document {}

const PropertySchema = new Schema({
  name: { type: String, required: true },
  values: { type: [String], required: true },
});

const CategorySchema = new Schema<ICategoryDocument>({
  name: { type: String, required: true },
  parent: { type: Types.ObjectId, ref: "Category" },
  properties: [PropertySchema],
});

let Category: Model<ICategoryDocument>;

Category = models.Category
  ? model<ICategoryDocument>("Category")
  : model<ICategoryDocument>("Category", CategorySchema);

export default Category;
