
import { useEffect, useState, useCallback, useRef } from "react";
import BackgroundShift from "../components/BackgroundShift";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { EventCard } from "../components/Cards";

// Simple scroll animation hook
function useScrollFadeUp(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

function formatDateTime(dateStr) {
  const dateObj = new Date(dateStr);
  const datePart = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timePart = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart} • ${timePart}`;
}

function isEventUpcoming(dateStr) {
  return new Date(dateStr) >= new Date();
}

function DynamicUpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("events")
          .select("title, description, date, venue, image_url, society")
          .gte("date", today)
          .order("date", { ascending: true })
          .limit(2);
        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-slate-400">Loading events...</div>;
  }
  if (error) {
    return <div className="text-red-400">{error}</div>;
  }
  if (!events.length) {
    return <div className="text-slate-400">No upcoming events found.</div>;
  }
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {events.map((event, idx) => (
        <EventCard
          key={idx}
          event={event}
          formatDateTime={formatDateTime}
          isUpcoming={isEventUpcoming(event.date)}
        />
      ))}
    </div>
  );
}

export default function Home() {
  // Section refs for scroll animation (declare first!)
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const teamSectionRef = useRef(null);
  const eventsRef = useRef(null);
  const ctaRef = useRef(null);
  const footerAnchorRef = useRef(null);

  // Animation state
  const heroVisible = useScrollFadeUp(heroRef);
  const aboutVisible = useScrollFadeUp(aboutRef);
  const teamVisible = useScrollFadeUp(teamSectionRef);
  const eventsVisible = useScrollFadeUp(eventsRef);
  const ctaVisible = useScrollFadeUp(ctaRef);
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

  // Scroll to footer handler
  const handleContactScroll = useCallback(() => {
    if (footerAnchorRef.current) {
      footerAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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
          ref={heroRef}
          id="hero-section"
          className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
        >
          <div
            className={`relative z-10 text-center px-4 -mt-28 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
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
              <button
                className="px-8 py-3 border border-white/30 hover:border-white/60 text-white rounded-lg font-semibold backdrop-blur-sm transition-all duration-200 transform hover:scale-105 active:scale-95"
                type="button"
                onClick={handleContactScroll}
              >
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
        <hr className="border-t border-white/20 my-0" />
        <hr className="border-t border-white/20 my-0" />
        <hr className="border-t border-white/20 my-0" />
        <hr className="border-t border-white/20 my-0" />
        <hr className="border-t border-white/20 my-0" />
        <hr className="border-t border-white/20 my-0" />
        <hr className="border-t border-white/20 my-0" />

        {/* About Section */}
        <section ref={aboutRef} className="relative z-10 py-20 px-6 bg-gray-900">
          <div className={`transition-all duration-1000 ${aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="max-w-3xl mx-auto text-center">
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              About IEEE MIT Bengaluru
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              IEEE MIT Bengaluru is dedicated to fostering innovation, building a vibrant community of engineers and technologists, and making a positive impact on society. Through collaborative research, professional development, and outreach, we empower our members to drive technological advancement and address real-world challenges. Join us in our mission to inspire excellence and create meaningful change through technology.
            </p>
          </div>
        </section>

        {/* Our Team Section */}
        <section ref={teamSectionRef} className="relative z-10 py-20 px-6 bg-gray-900 border-t border-white/10">
          <div className={`transition-all duration-1000 ${teamVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Sampreet",
                    position: "Chairperson",
                    img: "/sbPhotos/sampreet.jpeg"
                  },
                  {
                    name: "Harthik",
                    position: "Vice Chair",
                    img: "/sbPhotos/harik.jpeg"
                  },
                  {
                    name: "Rosanne",
                    position: "General Secretary",
                    img: "/sbPhotos/rosanne.jpeg"
                  },
                  {
                    name: "Siddharth",
                    position: "Joint Secretary",
                    img: "/sbPhotos/siddharth.jpeg"
                  },
                  {
                    name: "Mahika",
                    position: "Treasurer",
                    img: "/sbPhotos/mahika.jpeg"
                  }
                ].map((member, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-full aspect-square bg-white/5 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-gray-400 mb-2">{member.position}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <hr className="border-t border-white/20 my-0" />
        {/* Events Section - Dynamic */}
        <section ref={eventsRef} className="relative z-10 py-20 px-6 bg-gray-900">
          <div className={`transition-all duration-1000 ${eventsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-12">Upcoming Events</h2>
              <DynamicUpcomingEvents />
              <div className="mt-8">
                <Link to="/events" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all duration-200">
                  View All Events
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* End of main content - CTA section removed as requested */}
        <div ref={footerAnchorRef} tabIndex={-1} aria-hidden="true" />
      </div>
    </div>
  );
}
