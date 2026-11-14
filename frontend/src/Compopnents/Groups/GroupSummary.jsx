
import React from "react";

const GroupSummary = ({
  totalExpenses,
  totalMembers,
  totalExpenseCount,
  money,
}) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

      {/* Total Expenses */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Total Expenses
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-800">
          {money(totalExpenses)}
        </h2>
      </div>

      {/* Total Members */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Members
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-800">
          {totalMembers}
        </h2>
      </div>

      {/* Expense Count */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Expense Transactions
        </p>

        <h2 className="mt-2 text-2xl font-bold text-gray-800">
          {totalExpenseCount}
        </h2>
      </div>

    </div>
  );
};

export default GroupSummary;
