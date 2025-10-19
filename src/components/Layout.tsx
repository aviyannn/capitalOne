import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 overflow-hidden">
    {children}
  </div>
);

export default Layout;