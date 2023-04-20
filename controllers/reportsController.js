const User = require("../models/User");
const Report = require("../models/Report");
const asyncHandler = require("express-async-handler");

// @desc Get all users
// @route GET /users
// @access Private
const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .lean()
    .populate("user", "name surname"); // Add this line to populate user's name and surname;

  if (!reports?.length) {
    return res.status(400).json({ message: "No reports found" });
  }

  const reportsWithUser = await Promise.all(
    reports.map(async (report) => {
      const user = await User.findById(report.user).lean().exec();
      if (user) {
        return {
          ...report,
          username: user.username,
        };
      } else {
        return {
          ...report,
          username: "Unknown User",
        };
      }
    })
  );

  res.json(reportsWithUser);
});

// @desc Create a user
// @route POST /users
// @access Private
const createNewReport = asyncHandler(async (req, res) => {
  const { user, name, type, date, status } = req.body;

  // Confirm data
  if (!user) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate
  //   const duplicate = await User.findOne({ username }).lean().exec();

  //   if (duplicate) {
  //     return res.status(409).json({ message: "Duplicate username" });
  //   }

  // Hash password
  //   const hashedPwd = await bcrypt.hash(password, 10);

  // Create and store new user
  const report = await Report.create({ user, name });

  if (report) {
    // if created
    res.status(201).json({ message: `New report ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid client data received" });
  }
});

// @desc Update a users
// @route PATCH /users
// @access Private
const updateReport = asyncHandler(async (req, res) => {
  const { id, user, name, status, type } = req.body;

  // Confirm data
  if (!id || !user) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm report exists to update
  const report = await Report.findById(id).exec();

  if (!report) {
    return res.status(400).json({ message: "Report not found" });
  }

  // Check for duplicate title
  // const duplicate = await Note.findOne({ title }).lean().exec();

  // Allow renaming of the original note
  // if (duplicate && duplicate?._id.toString() !== id) {
  //   return res.status(409).json({ message: "Duplicate note title" });
  // }

  report.user = user;
  report.name = name;
  report.type = type;
  report.status = status;

  const updatedReport = await report.save();

  res.json(`'${updatedReport.name}' updated`);
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteReport = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Report ID required" });
  }
  const report = await Report.findById(id).exec();

  if (!report) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await report.deleteOne();

  const reply = `Report ${result.name} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllReports,
  createNewReport,
  updateReport,
  deleteReport,
};
