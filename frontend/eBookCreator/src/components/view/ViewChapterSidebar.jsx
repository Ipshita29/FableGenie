import React from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';

const ViewChapterSidebar = ({ chapters, selectedChapterIndex, onChapterSelect }) => {
  if (!chapters || chapters.length === 0) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No chapters available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Chapters
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Chapters List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {chapters.map((chapter, index) => (
            <button
              key={index}
              onClick={() => onChapterSelect(index)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                index === selectedChapterIndex
                  ? 'bg-indigo-50 border-2 border-indigo-200 shadow-sm'
                  : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Chapter Number */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index === selectedChapterIndex
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                }`}>
                  {index + 1}
                </div>

                {/* Chapter Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm leading-tight mb-1 ${
                    index === selectedChapterIndex ? 'text-indigo-900' : 'text-gray-900'
                  }`}>
                    {chapter.title || `Chapter ${index + 1}`}
                  </h3>
                  {chapter.description && (
                    <p className={`text-xs leading-relaxed line-clamp-2 ${
                      index === selectedChapterIndex ? 'text-indigo-700' : 'text-gray-600'
                    }`}>
                      {chapter.description}
                    </p>
                  )}
                  {chapter.content && (
                    <p className="text-xs text-gray-400 mt-1">
                      {chapter.content.length > 100
                        ? `${chapter.content.substring(0, 100)}...`
                        : chapter.content
                      }
                    </p>
                  )}
                </div>

                {/* Arrow Indicator */}
                {index === selectedChapterIndex && (
                  <ChevronRight className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Reading Chapter {selectedChapterIndex + 1} of {chapters.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewChapterSidebar;
