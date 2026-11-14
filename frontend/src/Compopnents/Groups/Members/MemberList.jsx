import React from "react";

const MemberList = ({ members, removeMember }) => {
  return (
    <div>
      <h2 className="mb-5 text-xl font-semibold">
        Group Members
      </h2>

      {members.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          No members added yet.
        </p>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {member.name}
                </p>

                <p className="text-sm text-gray-500">
                  {member.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeMember(member.id)}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberList;