// src/pages/Home.jsx
import { useEffect, useState, useCallback } from "react";
import BackgroundShift from "../components/BackgroundShift";
import { Link } from "react-router-dom";

export default function Home() {
  const [bgOpacity, setBgOpacity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const heroHeight = hero.offsetHeight;
    const scrollProgress = Math.max(0, Math.min(1, -rect.top / (heroHeight * 0.5)));

    setBgOpacity(Math.max(0.3, 1 - scrollProgress * 0.7));
  }, []);

  useEffect(() => {
    setIsLoaded(true);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Background animation */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundShift opacity={bgOpacity} />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section
          id="hero-section"
          className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
        >
          <div
            className={`relative z-10 text-center px-4 -mt-28 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
              IEEE MIT
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Bengaluru
              </span>
            </h1>
            <p className="text-lg md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Advancing technology for humanity through innovation, collaboration,
              and excellence in engineering.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/membership">
                <button className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95">
                  Become a Member
                </button>
              </Link>
              <button className="px-8 py-3 border border-white/30 hover:border-white/60 text-white rounded-lg font-semibold backdrop-blur-sm transition-all duration-200 transform hover:scale-105 active:scale-95">
                Contact Us
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            className="absolute bottom-40 left-1/2 -translate-x-1/2 text-white/80 transition-all duration-1000"
            style={{ zIndex: 100 }}
          >
            <div
              className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center shadow-lg animate-bounce"
              style={{ boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
            >
              <div className="w-1.5 h-4 bg-white/80 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="relative z-10 py-20 px-6 bg-gray-900">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              About IEEE MIT Bengaluru
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation",
                  text: "Driving technological advancement through cutting-edge research and development initiatives that shape the future.",
                },
                {
                  title: "Community",
                  text: "Building a strong network of engineers, researchers, and technologists committed to excellence and collaboration.",
                },
                {
                  title: "Impact",
                  text: "Creating meaningful change in society through technology that improves lives and addresses global challenges.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/10 transition"
                >
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Societies Section */}
        <section className="relative z-10 py-20 px-6 bg-gray-800">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Our Societies</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Computer Society",
                  text: "Advancing computing and IT through research, education, and professional development.",
                },
                {
                  title: "Robotics & Automation",
                  text: "Exploring robotics, automation, and intelligent systems for tomorrow's world.",
                },
                {
                  title: "Computational Intelligence",
                  text: "Developing AI & ML solutions that enhance human capabilities and solve complex problems.",
                },
                {
                  title: "Photonics Society",
                  text: "Advancing the science and application of light-based technologies for communication and sensing.",
                },
                {
                  title: "Women in Engineering",
                  text: "Promoting the involvement of women in engineering and inspiring the next generation.",
                },
                {
                  title: "And More...",
                  text: "Discover all our societies dedicated to various fields of engineering and technology advancement.",
                },
              ].map((society, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:bg-white/10 transition"
                >
                  <h3 className="text-lg font-semibold mb-2">{society.title}</h3>
                  <p className="text-gray-300 text-sm">{society.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="relative z-10 py-20 px-6 bg-gray-900">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Tech Symposium 2025",
                  date: "March 15, 2025 • 9:00 AM",
                  badge: "Conference",
                  badgeColor: "bg-blue-600",
                  desc: "Join us for a day of presentations, workshops, and networking with industry leaders.",
                  btn: "Learn More →",
                  btnColor: "text-blue-400 hover:text-blue-300",
                },
                {
                  title: "AI & ML Workshop",
                  date: "April 8, 2025 • 2:00 PM",
                  badge: "Workshop",
                  badgeColor: "bg-green-600",
                  desc: "Hands-on workshop exploring the latest AI & ML applications across industries.",
                  btn: "Register Now →",
                  btnColor: "text-green-400 hover:text-green-300",
                },
              ].map((event, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-left"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-400">{event.date}</p>
                    </div>
                    <span
                      className={`${event.badgeColor} text-white text-xs px-2 py-1 rounded`}
                    >
                      {event.badge}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{event.desc}</p>
                  <button className={`${event.btnColor} text-sm font-medium`}>
                    {event.btn}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join IEEE MIT Bengaluru?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Become part of a global community of engineers and technologists
              working to advance technology for humanity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/membership">
                <button className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95">
                  Become a Member
                </button>
              </Link>
              <button className="px-8 py-3 border border-white/30 hover:border-white/60 text-white rounded-lg font-semibold backdrop-blur-sm transition-all duration-200 transform hover:scale-105 active:scale-95">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
