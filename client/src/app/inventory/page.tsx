"use client";

import { DataGrid } from "@mui/x-data-grid";
import Header from "../(components)/Header";
import { useGetProductsQuery } from "../state/api";
import { GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "productId", headerName: "ID",minWidth: 80, flex: 1, },
  { field: "name", headerName: "Product Name", minWidth: 120, flex: 1, },
  {
    field: "price",
    headerName: "Price",
    type: "number",
   minWidth: 90, flex: 1,
    valueGetter: (value, row) => `Kes ${row.price}`,
  },
  {
    field: "rating",
    headerName: "Rating",
    type: "number",
    minWidth: 100, flex: 1,
    valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
  },
  {
    field: "stockQuantity",
    headerName: "Stock Quantity",
    type: "number",
    minWidth: 120,
    flex: 1,
  },
];

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();

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
    <div className="flex flex-col ">
      <Header name="Inventory" />
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.productId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700" 
      />
    </div>
  );
};

export default Inventory;
