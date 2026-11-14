
import React from "react";

const ExpenseForm = ({
  showExpenseForm,
  setShowExpenseForm,
  editingExpenseId,
  expenseForm,
  setExpenseForm,
  members,
  categories,
  saveExpense,
  toggleParticipant,
}) => {
  if (!showExpenseForm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <form
        onSubmit={saveExpense}
        className="my-8 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editingExpenseId ? "Edit Expense" : "Add Expense"}
          </h2>

          <button
            type="button"
            onClick={() => setShowExpenseForm(false)}
            className="text-2xl text-gray-400"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {/* Expense Title */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Expense Title
            </label>

            <input
              value={expenseForm.title}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  title: e.target.value,
                })
              }
              placeholder="e.g. Dinner"
              className="w-full rounded-lg border px-3 py-3"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Amount (₹)
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={expenseForm.amount}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  amount: e.target.value,
                })
              }
              placeholder="Enter amount"
              className="w-full rounded-lg border px-3 py-3"
              required
            />
          </div>

          {/* Paid By */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Paid By
            </label>

            <select
              value={expenseForm.paidBy}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  paidBy: e.target.value,
                })
              }
              className="w-full rounded-lg border px-3 py-3"
              required
            >
              <option value="">Select member</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>

            <select
              value={expenseForm.category}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  category: e.target.value,
                })
              }
              className="w-full rounded-lg border px-3 py-3"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Split Type */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Split Type
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setExpenseForm({
                    ...expenseForm,
                    splitType: "equal",
                  })
                }
                className={`flex-1 rounded-lg border p-3 ${
                  expenseForm.splitType === "equal"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : ""
                }`}
              >
                Equal Split
              </button>

              <button
                type="button"
                onClick={() =>
                  setExpenseForm({
                    ...expenseForm,
                    splitType: "ratio",
                  })
                }
                className={`flex-1 rounded-lg border p-3 ${
                  expenseForm.splitType === "ratio"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : ""
                }`}
              >
                Ratio Split
              </button>
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Split Between
            </label>

            <div className="space-y-2 rounded-lg border p-3">
              {members.map((member) => {
                const selected =
                  expenseForm.participants.includes(member.id);

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleParticipant(member.id)
                        }
                      />

                      {member.name}
                    </label>

                    {selected &&
                      expenseForm.splitType === "ratio" && (
                        <input
                          type="number"
                          min="0.01"
                          step="any"
                          placeholder="Ratio"
                          value={expenseForm.ratios[member.id] || ""}
                          onChange={(e) =>
                            setExpenseForm((prev) => ({
                              ...prev,
                              ratios: {
                                ...prev.ratios,
                                [member.id]: e.target.value,
                              },
                            }))
                          }
                          className="w-24 rounded-lg border px-2 py-1"
                        />
                      )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {editingExpenseId ? "Update Expense" : "Save Expense"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
