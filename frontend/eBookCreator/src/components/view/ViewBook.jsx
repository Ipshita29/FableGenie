import React from 'react';
import ReactMarkdown from 'react-markdown';

const ViewBook = ({ chapter }) => {
  if (!chapter) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No chapter content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chapter Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight">
          {chapter.title || 'Untitled Chapter'}
        </h1>
        {chapter.description && (
          <p className="text-xl text-gray-600 leading-relaxed">
            {chapter.description}
          </p>
        )}
      </div>

      {/* Chapter Content */}
      <div className="prose prose-lg prose-gray max-w-none">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 leading-relaxed">
          {chapter.content ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed text-lg">{children}</p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-indigo-500 pl-6 py-2 my-6 bg-indigo-50 italic text-gray-800">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-lg leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-700">{children}</em>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-6 text-sm">
                    {children}
                  </pre>
                ),
              }}
            >
              {chapter.content}
            </ReactMarkdown>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">This chapter is empty</p>
              <p className="text-gray-400 text-sm mt-2">Content will appear here once it's written</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBook;
