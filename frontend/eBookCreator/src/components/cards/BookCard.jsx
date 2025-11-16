import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utlis/apiPaths";
import { Edit, Trash } from "lucide-react";

const BookCard = ({ book, onDelete }) => {
  const navigate = useNavigate();

  const coverImageUrl = book.coverImage
    ? `${BASE_URL}${book.coverImage}`.replace(/\\/g, "/")
    : "/no-cover.png";

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 flex flex-col w-64"
      onClick={() => navigate(`/view-book/${book._id}`)}
    >
      {/* Book Cover (fixed ratio like a real book: 3:4) */}
      <div className="relative w-full pt-[133%] bg-gray-100 rounded-lg overflow-hidden shadow-sm"> 
        {/* 133% = height/width for 3:4 ratio (4/3 * 100) */}

        <img
          src={coverImageUrl}
          alt={book.title || "No cover"}
          className="absolute top-0 left-0 w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
          onError={(e) => (e.target.src = "/no-cover.png")}
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
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {book.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
