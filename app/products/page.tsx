"use client";

import Link from "next/link";
import Layout from "@/app/components/Layout";

export default function Products(): JSX.Element {
  return (
    <Layout>
      <Link
        className="bg-blue-900 text-white rounded-md py-1 px-2"
        href={"/products/new"}
      >
        Add new product
      </Link>
    </Layout>
  );
}
