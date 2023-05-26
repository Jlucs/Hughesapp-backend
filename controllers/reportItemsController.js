const User = require("../models/User");
const Report = require("../models/Report");
const ReportItem = require("../models/ReportItem");
const asyncHandler = require("express-async-handler");

// @desc Get all users
// @route GET /users
// @access Private
const getAllReportItems = asyncHandler(async (req, res) => {
  const reportItems = await ReportItem.find().lean();

  if (!reportItems?.length) {
    return res.status(400).json({ message: "No report items found" });
  }

  const reportItemsWithUser = await Promise.all(
    reportItems.map(async (reportItem) => {
      const user = await User.findById(reportItem.user).lean().exec();
      return {
        ...reportItem,
        reportId: reportItem.report,
      };
    })
  );

  res.json(reportItemsWithUser);
});

// @desc Create a user
// @route POST /users
// @access Private
const createNewReportItem = asyncHandler(async (req, res) => {
  const {
    user,
    report,
    name,
    clientName,
    date,
    timeIn,
    timeOut,
    objective,
    management,
    issues,
    steps,
    completed,
  } = req.body;

  // Confirm data
  if (!user || !report || !clientName) {
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
  const reportItem = await ReportItem.create({
    user,
    report,
    name,
    clientName,
    date,
    timeIn,
    timeOut,
    objective,
    management,
    issues,
    steps,
    completed,
  });

  if (reportItem) {
    // if created
    res.status(201).json({ message: `New report ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid client data received" });
  }
});

// @desc Update a users
// @route PATCH /users
// @access Private
const updateReportItem = asyncHandler(async (req, res) => {
  const {
    id,
    user,
    report,
    name,
    clientName,
    date,
    timeIn,
    timeOut,
    objective,
    management,
    issues,
    steps,
  } = req.body;

  // Confirm data
  if (!id || !report || !user) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Confirm report item exists to update
  const reportItem = await ReportItem.findById(id).exec();

  if (!reportItem) {
    return res.status(400).json({ message: "Report item not found" });
  }

  // Check for duplicate title
  // const duplicate = await Note.findOne({ title }).lean().exec();

  // Allow renaming of the original note
  // if (duplicate && duplicate?._id.toString() !== id) {
  //   return res.status(409).json({ message: "Duplicate note title" });
  // }

  reportItem.user = user;
  reportItem.report = report;
  reportItem.name = name;
  reportItem.clientName = clientName;
  reportItem.date = date;
  reportItem.timeIn = timeIn;
  reportItem.timeOut = timeOut;
  reportItem.objective = objective;
  reportItem.management = management;
  reportItem.issues = issues;
  reportItem.steps = steps;

  const updatedReportItem = await reportItem.save();

  res.json(`'${updatedReportItem.name}' updated`);
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteReportItem = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Report item ID required" });
  }
  const reportItem = await ReportItem.findById(id).exec();

  if (!reportItem) {
    return res.status(400).json({ message: "report item not found" });
  }

  const result = await reportItem.deleteOne();

  const reply = `Report ${result.name} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllReportItems,
  createNewReportItem,
  updateReportItem,
  deleteReportItem,
};
