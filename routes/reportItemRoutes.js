const express = require("express");
const router = express.Router();
const reportItemsController = require("../controllers/reportItemsController");

router
  .route("/")
  .get(reportItemsController.getAllReportItems)
  .post(reportItemsController.createNewReportItem)
  .patch(reportItemsController.updateReportItem)
  .delete(reportItemsController.deleteReportItem);

module.exports = router;
