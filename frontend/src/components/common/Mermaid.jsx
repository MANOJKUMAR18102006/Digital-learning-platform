import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'forest',
  securityLevel: 'loose',
  fontFamily: 'Inter',
  mindmap: {
    useMaxWidth: true,
    padding: 20
  }
});

const Mermaid = ({ chart }) => {
  const ref = useRef();

  useEffect(() => {
    if (chart && ref.current) {
      mermaid.contentLoaded();
      // Ensure we clear the previous content before re-rendering
      ref.current.removeAttribute('data-processed');
      mermaid.render('mermaid-svg-' + Math.random().toString(36).substr(2, 9), chart)
        .then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        })
        .catch(err => {
          console.error('Mermaid render error:', err);
          if (ref.current) {
             ref.current.innerHTML = '<div class="text-red-500 p-4 border border-red-100 rounded-lg bg-red-50 text-xs font-mono">Invalid mindmap syntax generated. Please try again.</div>';
          }
        });
    }
  }, [chart]);

  return (
    <div className="mermaid-container w-full overflow-x-auto flex justify-center py-6 bg-slate-50/30 rounded-2xl border border-slate-100/50">
      <div ref={ref} className="mermaid flex justify-center w-full min-h-[300px]" />
    </div>
  );
};

export default Mermaid;
