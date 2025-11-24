/**
 * App Component - Application Bootstrap
 * 
 * This is the root component that controls the application's initial loading state.
 * 
 * How it works:
 * 1. Shows a loading screen for 2.5 seconds when the app starts
 * 2. Uses React's useState to track loading state
 * 3. Uses useEffect to set a timer that changes loading state after 2.5s
 * 4. When loading is false, fades out the loading screen
 * 5. Then renders the main app with all routes via RouterProvider
 * 
 * Why a loading screen?
 * - Provides a polished first impression
 * - Can be extended to wait for critical data to load
 * - Hides the initial page render/layout shift
 * - Shows branding (IEEE logo/colors) immediately
 * 
 * Technical Details:
 * - Timer is cleaned up on unmount (prevents memory leaks)
 * - LoadingScreen component handles its own fade-out animation
 * - Router is imported from main.jsx (centralized routing config)
 */
import React, { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import { router } from "./main"; // import your router config from main.jsx

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for ~2.5s
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen fadeOut={!loading} />
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}
