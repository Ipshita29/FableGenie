const express = require("express")
const router = express.Router()
const {
    generateOutline,
    generateChapterContent
}=require("../controller/aiController")
const {protect} = require("../middleware/authMiddleware")
router.use(protect)
router.post("/generate-outline", async (req, res) => {
  try {
    const outline = await generateOutline(req.body);
    res.status(200).json(outline);
  } catch (error) {
    res.status(500).json({ message: "Server error during AI outline generation" });
  }
});
router.post("/generate-chapter-content",generateChapterContent)

module.exports = router;
