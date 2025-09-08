import React, { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { ArticleCard } from "../components/Cards.jsx";
import { useSearchParams } from "react-router-dom";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [_totalArticles, setTotalArticles] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [societyFilter, setSocietyFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // Sync society filter from URL
  useEffect(() => {
    const param = searchParams.get("society");
    if (param) {
      try {
        const decoded = decodeURIComponent(param);
        if (decoded !== societyFilter) setSocietyFilter(decoded);
      } catch (_err) {
        void _err;
        if (param !== societyFilter) setSocietyFilter(param);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const current = searchParams.get("society") || "";
    if (societyFilter && societyFilter !== current) {
      const next = new URLSearchParams(searchParams.toString());
      next.set("society", societyFilter);
      setSearchParams(next);
    } else if (!societyFilter && current) {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("society");
      setSearchParams(next);
    }
  }, [societyFilter]);

  const articlesPerPage = 12;
  const currentYear = new Date().getFullYear();

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

  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      years.push(year);
    }
    return years;
  }, [currentYear]);

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

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("articles")
        .select("id, title, author, publication, publication_date, article_url, image_url, society, short_description", { count: "exact" });

      if (societyFilter) query = query.eq("society", societyFilter);
      if (yearFilter)
        query = query.gte("publication_date", `${yearFilter}-01-01`).lt("publication_date", `${parseInt(yearFilter) + 1}-01-01`);
      if (monthFilter && yearFilter)
        query = query.gte("publication_date", `${yearFilter}-${monthFilter}-01`)
          .lt("publication_date", `${yearFilter}-${String(parseInt(monthFilter) + 1).padStart(2, "0")}-01`);
      if (dateFilter) query = query.eq("publication_date", dateFilter);

      const { data, count, error } = await query.order("publication_date", { ascending: false });

      if (error) throw error;

      setTotalArticles(count || 0);
      setTotalPages(Math.ceil((count || 0) / articlesPerPage));

      const startIndex = (currentPage - 1) * articlesPerPage;
      const paginated = (data || []).slice(startIndex, startIndex + articlesPerPage);
      setArticles(paginated);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, societyFilter, yearFilter, monthFilter, dateFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [societyFilter, yearFilter, monthFilter, dateFilter]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;
    return articles.filter(article =>
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.publication?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSocietyFilter("");
    setYearFilter("");
    setMonthFilter("");
    setDateFilter("");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-xl text-slate-300">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">IEEE Articles</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore research, publications, and insights shared by IEEE societies
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search articles, authors, publications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Society */}
            <select
              value={societyFilter}
              onChange={(e) => setSocietyFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white"
            >
              <option value="">All Societies</option>
              {societies.map((soc, idx) => (
                <option key={idx} value={soc}>{soc}</option>
              ))}
            </select>

            {/* Year */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white"
            >
              <option value="">All Years</option>
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Month */}
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              disabled={!yearFilter}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white disabled:opacity-50"
            >
              <option value="">All Months</option>
              {monthOptions.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>

            {/* Date */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white"
            />

            {/* Clear */}
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium rounded-xl transition-all duration-200"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-bold text-white mb-6">Articles</h2>
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No articles found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-3">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-xl text-slate-300 hover:text-white disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-xl font-medium ${currentPage === i + 1
                        ? "bg-indigo-500 text-white"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-xl text-slate-300 hover:text-white disabled:opacity-50"
                  >
                    Next
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
