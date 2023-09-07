"use client";

import axios from "axios";
import { redirect } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { ICategory, Property } from "@/types/ICategory";

interface Props extends IProduct {
  _id?: string;
  images?: any;
}

interface ICategoryWithID extends ICategory {
  _id: string;
}

interface IProductProperties {
  [key: string]: string | number | boolean;
}

export default function ProductsForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}: Props): JSX.Element {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [goToProducts, setGoToProducts] = useState(false);
  const [imageUrl, setImageUrl] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<ICategoryWithID[]>([]);
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] =
    useState<IProductProperties>(assignedProperties || {});

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(
    ev: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images: imageUrl,
      category,
      properties: productProperties,
    };
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

  function updateImagesOrder(images: any) {
    setImageUrl(images);
  }

  function setProductProp(propName: string, value: string | number | boolean) {
    setProductProperties((prev: IProductProperties) => {
      const newProductprops = { ...prev };
      newProductprops[propName] = value;
      return newProductprops;
    });
  }

  const propertiesToFill: Property[] = [];

  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);

    propertiesToFill.push(...(catInfo?.properties ?? []));

    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id.toString() === catInfo?.parent?._id?.toString()
      );

      propertiesToFill.push(...(parentCat?.properties ?? []));

      catInfo = parentCat;
    }
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
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="flex gap-1" key={p._id}>
            <div>{p.name}</div>
            <select
              value={String(productProperties[p.name] || "")}
              onChange={(ev) => setProductProp(p.name, ev.target.value)}
            >
              <option value="">{`Select ${p.name.toLowerCase()}`}</option>
              {p.values.map((v) => (
                <option key={`${p._id}-${v}`} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ))}

      <label>Photos </label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={imageUrl}
          setList={updateImagesOrder}
        >
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
        </ReactSortable>
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
