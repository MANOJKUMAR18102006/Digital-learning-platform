import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="text-neutral-700">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-3" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold text-slate-800 mt-5 mb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2" {...props} />,
        h4: ({ node, ...props }) => <h4 className="text-base font-semibold text-slate-700 mt-3 mb-1" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-3 text-slate-700" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-3 text-slate-700" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-slate-600" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-emerald-500/50 pl-6 py-4 my-6 backdrop-blur-sm bg-emerald-50/50 rounded-r-2xl shadow-sm italic text-slate-700" {...props} />
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-([\w-]+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={dracula}
              language={match[1]}
              PreTag="div"
              className="rounded-xl my-3 text-sm"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-slate-100 text-emerald-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          );
        },
        pre: ({ node, ...props }) => <pre className="bg-slate-900 rounded-xl overflow-x-auto my-3" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;