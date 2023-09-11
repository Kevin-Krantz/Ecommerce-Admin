"use client";

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { ICategory } from "@/types/ICategory";
import SweetAlert2 from "react-sweetalert2";
interface ICategoryWithID extends ICategory {
  _id: string;
}

interface Property {
  name: string;
  values: string;
}

export default function Categories() {
  const [editedCategory, setEditedCategory] = useState<ICategoryWithID | null>(
    null
  );

  const [name, setName] = useState("");

  const [parentCategory, setParentCategory] = useState("");

  const [categories, setCategories] = useState<ICategoryWithID[]>([]);

  const [swalProps, setSwalProps] = useState({});

  const [categoryToDelete, setCategoryToDelete] =
    useState<ICategoryWithID | null>(null);

  const [properties, setProperties] = useState<Array<Property>>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(
    ev: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    ev.preventDefault();

    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };

    if (editedCategory) {
      await axios.put("/api/categories", { ...data, _id: editedCategory._id });
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }

    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category: ICategoryWithID) {
    setEditedCategory(category);
    setName(category.name);

    const parentID =
      category.parent && category.parent._id
        ? category.parent._id.toString()
        : "";

    setParentCategory(parentID);
    setProperties(
      category.properties?.map(({ name, values }) => ({
        name,
        values: values.join(","),
      })) || []
    );
  }

  function handleSwalConfirm() {
    if (categoryToDelete) {
      const { _id } = categoryToDelete;
      axios.delete("/api/categories?_id=" + _id).then(() => {
        fetchCategories();
        setCategoryToDelete(null);
      });
    }
  }

  async function deleteCategory(category: ICategoryWithID) {
    setCategoryToDelete(category);

    setSwalProps({
      show: true,
      title: `Are you sure you want to delete ${category.name} category?`,
      text: "Once deleted, you cannot recover this category!",
      icon: "warning",
      confirmButtonColor: "#d55",
      confirmButtonText: "Delete",
      showCancelButton: true,
    });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(
    index: number,
    property: Property,
    newName: string
  ) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(
    index: number,
    property: Property,
    newValues: string
  ) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove: number) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2" key={index}>
                <input
                  type="text"
                  placeholder="property name (example: color)"
                  value={property.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                />
                <input
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  className="mb-0"
                  type="text"
                  value={property.values}
                  placeholder="values, comma separated"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-default"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-primary mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-primary"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      <SweetAlert2
        {...swalProps}
        onConfirm={handleSwalConfirm}
        didClose={() => {
          setSwalProps({});
        }}
      />
    </Layout>
  );
}
