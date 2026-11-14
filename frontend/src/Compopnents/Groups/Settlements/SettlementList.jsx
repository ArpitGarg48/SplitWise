
import React from "react";

const SettlementList = ({
  settlements,
  members,
  getMemberName,
  money,
  deleteSettlement,
  openAddSettlement,
}) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold">
          Settlement History
        </h2>

        <button
          type="button"
          onClick={openAddSettlement}
          disabled={members.length < 2}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          + Record Settlement
        </button>
      </div>

      {settlements.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          No settlements recorded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {settlements.map((settlement) => (
            <div
              key={settlement.id}
              className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {getMemberName(settlement.from)} paid{" "}
                  {getMemberName(settlement.to)}
                </p>

                <p className="mt-1 text-lg font-bold text-green-600">
                  {money(settlement.amount)}
                </p>

                <p className="text-xs text-gray-400">
                  {new Date(settlement.date).toLocaleString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => deleteSettlement(settlement.id)}
                className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-200"
              >
                Delete Settlement
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettlementList;
