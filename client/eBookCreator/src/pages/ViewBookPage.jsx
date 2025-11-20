/* Modern UI — No functionality changed */
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

const ViewBookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );
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
      <div className="min-h-screen flex flex-col items-center justify-center text-pink-600">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500 mb-4"></div>
        Loading your book...
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <BookOpen className="w-16 h-16 text-pink-300 mb-3" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Book Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          It may have been removed or doesn’t exist.
        </p>
        <button
          onClick={handleBack}
          className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2.5 h-11 rounded-xl shadow-lg shadow-pink-300/50"
        >
          Back to Dashboard
        </button>
      </div>
    );

  const coverImage = book.coverImage
    ? `${BASE_URL}${book.coverImage}`.replace(/\\/g, "/")
    : "/no-cover.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50/60 to-pink-100/40">

      {/* Glass Header */}
      <header className="backdrop-blur-xl bg-white/60 border-b border-pink-200 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-transparent hover:bg-pink-50 text-pink-600 hover:text-pink-700 px-4 py-2.5 h-11 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>

          <h1 className="text-lg font-semibold truncate max-w-md text-gray-800 tracking-wide">
            {book.title || "Untitled Book"}
          </h1>

          <button
            onClick={handleEdit}
            className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-gray-100 hover:bg-pink-50 text-gray-700 border border-gray-200 px-4 py-2.5 h-11 rounded-xl"
          >
            <Eye className="w-4 h-4 mr-2" /> Edit
          </button>

        </div>
      </header>

      {/* Book Info Card */}
      <div className="bg-white/70 backdrop-blur-xl shadow-xl shadow-pink-200/40 border border-pink-100 rounded-xl max-w-7xl mx-auto mt-6 p-6">

        <div className="flex flex-col md:flex-row gap-8">

          <img
            src={coverImage}
            alt={book.title}
            className="w-32 h-48 object-cover rounded-xl shadow-md shadow-pink-200/70"
            onError={(e) => (e.target.src = "/no-cover.png")}
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

            {book.subtitle && (
              <h2 className="text-lg text-gray-600 mt-1">{book.subtitle}</h2>
            )}

            <div className="mt-4 space-y-2 text-gray-700">
              <p>
                <User className="inline w-4 h-4 mr-2 text-pink-600" /> 
                <b>Author:</b> {book.author || "Unknown"}
              </p>

              <p>
                <Calendar className="inline w-4 h-4 mr-2 text-pink-600" /> 
                <b>Status:</b>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    book.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-pink-100 text-pink-700"
                  }`}
                >
                  {book.status === "published" ? "Published" : "Draft"}
                </span>
              </p>

              <p>
                <BookOpen className="inline w-4 h-4 mr-2 text-pink-600" /> 
                <b>Chapters:</b> {book.chapters.length}
              </p>
            </div>

            {book.description && (
              <div className="mt-6 bg-white/70 border border-pink-100 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-6">

        {/* Sidebar - Neumorphic */}
        <div className="w-full md:w-80 bg-white rounded-2xl border border-pink-100 shadow-[8px_8px_20px_rgba(0,0,0,0.06),-8px_-8px_20px_rgba(255,255,255,0.9)] p-4 max-h-[72vh] overflow-y-auto">

          <h2 className="font-semibold flex items-center gap-2 text-gray-900 mb-2">
            <BookOpen className="w-5 h-5 text-pink-600" /> Chapters
          </h2>

          {/* Chapter List */}
          <div className="space-y-2 mt-3">
            {book.chapters.map((ch, i) => (
              <button
                key={i}
                onClick={() => setSelectedChapterIndex(i)}
                className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-4
                  ${
                    i === selectedChapterIndex
                      ? "bg-pink-100/90 shadow-lg border border-pink-200"
                      : "bg-white shadow-sm hover:shadow-md"
                  }
                `}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm 
                    ${
                      i === selectedChapterIndex
                        ? "bg-pink-600 text-white"
                        : "bg-pink-100 text-pink-700"
                    }
                  `}
                >
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold truncate ${
                      i === selectedChapterIndex
                        ? "text-pink-700"
                        : "text-gray-800"
                    }`}
                  >
                    {ch.title || `Chapter ${i + 1}`}
                  </h3>
                  {ch.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {ch.description}
                    </p>
                  )}
                </div>

                {i === selectedChapterIndex && (
                  <ChevronRight className="w-5 h-5 text-pink-600 mt-1" />
                )}
              </button>
            ))}
          </div>

          <div className="text-center mt-4 text-sm text-gray-500">
            Reading {selectedChapterIndex + 1}/{book.chapters.length}
          </div>
        </div>

        {/* Chapter Reader */}
        <div className="flex-1 bg-white rounded-2xl border border-pink-100 p-6 shadow-[8px_8px_20px_rgba(0,0,0,0.06),-8px_-8px_20px_rgba(255,255,255,0.9)] leading-relaxed">

          {chapter ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mb-4 text-gray-900">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {children}
                  </p>
                ),
                code: ({ children }) => (
                  <code className="bg-pink-100 px-2 py-1 rounded text-sm font-mono text-pink-800">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-pink-100 p-4 rounded-xl overflow-x-auto mb-4 text-sm shadow-inner">
                    {children}
                  </pre>
                ),
              }}
            >
              {chapter.content ||
                chapter.description ||
                "_This chapter is empty._"}
            </ReactMarkdown>
          ) : (
            <div className="text-center text-gray-500 py-16">
              No chapter content available
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ViewBookPage;
