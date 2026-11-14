
import React from "react";

const SettlementForm = ({
  showSettlementForm,
  setShowSettlementForm,
  settlementForm,
  setSettlementForm,
  members,
  saveSettlement,
}) => {
  if (!showSettlementForm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={saveSettlement}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Record Settlement
          </h2>

          <button
            type="button"
            onClick={() => setShowSettlementForm(false)}
            className="text-2xl text-gray-400"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {/* Paid By */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Paid By
            </label>

            <select
              value={settlementForm.from}
              onChange={(e) =>
                setSettlementForm({
                  ...settlementForm,
                  from: e.target.value,
                })
              }
              className="w-full rounded-lg border px-3 py-3"
              required
            >
              <option value="">Select member</option>

              {members.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                  disabled={member.id === settlementForm.to}
                >
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Paid To */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Paid To
            </label>

            <select
              value={settlementForm.to}
              onChange={(e) =>
                setSettlementForm({
                  ...settlementForm,
                  to: e.target.value,
                })
              }
              className="w-full rounded-lg border px-3 py-3"
              required
            >
              <option value="">Select member</option>

              {members.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                  disabled={member.id === settlementForm.from}
                >
                  {member.name}
                </option>
              ))}
            </select>
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
              value={settlementForm.amount}
              onChange={(e) =>
                setSettlementForm({
                  ...settlementForm,
                  amount: e.target.value,
                })
              }
              placeholder="Enter amount"
              className="w-full rounded-lg border px-3 py-3"
              required
            />
          </div>

          <p className="text-xs text-gray-500">
            The payment cannot exceed the currently suggested
            amount between these members.
          </p>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
          >
            Save Settlement
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettlementForm;
