import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

const CodeBlock = ({ language, value }: { language: string, value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group border border-gray-200 rounded bg-gray-50 my-4 font-mono text-sm">
       <div className="absolute top-2 right-2 flex items-center gap-2">
         <span className="text-xs text-gray-400 uppercase select-none">{language}</span>
         <button 
           onClick={handleCopy} 
           className="p-1 text-gray-400 hover:text-gray-600 bg-white rounded border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
           title="Copy Code"
         >
           {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
         </button>
       </div>
        
       <div className="p-4 overflow-x-auto">
           <SyntaxHighlighter
              style={docco}
              language={language}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
              }}
            >
              {value}
            </SyntaxHighlighter>
        </div>
    </div>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="w-full font-sans text-gray-800">
      <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-[#8c1515] prose-a:no-underline hover:prose-a:underline">
        <ReactMarkdown
          components={{
            // Handle Code Blocks
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const value = String(children).replace(/\n$/, '');

              return !inline && match ? (
                <CodeBlock language={match[1]} value={value} />
              ) : (
                <code className={`${className} bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-sm`} {...props}>
                  {children}
                </code>
              );
            },
            // Handle Links securely
            a({ node, children, href, ...props }: any) {
               return (
                 <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                   {children}
                 </a>
               )
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownRenderer;