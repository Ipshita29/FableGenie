const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// @desc    Generate book outline
// @access  Private
const generateOutline = async (params) => {
  try {
    const { title, topic, style, numChapters = 5, description } = params;

    const searchTopic = topic || title || "a general interesting book";
    const chapterCount = parseInt(numChapters) || 5;

    const prompt = `
You are an expert book outline generator. Create a comprehensive book outline for a book titled "${title}".
The book is about: "${searchTopic}"
Description: "${description || 'No description provided.'}"
Writing Style: ${style || 'Informative'}
Number of Chapters: ${chapterCount}

Requirements:
1. Generate exactly ${chapterCount} chapters.
2. Each chapter must have "title" and "content" (a brief summary of what the chapter will cover).
3. Return ONLY a valid JSON object in this format:
{
  "chapters": [
    { "title": "Chapter 1: ...", "content": "..." },
    ...
  ]
}
`;

    console.log(`🤖 Generating outline for: "${title}" with model gemini-2.0-flash`);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // fast + free
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      console.error("❌ AI returned empty response");
      throw new Error("AI returned empty response");
    }

    console.log("📝 AI Response received, length:", text.length);

    // Try to extract JSON safely
    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");
    if (startIndex === -1 || endIndex === -1) {
      console.error("❌ AI response missing JSON brackets. Response start:", text.substring(0, 100));
      throw new Error("Failed to parse AI response: no JSON found");
    }

    const jsonString = text.substring(startIndex, endIndex + 1);

    let outline;
    try {
      outline = JSON.parse(jsonString);
    } catch (err) {
      console.error("❌ Invalid JSON from AI:", err.message);
      console.error("Full JSON string that failed:", jsonString);
      throw new Error("AI returned invalid JSON");
    }

    if (!outline.chapters || !Array.isArray(outline.chapters)) {
      console.error("❌ AI response missing chapters array");
      throw new Error("AI response missing chapters array");
    }

    return outline;

  } catch (error) {
    console.error("❌ Error generating outline:", error.message);
    throw error;
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

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.status(200).json({
      generatedText: response.choices[0]?.message?.content,
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
