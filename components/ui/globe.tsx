import React from "react";

/**
 * Rotating globe (CSS day/night terminator via layered inset shadows).
 * Integrated from the provided component — the 250px ball geometry is kept
 * intact (the px-based inset shadows define the lit edge), and a `scale`
 * prop resizes it without distorting that shading. `className` positions the
 * outer wrapper so it can sit inside a hero rather than forcing `h-screen`.
 */
const Globe: React.FC<{ scale?: number; className?: string }> = ({
  scale = 1,
  className = "flex items-center justify-center",
}) => {
  return (
    <>
      <style>
        {`
          @keyframes earthRotate {
            0% { background-position: 0 0; }
            100% { background-position: 400px 0; }
          }
          @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        `}
      </style>
      <div className={className}>
        <div
          className="relative h-[250px] w-[250px] rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2),-5px_0_8px_#c3f4ff_inset,15px_2px_25px_#000_inset,-24px_-2px_34px_#c3f4ff99_inset,250px_0_44px_#00000066_inset,150px_0_38px_#000000aa_inset]"
          style={{
            transform: `scale(${scale})`,
            backgroundImage:
              "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "left",
            animation: "earthRotate 30s linear infinite",
          }}
        >
          {/* Stars */}
          <div
            className="absolute left-[-20px] h-1 w-1 rounded-full bg-white"
            style={{ animation: "twinkling 3s infinite" }}
          />
          <div
            className="absolute top-[30px] left-[-40px] h-1 w-1 rounded-full bg-white"
            style={{ animation: "twinkling-slow 2s infinite" }}
          />
          <div
            className="absolute top-[90px] left-[350px] h-1 w-1 rounded-full bg-white"
            style={{ animation: "twinkling-long 4s infinite" }}
          />
          <div
            className="absolute top-[290px] left-[200px] h-1 w-1 rounded-full bg-white"
            style={{ animation: "twinkling 3s infinite" }}
          />
          <div
            className="absolute top-[270px] left-[50px] h-1 w-1 rounded-full bg-white"
            style={{ animation: "twinkling-fast 1.5s infinite" }}
          />
          <div
            className="absolute top-[-50px] left-[250px] h-1 w-1 rounded-full bg-white"
            style={{ animation: "twinkling-long 4s infinite" }}
          />
          <div
            className="absolute top-[60px] left-[290px] h-1 w-1 rounded-full bg-white"
            style={{ animation: "twinkling-slow 2s infinite" }}
          />
        </div>
      </div>
    </>
  );
};

export default Globe;
