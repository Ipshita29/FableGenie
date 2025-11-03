import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Trash2,
  Plus,
  GripVertical,
  Edit2,
  Search,
} from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "../ui/Button";

const SortableItem = ({
  chapter,
  index,
  selectedChapterIndex,
  onSelectChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  onRenameChapter,
  isGenerating,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(chapter.title || "");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor:
      index === selectedChapterIndex ? "#fff8e1" : "#ffffff",
    border:
      index === selectedChapterIndex
        ? "2px solid #f59e0b"
        : "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    marginBottom: "0.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const handleRename = () => {
    onRenameChapter(index, newTitle.trim() || `Chapter ${index + 1}`);
    setIsEditing(false);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        onClick={() => onSelectChapter(index)}
        style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: "500",
        }}
      >
        {isEditing ? (
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
            className="w-full border rounded px-2 py-1 text-sm"
          />
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to rename"
          >
            {chapter.title || `Chapter ${index + 1}`}
          </span>
        )}
      </div>

      <div className="flex gap-2 items-center ml-2">
        <Sparkles
          size={18}
          title="Generate AI content"
          className={`cursor-pointer ${
            isGenerating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isGenerating) onGenerateChapterContent(index);
          }}
        />
        <Edit2
          size={16}
          title="Rename chapter"
          className="cursor-pointer text-gray-500 hover:text-black"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        />
        <Trash2
          size={18}
          title="Delete chapter"
          color="red"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this chapter?"))
              onDeleteChapter(index);
          }}
        />
        <GripVertical size={18} className="cursor-grab text-gray-400" />
      </div>
    </div>
  );
};

const ChapterSidebar = ({
  book,
  selectedChapterIndex,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  onRenameChapter,
  isGenerating,
  onReorderChapters,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorderChapters(active.id, over.id);
  };

  const filteredChapters = book.chapters.filter((chapter) =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWords = book.chapters.reduce(
    (sum, ch) => sum + (ch.content ? ch.content.split(" ").length : 0),
    0
  );

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 p-4 flex flex-col dark:bg-gray-900 dark:border-gray-700 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-black"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <Button
          onClick={onAddChapter}
          icon={<Plus size={16} />}
          label="Add"
        />
      </div>

      {/* Search */}
      <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 mb-3">
        <Search size={16} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search chapters..."
          className="w-full bg-transparent outline-none text-sm py-1 px-2 text-gray-800 dark:text-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        📚 {book.chapters.length} chapters • ✍️ {totalWords} words
      </div>

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={book.chapters.map((_, idx) => idx)}
            strategy={verticalListSortingStrategy}
          >
            {filteredChapters.map((chapter, index) => (
              <SortableItem
                key={index}
                chapter={chapter}
                index={index}
                selectedChapterIndex={selectedChapterIndex}
                onSelectChapter={onSelectChapter}
                onDeleteChapter={onDeleteChapter}
                onGenerateChapterContent={onGenerateChapterContent}
                onRenameChapter={onRenameChapter}
                isGenerating={isGenerating}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default ChapterSidebar;
