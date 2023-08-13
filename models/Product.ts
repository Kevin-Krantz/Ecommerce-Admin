import { Schema, Document, model, Model, models } from "mongoose";

interface IProductDocument extends IProduct, Document {}

const ProductSchema = new Schema<IProductDocument>({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
});

let Product: Model<IProductDocument>;

if (models.Product) {
  Product = model<IProductDocument>("Product");
} else {
  Product = model<IProductDocument>("Product", ProductSchema);
}
export default Product;
