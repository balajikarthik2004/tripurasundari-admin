import React, { useState } from 'react';

export default function Tooltip({ children, content, position = 'right', enabled = true }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!enabled || !content) {
    return <>{children}</>;
  }

  const positionClasses = {
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
  };

  const arrowClasses = {
    right: 'left-[-4px] top-1/2 -translate-y-1/2 border-r-[#400D21] border-r-[5px] border-y-[4px] border-y-transparent border-l-0',
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-[#400D21] border-t-[5px] border-x-[4px] border-x-transparent border-b-0',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-b-[#400D21] border-b-[5px] border-x-[4px] border-x-transparent border-t-0',
    left: 'right-[-4px] top-1/2 -translate-y-1/2 border-l-[#400D21] border-l-[5px] border-y-[4px] border-y-transparent border-r-0',
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none whitespace-nowrap rounded-md bg-[#38091B] border border-[#B68A36]/40 px-2.5 py-1.5 text-xs text-white shadow-xl shadow-black/40 animate-in fade-in zoom-in-95 duration-150 ${positionClasses[position]}`}
        >
          <div className="font-medium text-[#F8F5EF] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E2BC6B]"></span>
            {content}
          </div>
          <span className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
}

