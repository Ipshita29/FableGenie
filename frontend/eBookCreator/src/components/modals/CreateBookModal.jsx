import { useState } from "react";
import { BookOpen, Hash, Lightbulb, Palette, Sparkles, X, Loader2 } from "lucide-react";
import axiosInstance from "../../utlis/axiosInstance";
import { API_PATHS } from "../../utlis/apiPaths";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {
  const { user } = useAuth();

  const [bookTitle, setBookTitle] = useState("");
  const [numChapters, setNumChapters] = useState(5);
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("Informative");
  const [isCreating, setIsCreating] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const resetModal = () => {
    setBookTitle("");
    setNumChapters(5);
    setAiTopic("");
    setAiStyle("Informative");
    setCoverImage(null);
    setCoverPreview(null);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBook = async () => {
    if (!bookTitle || !numChapters) {
      toast.error("Please provide a title and number of chapters.");
      return;
    }

    setIsCreating(true);

    try {
      const formData = new FormData();
      formData.append("title", bookTitle);
      formData.append("author", user.name || "Unknown Author");
      formData.append("numChapters", numChapters);
      formData.append("topic", aiTopic);
      formData.append("style", aiStyle);

      if (coverImage) formData.append("coverImage", coverImage);

      const response = await axiosInstance.post(
        API_PATHS.BOOKS.CREATE_TEMPLATE_BOOK,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Template created! AI will generate full book soon.");
      onBookCreated(response.data.book._id);

      onClose();
      resetModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create eBook.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 backdrop-blur-sm">
        {/* Modal Box */}
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
          {/* Close Button */}
          <button
            onClick={() => {
              onClose();
              resetModal();
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          >
            <X size={22} />
          </button>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Create New eBook
          </h3>

          {/* Modal Content */}
          <div className="space-y-6">
        {/* Book Title Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Book Title
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter your book title..."
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full h-11 px-3 py-2 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          {coverPreview && (
            <img
              src={coverPreview}
              className="mt-4 w-32 h-48 object-cover rounded-lg shadow-md"
              alt="Cover Preview"
            />
          )}
        </div>

        {/* Number of Chapters Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Number of Chapters
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="number"
              placeholder="5"
              value={numChapters}
              onChange={(e) => setNumChapters(parseInt(e.target.value) || 1)}
              className="w-full h-11 px-3 py-2 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

        {/* Topic Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Topic (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lightbulb className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Specific topic for the book..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="w-full h-11 px-3 py-2 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

            {/* Writing Style Select */}
            <div className="space-y-2">
              <label
                htmlFor="writingStyle"
                className="block text-sm font-medium text-gray-700"
              >
                Writing Style
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Palette className="h-5 w-5 text-gray-400" />
                </div>

                <select
                  id="writingStyle"
                  name="writingStyle"
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value)}
                  className="w-full h-11 px-3 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
                >
                  <option value="Informative">Informative</option>
                  <option value="StoryTelling">StoryTelling</option>
                  <option value="Casual">Casual</option>
                  <option value="Professional">Professional</option>
                  <option value="Humorous">Humorous</option>
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M7 7l3 3 3-3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleCreateBook}
                disabled={isCreating}
                className="inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2.5 h-11 rounded-xl shadow-lg shadow-pink-300/50"
              >
                {isCreating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white mr-2" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Template
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CreateBookModal;
