"use client";

import {
  ExpenseByCategorySummary,
  useGetExpensesByCategoryQuery,
} from "../state/api";
import { useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type AggregatedDataItem = {
  name: string;
  color?: string;
  amount: number;
};

type AggregatedData = {
  [category: string]: AggregatedDataItem;
};

const Expenses = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data: expensesData,
    isLoading,
    isError,
  } = useGetExpensesByCategoryQuery();
  const expenses = useMemo(() => expensesData ?? [], [expensesData]);

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const aggregatedData: AggregatedDataItem[] = useMemo(() => {
    const filtered: AggregatedData = expenses
      .filter((data: ExpenseByCategorySummary) => {
        const matchesCategory =
          selectedCategory === "All" || data.category === selectedCategory;
        const dataDate = parseDate(data.date);
        const matchesDate =
          !startDate ||
          !endDate ||
          (dataDate >= startDate && dataDate <= endDate);
        return matchesCategory && matchesDate;
      })
      .reduce((acc: AggregatedData, data: ExpenseByCategorySummary) => {
        const amount = parseInt(data.amount);
        if (!acc[data.category]) {
          acc[data.category] = { name: data.category, amount: 0 };
          acc[data.category].color = `#${Math.floor(
            Math.random() * 16777215
          ).toString(16)}`;
        }
        acc[data.category].amount += amount;
        return acc;
      }, {});
    return Object.values(filtered);
  }, [expenses, selectedCategory, startDate, endDate]);

  const totalExpenses = aggregatedData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const classNames = {
    label: "block text-sm font-medium text-gray-700",
    selectInput:
      "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
  };

  if (isLoading) return <div className="py-4">Loading...</div>;
  if (isError || !expensesData)
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch expenses
      </div>
    );

  return (
    <div>
      {/* HEADER */}
      <div className="mb-5">
        <Header name="Expenses" />
        <p className="text-sm text-gray-500">
          A visual representation of expenses over time.
        </p>
      </div>

      {/* TOTAL EXPENSE */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Total: KES {totalExpenses.toLocaleString()}
        </h2>
        <p className="text-gray-500 text-sm">Across all categories</p>
      </div>

      {/* FILTERS + CHART */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* FILTER CARD */}
        <div className="w-full md:w-1/3 bg-white shadow-xl rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Filter by Category and Date
          </h3>

          {/* Category */}
          <div>
            <label htmlFor="category" className={classNames.label}>
              Category
            </label>
            <select
              id="category"
              name="category"
              className={classNames.selectInput}
              defaultValue="All"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All</option>
              <option>Office</option>
              <option>Professional</option>
              <option>Salaries</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="start-date" className={classNames.label}>
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              name="start-date"
              className={classNames.selectInput}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end-date" className={classNames.label}>
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              name="end-date"
              className={classNames.selectInput}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* PIE CHART */}
        <div className="flex-grow bg-white shadow-xl rounded-2xl p-6">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={aggregatedData}
                cx="50%"
                cy="50%"
                outerRadius={140}
                dataKey="amount"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {aggregatedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === activeIndex
                        ? "rgb(59,130,246)"
                        : entry.color
                    }
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) =>
                  `KES ${parseInt(value).toLocaleString()}`
                }
                labelFormatter={(_, payload: any[]) => {
                  const percent =
                    ((payload[0]?.value ?? 0) / totalExpenses) * 100;
                  return `${payload[0]?.name} — ${percent.toFixed(1)}%`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* CUSTOM LEGEND */}
          <div className="mt-6 space-y-2">
            {aggregatedData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-800">{item.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  KES {item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
