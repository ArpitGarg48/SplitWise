import User from "../models/User.js";

const emptyGroup = {
  groupName: "",
  members: [],
  expenses: [],
  settlements: [],
};

export const getMyGroup = async (req, res) => {
  try {
    res.status(200).json({ group: req.user.groupData || emptyGroup });
  } catch (error) {
    res.status(500).json({ message: "Could not load group data" });
  }
};

export const saveMyGroup = async (req, res) => {
  try {
    const { groupName, members, expenses, settlements } = req.body || {};

    if (
      typeof groupName !== "string" ||
      !Array.isArray(members) ||
      !Array.isArray(expenses) ||
      !Array.isArray(settlements)
    ) {
      return res.status(400).json({ message: "Invalid group data" });
    }

    const groupData = {
      groupName: groupName.trim(),
      members,
      expenses,
      settlements,
    };

    await User.findByIdAndUpdate(req.user._id, {
      $set: { groupData },
    });

    res.status(200).json({
      message: "Group data saved successfully",
      group: groupData,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not save group data" });
  }
};
