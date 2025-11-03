import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utlis/apiPaths";
import { Edit, Trash } from "lucide-react";

const BookCard = ({ book, onDelete }) => {
  const navigate = useNavigate();
  const coverImageUrl = book.coverImage
    ? `${BASE_URL}/backend${book.coverImage}`.replace(/\\/g, "/")
    : "https://via.placeholder.com/300x400?text=No+Cover";

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/view-book/${book._id}`)}
    >
      {/* Book Cover */}
      <div className="relative w-full h-56 bg-gray-100">
        <img
          src={coverImageUrl}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x400?text=No+Cover";
          }}
        />

        {/* Edit & Delete buttons */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/editor/${book._id}`);
            }}
            className="bg-white/80 hover:bg-white text-gray-700 p-1.5 rounded-lg shadow-sm"
            title="Edit Book"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book._id);
            }}
            className="bg-white/80 hover:bg-white text-red-500 p-1.5 rounded-lg shadow-sm"
            title="Delete Book"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {book.title || "Untitled Book"}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {book.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
