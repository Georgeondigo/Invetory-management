"use client";

import { useState } from "react";
import { useCreateProductMutation, useGetProductsQuery } from "../state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import Header from "../(components)/Header";
import Rating from "../(components)/Rating";
import CreateProductModal from "./CreateProductModal";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const handleCreateProduct = async (productData : ProductFormData) => {
      await createProduct(productData);
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !products) {
    return (
      <div className="py-4 text-center text-red-500">
        Error loading products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/*SEARCH BAR*/}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search Products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/*HEADER*/}
      <div className="flex items-center justify-between mb-6">
        <Header name="Products" />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-gray-200 font-bold rounded hover:bg-blue-700"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !test-gray-200" />
          Add Product
        </button>
      </div>
      {/*PRODUCTS LIST*/}
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3  gap-10 justify-between">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          products.map((product) => (
            <div
              key={product.productId}
              className=" shadow rounded-md border  border-gray-200 p-4 max-w-full w-full mx-auto"
            >
              <div className="flex flex-col items-center mb-4">
                IMG
                <h3 className=" flex justify-center text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="  text-gray-800">
                  {" "}
                  Kes {product.price.toFixed(2)}
                </p>
                <div className=" text-sm mt-1 text-gray-600">
                  Stock: {product.stockQuantity}
                </div>
                {product.rating && (
                  <div className="flex items-center mt-2">
                    <Rating rating={product.rating} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/*MODAL FOR ADDING PRODUCT*/}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />
    </div>
  );
};

export default Products;
