import React from 'react';
import { ExpenseByCategorySummary, useGetDashboardMetricsQuery } from '../state/api';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

type ExpenseSums = {
  [category: string]: number;
};

const colors = ["#00C94F", "#0088FE", "#FFBB28"];

const CardExpenseSummary = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  const expenseByCategorySummary = dashboardMetrics?.expenseByCategorySummary || [];
  const expenseSummary = dashboardMetrics?.expenseSummary || [];

  // Aggregate expenses by category
  const expenseSums = expenseByCategorySummary.reduce(
    (acc: ExpenseSums, item: ExpenseByCategorySummary) => {
      const category = item.category + " Expenses";
      const amount = typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount;
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    },
    {}
  );

  const expenseCategories = Object.entries(expenseSums).map(([name, value]) => ({
    name,
    value,
  }));

  const totalExpenses = expenseCategories.reduce((acc, category) => acc + category.value, 0);
  const formattedTotalExpenses = totalExpenses.toFixed(2);

  // Compute average totalExpenses from summary
  const averageTotalExpenses = expenseSummary.reduce((sum: number, item: any) => {
    const total = typeof item.totalExpenses === 'string'
      ? parseFloat(item.totalExpenses)
      : item.totalExpenses ?? 0;
    return sum + total;
  }, 0) / (expenseSummary.length || 1);

  return (
    <div className='row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between'>
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className='text-lg font-semibold px-7 pt-5 pb-2'>Expense Summary</h2>
            <hr className="border-gray-300" />
          </div>

          {/* BODY */}
          <div className='xl:flex justify-between pr-7'>
            {/* CHART */}
            <div className='relative basis-3/5 h-52'>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    innerRadius={50}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
                <span className='font-bold text-sm'>
                  Kes {formattedTotalExpenses}
                </span>
              </div>
            </div>

            {/* LABELS */}
            <ul className='flex flex-col justify-around items-center xl:items-start py-5 gap-3'>
              {expenseCategories.map((entry, index) => (
                <li key={`legend-${index}`} className='flex items-center text-xs'>
                  <span
                    className='w-3 h-3 rounded-full mr-2'
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></span>
                  {entry.name}
                </li>
              ))}
            </ul>
          </div>

          {/* FOOTER */}
          <div>
            <hr className='border-gray-300'/>
            {expenseSummary.length > 0 && (
              <div className='mt-3 flex justify-between items-center px-7 mb-4'>
                <div className='pt-2'>
                  <p className='text-sm'>
                    Average:{' '}
                    <span className='font-semibold'>
                      Kes {averageTotalExpenses.toFixed(2)}
                    </span>
                  </p>
                </div>
                <span className='flex items-center mt-2'>
                  <TrendingUp className='mr-2 text-green-500' />
                  30%
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CardExpenseSummary;
