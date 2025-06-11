import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

export default function MarkdownPreview({ content }) {
    return (
        <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 overflow-y-auto" style={{ maxHeight: '200px' }}>
            <p className="text-gray-500 font-semibold mb-2">Xem trước:</p>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
