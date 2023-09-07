import mongoose, { Schema, Document, model, Model, models } from "mongoose";

interface IProductDocument extends IProduct, Document {}

const ProductSchema = new Schema<IProductDocument>({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: { type: Object },
});

let Product: Model<IProductDocument>;

Product = models.Product
  ? (Product = model<IProductDocument>("Product"))
  : (Product = model<IProductDocument>("Product", ProductSchema));

export default Product;
