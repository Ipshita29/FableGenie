import { useState, useEffect, useRef, useCallback } from "react";
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
  Menu,
  Trash2,
  MoreVertical,
  Pencil,
  Loader2,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";

// Assumed imports - ensure these paths are correct in your project
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";
import Button from "../components/ui/Button"; // Reusable Button component
// import ConfirmModal from "../components/ui/ConfirmModal"; // Assumed simple confirmation modal component

// Placeholder for a simple ConfirmModal. You should replace this with your actual component.
const ConfirmModal = ({ isOpen, onConfirm, onClose, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="danger">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

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
  const [editingChapterTitleIndex, setEditingChapterTitleIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chapterToDeleteIndex, setChapterToDeleteIndex] = useState(null);
  const autoSaveRef = useRef(null);

  // Helper function to update book state and set unsaved changes
  const updateBookState = useCallback((newBook) => {
    setBook(newBook);
    setHasUnsavedChanges(true);
  }, []);

  // ✅ Fetch book on mount
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );
        const fetchedBook = res.data;

        // Ensure chapters exist
        if (!fetchedBook.chapters || !Array.isArray(fetchedBook.chapters) || fetchedBook.chapters.length === 0) {
          fetchedBook.chapters = [{ title: "Chapter 1", content: "" }];
        }

        setBook(fetchedBook);
        // Ensure selectedChapterIndex is valid
        setSelectedChapterIndex(prevIndex => Math.min(prevIndex, fetchedBook.chapters.length - 1));

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

  // ✅ Save book (Memoized with useCallback)
  const handleSave = useCallback(async (manual = false) => {
    if (!hasUnsavedChanges || !book) return;
    try {
      setIsSaving(true);
      await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`, book);
      if (manual) toast.success("✅ Changes saved successfully");
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }, [book, bookId, hasUnsavedChanges]);

  // ✅ Auto-save after delay
  useEffect(() => {
    if (book && hasUnsavedChanges) {
      clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(() => {
        handleSave();
      }, 3000); // 3 second delay for auto-save
    }
    return () => clearTimeout(autoSaveRef.current);
  }, [book, hasUnsavedChanges, handleSave]);

  // ✅ Add new chapter
  const handleAddChapter = () => {
    if (!book) return;
    const newChapter = {
      title: `New Chapter ${book.chapters.length + 1}`,
      content: "",
    };
    const updated = { ...book, chapters: [...book.chapters, newChapter] };
    updateBookState(updated);
    setSelectedChapterIndex(updated.chapters.length - 1);
    setIsPreviewMode(false);
  };

  // ✅ Start chapter rename
  const handleStartRename = (index) => {
    setEditingChapterTitleIndex(index);
  };

  // ✅ Confirm chapter rename
  const handleConfirmRename = (index, newTitle) => {
    if (!book || !newTitle.trim()) {
        toast.error("Chapter title cannot be empty.");
        return;
    }
    
    const updated = { ...book };
    updated.chapters = [...book.chapters];
    updated.chapters[index] = { ...updated.chapters[index], title: newTitle.trim() };
    
    updateBookState(updated);
    setEditingChapterTitleIndex(null);
  };

  // ✅ Delete chapter (starts confirmation)
  const handleDeleteChapter = (index) => {
    if (!book || book.chapters.length <= 1) {
        toast.error("Cannot delete the last chapter.");
        return;
    }
    setChapterToDeleteIndex(index);
    setIsModalOpen(true);
  };

  // ✅ Confirm delete action
  const confirmDelete = () => {
    if (chapterToDeleteIndex === null || !book || book.chapters.length <= 1) {
        setIsModalOpen(false);
        setChapterToDeleteIndex(null);
        return;
    }

    const updatedChapters = book.chapters.filter((_, i) => i !== chapterToDeleteIndex);
    const updated = { ...book, chapters: updatedChapters };

    // Adjust selected index
    let newSelectedIndex = selectedChapterIndex;
    if (chapterToDeleteIndex === selectedChapterIndex) {
        newSelectedIndex = Math.max(0, chapterToDeleteIndex - 1);
    } else if (chapterToDeleteIndex < selectedChapterIndex) {
        newSelectedIndex = selectedChapterIndex - 1;
    }
    
    setBook(updated); // setBook directly as selectedChapterIndex depends on it
    setHasUnsavedChanges(true);
    setSelectedChapterIndex(newSelectedIndex);
    setIsModalOpen(false);
    setChapterToDeleteIndex(null);
    toast.success("Chapter deleted.");
  };

  // ✅ Change selected chapter
  const handleSelectChapter = (index) => {
    if (index === selectedChapterIndex) return;
    setEditingChapterTitleIndex(null); // Close any active renaming
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
      // NOTE: Using token from localStorage is often less secure than using an http-only cookie, 
      // but keeping it here to match your original structure.
      const token = localStorage.getItem("token"); 
      
      const res = await axiosInstance.post(
        API_PATHS.AI.GENERATE_CHAPTER_CONTENT,
        {
          title: current.title,
          existingContent: current.content,
          bookContext: book.chapters.slice(0, selectedChapterIndex).map(c => ({ title: c.title, content: c.content.substring(0, 500) })) // Provide some context
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const generatedText =
        res.data?.generatedText ||
        "✨ AI failed to generate content. Try again later.";

      setBook((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.chapters = [...updated.chapters];
        
        // Add a separator if content already exists
        const separator = updated.chapters[selectedChapterIndex].content ? "\n\n---\n\n" : "";
        updated.chapters[selectedChapterIndex].content += `${separator}${generatedText}`;
        
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mr-3" />
        <p className="text-xl text-gray-600">Loading Book Editor...</p>
      </div>
    );
  }

  const currentChapter =
    book.chapters?.[selectedChapterIndex] || { title: "Untitled", content: "" };
  
  // Custom Chapter Item Component for Sidebar
  const ChapterItem = ({ chapter, index, isSelected, onSelect, onStartRename, onRename, onDelete, isRenaming }) => {
    const [titleInput, setTitleInput] = useState(chapter.title || `Untitled Chapter`);
    const inputRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isRenaming) {
            inputRef.current?.focus();
        }
    }, [isRenaming]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onRename(index, titleInput);
            setIsMenuOpen(false);
        } else if (e.key === 'Escape') {
            onRename(index, chapter.title); // Revert
            setIsMenuOpen(false);
        }
    };

    return (
        <div 
            className={`flex items-center w-full p-2 rounded-lg transition-colors duration-150 relative ${
                isSelected
                    ? "bg-indigo-600 text-white shadow-md font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            <button
                onClick={() => onSelect(index)}
                className="flex-1 text-left truncate pr-10"
                disabled={isRenaming}
            >
                {index + 1}. 
                {isRenaming ? (
                    <input 
                        ref={inputRef}
                        type="text"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        onBlur={() => onRename(index, titleInput)}
                        onKeyDown={handleKeyDown}
                        className={`bg-transparent border-b ${isSelected ? 'border-white/50 text-white' : 'border-gray-400 text-gray-800'} focus:outline-none w-full ml-1`}
                        style={{ width: 'calc(100% - 30px)' }}
                    />
                ) : (
                    <span className="ml-1">{chapter.title || `Untitled Chapter`}</span>
                )}
            </button>
            
            {/* Context Menu / Options */}
            <div className="relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    className={`p-1 rounded-full ${isSelected ? 'hover:bg-indigo-700' : 'hover:bg-gray-200'}`}
                    title="Chapter Options"
                >
                    <MoreVertical size={16} />
                </button>
                
                {isMenuOpen && (
                    <div className={`absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 ${isSelected ? 'bg-indigo-50 border-indigo-200' : ''}`}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setTitleInput(chapter.title); // Reset input state before editing
                                onStartRename(index);
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                        >
                            <Pencil size={14} /> Rename
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(index);
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                            disabled={book.chapters.length <= 1}
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                )}
            </div>
            
        </div>
    );
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this chapter? This action cannot be undone."
      />

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-lg sticky top-0 z-20 border-b border-indigo-100">
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              if (hasUnsavedChanges) handleSave(true);
              navigate(-1);
            }}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition p-2 rounded-lg bg-indigo-50"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} /> <span className="hidden sm:inline">Back</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <NotebookText size={24} className="text-indigo-600" />
            <span className="truncate max-w-xs">{book.title}</span>
          </h2>
          {hasUnsavedChanges && (
            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium animate-pulse">
              Unsaved
            </span>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <Button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            icon={isPreviewMode ? Edit : Eye}
            variant="secondary"
            className="hidden sm:flex"
            disabled={editingChapterTitleIndex !== null}
          >
            {isPreviewMode ? "Edit" : "Preview"}
          </Button>
          <Button
            onClick={() => handleSave(true)}
            icon={Save}
            isLoading={isSaving}
            disabled={!hasUnsavedChanges || isGenerating || editingChapterTitleIndex !== null}
          >
            {isSaving ? "Saving..." : "Save Now"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 flex-shrink-0 overflow-y-auto shadow-inner">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center border-b pb-2">
            <Menu size={20} className="text-indigo-600 mr-2" />
            Book Chapters
            <button
              onClick={handleAddChapter}
              className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-100 transition"
              title="Add New Chapter"
            >
              <PlusCircle size={24} />
            </button>
          </h3>
          <div className="space-y-2">
            {book.chapters?.map((ch, index) => (
              <ChapterItem
                  key={index}
                  chapter={ch}
                  index={index}
                  isSelected={index === selectedChapterIndex}
                  isRenaming={index === editingChapterTitleIndex}
                  onSelect={handleSelectChapter}
                  onStartRename={handleStartRename}
                  onRename={handleConfirmRename}
                  onDelete={handleDeleteChapter}
              />
            ))}
          </div>
        </aside>

        {/* Editor / Preview */}
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <div className="max-w-5xl mx-auto min-h-full">
            <div className="flex justify-between items-center p-4 bg-white rounded-t-xl border-b border-gray-200 sticky top-0 z-10 shadow-sm">
              <h3 className="text-xl font-extrabold text-indigo-700">
                Chapter: {currentChapter.title}
              </h3>
              <p className="text-md font-medium text-gray-600">
                Chapter {selectedChapterIndex + 1} of {book.chapters?.length || 0}
              </p>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-6">
                {isPreviewMode ? (
                  <div className="prose max-w-none p-4 rounded-xl border border-gray-200 min-h-[500px] text-gray-800">
                    <ReactMarkdown>
                      {currentChapter.content || "**Start writing this amazing chapter...**"}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div data-color-mode="light" className="w-full">
                    <MDEditor
                      value={currentChapter.content}
                      onChange={handleChangeChapter}
                      height={600}
                      preview="edit" // Force edit mode for a focused writing experience
                      commandsFilter={(command) => {
                          // Filter out some commands to simplify the toolbar if needed
                          // Example: if (command.key === 'fullscreen') return false;
                          return command;
                      }}
                      style={{
                        backgroundColor: "#ffffff", // Pure white editor background
                        color: "#1f2937", // Dark gray text
                        borderRadius: "0.75rem",
                        border: "1px solid #e5e7eb", // Light gray border
                      }}
                    />
                  </div>
                )}
            </div>
            
            <div className="flex justify-end items-center mt-6">
              <Button
                onClick={handleGenerate}
                icon={Sparkles}
                isLoading={isGenerating}
                variant="primary" // Use the primary style for AI generation
                className="group bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                disabled={isGenerating || editingChapterTitleIndex !== null}
              >
                <span className="group-hover:animate-pulse">
                  {isGenerating ? "Generating Content..." : "Generate Next Section (AI)"}
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
