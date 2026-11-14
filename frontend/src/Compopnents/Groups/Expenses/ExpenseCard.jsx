
import React from "react";

const ExpenseCard = ({
  expense,
  getMemberName,
  money,
  openEditExpense,
  deleteExpense,
}) => {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row">
      <div>
        <h3 className="font-semibold text-gray-800">
          {expense.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Paid by {getMemberName(expense.paidBy)}
        </p>

        <p className="text-sm text-gray-500">
          {expense.category} ·{" "}
          {new Date(expense.date).toLocaleDateString()}
        </p>

        <p className="mt-2 text-sm text-gray-600">
          Participants:{" "}
          {expense.participants.map(getMemberName).join(", ")}
        </p>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 sm:items-end">
        <p className="text-lg font-bold text-gray-800">
          {money(expense.amount)}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEditExpense(expense)}
            className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => deleteExpense(expense.id)}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
