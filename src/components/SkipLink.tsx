import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 
                 bg-eldercare-primary text-white px-4 py-2 rounded-md font-opensans font-medium
                 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2
                 transition-all duration-300"
    >
      {children}
    </a>
  );
};