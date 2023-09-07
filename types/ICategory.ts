import { Types } from "mongoose";

export interface ICategory {
  name: string;
  parent?: IParentCategory;
  properties?: Property[];
}

interface IParentCategory {
  _id: Types.ObjectId;
  name: string;
}

export interface Property {
  name: string;
  values: string[];
  _id: string;
}
