import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, BookOpen, User, Calendar, Eye } from 'lucide-react';

import axiosInstance from '../utlis/axiosInstance';
import { API_PATHS, BASE_URL } from '../utlis/apiPaths';
import Button from '../components/ui/Button';
import ViewBook from '../components/view/ViewBook';
import ViewChapterSidebar from '../components/view/ViewChapterSidebar';

const ViewBookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  // Fetch book data on mount
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`);
        const fetchedBook = response.data;

        // Ensure chapters exist
        if (!fetchedBook.chapters || !Array.isArray(fetchedBook.chapters)) {
          fetchedBook.chapters = [];
        }

        setBook(fetchedBook);

        // Set initial chapter to first one if available
        if (fetchedBook.chapters.length > 0) {
          setSelectedChapterIndex(0);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        toast.error('Failed to load the book. Please try again.');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId, navigate]);

  // Handle chapter selection
  const handleChapterSelect = (index) => {
    setSelectedChapterIndex(index);
  };

  // Handle navigation back to dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Handle edit book
  const handleEditBook = () => {
    navigate(`/editor/${bookId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your book...</p>
        </div>
      </div>
    );
  }

  // Error state - no book found
  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
          <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentChapter = book.chapters[selectedChapterIndex];
  const coverImageUrl = book.coverImage
    ? `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g, "/")
    : "https://via.placeholder.com/400x600?text=No+Cover";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Back Button */}
            <Button
              onClick={handleBackToDashboard}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>

            {/* Center - Book Title */}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md mx-auto">
                {book.title || 'Untitled Book'}
              </h1>
            </div>

            {/* Right - Edit Button */}
            <Button
              onClick={handleEditBook}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Edit Book
            </Button>
          </div>
        </div>
      </header>

      {/* Book Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-48 h-72 mx-auto md:mx-0">
                <img
                  src={coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x600?text=No+Cover";
                  }}
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {book.title || 'Untitled Book'}
                </h1>
                {book.subtitle && (
                  <h2 className="text-xl text-gray-600 mb-4">
                    {book.subtitle}
                  </h2>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Author:</span>
                  <span>{book.author || 'Unknown'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    book.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {book.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">Chapters:</span>
                  <span>{book.chapters.length}</span>
                </div>
              </div>

              {book.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <ViewChapterSidebar
            chapters={book.chapters}
            selectedChapterIndex={selectedChapterIndex}
            onChapterSelect={handleChapterSelect}
          />

          {/* Main Content Area */}
          <div className="flex-1">
            <ViewBook chapter={currentChapter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBookPage;
