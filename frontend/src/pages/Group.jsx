
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, clearSession } from "../lib/api";

import GroupHeader from "../Compopnents/Groups/GroupHeader";
import GroupSummary from "../Compopnents/Groups/GroupSummary";
import GroupTabs from "../Compopnents/Groups/GroupTabs";
import AddMemberForm from "../Compopnents/Groups/Members/AddMemberForm";
import MemberList from "../Compopnents/Groups/Members/MemberList";
import ExpenseList from "../Compopnents/Groups/Expenses/ExpenseList";
import ExpenseForm from "../Compopnents/Groups/Expenses/ExpenseForm";
import BalanceList from "../Compopnents/Groups/Balances/BalanceList";
import WhoOwesWhom from "../Compopnents/Groups/Balances/WhoOwesWhom";
import SettlementList from "../Compopnents/Groups/Settlements/SettlementList";
import SettlementForm from "../Compopnents/Groups/Settlements/SettlementForm";

// Group data is loaded from and saved to the authenticated user's MongoDB record.
const emptyGroupData = {
  groupName: "",
  members: [],
  expenses: [],
  settlements: [],
};

// ================= HELPER FUNCTIONS =================

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format((amount || 0) / 100);

const toPaise = (amount) => Math.round(Number(amount) * 100);

const createId = () => crypto.randomUUID();

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Bills",
  "Other",
];

const allocateAmount = (amount, weights) => {
  const totalWeight = weights.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  if (totalWeight <= 0) return {};

  const allocations = weights.map((item) => {
    const exact = (amount * item.weight) / totalWeight;

    return {
      id: item.id,
      amount: Math.floor(exact),
      remainder: exact - Math.floor(exact),
    };
  });

  let remaining =
    amount -
    allocations.reduce((sum, item) => sum + item.amount, 0);

  const sorted = [...allocations].sort(
    (a, b) => b.remainder - a.remainder
  );

  for (let i = 0; i < remaining; i++) {
    sorted[i].amount++;
  }

  return Object.fromEntries(
    allocations.map((item) => [
      item.id,
      sorted.find((x) => x.id === item.id).amount,
    ])
  );
};

// ================= MAIN COMPONENT =================

