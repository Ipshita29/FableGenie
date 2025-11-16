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
  BookOpen // Added for a better sidebar title icon
} from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths"; // Assuming corrected path

// 1. Confirm Modal (Modernized Styling - Pink Accent)
const ConfirmModal = ({ isOpen, onConfirm, onClose, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          {/* Using custom Button styling for primary action */}
          <button onClick={onClose} className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-gray-100 hover:bg-pink-50 text-gray-700 border border-gray-200 px-4 py-2.5 h-11 rounded-xl">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-pink-600 hover:bg-pink-700 text-white px-4 py-2.5 h-11 rounded-xl shadow-lg shadow-pink-200/50"
          >
            Confirm Delete
          </button>
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
  const [contentKey, setContentKey] = useState(0); // FIX: Key to force MDEditor refresh

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
    setContentKey(prev => prev + 1); // Force editor refresh
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
    setContentKey(prev => prev + 1); // Force editor refresh
  };

  // ✅ Change selected chapter
  const handleSelectChapter = (index) => {
    if (index === selectedChapterIndex) return;
    setEditingChapterTitleIndex(null); // Close any active renaming
    setSelectedChapterIndex(index);
    setIsPreviewMode(false);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
    setContentKey(prev => prev + 1); // FIX: Force MDEditor to refresh when chapter is selected
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
          bookContext: book.chapters.slice(0, selectedChapterIndex).map(c => ({ title: c.title, content: c.content.substring(0, 500) }))
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
        
        const separator = updated.chapters[selectedChapterIndex].content ? "\n\n---\n\n" : "";
        updated.chapters[selectedChapterIndex].content += `${separator}${generatedText}`;
        
        return updated;
      });

      // FIX: Force MDEditor to refresh when AI content is generated
      setContentKey(prev => prev + 1); 

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
        <Loader2 className="w-8 h-8 text-pink-600 animate-spin mr-3" />
        <p className="text-xl text-gray-600">Loading Book Editor...</p>
      </div>
    );
  }

  const currentChapter =
    book.chapters?.[selectedChapterIndex] || { title: "Untitled", content: "" };
  
  // Custom Chapter Item Component for Sidebar (Dark Mode Styling)
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
            className={`flex items-center w-full p-3 rounded-lg transition-colors duration-150 relative ${
                isSelected
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30 font-semibold" // Vibrant pink accent
                    : "text-gray-300 hover:bg-gray-700/50" // Dark mode hover
            }`}
        >
            <button
                onClick={() => onSelect(index)}
                className="flex-1 text-left truncate pr-10"
                disabled={isRenaming}
            >
                <span className="text-sm font-mono mr-2 opacity-80">{index + 1}.</span> 
                {isRenaming ? (
                    <input 
                        ref={inputRef}
                        type="text"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        onBlur={() => onRename(index, titleInput)}
                        onKeyDown={handleKeyDown}
                        // Input Styling in Sidebar (Dark)
                        className={`bg-transparent border-b ${isSelected ? 'border-white/50 text-white' : 'border-gray-500 text-white'} focus:outline-none w-full ml-1 text-base`}
                        style={{ width: 'calc(100% - 30px)' }}
                    />
                ) : (
                    <span className="ml-1 text-base">{chapter.title || `Untitled Chapter`}</span>
                )}
            </button>
            
            {/* Context Menu / Options */}
            <div className="relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    className={`p-1 rounded-full ${isSelected ? 'hover:bg-pink-700' : 'hover:bg-gray-700'}`}
                    title="Chapter Options"
                >
                    <MoreVertical size={16} />
                </button>
                
                {isMenuOpen && (
                    // Menu Styling (Light overlay over dark sidebar)
                    <div className={`absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-20`}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setTitleInput(chapter.title); 
                                onStartRename(index);
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 rounded-t-lg"
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
    // Overall Layout: Very light background to contrast with dark sidebar
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black opacity-60 z-20" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* 2. Sidebar (Chapter Navigation) - Dark Mode & Modern Styling */}
      <div 
        className={`flex-shrink-0 w-72 bg-gray-800 border-r border-gray-700 p-5 transition-transform duration-300 ease-in-out z-30
          fixed inset-y-0 left-0 md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          flex flex-col h-full`}
      >
        <div className="flex justify-between items-center pb-5 border-b border-gray-700 mb-5">
            {/* Back to Dashboard Button */}
            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center text-sm font-semibold text-gray-300 hover:text-pink-400 transition"
            >
                <ArrowLeft size={16} className="mr-2" />
                Dashboard
            </button>
            <button className="md:hidden text-gray-400 hover:text-pink-400" onClick={() => setIsSidebarOpen(false)}>
                <Menu size={20} />
            </button>
        </div>
        
        <h2 className="text-xl font-extrabold text-white mb-4 flex items-center gap-3">
          <BookOpen size={24} className="text-pink-500" />
          {book.title || "Untitled Book"}
        </h2>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {book.chapters.map((chapter, index) => (
            <ChapterItem
              // Use a key that changes on update (e.g., index is fine here unless the list is reordered)
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
        <div className="mt-6 pt-5 border-t border-gray-700">
          <button
            onClick={handleAddChapter}
            className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap w-full bg-transparent hover:bg-gray-700 text-pink-400 hover:text-pink-300 border border-gray-700 hover:border-pink-500 px-4 py-2.5 h-11 rounded-xl"
          >
            <PlusCircle size={18} className="mr-2" />
            Add New Chapter
          </button>
        </div>
      </div>

      {/* 3. Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Bar / Toolbar - Clean White Background */}
        <header className="flex-shrink-0 bg-white border-b border-gray-100 shadow-md p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">

            {/* Chapter Title / Mobile Menu */}
            <div className="flex items-center flex-1 min-w-0">
                <button className="md:hidden p-2 text-gray-700 hover:text-pink-600 mr-3" onClick={() => setIsSidebarOpen(true)}>
                    <Menu size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                    {currentChapter.title}
                </h1>
            </div>


            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              
              {/* Preview Toggle Button - Clean Toggle Style */}
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap px-4 py-2.5 h-11 rounded-xl ${isPreviewMode ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-200/50' : 'bg-gray-100 hover:bg-pink-50 text-gray-700 border border-gray-200'}`}
              >
                {isPreviewMode ? <Edit size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                {isPreviewMode ? "Edit Mode" : "Preview"}
              </button>

              {/* AI Generator Button - Purple Accent */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || isPreviewMode}
                className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 h-11 rounded-xl shadow-lg shadow-purple-300/50"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white mr-2" />
                ) : (
                  <>
                    Generate with AI
                    <Sparkles size={18} className="ml-2" />
                  </>
                )}
              </button>

              {/* Save Button - Distinct Accent with Unsaved Indicator */}
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving || !hasUnsavedChanges}
                className={`inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap px-4 py-2.5 h-11 rounded-xl ${
                    hasUnsavedChanges
                        ? 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200/50'
                        : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200/50'
                } text-white`}
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white mr-2" />
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    {hasUnsavedChanges ? "Unsaved Changes" : "Saved"}
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Editor/Preview Content Area - Maximize Focus */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto w-full">
            {isPreviewMode ? (
              // Preview Mode Styling - Wide, clean text block with large font
              <div 
                data-color-mode="light" 
                className="wmde-markdown-var bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 min-h-[70vh] prose lg:prose-xl"
              >
                <ReactMarkdown>{currentChapter.content}</ReactMarkdown>
              </div>
            ) : (
              // Editor Mode Styling - Maximize Writing Space
              <div className="w-full h-full" data-color-mode="light">
                <MDEditor
                  // Added key to force content refresh on chapter change
                  key={selectedChapterIndex} 
                  value={currentChapter.content}
                  onChange={handleChangeChapter}
                  // Adjusted height calculation for better fit
                  height={window.innerHeight - (window.innerWidth >= 768 ? 130 : 200)} 
                  // Custom MDEditor Styling Classes
                  className="rounded-2xl shadow-2xl border border-gray-100/50" 
                  textareaProps={{
                    placeholder: "Start writing your chapter content here...",
                  }}
                  previewOptions={{
                    className: "prose lg:prose-xl"
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