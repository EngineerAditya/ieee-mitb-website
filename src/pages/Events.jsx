import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [societyFilter, setSocietyFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPastPages, setTotalPastPages] = useState(1);

  const societies = [
    "Antennas and Propagation Society",
    "Computer Society",
    "Computational Intelligence Society",
    "Engineering in Medicine and Biology Society",
    "Geoscience and Remote Sensing Society",
    "Microwave Theory and Technology Society",
    "Photonics Society",
    "Robotics and Automation Society",
    "Vehicular Technology Society",
    "Women in Engineering"
  ];

  useEffect(() => {
    fetchEvents();
  }, [page]);

  async function fetchEvents() {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    // Count totals
    const { count: pastCount } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .lt("date", today);

    const { count: upcomingCount } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .gte("date", today);

    // For pagination after page 1
    const pastOnPage1 = Math.max(0, 20 - Math.min(upcomingCount || 0, 20));
    const remainingPast = Math.max((pastCount || 0) - pastOnPage1, 0);
    setTotalPastPages(1 + Math.ceil(remainingPast / 20));

    let upcoming = [];
    let past = [];

    if (page === 1) {
      // Fetch all upcoming events but limit total cards to 20
      const { data: upcomingData } = await supabase
        .from("events")
        .select("title, description, date, venue, image_url, society")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(20);

      upcoming = upcomingData || [];

      // Fill the rest with past events if < 20 upcoming
      const pastLimit = 20 - upcoming.length;
      if (pastLimit > 0) {
        const { data: pastData } = await supabase
          .from("events")
          .select("title, description, date, venue, image_url, society")
          .lt("date", today)
          .order("date", { ascending: false })
          .limit(pastLimit);
        past = pastData || [];
      }
    } else {
      // Pages 2+ — only past events
      const offset = pastOnPage1 + (page - 2) * 20;
      const { data: pastData } = await supabase
        .from("events")
        .select("title, description, date, venue, image_url, society")
        .lt("date", today)
        .order("date", { ascending: false })
        .range(offset, offset + 19);
      past = pastData || [];
    }

    setUpcomingEvents(upcoming);
    setPastEvents(past);
    setLoading(false);
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

  const filterEvents = (events) =>
    events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.date.includes(searchTerm);
      const matchesSociety = societyFilter ? event.society === societyFilter : true;
      const matchesDate = dateFilter ? event.date.startsWith(dateFilter) : true;
      return matchesSearch && matchesSociety && matchesDate;
    });

  if (loading) return <p className="loading">Loading events...</p>;

  return (
    <div className="events-page">
      <div className="flex justify-between items-center">
        <h1 className="events-title-text text-3xl font-bold">Events</h1>

        {/* Search + Filters */}
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search event or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 rounded-md border border-slate-600 bg-slate-900 text-white"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1 rounded-md border border-slate-600 bg-slate-900 text-white"
          />
          <select
            value={societyFilter}
            onChange={(e) => setSocietyFilter(e.target.value)}
            className="px-3 py-1 rounded-md border border-slate-600 bg-slate-900 text-white"
          >
            <option value="">All Societies</option>
            {societies.map((soc, idx) => (
              <option key={idx} value={soc}>
                {soc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upcoming Events (Page 1 only) */}
      {page === 1 && upcomingEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-8">Upcoming Events</h2>
          <div className="events-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {filterEvents(upcomingEvents).map((event, idx) => (
              <EventCard key={idx} event={event} formatDateTime={formatDateTime} />
            ))}
          </div>
        </>
      )}

      {/* Past Events */}
      <h2 className="text-2xl font-bold mt-12">Past Events</h2>
      {filterEvents(pastEvents).length === 0 ? (
        <p className="no-events mt-4">No past events found.</p>
      ) : (
        <>
          <div className="events-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {filterEvents(pastEvents).map((event, idx) => (
              <EventCard key={idx} event={event} formatDateTime={formatDateTime} />
            ))}
          </div>

          {/* Numbered Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPastPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-lg border ${page === i + 1
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EventCard({ event, formatDateTime }) {
  return (
    <div className="event-card bg-slate-800/80 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border border-slate-700 p-6 flex flex-col gap-4">
      <h2 className="event-title text-2xl font-bold text-sky-400 mb-1">
        {event.title}
      </h2>
      <p className="text-sm text-emerald-400 font-semibold">{event.society}</p>
      <p className="event-date text-sm text-slate-400">
        {formatDateTime(event.date)}
      </p>
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="event-image w-full h-48 object-cover rounded-xl shadow mb-2"
        />
      )}
      {event.venue && (
        <p className="event-venue text-slate-300 text-sm flex items-center gap-1">
          <span role="img" aria-label="Venue">📍</span> {event.venue}
        </p>
      )}
      <p className="event-description text-slate-200">{event.description}</p>
    </div>
  );
}
