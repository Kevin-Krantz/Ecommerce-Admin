"use client";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Document } from "mongodb";

interface IOrderDocument extends IOrder, Document {}

export default function Orders(): JSX.Element {
  const [orders, setOrders] = useState<IOrderDocument[]>([]);

  useEffect(() => {
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td className={order.paid ? "text-green-600" : "text-red-600"}>
                {order.paid ? "YES" : "NO"}
              </td>
              <td>
                {order.name} {order.email} <br />
                {order.city} {order.postalCode} {order.country} <br />
                {order.streetAddress}
              </td>
              <td>
                {order.line_items.map((line) => (
                  <>
                    {line.price_data.product_data.name} x {line.quantity} <br />
                  </>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
