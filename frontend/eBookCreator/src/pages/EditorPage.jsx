import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Sparkles,
  FileDown,
  Save,
  Menu,
  X,
  NotebookText,
  ChevronDown,
  FileText,
  PlusCircle,
} from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";
import Dropdown, { DropdownItem } from "../components/ui/Dropdown";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import SelectField from "../components/ui/SelectField";
import ChapterSidebar from "../components/editor/ChapterSidebar";

const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  // AI modal states
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("Informative");
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch book details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );
        setBook(response.data);
      } catch (error) {
        toast.error("Failed to load book details.");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [bookId, navigate]);

  // 📝 Handle title/subtitle change
  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  // 🧾 Handle chapter content edit
  const handleChangeChapter = (e) => {
    const updatedContent = e.target.value;
    setBook((prev) => {
      const updated = { ...prev };
      updated.chapters[selectedChapterIndex].content = updatedContent;
      return updated;
    });
  };

  // ➕ Add new chapter
  const handleAddChapter = () => {
    const newChapter = {
      title: `New Chapter ${book.chapters.length + 1}`,
      description: "",
      content: "",
    };
    setBook((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }));
    setSelectedChapterIndex(book.chapters.length);
    toast.success("New chapter added!");
  };

  // ❌ Delete chapter
  const handleDeleteChapter = (index) => {
    const updated = [...book.chapters];
    updated.splice(index, 1);
    setBook((prev) => ({ ...prev, chapters: updated }));
    setSelectedChapterIndex(0);
    toast.success("Chapter deleted!");
  };

  // 🔀 Reorder chapters
  const handleReorderChapters = (oldIndex, newIndex) => {
    setBook((prev) => ({
      ...prev,
      chapters: arrayMove(prev.chapters, oldIndex, newIndex),
    }));
    toast("Chapters reordered ✨");
  };

  // 💾 Save changes
  const handleSaveChanges = async (bookToSave = book, showToast = true) => {
    try {
      setIsSaving(true);
      await axiosInstance.put(
        `${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`,
        bookToSave
      );
      if (showToast) toast.success("Changes saved successfully!");
    } catch (error) {
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // 🧠 AI chapter generator (mock)
  const handleGenerateChapterContent = async (index) => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedText = `✨ This is AI-generated content for ${book.chapters[index].title}.`;
      setBook((prev) => {
        const updated = { ...prev };
        updated.chapters[index].content = generatedText;
        return updated;
      });
      setIsGenerating(false);
      toast.success("AI-generated content added!");
    }, 1500);
  };

  // 📤 Export to PDF (mock)
  const handleExportPDF = async () => {
    toast("📄 Exporting to PDF...");
  };

  // 📄 Export to DOC (mock)
  const handleExportDoc = async () => {
    toast("📝 Exporting to Word...");
  };

  if (isLoading || !book) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading Editor...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 to-orange-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white shadow-md border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition"
          >
            <Menu size={18} />
            <span className="font-medium">Chapters</span>
          </button>

          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <NotebookText className="text-yellow-600" size={20} />
            {book.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button
            icon={Save}
            isLoading={isSaving}
            onClick={handleSaveChanges}
          >
            Save
          </Button>

          <Dropdown
            trigger={
              <Button icon={ChevronDown} variant="secondary">
                Export
              </Button>
            }
          >
            <DropdownItem
              icon={FileDown}
              label="Export as PDF"
              onClick={handleExportPDF}
            />
            <DropdownItem
              icon={FileText}
              label="Export as DOC"
              onClick={handleExportDoc}
            />
          </Dropdown>
        </div>
      </header>

      {/* Main Editor Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            ></div>

            <aside className="fixed top-0 left-0 z-50 w-80 h-full bg-white shadow-lg border-r border-gray-200 overflow-y-auto transition-transform duration-300">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700 text-lg">
                  Chapter List
                </h3>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <ChapterSidebar
                book={book}
                selectedChapterIndex={selectedChapterIndex}
                onSelectChapter={(index) => {
                  setSelectedChapterIndex(index);
                  setIsSidebarOpen(false);
                }}
                onAddChapter={handleAddChapter}
                onDeleteChapter={handleDeleteChapter}
                onGenerateChapterContent={handleGenerateChapterContent}
                isGenerating={isGenerating}
                onReorderChapters={handleReorderChapters}
              />
            </aside>
          </>
        )}

        {/* Editor Workspace */}
        <main className="flex-1 p-6 overflow-y-auto bg-white rounded-tl-3xl shadow-inner">
          <div className="max-w-4xl mx-auto space-y-6">
            <InputField
              label="Book Title"
              name="title"
              value={book.title}
              onChange={handleBookChange}
            />

            <InputField
              label="Subtitle"
              name="subtitle"
              value={book.subtitle}
              onChange={handleBookChange}
            />

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">
                {book.chapters[selectedChapterIndex]?.title || "Untitled Chapter"}
              </h3>
              <Button
                icon={PlusCircle}
                variant="secondary"
                onClick={handleAddChapter}
              >
                Add Chapter
              </Button>
            </div>

            <textarea
              value={
                book.chapters[selectedChapterIndex]?.content ||
                "Start writing your story..."
              }
              onChange={handleChangeChapter}
              className="w-full min-h-[400px] border border-gray-300 rounded-xl p-4 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />

            <div className="flex justify-end gap-3 pt-3">
              <Button
                icon={Sparkles}
                isLoading={isGenerating}
                onClick={() => handleGenerateChapterContent(selectedChapterIndex)}
              >
                Generate AI Outline
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorPage;
