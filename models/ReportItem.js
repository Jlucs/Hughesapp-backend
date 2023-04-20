const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const reportItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Report",
    },
    name: {
      type: String,
      required: false,
    },
    clientName: {
      type: String,
      required: false,
    },
    date: {
      type: String,
      required: false,
    },
    timeIn: {
      type: String,
      required: false,
    },
    timeOut: {
      type: String,
      required: false,
    },
    objective: {
      type: String,
      required: false,
    },
    management: {
      type: String,
      required: false,
    },
    issues: {
      type: String,
      required: false,
    },
    steps: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// reportSchema.plugin(AutoIncrement, {
//   inc_field: "ticket",
//   id: "ticketNums",
//   start_seq: 100,
// });

module.exports = mongoose.model("ReportItem", reportItemSchema);
