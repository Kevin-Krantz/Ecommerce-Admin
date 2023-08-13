"use client";

import Layout from "@/app/components/Layout";
import ProductsForm from "@/app/components/ProductsForm";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState<IProduct>();
  const params = useParams();
  const id = params?.id[0];

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, []);

  return (
    <Layout>
      <h1>Edit product</h1>
      {productInfo && <ProductsForm {...productInfo} />}
    </Layout>
  );
}
