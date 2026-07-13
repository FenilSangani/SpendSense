// Layout.jsx — Layout wrapper component
// Combines the sidebar with the main content area
// Every protected page is rendered inside this layout

import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area on the right */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
