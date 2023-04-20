const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "user",
    },
    name: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      default: "Daily",
    },
    status: {
      type: String,
      default: "Pending",
    },
    active: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("Report", reportSchema);
