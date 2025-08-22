import React, { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { EventCard } from "../components/Cards.jsx";
import { useSearchParams } from "react-router-dom";

export default function Events() {
  // State management
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [societyFilter, setSocietyFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all"); // all, upcoming, past
  // Read and sync query params so links like /events?society=Name prefill filters
  const [searchParams, setSearchParams] = useSearchParams();

  // On mount / when query changes: if society param exists, set the filter
  useEffect(() => {
    const param = searchParams.get("society");
    if (param) {
      try {
        const decoded = decodeURIComponent(param);
        if (decoded !== societyFilter) setSocietyFilter(decoded);
      } catch (e) {
        if (param !== societyFilter) setSocietyFilter(param);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Two-way sync: when societyFilter changes, update the URL query param
  useEffect(() => {
    const current = searchParams.get("society") || "";
    if (societyFilter && societyFilter !== current) {
      const next = new URLSearchParams(searchParams.toString());
      next.set("society", societyFilter);
      setSearchParams(next);
    } else if (!societyFilter && current) {
      // remove param when filter cleared
      const next = new URLSearchParams(searchParams.toString());
      next.delete("society");
      setSearchParams(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [societyFilter]);

  // Configuration
  const eventsPerPage = 12;
  const currentYear = new Date().getFullYear();

  // Available societies
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

  // Generate year options (current year + 5 years back)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      years.push(year);
    }
    return years;
  }, [currentYear]);

  // Generate month options
  const monthOptions = useMemo(() => [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ], []);

  // Fetch events from database
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      // Build base query for filters
      const buildFilteredQuery = (baseQuery) => {
        let query = baseQuery;

        // Apply society filter
        if (societyFilter) {
          query = query.eq("society", societyFilter);
        }

        // Apply year filter
        if (yearFilter) {
          query = query.gte("date", `${yearFilter}-01-01`).lt("date", `${parseInt(yearFilter) + 1}-01-01`);
        }

        // Apply month filter
        if (monthFilter && yearFilter) {
          query = query.gte("date", `${yearFilter}-${monthFilter}-01`).lt("date", `${yearFilter}-${parseInt(monthFilter) + 1}-01`);
        }

        // Apply date filter
        if (dateFilter) {
          query = query.eq("date", dateFilter);
        }

        return query;
      };

      let upcomingData = [];
      let pastData = [];
      let totalUpcoming = 0;
      let totalPast = 0;

      // Fetch upcoming events if showing all or upcoming
      if (eventTypeFilter === "all" || eventTypeFilter === "upcoming") {
        const upcomingQuery = buildFilteredQuery(
          supabase
            .from("events")
            .select("title, description, date, venue, image_url, society", { count: "exact" })
            .gte("date", today)
        );

        const { data: upcoming, count: upcomingCount } = await upcomingQuery
          .order("date", { ascending: true });

        upcomingData = upcoming || [];
        totalUpcoming = upcomingCount || 0;
      }

      // Fetch past events if showing all or past
      if (eventTypeFilter === "all" || eventTypeFilter === "past") {
        const pastQuery = buildFilteredQuery(
          supabase
            .from("events")
            .select("title, description, date, venue, image_url, society", { count: "exact" })
            .lt("date", today)
        );

        const { data: past, count: pastCount } = await pastQuery
          .order("date", { ascending: false }); // Past events in descending order

        pastData = past || [];
        totalPast = pastCount || 0;
      }

      // Combine events based on filter type
      let combinedEvents = [];
      if (eventTypeFilter === "all") {
        // Show upcoming first, then past
        combinedEvents = [...upcomingData, ...pastData];
      } else if (eventTypeFilter === "upcoming") {
        combinedEvents = upcomingData;
      } else if (eventTypeFilter === "past") {
        combinedEvents = pastData;
      }

      // Calculate total events and pages
      const total = eventTypeFilter === "all" ? totalUpcoming + totalPast :
        eventTypeFilter === "upcoming" ? totalUpcoming : totalPast;

      setTotalEvents(total);
      setTotalPages(Math.ceil(total / eventsPerPage));

      // Apply pagination to combined events
      const startIndex = (currentPage - 1) * eventsPerPage;
      const endIndex = startIndex + eventsPerPage;
      const paginatedEvents = combinedEvents.slice(startIndex, endIndex);

      // Separate upcoming and past for display
      const upcoming = paginatedEvents.filter(event => new Date(event.date) >= new Date());
      const past = paginatedEvents.filter(event => new Date(event.date) < new Date());

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (error) {
      console.error("Error fetching events:", error);
      setUpcomingEvents([]);
      setPastEvents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, societyFilter, yearFilter, monthFilter, dateFilter, eventTypeFilter]);

  // Fetch events when filters or page changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [societyFilter, yearFilter, monthFilter, dateFilter, eventTypeFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter events based on search term (client-side filtering for better UX)
  const filteredUpcomingEvents = useMemo(() => {
    if (!searchTerm) return upcomingEvents;

    return upcomingEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [upcomingEvents, searchTerm]);

  const filteredPastEvents = useMemo(() => {
    if (!searchTerm) return pastEvents;

    return pastEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pastEvents, searchTerm]);

  // Format date for display
  const formatDateTime = useCallback((dateStr) => {
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
  }, []);

  // Check if event is upcoming
  const isEventUpcoming = useCallback((dateStr) => {
    return new Date(dateStr) >= new Date();
  }, []);

  // Generate pagination numbers with ellipsis
  const generatePaginationNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 4) {
        pages.push(2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push('...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSocietyFilter("");
    setYearFilter("");
    setMonthFilter("");
    setDateFilter("");
    setEventTypeFilter("all");
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-xl text-slate-300">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              IEEE Events
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover cutting-edge technology events, workshops, and conferences hosted by IEEE societies
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events, descriptions, or venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Event Type Filter */}
            <div className="relative">
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Society Filter */}
            <div className="relative">
              <select
                value={societyFilter}
                onChange={(e) => setSocietyFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">All Societies</option>
                {societies.map((soc, idx) => (
                  <option key={idx} value={soc}>{soc}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">All Years</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Month Filter */}
            <div className="relative">
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                disabled={!yearFilter}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Months</option>
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium rounded-xl transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {eventTypeFilter === "upcoming" ? "Upcoming Events" :
                eventTypeFilter === "past" ? "Past Events" : "All Events"}
            </h2>
            <p className="text-slate-400">
              {totalEvents > 0
                ? `Showing ${filteredUpcomingEvents.length + filteredPastEvents.length} of ${totalEvents} events`
                : "No events found"
              }
            </p>
          </div>

          {/* Active Filters Display */}
          {(societyFilter || yearFilter || monthFilter || dateFilter) && (
            <div className="flex flex-wrap gap-2">
              {societyFilter && (
                <span className="px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-sm border border-sky-500/30">
                  Society: {societyFilter}
                </span>
              )}
              {yearFilter && (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm border border-emerald-500/30">
                  Year: {yearFilter}
                </span>
              )}
              {monthFilter && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                  Month: {monthOptions.find(m => m.value === monthFilter)?.label}
                </span>
              )}
              {dateFilter && (
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30">
                  Date: {new Date(dateFilter).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Events Display */}
        {filteredUpcomingEvents.length === 0 && filteredPastEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.262M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No events found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Upcoming Events Section */}
            {filteredUpcomingEvents.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-10 bg-gradient-to-b from-sky-400 to-blue-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-white">Upcoming Events</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredUpcomingEvents.map((event, idx) => (
                    <EventCard
                      key={`upcoming-${idx}`}
                      event={event}
                      formatDateTime={formatDateTime}
                      isUpcoming={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events Section */}
            {filteredPastEvents.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1 h-10 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-white">Past Events</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPastEvents.map((event, idx) => (
                    <EventCard
                      key={`past-${idx}`}
                      event={event}
                      formatDateTime={formatDateTime}
                      isUpcoming={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-3">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 hover:text-white hover:bg-slate-700/50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {generatePaginationNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                      {pageNum === '...' ? (
                        <span className="px-3 py-2 text-slate-400">...</span>
                      ) : (
                        <button
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${currentPage === pageNum
                            ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25"
                            : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                            }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 hover:text-white hover:bg-slate-700/50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
