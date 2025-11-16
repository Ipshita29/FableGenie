const express = require("express");
const router = express.Router();

const { exportAsPDF, exportAsDocument } = require("../controller/exportController");
const { protect } = require("../middleware/authMiddleware");

// Apply protect middleware to all routes in this file
router.use(protect);

// Export book as PDF
router.get("/pdf/:id", exportAsPDF);

// Export book as DOCX
router.get("/doc/:id", exportAsDocument);

module.exports = router;
