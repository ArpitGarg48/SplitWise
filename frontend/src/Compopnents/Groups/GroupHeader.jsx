
import React from "react";

const GroupHeader = ({
  groupName,
  setGroupName,
  editingGroupName,
  setEditingGroupName,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert("Enter a group name.");
      return;
    }

    setGroupName(groupName.trim());
    setEditingGroupName(false);
  };

  return (
    <div>
      {editingGroupName ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="rounded-lg border px-3 py-2"
            required
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Save
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-800">
            {groupName || "New Group"}
          </h1>

          <button
            onClick={() => setEditingGroupName(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        </div>
      )}

      <p className="mt-1 text-gray-500">
        Manage group expenses and settlements
      </p>
    </div>
  );
};

export default GroupHeader;
