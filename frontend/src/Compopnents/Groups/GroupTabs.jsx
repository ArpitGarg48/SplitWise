
import React from "react";

const GroupTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    "expenses",
    "members",
    "balances",
    "settlements",
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b">

      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`border-b-2 px-4 py-3 text-sm font-medium capitalize ${
            activeTab === tab
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}

    </div>
  );
};

export default GroupTabs;
