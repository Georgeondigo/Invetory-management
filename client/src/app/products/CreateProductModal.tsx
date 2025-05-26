import React, { FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "../(components)/Header";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState({
    productId: v4(),
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity" || name === "rating"
          ? parseFloat(value)
          : value,
    });
  };

  const handlesubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const labelCssStyles = "block text-gray-700 text-sm font-medium ";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-2 border-gray-500 rounded-md ";

  return (
    <div className="fixed inset-0 bg-gray-600/50   overflow-y-auto h-full w-full z-20">
      <div className=" relative top-20 mx-auto p-5 border w-96  border-gray-100 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handlesubmit} className="mt-5">
          {/*PRODUNCT NAME*/}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/*PRODUNCT NAME*/}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />
          {/*PRODUNCT NAME*/}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
          />
          {/*PRODUNCT NAME*/}
          <label htmlFor="rating" className={labelCssStyles}>
            Rating
          </label>
          <input
            type="number"
            name="rating"
            min="0"
            max="5"
            placeholder="Rating (0-5)"
            onChange={handleChange}
            value={formData.rating}
            className={inputCssStyles}
            required
          />
          { /*SUBMIT BUTTON*/}
            <button type="submit" className=" bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mt-4">
            Create
          </button>
            <button
                type="button"
                onClick={onClose}
                className=" bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 mt-4 ml-2"
            >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
