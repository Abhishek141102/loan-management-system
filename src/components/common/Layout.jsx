import { useState } from "react";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [globalSearch, setGlobalSearch] = useState("");

  return (
    <div className="admin-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="admin-main">
        <Header
          setSidebarOpen={setSidebarOpen}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />

        <div className="admin-content">
          {children &&
            React.cloneElement(children, {
              globalSearch,
            })}
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default Layout;
