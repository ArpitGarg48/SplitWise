
import React from "react";

const BalanceList = ({ members, balances, money }) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Member Balances
      </h2>

      {members.length === 0 ? (
        <p className="text-center text-gray-500">
          Add members to view balances.
        </p>
      ) : (
        <div className="space-y-4">
          {members.map((member) => {
            const balance = balances[member.id];

            return (
              <div
                key={member.id}
                className="rounded-lg border p-4"
              >
                <div className="mb-3 flex justify-between gap-3">
                  <p className="font-semibold">
                    {member.name}
                  </p>

                  <p
                    className={`text-right font-bold ${
                      balance.net > 0
                        ? "text-green-600"
                        : balance.net < 0
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {balance.net > 0
                      ? `Gets back ${money(balance.net)}`
                      : balance.net < 0
                      ? `Owes ${money(-balance.net)}`
                      : "Settled up"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-gray-500">Paid</p>
                    <p className="font-medium">
                      {money(balance.paid)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Share</p>
                    <p className="font-medium">
                      {money(balance.share)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Sent</p>
                    <p className="font-medium">
                      {money(balance.sent)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Received</p>
                    <p className="font-medium">
                      {money(balance.received)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BalanceList;
