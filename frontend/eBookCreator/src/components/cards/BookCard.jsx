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
      className="
        bg-white 
        rounded-2xl 
        border border-pink-100 
        shadow-md 
        hover:shadow-xl 
        hover:-translate-y-1 
        transition-all 
        duration-300 
        overflow-hidden 
        cursor-pointer 
        flex flex-col 
        w-64
      "
      onClick={() => navigate(`/view-book/${book._id}`)}
    >
      {/* Book Cover - soft rounded & shadow */}
      <div className="relative w-full pt-[133%] bg-pink-50 rounded-lg overflow-hidden">
        <img
          src={coverImageUrl}
          alt={book.title || "No cover"}
          className="
            absolute top-0 left-0 w-full h-full 
            object-cover object-top 
            transition-transform duration-500 
            hover:scale-105
          "
          onError={(e) => (e.target.src = "/no-cover.png")}
        />

        {/* Floating Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/editor/${book._id}`);
            }}
            className="
              backdrop-blur-md bg-white/70 
              hover:bg-white 
              text-gray-700 
              p-2 rounded-lg 
              shadow-lg 
              transition
            "
            title="Edit Book"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book._id);
            }}
            className="
              backdrop-blur-md bg-white/70 
              hover:bg-white 
              text-red-500 
              p-2 rounded-lg 
              shadow-lg 
              transition
            "
            title="Delete Book"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 truncate">
          {book.title || "Untitled Book"}
        </h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
          {book.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default BookCard;
