import { mongooseConnect } from "@/lib/mongoose";
import Category from "@/models/Category";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { SessionUserWithAdmin } from "@/types/SessionUserWithAdmin";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await mongooseConnect();

  const session = await getServerSession(authOptions);
  const { isAdmin } = session?.user as SessionUserWithAdmin;

  if (!isAdmin) {
    return NextResponse.json(
      {
        error:
          "Access Denied: You do not have permission to perform this action.",
      },
      { status: 403 }
    );
  }

  const data = await req.json();
  let { name, parentCategory, properties } = data;

  if (parentCategory === "") {
    parentCategory = undefined;
  }

  const categoryDoc = await Category.create({
    name,
    parent: parentCategory || undefined,
    properties,
  });
  return NextResponse.json(categoryDoc);
}

export async function GET(req: NextRequest) {
  await mongooseConnect();

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    return NextResponse.json(await Category.findById(id));
  } else return NextResponse.json(await Category.find().populate("parent"));
}

export async function PUT(req: NextRequest) {
  await mongooseConnect();

  const session = await getServerSession(authOptions);
  const { isAdmin } = session?.user as SessionUserWithAdmin;

  if (!isAdmin) {
    return NextResponse.json(
      {
        error:
          "Access Denied: You do not have permission to perform this action.",
      },
      { status: 403 }
    );
  }

  const data = await req.json();
  let { name, parentCategory, _id, properties } = data;

  if (parentCategory === "") {
    parentCategory = undefined;
  }

  const categoryDoc = await Category.updateOne(
    { _id },
    {
      name,
      parent: parentCategory,
      properties,
    }
  );
  return NextResponse.json(categoryDoc);
}

export async function DELETE(req: NextRequest) {
  await mongooseConnect();

  const session = await getServerSession(authOptions);
  const { isAdmin } = session?.user as SessionUserWithAdmin;

  if (!isAdmin) {
    return NextResponse.json(
      {
        error:
          "Access Denied: You do not have permission to perform this action.",
      },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  console.log(url);

  await Category.deleteOne({ _id });
  return NextResponse.json("SUCCESSFULLY DELETED CATEGORY");
}