export default function Group() {
  const navigate = useNavigate();

  // Group details and transaction data
  const [groupName, setGroupName] = useState("");
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [isGroupLoaded, setIsGroupLoaded] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [groupLoadError, setGroupLoadError] = useState("");

  // Fetch the current user's group after authentication.
  useEffect(() => {
    let active = true;

    const loadGroup = async () => {
      try {
        const data = await apiRequest("/api/group");
        if (!active) return;

        // Each account starts with only its own MongoDB data.
        // Do not import legacy browser-wide data here: that would copy the
        // previous user's group into every new account on this browser.
        const group = data.group || emptyGroupData;

        setGroupName(group.groupName || "");
        setMembers(Array.isArray(group.members) ? group.members : []);
        setExpenses(Array.isArray(group.expenses) ? group.expenses : []);
        setSettlements(Array.isArray(group.settlements) ? group.settlements : []);
        setIsGroupLoaded(true);
      } catch (error) {
        if (!active) return;
        if (!localStorage.getItem("token")) {
          clearSession();
          navigate("/login", { replace: true });
          return;
        }
        setGroupLoadError(error.message || "Could not load group data.");
      }
    };

    loadGroup();
    return () => { active = false; };
  }, [navigate]);

  // Persist changes to MongoDB. Debouncing prevents a request on every keystroke.
  useEffect(() => {
    if (!isGroupLoaded) return undefined;

    const timer = setTimeout(async () => {
      try {
        await apiRequest("/api/group", {
          method: "PUT",
          body: JSON.stringify({ groupName, members, expenses, settlements }),
        });
        setSaveMessage("All changes saved");
      } catch (error) {
        setSaveMessage(error.message || "Could not save changes");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [groupName, members, expenses, settlements, isGroupLoaded]);

  // Navigation
  const [activeTab, setActiveTab] = useState("expenses");

  // Member form
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  // Expense form
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const initialExpenseForm = {
    title: "",
    amount: "",
    paidBy: "",
    participants: [],
    category: "Other",
    splitType: "equal",
    ratios: {},
  };

  const [expenseForm, setExpenseForm] = useState(initialExpenseForm);

  // Settlement form
  const [showSettlementForm, setShowSettlementForm] = useState(false);

  const [settlementForm, setSettlementForm] = useState({
    from: "",
    to: "",
    amount: "",
  });

  // Expense filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ================= COMMON HELPERS =================

  const getMemberName = (memberId) =>
    members.find((member) => member.id === memberId)?.name || "Unknown";

  // ================= MEMBER MANAGEMENT =================

  const addMember = (e) => {
    e.preventDefault();

    if (!memberName.trim() || !memberEmail.trim()) {
      alert("Enter member name and email.");
      return;
    }

    const exists = members.some(
      (member) =>
        member.email.toLowerCase() ===
        memberEmail.trim().toLowerCase()
    );

    if (exists) {
      alert("Member already exists.");
      return;
    }

    setMembers((prev) => [
      ...prev,
      {
        id: createId(),
        name: memberName.trim(),
        email: memberEmail.trim(),
      },
    ]);

    setMemberName("");
    setMemberEmail("");
  };

  const removeMember = (memberId) => {
    const usedInExpense = expenses.some(
      (expense) =>
        expense.paidBy === memberId ||
        expense.participants.includes(memberId)
    );

    const usedInSettlement = settlements.some(
      (settlement) =>
        settlement.from === memberId ||
        settlement.to === memberId
    );

    if (usedInExpense || usedInSettlement) {
      alert("Cannot remove a member with transaction history.");
      return;
    }

    if (!window.confirm("Remove this member?")) return;

    setMembers((prev) =>
      prev.filter((member) => member.id !== memberId)
    );
  };

  // ================= EXPENSE MANAGEMENT =================

  const openAddExpense = () => {
    setEditingExpenseId(null);

    setExpenseForm({
      ...initialExpenseForm,
      paidBy: members[0]?.id || "",
      participants: members.map((member) => member.id),
    });

    setShowExpenseForm(true);
  };

  const openEditExpense = (expense) => {
    setEditingExpenseId(expense.id);

    setExpenseForm({
      title: expense.title,
      amount: (expense.amount / 100).toString(),
      paidBy: expense.paidBy,
      participants: [...expense.participants],
      category: expense.category,
      splitType: expense.splitType,
      ratios: { ...expense.ratios },
    });

    setShowExpenseForm(true);
  };

  const toggleParticipant = (memberId) => {
    setExpenseForm((prev) => ({
      ...prev,
      participants: prev.participants.includes(memberId)
        ? prev.participants.filter((id) => id !== memberId)
        : [...prev.participants, memberId],
    }));
  };

  const saveExpense = (e) => {
    e.preventDefault();

    const amount = toPaise(expenseForm.amount);

    if (!expenseForm.title.trim()) {
      alert("Enter expense title.");
      return;
    }

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      alert("Enter a valid expense amount.");
      return;
    }

    if (!expenseForm.paidBy) {
      alert("Select who paid.");
      return;
    }

    if (expenseForm.participants.length === 0) {
      alert("Select at least one participant.");
      return;
    }

    let shares = {};

    if (expenseForm.splitType === "equal") {
      shares = allocateAmount(
        amount,
        expenseForm.participants.map((id) => ({
          id,
          weight: 1,
        }))
      );
    } else {
      const weights = expenseForm.participants.map((id) => ({
        id,
        weight: Number(expenseForm.ratios[id] || 0),
      }));

      if (
        weights.some(
          (item) =>
            !Number.isFinite(item.weight) || item.weight <= 0
        )
      ) {
        alert("Enter a valid ratio for every participant.");
        return;
      }

      shares = allocateAmount(amount, weights);
    }

    const oldExpense = expenses.find(
      (expense) => expense.id === editingExpenseId
    );

    const expenseData = {
      id: editingExpenseId || createId(),
      title: expenseForm.title.trim(),
      amount,
      paidBy: expenseForm.paidBy,
      participants: [...expenseForm.participants],
      category: expenseForm.category,
      splitType: expenseForm.splitType,
      ratios: { ...expenseForm.ratios },
      shares,
      date: oldExpense?.date || new Date().toISOString(),
    };

    if (editingExpenseId) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === editingExpenseId ? expenseData : expense
        )
      );
    } else {
      setExpenses((prev) => [...prev, expenseData]);
    }

    setShowExpenseForm(false);
    setEditingExpenseId(null);
    setExpenseForm(initialExpenseForm);
  };

  const deleteExpense = (expenseId) => {
    if (
      !window.confirm(
        "Delete this expense? Its effect will be removed from all member balances."
      )
    ) {
      return;
    }

    setExpenses((prev) =>
      prev.filter((expense) => expense.id !== expenseId)
    );
  };

  // ================= BALANCE CALCULATION =================

  const balances = useMemo(() => {
    const result = {};

    members.forEach((member) => {
      result[member.id] = {
        paid: 0,
        share: 0,
        sent: 0,
        received: 0,
        net: 0,
      };
    });

    // Calculate expenses
    expenses.forEach((expense) => {
      if (result[expense.paidBy]) {
        result[expense.paidBy].paid += expense.amount;
      }

      Object.entries(expense.shares || {}).forEach(
        ([memberId, share]) => {
          if (result[memberId]) {
            result[memberId].share += share;
          }
        }
      );
    });

    // Calculate settlements
    settlements.forEach((settlement) => {
      if (result[settlement.from]) {
        result[settlement.from].sent += settlement.amount;
      }

      if (result[settlement.to]) {
        result[settlement.to].received += settlement.amount;
      }
    });

    // Calculate final balances
    members.forEach((member) => {
      const balance = result[member.id];

      balance.net =
        balance.paid -
        balance.share +
        balance.sent -
        balance.received;
    });

    return result;
  }, [members, expenses, settlements]);

  // ================= SUMMARY CALCULATIONS =================

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // ================= WHO OWES WHOM =================

  const settlementMatrix = useMemo(() => {
    const debtors = [];
    const creditors = [];

    members.forEach((member) => {
      const net = balances[member.id]?.net || 0;

      if (net < 0) {
        debtors.push({
          id: member.id,
          amount: -net,
        });
      } else if (net > 0) {
        creditors.push({
          id: member.id,
          amount: net,
        });
      }
    });

    const matrix = {};

    debtors.forEach((debtor) => {
      matrix[debtor.id] = {};
    });

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(
        debtors[i].amount,
        creditors[j].amount
      );

      if (amount > 0) {
        matrix[debtors[i].id][creditors[j].id] = amount;
      }

      debtors[i].amount -= amount;
      creditors[j].amount -= amount;

      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }

    return matrix;
  }, [members, balances]);

  // ================= SETTLEMENT MANAGEMENT =================

  const openAddSettlement = () => {
    setSettlementForm({
      from: members[0]?.id || "",
      to: members[1]?.id || "",
      amount: "",
    });

    setShowSettlementForm(true);
  };

  const openSettlement = (from, to, amount) => {
    setSettlementForm({
      from,
      to,
      amount: (amount / 100).toFixed(2),
    });

    setShowSettlementForm(true);
  };

  const saveSettlement = (e) => {
    e.preventDefault();

    const amount = toPaise(settlementForm.amount);
    const { from, to } = settlementForm;

    if (!from || !to || from === to) {
      alert("Select two different members.");
      return;
    }

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    const maximumAmount = settlementMatrix[from]?.[to] || 0;

    if (amount > maximumAmount) {
      alert(
        `The suggested amount for this payment is ${money(maximumAmount)}.`
      );
      return;
    }

    setSettlements((prev) => [
      ...prev,
      {
        id: createId(),
        from,
        to,
        amount,
        date: new Date().toISOString(),
      },
    ]);

    setShowSettlementForm(false);

    setSettlementForm({
      from: "",
      to: "",
      amount: "",
    });
  };

  const deleteSettlement = (settlementId) => {
    if (
      !window.confirm(
        "Delete this settlement? Member balances will be recalculated."
      )
    ) {
      return;
    }

    setSettlements((prev) =>
      prev.filter(
        (settlement) => settlement.id !== settlementId
      )
    );
  };

  // ================= EXPENSE FILTERING =================

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // ================= UI =================

  if (!isGroupLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-gray-600">
        {groupLoadError ? (
          <>
            <p role="alert" className="text-center text-red-600">{groupLoadError}</p>
            <button onClick={() => window.location.reload()} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white">Retry</button>
          </>
        ) : "Loading your group..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <GroupHeader
            groupName={groupName}
            setGroupName={setGroupName}
            editingGroupName={editingGroupName}
            setEditingGroupName={setEditingGroupName}
          />
          <p className="text-xs text-gray-500 self-center" aria-live="polite">{saveMessage}</p>

          <div className="flex flex-wrap gap-3">

            {/* Dashboard Button */}
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
            >
              ← Dashboard
            </button>

            {/* Add Expense Button */}
            <button
              onClick={openAddExpense}
              disabled={members.length === 0}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              + Add Expense
            </button>

          </div>
        </div>

        {/* SUMMARY */}

        <GroupSummary
          totalExpenses={totalExpenses}
          totalMembers={members.length}
          totalExpenseCount={expenses.length}
          money={money}
        />

        {/* NAVIGATION TABS */}

        <GroupTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* ================= EXPENSES TAB ================= */}

        {activeTab === "expenses" && (
          <ExpenseList
            expenses={filteredExpenses}
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
            getMemberName={getMemberName}
            money={money}
            openEditExpense={openEditExpense}
            deleteExpense={deleteExpense}
          />
        )}

        {/* ================= MEMBERS TAB ================= */}

        {activeTab === "members" && (
          <div className="rounded-xl bg-white p-5 shadow-sm">

            <AddMemberForm
              memberName={memberName}
              setMemberName={setMemberName}
              memberEmail={memberEmail}
              setMemberEmail={setMemberEmail}
              addMember={addMember}
            />

            <MemberList
              members={members}
              removeMember={removeMember}
            />

          </div>
        )}

        {/* ================= BALANCES TAB ================= */}

        {activeTab === "balances" && (
          <div className="space-y-6">

            <BalanceList
              members={members}
              balances={balances}
              money={money}
            />

            <WhoOwesWhom
              settlementMatrix={settlementMatrix}
              getMemberName={getMemberName}
              money={money}
              openSettlement={openSettlement}
            />

          </div>
        )}

        {/* ================= SETTLEMENTS TAB ================= */}

        {activeTab === "settlements" && (
          <SettlementList
            settlements={settlements}
            members={members}
            getMemberName={getMemberName}
            money={money}
            deleteSettlement={deleteSettlement}
            openAddSettlement={openAddSettlement}
          />
        )}

        {/* ================= EXPENSE MODAL ================= */}

        <ExpenseForm
          showExpenseForm={showExpenseForm}
          setShowExpenseForm={setShowExpenseForm}
          editingExpenseId={editingExpenseId}
          expenseForm={expenseForm}
          setExpenseForm={setExpenseForm}
          members={members}
          categories={categories}
          saveExpense={saveExpense}
          toggleParticipant={toggleParticipant}
        />

        {/* ================= SETTLEMENT MODAL ================= */}

        <SettlementForm
          showSettlementForm={showSettlementForm}
          setShowSettlementForm={setShowSettlementForm}
          settlementForm={settlementForm}
          setSettlementForm={setSettlementForm}
          members={members}
          saveSettlement={saveSettlement}
        />

      </div>
    </div>
  );
}
