"use client";

import React, { useState } from "react";
import { useGetUsersQuery } from "../state/api";
import { SearchIcon } from "lucide-react";
import Header from "../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
  { field: "userId", headerName: "ID", flex: 1, minWidth: 150 },
];

function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading, isError } = useGetUsersQuery(searchTerm);

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isError || !users) {
    return (
      <div className="py-4 text-center text-red-500">Error loading users</div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full px-4">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <Header name="Users" />
      </div>

      {/* USER LIST */}
      <div className="h-[calc(100vh-260px)] w-full">
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.userId}
          checkboxSelection
          className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700"
        />
      </div>
    </div>
  );
}

export default Users;
