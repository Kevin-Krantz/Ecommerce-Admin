"use client";

import axios from "axios";
import { redirect } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Spinner from "./Spinner";

interface Props {
  title: string;
  description?: string;
  price: number;
  _id?: string;
  images: any;
}

export default function ProductsForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}: Props): JSX.Element {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [goToProducts, setGoToProducts] = useState(false);
  const [imageUrl, setImageUrl] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);

  async function saveProduct(
    ev: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    ev.preventDefault();
    const data = { title, description, price, images: imageUrl };
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

  async function uploadImages(e: ChangeEvent<HTMLInputElement>) {
    const fileInput = e.target;

    if (!fileInput.files) {
      console.warn("no file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("files list is empty");
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("something went wrong, check your console.");
        return;
      }

      const data: { fileUrl: string } = await res.json();

      setImageUrl((prevUrls: any) => [...prevUrls, data.fileUrl]);

      setIsUploading(false);
    } catch (error) {
      console.error("something went wrong, check your console.");
    }

    setIsUploading(false);

    /** Reset file input */
    e.target.type = "text";
    e.target.type = "file";
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
      <label>Photos </label>
      <div className="mb-2 flex flex-wrap gap-1">
        {imageUrl.map((url: any, index: any) => (
          <div key={index} className="h-24">
            <img
              className="rounded-lg"
              key={index}
              src={url}
              alt={`Product ${index}`}
            />
          </div>
        ))}
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="inline-block w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
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
