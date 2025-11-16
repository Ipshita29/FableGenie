import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Book, ArrowLeft, Loader2 } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utlis/axiosInstance";
import { API_PATHS } from "../utlis/apiPaths";
import BookCard from "../components/cards/BookCard";
import CreateBookModal from "../components/modals/CreateBookModal";

const BookCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-gray-100 rounded-xl p-4 shadow-sm">
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal box */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-gray-100 hover:bg-pink-50 text-gray-700 border border-gray-200 px-4 py-2.5 h-11 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 h-11 rounded-xl shadow-md shadow-red-300/50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log("📘 Fetching from:", API_PATHS.BOOKS.GET_BOOKS);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true); // ✅ Set loading before fetching
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
        setBooks(response.data);
      } catch (error) {
        toast.error("Failed to load your eBooks.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      await axiosInstance.delete(`${API_PATHS.BOOKS.DELETE_BOOK}/${bookToDelete}`);
      setBooks(books.filter((book) => book._id !== bookToDelete));
      toast.success("eBook deleted successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete eBook.");
    } finally {
      setBookToDelete(null);
    }
  };

  const handleCreateBookClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleBookCreated = (bookId) => {
    setIsCreateModalOpen(false);
    navigate(`/editor/${bookId}`);

  };

  return (
   <DashboardLayout>
  <div className="p-6 lg:p-10 bg-gradient-to-br from-white to-pink-50 min-h-screen">

    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          title="Back to Landing Page"
          className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-transparent hover:bg-pink-50 text-pink-600 hover:text-pink-700 p-2 rounded-xl"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Your eBooks
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Create, edit, and manage all your AI-generated eBooks.
          </p>
        </div>
      </div>

      <button
        onClick={handleCreateBookClick}
        className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 h-11 rounded-xl shadow-lg shadow-pink-200/50"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create New eBook
      </button>
    </div>

    {/* Main Content */}
    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    ) : books.length === 0 ? (
      <div className="flex flex-col items-center text-center py-20 bg-white rounded-2xl shadow-md border border-pink-100">
        <Book className="w-14 h-14 text-pink-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-800">No eBooks Yet</h3>
        <p className="text-gray-500 max-w-sm mt-2 mb-6">
          You haven't created any eBooks yet. Start building your first one using AI.
        </p>

        <button
          onClick={handleCreateBookClick}
          className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 h-11 rounded-xl shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your First eBook
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            onDelete={() => setBookToDelete(book._id)}
          />
        ))}
      </div>
    )}

    {/* Delete Confirmation Modal */}
    <ConfirmationModal
      isOpen={!!bookToDelete}
      onClose={() => setBookToDelete(null)}
      onConfirm={handleDeleteBook}
      title="Delete eBook"
      message="Are you sure you want to delete this eBook? This action cannot be undone."
    />

    {/* Create Book Modal */}
    <CreateBookModal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      onBookCreated={handleBookCreated}
    />
  </div>
</DashboardLayout>

  );
};

export default DashboardPage;
