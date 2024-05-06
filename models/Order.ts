import { Schema, Document, model, Model, models } from "mongoose";

interface IOrderDocument extends IOrder, Document {}

const OrderSchema = new Schema<IOrderDocument>(
  {
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

let Order: Model<IOrder>;

Order = models.Order
  ? (Order = model<IOrder>("Order"))
  : (Order = model<IOrder>("Order", OrderSchema));

export default Order;
