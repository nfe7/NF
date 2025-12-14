import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Colored light theme
import { NotebookCell, JupyterNotebook } from '../types';
import { Check, Copy } from 'lucide-react';
import DOMPurify from 'dompurify';

interface NotebookRendererProps {
  notebook: JupyterNotebook;
}

const CellRenderer: React.FC<{ cell: NotebookCell; index: number }> = ({ cell, index }) => {
  const [copied, setCopied] = useState(false);
  const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (cell.cell_type === 'markdown') {
    return (
      <div className="mb-4 px-4 py-2 text-gray-800 prose prose-slate max-w-none font-sans">
        <ReactMarkdown
          components={{
             a({ node, children, href, ...props }: any) {
               return (
                 <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                   {children}
                 </a>
               )
            }
          }}
        >
          {source}
        </ReactMarkdown>
      </div>
    );
  }

  if (cell.cell_type === 'code') {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1 pl-1">
           <span className="text-xs font-mono text-gray-500">In [{cell.execution_count || ' '}]:</span>
        </div>
        
        <div className="relative group border border-gray-200 rounded bg-gray-50">
          <button 
             onClick={handleCopy} 
             className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 bg-white rounded border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
             title="Copy Code"
           >
             {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
           </button>

           <div className="p-3 overflow-x-auto text-sm font-mono">
             <SyntaxHighlighter 
              language="python" 
              style={docco} 
              customStyle={{ background: 'transparent', margin: 0, padding: 0 }}
            >
              {source}
            </SyntaxHighlighter>
           </div>
        </div>

        {/* Outputs */}
        {cell.outputs && cell.outputs.length > 0 && (
          <div className="mt-2 pl-2">
            {cell.outputs.map((output, i) => {
              // Handle Stream text
              if (output.text) {
                const textContent = Array.isArray(output.text) ? output.text.join('') : output.text;
                return (
                  <pre key={i} className="text-sm font-mono text-gray-600 whitespace-pre-wrap overflow-x-auto my-2 p-2">
                    {textContent}
                  </pre>
                );
              }
              
              if (output.data) {
                // Image
                const imageKey = Object.keys(output.data).find(key => key.startsWith('image/'));
                if (imageKey) {
                   const base64Img = output.data[imageKey];
                   const imgSrc = Array.isArray(base64Img) ? base64Img.join('').replace(/\n/g, '') : base64Img;
                   return (
                    <div key={i} className="my-2">
                      <img src={`data:${imageKey};base64,${imgSrc}`} alt="Output" className="max-w-full h-auto" />
                    </div>
                  );
                }
                
                // HTML
                if (output.data['text/html']) {
                    const htmlContent = Array.isArray(output.data['text/html']) ? output.data['text/html'].join('') : output.data['text/html'];
                    const cleanHtml = DOMPurify.sanitize(htmlContent);
                    return <div key={i} className="my-2 overflow-auto prose prose-sm max-w-none" dangerouslySetInnerHTML={{__html: cleanHtml}} />
                }

                 // Plain Text
                 if (output.data['text/plain']) {
                    const plainText = Array.isArray(output.data['text/plain']) ? output.data['text/plain'].join('') : output.data['text/plain'];
                    return <pre key={i} className="text-sm font-mono text-gray-600 whitespace-pre-wrap my-2 bg-white p-2">{plainText}</pre>
                }
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
};

const NotebookRenderer: React.FC<NotebookRendererProps> = ({ notebook }) => {
  if (!notebook || !notebook.cells) return <div className="text-red-500">Invalid Notebook Format</div>;

  return (
    <div className="w-full">
      {notebook.cells.map((cell, idx) => (
        <CellRenderer key={idx} cell={cell} index={idx} />
      ))}
    </div>
  );
};

export default NotebookRenderer;