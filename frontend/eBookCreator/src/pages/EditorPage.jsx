import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Sparkles,
  Save,
  NotebookText,
  PlusCircle,
  Eye,
  Edit,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";
import Button from "../components/ui/Button";

const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const autoSaveRef = useRef(null);

  // ✅ Fetch book on mount
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );
        const fetchedBook = res.data;

        // Ensure chapters exist
        if (!fetchedBook.chapters || !Array.isArray(fetchedBook.chapters)) {
          fetchedBook.chapters = [{ title: "Chapter 1", content: "" }];
        }

        setBook(fetchedBook);
      } catch (err) {
        console.error("Error fetching book:", err);
        toast.error("Failed to load book");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId, navigate]);

  // ✅ Auto-save after delay
  useEffect(() => {
    if (book && hasUnsavedChanges) {
      clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(() => {
        handleSave();
      }, 3000);
    }
    return () => clearTimeout(autoSaveRef.current);
  }, [book, hasUnsavedChanges]);

  // ✅ Save book
  const handleSave = async () => {
    if (!hasUnsavedChanges || !book) return;
    try {
      setIsSaving(true);
      await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`, book);
      toast.success("✅ Changes saved successfully");
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Add new chapter
  const handleAddChapter = () => {
    if (!book) return;
    const newChapter = {
      title: `Chapter ${(book.chapters?.length || 0) + 1}`,
      content: "",
    };
    const updated = { ...book, chapters: [...(book.chapters || []), newChapter] };
    setBook(updated);
    setSelectedChapterIndex(updated.chapters.length - 1);
    setHasUnsavedChanges(true);
    setIsPreviewMode(false);
  };

  // ✅ Change selected chapter
  const handleSelectChapter = (index) => {
    if (index === selectedChapterIndex) return;
    setSelectedChapterIndex(index);
    setIsPreviewMode(false);
  };

  // ✅ Update content as user types
  const handleChangeChapter = (value) => {
    setBook((prev) => {
      if (!prev || !prev.chapters) return prev;
      const updated = { ...prev };
      updated.chapters = [...prev.chapters];
      updated.chapters[selectedChapterIndex] = {
        ...updated.chapters[selectedChapterIndex],
        content: value || "",
      };
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  // ✅ Generate AI content
  const handleGenerate = async () => {
    if (!book || !book.chapters?.length) {
      toast.error("No chapters available to generate content.");
      return;
    }

    const current = book.chapters[selectedChapterIndex];
    if (!current || !current.title) {
      toast.error("Chapter is missing a title.");
      return;
    }

    try {
      setIsGenerating(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post(
        API_PATHS.AI.GENERATE_CHAPTER_CONTENT,
        {
          title: current.title,
          existingContent: current.content,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const generatedText =
        res.data?.generatedText ||
        "✨ AI failed to generate content. Try again later.";

      setBook((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.chapters = [...prev.chapters];
        updated.chapters[selectedChapterIndex].content += `\n\n${generatedText}`;
        return updated;
      });

      setHasUnsavedChanges(true);
      toast.success("AI content added!");
    } catch (err) {
      console.error("AI Generation Error:", err);
      toast.error("AI generation failed. Check backend response.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading || !book) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600 animate-pulse">Loading Editor...</p>
      </div>
    );
  }

  const currentChapter =
    book.chapters?.[selectedChapterIndex] || { title: "Untitled", content: "" };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (hasUnsavedChanges) handleSave();
              navigate(-1);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <NotebookText size={22} className="text-indigo-600" />
            {book.title}
          </h2>
          {hasUnsavedChanges && (
            <span className="text-sm text-orange-600 font-medium">
              • Unsaved Changes
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            icon={Save}
            isLoading={isSaving}
            disabled={!hasUnsavedChanges || isGenerating}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            icon={isPreviewMode ? Edit : Eye}
            variant="secondary"
          >
            {isPreviewMode ? "Edit" : "Preview"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0 overflow-y-auto">
          <h3 className="text-md font-bold text-gray-800 mb-3 flex justify-between items-center">
            Chapters
            <button
              onClick={handleAddChapter}
              className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50 transition"
              title="Add New Chapter"
            >
              <PlusCircle size={20} />
            </button>
          </h3>
          <div className="space-y-1">
            {book.chapters?.map((ch, index) => (
              <button
                key={index}
                onClick={() => handleSelectChapter(index)}
                className={`w-full text-left p-2 rounded-lg transition-colors duration-150 flex justify-between items-center ${
                  index === selectedChapterIndex
                    ? "bg-indigo-600 text-white shadow-md font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="truncate">
                  {index + 1}. {ch.title || `Untitled Chapter`}
                </span>
                {index === selectedChapterIndex && <ChevronRight size={16} />}
              </button>
            ))}
          </div>
        </aside>

        {/* Editor / Preview */}
        <main className="flex-1 p-6 bg-white shadow-inner overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                ✏️ {currentChapter.title}
              </h3>
              <p className="text-sm text-gray-600">
                Chapter {selectedChapterIndex + 1} / {book.chapters?.length || 0}
              </p>
            </div>

            {isPreviewMode ? (
              <div className="prose max-w-none bg-gray-50 p-6 rounded-xl border min-h-[500px]">
                <ReactMarkdown>
                  {currentChapter.content || "**Start writing...**"}
                </ReactMarkdown>
              </div>
            ) : (
              <div data-color-mode="light" className="bg-white rounded-xl p-2">
                <MDEditor
                  value={currentChapter.content}
                  onChange={handleChangeChapter}
                  height={500}
                  style={{
                    backgroundColor: "#f9fafb",
                    color: "#111827",
                    borderRadius: "0.75rem",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            )}

            <div className="flex justify-end items-center mt-4">
              <Button
                onClick={handleGenerate}
                icon={Sparkles}
                isLoading={isGenerating}
                variant="secondary"
                disabled={isGenerating}
                className="group"
              >
                <span className="group-hover:animate-pulse">
                  {isGenerating ? "Generating..." : "Generate AI Content"}
                </span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorPage;
