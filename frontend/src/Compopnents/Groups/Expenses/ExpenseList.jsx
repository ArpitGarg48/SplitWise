
import React from "react";
import ExpenseCard from "./ExpenseCard";

const ExpenseList = ({
  expenses,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  categories,
  getMemberName,
  money,
  openEditExpense,
  deleteExpense,
}) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row">
        <h2 className="text-xl font-semibold">
          Group Expenses
        </h2>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expense..."
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {expenses.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          No expenses found.
        </p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              getMemberName={getMemberName}
              money={money}
              openEditExpense={openEditExpense}
              deleteExpense={deleteExpense}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
