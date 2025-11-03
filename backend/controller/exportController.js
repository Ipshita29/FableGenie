const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
} = require("docx");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const Book = require("../models/Book");

const md = new MarkdownIt();

const DOC_STYLES = {
  fonts: { body: "Charter", heading: "Inter" },
  sizes: {
    title: 32,
    subtitle: 20,
    author: 18,
    chapterTitle: 24,
    h1: 20,
    h2: 18,
    h3: 16,
    body: 12,
  },
  spacing: {
    paragraphBefore: 200,
    paragraphAfter: 200,
    chapterBefore: 400,
    chapterAfter: 300,
    headingBefore: 300,
    headingAfter: 150,
  },
};

// Convert inline tokens to TextRun
const processInlineContent = (children) => {
  return children.map((child) => {
    let run = {
      text: child.content || "",
      font: DOC_STYLES.fonts.body,
      size: DOC_STYLES.sizes.body,
    };
    if (child.type === "strong_open") run.bold = true;
    if (child.type === "em_open") run.italics = true;
    if (child.type === "underline_open") run.underline = {};
    return new TextRun(run);
  });
};

// Convert Markdown to DOCX paragraphs with lists & blockquotes
const processMarkdownToDocx = (markdown) => {
  const tokens = md.parse(markdown, {});
  const paragraphs = [];
  let inList = false;
  let listType = null;
  let orderedCounter = 1;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    try {
      // Headings
      if (token.type === "heading_open") {
        const level = parseInt(token.tag.substring(1), 10);
        const nextToken = tokens[i + 1];
        if (nextToken && nextToken.type === "inline") {
          let headingLevel, fontSize;
          switch (level) {
            case 1:
              headingLevel = HeadingLevel.HEADING_1;
              fontSize = DOC_STYLES.sizes.h1;
              break;
            case 2:
              headingLevel = HeadingLevel.HEADING_2;
              fontSize = DOC_STYLES.sizes.h2;
              break;
            case 3:
              headingLevel = HeadingLevel.HEADING_3;
              fontSize = DOC_STYLES.sizes.h3;
              break;
            default:
              headingLevel = HeadingLevel.HEADING_3;
              fontSize = DOC_STYLES.sizes.h3;
          }
          paragraphs.push(
            new Paragraph({
              text: nextToken.content,
              heading: headingLevel,
              spacing: {
                before: DOC_STYLES.spacing.headingBefore,
                after: DOC_STYLES.spacing.headingAfter,
              },
            })
          );
        }
        i += 2;
      }

      // Paragraphs
      else if (token.type === "paragraph_open") {
        const nextToken = tokens[i + 1];
        if (nextToken && nextToken.type === "inline" && nextToken.children) {
          const textRuns = processInlineContent(nextToken.children);

          // Add bullet or ordered prefix
          let bulletText = "";
          if (inList) {
            if (listType === "bullet") bulletText = "• ";
            else if (listType === "ordered") bulletText = `${orderedCounter}. `;
          }
          if (bulletText) {
            textRuns.unshift(
              new TextRun({
                text: bulletText,
                font: DOC_STYLES.fonts.body,
                size: DOC_STYLES.sizes.body,
              })
            );
            if (listType === "ordered") orderedCounter++;
          }

          paragraphs.push(
            new Paragraph({
              children: textRuns,
              spacing: { before: 100, after: 100 },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
        }
        i += 2;
      }

      // Lists
      else if (token.type === "bullet_list_open") {
        inList = true;
        listType = "bullet";
      } else if (token.type === "bullet_list_close") {
        inList = false;
        listType = null;
        paragraphs.push(new Paragraph({ text: "", spacing: { after: 100 } }));
      } else if (token.type === "ordered_list_open") {
        inList = true;
        listType = "ordered";
        orderedCounter = 1;
      } else if (token.type === "ordered_list_close") {
        inList = false;
        listType = null;
        orderedCounter = 1;
        paragraphs.push(new Paragraph({ text: "", spacing: { after: 100 } }));
      }

      // Blockquotes
      else if (token.type === "blockquote_open") {
        const nextToken = tokens[i + 1];
        if (nextToken && nextToken.type === "paragraph_open") {
          const inlineToken = tokens[i + 2];
          if (inlineToken && inlineToken.type === "inline") {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: inlineToken.content,
                    italics: true,
                    color: "666666",
                    font: DOC_STYLES.fonts.body,
                    size: DOC_STYLES.sizes.body,
                  }),
                ],
                spacing: { before: 200, after: 200 },
                indent: { left: 720 },
                alignment: AlignmentType.JUSTIFIED,
              })
            );
          }
        }
        i += 3;
      }
    } catch (err) {
      console.error(`Error processing token ${i}:`, err);
    }
  }
  return paragraphs;
};

// DOCX export
const exportAsDocument = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    const sections = [];

    // Title page
    const titlePage = [
      new Paragraph({
        children: [
          new TextRun({
            text: book.title,
            bold: true,
            font: DOC_STYLES.fonts.heading,
            size: DOC_STYLES.sizes.title * 2,
            color: "1A202C",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
    ];

    if (book.subtitle && book.subtitle.trim() !== "") {
      titlePage.push(
        new Paragraph({
          children: [
            new TextRun({
              text: book.subtitle,
              font: DOC_STYLES.fonts.heading,
              size: DOC_STYLES.sizes.subtitle * 2,
              color: "3B3B3B",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      );
    }

    titlePage.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `By ${book.author}`,
            font: DOC_STYLES.fonts.heading,
            size: DOC_STYLES.sizes.author * 2,
            color: "203748",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Decorative line
    titlePage.push(
      new Paragraph({
        text: "",
        border: { bottom: { color: "4F46E5", space: 1, style: "single", size: 12 } },
      })
    );

    sections.push(...titlePage);

    // Chapters
    book.chapters.forEach((chapter, index) => {
      try {
        if (index > 0) sections.push(new Paragraph({ text: "", pageBreakBefore: true }));
        sections.push(
          new Paragraph({
            text: chapter.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: DOC_STYLES.spacing.chapterBefore },
          })
        );
        const contentParagraphs = processMarkdownToDocx(chapter.content || "");
        sections.push(...contentParagraphs);
      } catch (chapterError) {
        console.error(`Error processing chapter ${index}:`, chapterError);
      }
    });

    // Generate DOCX
    const doc = new Document({
      sections: [
        {
          properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
          children: sections,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx"`
    );
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error("Error exporting document:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error during document export", error: error.message });
    }
  }
};

// PDF export
const exportAsPDF = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    const pdfDoc = new PDFDocument({ margin: 50 });
    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const result = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`
      );
      res.setHeader("Content-Length", result.length);
      res.send(result);
    });

    // Title
    pdfDoc.fontSize(28).text(book.title, { align: "center" });
    if (book.subtitle) pdfDoc.fontSize(20).text(book.subtitle, { align: "center" });
    pdfDoc.fontSize(16).text(`By ${book.author}`, { align: "center" });
    pdfDoc.moveDown();

    // Chapters
    book.chapters.forEach((chapter, index) => {
      if (index > 0) pdfDoc.addPage();
      pdfDoc.fontSize(22).text(chapter.title, { underline: true });
      pdfDoc.moveDown();
      pdfDoc.fontSize(12).text(chapter.content || "", { align: "justify" });
    });

    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error during PDF export", error: error.message });
    }
  }
};

module.exports = {
  exportAsDocument,
  exportAsPDF,
};
