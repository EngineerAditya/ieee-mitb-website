import React from 'react';
import { Link } from 'react-router-dom';

export default function SocietiesPage({
  title = 'Society Name',
  logoUrl = '/logo.png',
  about = 'About text goes here. Provide a concise description of the society mission, activities and focus areas.',
  students = [], // [{ name, role, photo, email, linkedin }]
  faculty = [],
  contact = {},
}) {
  return (
    <main className="text-slate-100">
      {/* Hero - full viewport */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        <div className="max-w-5xl mx-auto w-full px-6">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-lg bg-white/5 flex items-center justify-center shadow-md">
              {logoUrl ? (
                <img src={logoUrl} alt={`${title} logo`} className="w-24 h-24 object-contain" />
              ) : (
                <div className="text-2xl font-semibold text-slate-200">{title.split(' ').slice(0, 2).map(t => t[0]).join('')}</div>
              )}
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">{title}</h1>
              <p className="mt-2 text-slate-300 max-w-2xl">A formal student society of the institute — click below or scroll to learn more about our activities, members and contact.</p>
              <div className="mt-6">
                <a href="#about" className="inline-block bg-white/6 text-white px-4 py-2 rounded-md hover:bg-white/10 transition">About</a>
                <Link to={`/events?society=${encodeURIComponent(title)}`} className="ml-3 inline-block text-slate-200 px-4 py-2 rounded-md border border-white/6 hover:bg-white/6 transition">View Events</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="py-16 bg-slate-900/60">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-white">About the Society</h2>
          <div className="mt-4 text-slate-300 leading-relaxed text-lg">
            {about}
          </div>
        </div>
      </section>

      {/* Students grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-semibold text-white">Student Members</h3>
          <p className="mt-2 text-slate-300">Leadership and core members. Hover a card to reveal contact links.</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {students.length === 0 && (
              <div className="text-slate-400">No student data provided yet.</div>
            )}

            {students.map((s, idx) => (
              <div key={idx} className="relative group bg-white/2 border border-white/6 rounded-lg p-4 text-center transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto w-28 h-28 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                  {s.photo ? (
                    <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xl font-medium text-slate-200">{(s.name || '').split(' ').map(p => p[0]).slice(0, 2).join('')}</div>
                  )}
                </div>

                <div className="mt-3">
                  <div className="text-white font-medium">{s.name}</div>
                  {s.role && <div className="text-slate-300 text-sm mt-1">{s.role}</div>}
                </div>

                {/* Hover reveal - text links */}
                <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/40 to-transparent rounded-lg p-4">
                  <div className="w-full">
                    <div className="flex flex-col gap-2 text-sm text-slate-100">
                      {s.email && <a href={`mailto:${s.email}`} className="block text-left bg-white/6 px-3 py-2 rounded">Email: {s.email}</a>}
                      {s.linkedin && <a href={s.linkedin} target="_blank" rel="noreferrer" className="block text-left bg-white/6 px-3 py-2 rounded">LinkedIn</a>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty advisors (simple list) */}
      {faculty && faculty.length > 0 && (
        <section className="py-12 bg-slate-900/60">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-2xl font-semibold text-white">Faculty Advisors</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {faculty.map((f, i) => (
                <div key={i} className="bg-white/2 border border-white/6 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                      {f.photo ? <img src={f.photo} alt={f.name} className="w-full h-full object-cover" /> : <div className="text-slate-200">{(f.name || '').split(' ').map(p => p[0]).slice(0, 2).join('')}</div>}
                    </div>
                    <div>
                      <div className="text-white font-medium">{f.name}</div>
                      {f.title && <div className="text-slate-300 text-sm">{f.title}</div>}
                      <div className="mt-2 text-sm text-slate-200">
                        {f.email && <a href={`mailto:${f.email}`} className="underline">{f.email}</a>}
                        {f.linkedin && <a href={f.linkedin} className="ml-3 underline" target="_blank" rel="noreferrer">LinkedIn</a>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h4 className="text-xl font-semibold text-white">Contact</h4>
          <div className="mt-3 text-slate-300">
            {contact.email && <div>Email: <a href={`mailto:${contact.email}`} className="underline">{contact.email}</a></div>}
            {contact.instagram && <div className="mt-2">Instagram: <a href={contact.instagram} target="_blank" rel="noreferrer" className="underline">{contact.instagram}</a></div>}
            {contact.linkedin && <div className="mt-2">LinkedIn: <a href={contact.linkedin} target="_blank" rel="noreferrer" className="underline">{contact.linkedin}</a></div>}
          </div>
        </div>
      </section>
    </main>
  );
}
