
import React from "react";

const WhoOwesWhom = ({
  settlementMatrix,
  getMemberName,
  money,
  openSettlement,
}) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Who Owes Whom
      </h2>

      {Object.values(settlementMatrix).every(
        (creditors) => Object.keys(creditors).length === 0
      ) ? (
        <p className="text-center text-gray-500">
          Everyone is settled up!
        </p>
      ) : (
        <div className="space-y-3">
          {Object.entries(settlementMatrix).map(
            ([from, creditors]) =>
              Object.entries(creditors).map(([to, amount]) => (
                <div
                  key={`${from}-${to}`}
                  className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                >
                  <p>
                    <strong>{getMemberName(from)}</strong> owes{" "}
                    <strong>{getMemberName(to)}</strong>
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-red-600">
                      {money(amount)}
                    </p>

                    <button
                      onClick={() =>
                        openSettlement(from, to, amount)
                      }
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                    >
                      Settle Up
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default WhoOwesWhom;
