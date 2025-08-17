import React from "react";

export default function LoadingScreen({ fadeOut = false }) {
  return (
    <>
      <style>{`
        .loader-wrapper {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          z-index: 9999;
          opacity: 1;
          transition: opacity 1s ease;
        }

        .loader-wrapper.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .logo {
          font-family: "Poppins", sans-serif;
          font-size: clamp(2rem, 6vw, 6rem);
          font-weight: 900;
          color: transparent;
          background: linear-gradient(90deg, #00629B, #FF6F00); /* IEEE Blue + Manipal Orange */
          -webkit-background-clip: text;
          background-clip: text;
          text-transform: uppercase;
          letter-spacing: 4px;
          opacity: 0;
          animation: fadeIn 1.8s ease forwards;
        }

        @keyframes fadeIn {
          0%   { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className={`loader-wrapper ${fadeOut ? "fade-out" : ""}`}>
        <div className="logo">IEEE X MIT</div>
      </div>
    </>
  );
}
