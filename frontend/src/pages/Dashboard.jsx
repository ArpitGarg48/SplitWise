
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, clearSession, getCurrentUser } from "../lib/api";

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format((amount || 0) / 100);

const Dashboard = () => {
  const navigate = useNavigate();

  const currentUser = getCurrentUser();
  const username = currentUser?.name || "User";
  const [groupData, setGroupData] = useState({
    groupName: "",
    members: [],
    expenses: [],
    settlements: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/api/group")
      .then((data) => {
        if (active) setGroupData(data.group || { groupName: "", members: [], expenses: [], settlements: [] });
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "Could not load dashboard data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const groupName = groupData.groupName || "";
  const members = groupData.members || [];
  const expenses = groupData.expenses || [];
  const settlements = groupData.settlements || [];

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Calculate each member's balance
  const balances = {};

  members.forEach((member) => {
    balances[member.id] = {
      paid: 0,
      share: 0,
      sent: 0,
      received: 0,
      net: 0,
    };
  });

  expenses.forEach((expense) => {
    if (balances[expense.paidBy]) {
      balances[expense.paidBy].paid += expense.amount;
    }

    Object.entries(expense.shares || {}).forEach(
      ([memberId, share]) => {
        if (balances[memberId]) {
          balances[memberId].share += share;
        }
      }
    );
  });

  settlements.forEach((settlement) => {
    if (balances[settlement.from]) {
      balances[settlement.from].sent += settlement.amount;
    }

    if (balances[settlement.to]) {
      balances[settlement.to].received += settlement.amount;
    }
  });

  members.forEach((member) => {
    const balance = balances[member.id];

    balance.net =
      balance.paid -
      balance.share +
      balance.sent -
      balance.received;
  });

  // Total amount still owed within the group
  const totalOutstanding = Object.values(balances).reduce(
    (total, balance) =>
      total + (balance.net > 0 ? balance.net : 0),
    0
  );

  // Recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getMemberName = (memberId) =>
    members.find((member) => member.id === memberId)?.name ||
    "Unknown";

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const openGroup = () => {
    navigate("/group");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-bold text-green-600">
            SplitWise
          </h1>

          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">
              {username}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">

        {loading && <p className="mb-5 text-sm text-gray-500">Loading your dashboard...</p>}
        {loadError && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{loadError}</p>}

        {/* Heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Dashboard
            </h2>

            <p className="mt-2 text-gray-500">
              Here's an overview of your group expenses.
            </p>
          </div>

          {groupName && (
            <button
              onClick={openGroup}
              className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            >
              Open Group
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <section className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Expenses
            </p>

            <h3 className="mt-3 text-2xl font-bold text-gray-800">
              {money(totalExpenses)}
            </h3>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Members
            </p>

            <h3 className="mt-3 text-2xl font-bold text-gray-800">
              {members.length}
            </h3>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Transactions
            </p>

            <h3 className="mt-3 text-2xl font-bold text-gray-800">
              {expenses.length}
            </h3>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Outstanding Balance
            </p>

            <h3 className="mt-3 text-2xl font-bold text-orange-600">
              {money(totalOutstanding)}
            </h3>
          </div>

        </section>

        {/* Group Overview */}
        <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Your Group
              </p>

              <h3 className="mt-1 text-xl font-bold text-gray-800">
                {groupName || "No group created yet"}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {members.length} members · {expenses.length} expenses · {settlements.length} settlements
              </p>
            </div>

            <button
              onClick={openGroup}
              className="rounded-lg border border-green-600 px-5 py-2.5 font-medium text-green-600 hover:bg-green-50"
            >
              {groupName ? "View Group" : "Get Started"}
            </button>

          </div>
        </section>

        {/* Recent Expenses */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              Recent Expenses
            </h3>

            {expenses.length > 0 && (
              <button
                onClick={openGroup}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                View All
              </button>
            )}
          </div>

          {recentExpenses.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">
                No expenses recorded yet.
              </p>

              <button
                onClick={openGroup}
                className="mt-4 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700"
              >
                Go to Group
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {expense.title}
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                      Paid by {getMemberName(expense.paidBy)}
                      {" · "}
                      {expense.category}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {expense.date
                        ? new Date(expense.date).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : ""}
                    </p>
                  </div>

                  <p className="font-bold text-gray-800">
                    {money(expense.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  );
};

export default Dashboard;
