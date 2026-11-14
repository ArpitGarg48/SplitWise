import React from "react";

const AddMemberForm = ({
  memberName,
  setMemberName,
  memberEmail,
  setMemberEmail,
  addMember,
}) => {
  return (
    <form
      onSubmit={addMember}
      className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3"
    >
      <input
        type="text"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
        placeholder="Member name"
        className="rounded-lg border px-3 py-3"
        required
      />

      <input
        type="email"
        value={memberEmail}
        onChange={(e) => setMemberEmail(e.target.value)}
        placeholder="Member email"
        className="rounded-lg border px-3 py-3"
        required
      />

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
      >
        + Add Member
      </button>
    </form>
  );
};

export default AddMemberForm;