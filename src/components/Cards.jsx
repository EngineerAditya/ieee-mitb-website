import React from "react";

export function EventCard({ event, formatDateTime, isUpcoming }) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl transition-all duration-700 hover:scale-[1.03] hover:shadow-2xl ${isUpcoming
      ? 'bg-gradient-to-br from-sky-900/60 via-blue-900/50 to-indigo-900/60 border border-sky-400/40 shadow-xl shadow-sky-500/20 hover:shadow-sky-500/40'
      : 'bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-zinc-800/60 border border-slate-500/30 shadow-xl hover:shadow-slate-500/30'
      }`}>
      {/* Event Image */}
      {event.image_url && (
        <div className="relative h-52 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Society Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg">
              {event.society}
            </span>
          </div>

          {/* Upcoming Badge */}
          {isUpcoming && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                Upcoming
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      )}

      {/* Event Content */}
      <div className="p-7">
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-sky-300 transition-all duration-300 leading-tight">
          {event.title}
        </h3>

        {/* Date and Time */}
        <div className="flex items-center gap-3 mb-4 text-slate-300">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium">{formatDateTime(event.date)}</span>
        </div>

        {/* Venue */}
        {event.venue && (
          <div className="flex items-center gap-3 mb-5 text-slate-300">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{event.venue}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-6">
          {event.description}
        </p>

        {/* Action Button */}
        <div className="relative overflow-hidden rounded-2xl">
          <button className="w-full py-3 px-6 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-600 hover:via-blue-600 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-sky-500/25">
            View Details
          </button>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
    </div>
  );
}

// Additional card components can be added here for other use cases
export function InfoCard({ title, description, icon, gradient, onClick }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer ${gradient || 'bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-zinc-800/60'
        } border border-slate-500/30 shadow-xl hover:shadow-2xl hover:shadow-slate-500/30`}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-7">
        {icon && (
          <div className="w-14 h-14 mb-5 text-sky-400 bg-sky-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-sky-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-sky-500/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
    </div>
  );
}

export function StatsCard({ title, value, subtitle, icon, trend }) {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-zinc-800/60 border border-slate-500/30 rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="w-14 h-14 text-sky-400 bg-sky-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="relative mt-5 flex items-center text-sm">
          <span className={`flex items-center px-3 py-1 rounded-full font-medium ${trend > 0
            ? 'text-emerald-400 bg-emerald-500/20'
            : 'text-red-400 bg-red-500/20'
            }`}>
            {trend > 0 ? (
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            {Math.abs(trend)}%
          </span>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-500/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
    </div>
  );
}

export function FeatureCard({ title, description, icon, features, gradient }) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] ${gradient || 'bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-zinc-800/60'
      } border border-slate-500/30 shadow-xl hover:shadow-2xl hover:shadow-slate-500/30`}>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-7">
        {icon && (
          <div className="w-14 h-14 mb-5 text-sky-400 bg-sky-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-sky-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-5">
          {description}
        </p>
        {features && (
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-sky-500/20 to-transparent rounded-full translate-y-8 -translate-x-8"></div>
    </div>
  );
}
