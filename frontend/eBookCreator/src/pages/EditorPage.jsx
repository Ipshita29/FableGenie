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
  Menu,
  Trash2,
  MoreVertical,
  Pencil,
  Loader2,
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";
import Button from "../components/ui/Button"; 

// 1. Confirm Modal (Updated Styling)
const ConfirmModal = ({ isOpen, onConfirm, onClose, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="secondary" className="border border-gray-300 text-gray-700 hover:bg-gray-100">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};


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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  // Helper function to update book state and set unsaved changes
  const updateBookState = useCallback((newBook) => {
    setBook(newBook);
    setHasUnsavedChanges(true);
  }, []);

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
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
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
        <Loader2 className="w-8 h-8 text-rose-600 animate-spin mr-3" />
        <p className="text-xl text-gray-600">Loading Book Editor...</p>
      </div>
    );
  }

  const currentChapter =
    book.chapters?.[selectedChapterIndex] || { title: "Untitled", content: "" };
  
  // Custom Chapter Item Component for Sidebar (Updated Styling)
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
            className={`flex items-center w-full p-3 rounded-xl transition-colors duration-150 relative ${
                isSelected
                    ? "bg-rose-500 text-white shadow-md shadow-rose-200 font-semibold" // Rose Accent
                    : "text-gray-700 hover:bg-rose-50" // Subtle rose hover
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
                        // Input Styling in Sidebar
                        className={`bg-transparent border-b ${isSelected ? 'border-white/50 text-white' : 'border-rose-300 text-gray-800'} focus:outline-none w-full ml-1`}
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
                    className={`p-1 rounded-full ${isSelected ? 'hover:bg-rose-600' : 'hover:bg-rose-100'}`}
                    title="Chapter Options"
                >
                    <MoreVertical size={16} />
                </button>
                
                {isMenuOpen && (
                    // Menu Styling
                    <div className={`absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20`}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setTitleInput(chapter.title); 
                                onStartRename(index);
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-t-lg"
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
  
  // --- MAIN LAYOUT START ---
  return (
    // Overall Layout: Subtle gray background, full height
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black opacity-50 z-20" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* 2. Sidebar (Chapter Navigation) - Modern Styling */}
      <div 
        className={`flex-shrink-0 w-72 bg-white border-r border-rose-100 p-4 transition-transform duration-300 ease-in-out z-30
          fixed inset-y-0 left-0 md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          flex flex-col h-full`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-rose-100 mb-4">
            {/* Back to Dashboard Button */}
            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center text-sm font-semibold text-gray-700 hover:text-rose-600 transition"
            >
                <ArrowLeft size={16} className="mr-1" />
                Back to Dashboard
            </button>
            <button className="md:hidden text-gray-600 hover:text-rose-600" onClick={() => setIsSidebarOpen(false)}>
                <Menu size={20} />
            </button>
        </div>
        
        <h2 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-2">
          <NotebookText size={20} className="text-rose-500" />
          {book.title || "Untitled Book"}
        </h2>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {book.chapters.map((chapter, index) => (
            <ChapterItem
              key={index}
              chapter={chapter}
              index={index}
              isSelected={index === selectedChapterIndex}
              onSelect={handleSelectChapter}
              onStartRename={handleStartRename}
              onRename={handleConfirmRename}
              onDelete={handleDeleteChapter}
              isRenaming={index === editingChapterTitleIndex}
            />
          ))}
        </div>

        {/* Add Chapter Button */}
        <div className="mt-4 pt-4 border-t border-rose-100">
          <Button
            onClick={handleAddChapter}
            variant="ghost"
            className="w-full text-rose-600 hover:bg-rose-50 border border-rose-200"
          >
            <PlusCircle size={18} className="mr-2" />
            Add New Chapter
          </Button>
        </div>
      </div>

      {/* 3. Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Bar / Toolbar */}
        <header className="flex-shrink-0 bg-white border-b border-rose-100 shadow-sm p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            
            {/* Chapter Title / Mobile Menu */}
            <div className="flex items-center">
                <button className="md:hidden p-2 text-gray-700 hover:text-rose-600 mr-3" onClick={() => setIsSidebarOpen(true)}>
                    <Menu size={20} />
                </button>
                <h1 className="text-xl font-bold text-gray-900 truncate max-w-xs md:max-w-none">
                    {currentChapter.title}
                </h1>
            </div>


            {/* Actions */}
            <div className="flex items-center gap-3">
              
              {/* Preview Toggle Button */}
              <Button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                variant={isPreviewMode ? 'primary' : 'secondary'}
                className={isPreviewMode ? 'bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-200' : 'text-gray-700 hover:bg-gray-100'}
              >
                {isPreviewMode ? <Edit size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                {isPreviewMode ? "Edit Mode" : "Preview"}
              </Button>

              {/* AI Generator Button */}
              <Button
                onClick={handleGenerate}
                isLoading={isGenerating}
                className="bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200" // Unique accent for AI
                disabled={isGenerating || isPreviewMode}
              >
                {isGenerating ? "Generating..." : "Generate with AI"}
                <Sparkles size={18} className="ml-2" />
              </Button>

              {/* Save Button */}
              <Button
                onClick={() => handleSave(true)}
                isLoading={isSaving}
                className="bg-gray-800 hover:bg-gray-900 shadow-md text-white" 
                disabled={isSaving || !hasUnsavedChanges}
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    {hasUnsavedChanges ? "Save Changes" : "Saved"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Editor/Preview Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full">
            {isPreviewMode ? (
              // Preview Mode Styling
              <div 
                data-color-mode="light" 
                className="wmde-markdown-var bg-white p-8 rounded-xl shadow-xl border border-rose-100 min-h-[70vh] prose lg:prose-lg"
              >
                <ReactMarkdown>{currentChapter.content}</ReactMarkdown>
              </div>
            ) : (
              // Editor Mode Styling (MDEditor styling is tricky; mostly controlled by its theme/props)
              <div className="w-full h-full" data-color-mode="light">
                <MDEditor
                  value={currentChapter.content}
                  onChange={handleChangeChapter}
                  height={window.innerHeight - 200} // Dynamic height
                  // Custom MDEditor Styling Classes (Applies to container)
                  className="rounded-xl shadow-xl border border-rose-100" 
                  textareaProps={{
                    placeholder: "Start writing your chapter content here...",
                  }}
                  previewOptions={{
                    className: "prose lg:prose-lg"
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onClose={() => setIsModalOpen(false)}
        title="Delete Chapter"
        message="Are you sure you want to delete this chapter? This action cannot be undone."
      />
    </div>
  );
};

export default EditorPage;