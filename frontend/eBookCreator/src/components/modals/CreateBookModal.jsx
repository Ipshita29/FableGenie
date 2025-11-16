import { useState } from "react";
import { BookOpen, Hash, Lightbulb, Palette, Sparkles } from "lucide-react";
import Modal from "../ui/Modal";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
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
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetModal();
      }}
      title="Create New eBook"
    >
      <div className="space-y-6">
        <InputField
          icon={BookOpen}
          label="Book Title"
          placeholder="Enter your book title..."
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />

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

        <InputField
          icon={Hash}
          label="Number of Chapters"
          type="number"
          placeholder="5"
          value={numChapters}
          onChange={(e) => setNumChapters(parseInt(e.target.value) || 1)}
        />

        <InputField
          icon={Lightbulb}
          label="Topic (Optional)"
          placeholder="Specific topic for the book..."
          value={aiTopic}
          onChange={(e) => setAiTopic(e.target.value)}
        />

        <SelectField
          icon={Palette}
          label="Writing Style"
          value={aiStyle}
          onChange={(e) => setAiStyle(e.target.value)}
          options={["Informative", "StoryTelling", "Casual", "Professional", "Humorous"]}
        />

        <div className="flex justify-center">
          <Button
            onClick={handleCreateBook}
            isLoading={isCreating}
            icon={Sparkles}
          >
            {isCreating ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateBookModal;
