"use client";

import Layout from "@/app/components/Layout";
import ProductsForm from "@/app/components/ProductsForm";

export default function NewProduct(): JSX.Element {
  return (
    <Layout>
      <h1>New Product</h1>
      <ProductsForm title="" description="" price={0} />
    </Layout>
  );
}
