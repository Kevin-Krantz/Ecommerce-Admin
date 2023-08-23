"use client";

import Layout from "@/app/components/Layout";
import axios from "axios";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [productInfo, setProductInfo] = useState<IProduct | undefined>();

  const params = useParams();
  const id = params?.id[0];

  useEffect(() => {
    if (shouldRedirect) {
      redirect("/products");
    }
  }, [shouldRedirect]);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  async function deleteProduct() {
    await axios.delete(`/api/products?id=${id}`);
    setShouldRedirect(true);
  }

  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete "{productInfo?.title}"?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="btn-red">
          Yes
        </button>
        <button className="btn-default" onClick={() => setShouldRedirect(true)}>
          No
        </button>
      </div>
    </Layout>
  );
}
