const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generate book outline
// @access  Private
const generateOutline = async (params) => {
  try {
    const { title, topic, style, numChapters = 5, description } = params;

    if (!topic) {
      throw new Error("Please provide a topic");
    }

    const prompt = `
You are an expert book outline generator. Create a comprehensive book outline:

Book Title: "${title}"
Topic: "${topic}"
Description: "${description}"
Writing Style: ${style}
Number of Chapters: ${numChapters}

Requirements:
1. Generate exactly ${numChapters} chapters.
2. Each chapter must have "title" and "content".
3. Return ONLY a valid JSON object with a "chapters" array.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = response.text;

    // Try to extract JSON safely
    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");
    if (startIndex === -1 || endIndex === -1) {
      console.error("AI response missing JSON:", text);
      throw new Error("Failed to parse AI response: no JSON found");
    }

    const jsonString = text.substring(startIndex, endIndex + 1);

    let outline;
    try {
      outline = JSON.parse(jsonString);
    } catch (err) {
      console.error("Invalid JSON from AI:", err, jsonString);
      throw new Error("AI returned invalid JSON");
    }

    return outline;

  } catch (error) {
    console.error("Error generating outline:", error.message);
    throw error; // Let the route/controller handle sending the response
  }
};

// @desc    Generate content for a chapter
// @route   POST /api/ai/generate-chapter-content
// @access  Private
const generateChapterContent = async (req, res) => {
  try {
    const { title, existingContent } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please provide a chapter title" });
    }

    const prompt = `
You are an expert writer. Write additional content for a book chapter:

Chapter Title: "${title}"
Existing Content: "${existingContent || ''}"

Requirements:
- Generate 300-500 words
- Professional, engaging tone
- Clear paragraphs and smooth transitions
- Add relevant examples
- Do not repeat title or existing content
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    res.status(200).json({ generatedText: response.text });
  } catch (error) {
    console.error("Error generating chapter:", error.message);
    res.status(500).json({
      message: "Server error during AI chapter generation",
    });
  }
};

module.exports = {
  generateOutline,
  generateChapterContent
};
