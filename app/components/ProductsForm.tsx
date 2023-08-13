"use client";

import axios from "axios";
import { redirect } from "next/navigation";
import { useState } from "react";

interface Props {
  title: string;
  description?: string;
  price: number;
  _id?: string;
}

export default function ProductsForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}: Props): JSX.Element {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [goToProducts, setGoToProducts] = useState(false);
  async function saveProduct(
    ev: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    ev.preventDefault();
    const data = { title, description, price };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    return redirect("/products");
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.valueAsNumber)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
