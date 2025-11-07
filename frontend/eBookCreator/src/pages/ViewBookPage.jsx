import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  BookOpen,
  User,
  Calendar,
  Eye,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS, BASE_URL } from "../utlis/apiPaths";
import Button from "../components/ui/Button";

const ViewBookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`);
        const data = res.data;
        data.chapters = Array.isArray(data.chapters) ? data.chapters : [];
        setBook(data);
      } catch {
        toast.error("Failed to load the book.");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId, navigate]);

  const handleBack = () => navigate("/dashboard");
  const handleEdit = () => navigate(`/editor/${bookId}`);
  const chapter = book?.chapters[selectedChapterIndex];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
        Loading your book...
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mb-3" />
        <h2 className="text-2xl font-semibold mb-2">Book Not Found</h2>
        <p className="text-gray-500 mb-6">It may have been removed or doesn’t exist.</p>
        <Button onClick={handleBack}>Back to Dashboard</Button>
      </div>
    );

  const coverImage = book.coverImage
    ? `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g, "/")
    : "https://via.placeholder.com/400x600?text=No+Cover";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Button onClick={handleBack} variant="ghost" className="flex items-center gap-2 text-gray-600">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <h1 className="text-lg font-semibold truncate max-w-md">{book.title || "Untitled Book"}</h1>
          <Button onClick={handleEdit} variant="secondary" className="flex items-center gap-2">
            <Eye className="w-4 h-4" /> Edit
          </Button>
        </div>
      </header>

      {/* Book Info */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-6">
          <img
            src={coverImage}
            alt={book.title}
            className="w-48 h-72 object-cover rounded-lg shadow-md"
            onError={(e) => (e.target.src = "https://via.placeholder.com/400x600?text=No+Cover")}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
            {book.subtitle && <h2 className="text-lg text-gray-600 mb-4">{book.subtitle}</h2>}

            <div className="space-y-2 text-gray-600 mb-4">
              <p><User className="inline w-4 h-4 mr-1" /> <b>Author:</b> {book.author || "Unknown"}</p>
              <p><Calendar className="inline w-4 h-4 mr-1" /> <b>Status:</b>{" "}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  book.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {book.status === "published" ? "Published" : "Draft"}
                </span>
              </p>
              <p><BookOpen className="inline w-4 h-4 mr-1" /> <b>Chapters:</b> {book.chapters.length}</p>
            </div>

            {book.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-6">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white border rounded-lg overflow-y-auto max-h-[70vh]">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center gap-2 text-gray-900">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Chapters
            </h2>
            <p className="text-sm text-gray-500">
              {book.chapters.length} chapter{book.chapters.length !== 1 ? "s" : ""}
            </p>
          </div>

          {book.chapters.length ? (
            <div className="p-2 space-y-2">
              {book.chapters.map((ch, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedChapterIndex(i)}
                  className={`w-full text-left p-3 rounded-lg flex items-start gap-3 transition ${
                    i === selectedChapterIndex
                      ? "bg-indigo-50 border border-indigo-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${
                      i === selectedChapterIndex ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm truncate ${
                      i === selectedChapterIndex ? "text-indigo-900" : "text-gray-900"
                    }`}>
                      {ch.title || `Chapter ${i + 1}`}
                    </h3>
                    {ch.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{ch.description}</p>
                    )}
                  </div>
                  {i === selectedChapterIndex && (
                    <ChevronRight className="w-4 h-4 text-indigo-600 mt-1" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">No chapters available</div>
          )}

          <div className="p-3 border-t text-center text-xs text-gray-500 bg-gray-50">
            Reading Chapter {selectedChapterIndex + 1} of {book.chapters.length}
          </div>
        </div>

        {/* Chapter View */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border p-6 leading-relaxed">
          {chapter ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
                p: ({ children }) => <p className="text-gray-700 mb-3">{children}</p>,
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">{children}</pre>
                ),
              }}
            >
              {chapter.content || "_This chapter is empty._"}
            </ReactMarkdown>
          ) : (
            <div className="text-center text-gray-500 py-16">No chapter content available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBookPage;
