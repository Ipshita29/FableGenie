const {GoogleGenAI} = require("@google/genai");
const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY})

const generateOutline = async (req, res) => {
  try {
    const { topic, style, numChapters, description } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Please provide a topic" });
    }

    const prompt = `
You are an expert book outline generator. Create a comprehensive book outline based on the following requirements:

Topic: "${topic}"
Description: "${description}"
Writing Style: ${style}
Number of Chapters: ${numChapters || 5}

Requirements:
1. Generate exactly ${numChapters || 5} chapters.
2. Each chapter title should be clear, engaging, and follow a logical progression.
3. Each chapter description should be 2–3 sentences explaining what the chapter covers.
4. Ensure chapters build upon each other coherently.
5. Match the "${style}" writing style in your titles and descriptions.

Output Format:
Return ONLY a valid JSON array with no additional text, markdown, or formatting. 
Each object must have exactly two keys: "title" and "description".

Example structure:
[
  {
    "title": "Chapter 1: Introduction to the Topic",
    "description": "A comprehensive overview introducing the main concepts and setting the foundation."
  },
  {
    "title": "Chapter 2: Core Principles",
    "description": "Explores the fundamental principles with examples and real-world applications."
  }
]
`;

    // Call the AI model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = response.text;

    // Extract JSON array from AI response
    const startIndex = text.indexOf("[");
    const endIndex = text.lastIndexOf("]");

    if (startIndex === -1 || endIndex === -1) {
      console.error("Could not find JSON array in AI response:", text);
      return res
        .status(500)
        .json({ message: "Failed to parse AI response, no JSON array found." });
    }

    const jsonString = text.substring(startIndex, endIndex + 1);

    // Validate JSON
    let chapters;
    try {
      chapters = JSON.parse(jsonString);
    } catch (error) {
      console.error("Invalid JSON from AI:", error);
      return res.status(500).json({ message: "AI returned invalid JSON." });
    }

    res.status(200).json({ outline: chapters });
  } catch (error) {
    console.error("Error generating outline:", error);
    res
      .status(500)
      .json({ message: "Server error during AI outline generation" });
  }
};


// @desc    Generate content for a chapter
// @route   POST /api/ai/generate-chapter-content
// @access  Private
const generateChapterContent = async (req, res) => {
  try {
    const { title, existingContent } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Please provide a chapter title" });
    }

    const prompt = `
You are an expert writer. Write additional content for a book chapter with the following specifications:

Chapter Title: "${title}"
Existing Content: "${existingContent || ''}"

Requirements:
1. Write in a professional and engaging tone
2. Generate 300-500 words of new content that complements the existing content
3. Structure the content with clear paragraphs and smooth transitions
4. Include relevant examples, explanations, or anecdotes as appropriate
5. Ensure the content flows logically and adds value to the chapter
6. If existing content is provided, build upon it naturally

Format Guidelines:
- Write in plain text without markdown formatting
- Start directly with the new content
- Do not repeat the chapter title or existing content

Begin writing the additional chapter content now:
`;

    // Call the AI model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    res.status(200).json({ generatedText: response.text });
  } catch (error) {
    console.error("Error generating chapter:", error);
    res.status(500).json({
      message: "Server error during AI chapter generation",
    });
  }
};


module.exports={
    generateChapterContent,
    generateOutline
}