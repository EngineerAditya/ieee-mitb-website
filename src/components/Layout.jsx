// src/components/Layout.jsx
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}


/*// ...existing code...
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTransitionLoader from "./PageTransitionLoader";
// ...existing code...

export default function Layout() {
  // ...existing code...

  const location = useLocation();
  const initialLoad = useRef(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState("IEEE X MIT");

  function titleFromPath(path) {
    if (path === "/" || path === "") return "IEEE X MIT";
    if (path.startsWith("/events")) return "Events";
    if (path.startsWith("/about")) return "About";
    if (path.startsWith("/articles")) return "Articles";
    if (path.startsWith("/membership")) return "Membership";
    // fallback
    const parts = path.split("/").filter(Boolean);
    return parts.length ? decodeURIComponent(parts[parts.length - 1]).replace(/[-_]/g, " ") : "Loading";
  }

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    const title = titleFromPath(location.pathname);
    setLoadingTitle(title);
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 600);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (pageLoading) return <PageTransitionLoader title={loadingTitle} />;

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
// ...existing code...*/