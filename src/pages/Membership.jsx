export default function Membership() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">IEEE Membership</h1>
        <p className="text-lg text-gray-300 mb-6">
          IEEE (Institute of Electrical and Electronics Engineers) is the world’s largest technical professional organization dedicated to advancing technology for the benefit of humanity. Membership in IEEE opens doors to a global community of engineers, technologists, and innovators.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Why Join IEEE?</h2>
        <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
          <li><b>Global Network:</b> Connect with over 400,000 members in more than 160 countries.</li>
          <li><b>Professional Development:</b> Access to conferences, workshops, webinars, and continuing education resources.</li>
          <li><b>Technical Resources:</b> Free or discounted access to IEEE Xplore, journals, magazines, and standards.</li>
          <li><b>Career Opportunities:</b> Job boards, mentoring, leadership roles, and volunteering opportunities.</li>
          <li><b>Discounts:</b> Reduced rates for conferences, publications, and insurance programs.</li>
          <li><b>Local Activities:</b> Participate in local IEEE sections, student branches, and technical societies.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Membership Types</h2>
        <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
          <li><b>Student Member:</b> For undergraduate and graduate students.</li>
          <li><b>Graduate Student Member:</b> For those pursuing graduate studies.</li>
          <li><b>Professional Member:</b> For working professionals in technology fields.</li>
          <li><b>Society Membership:</b> Join one or more of IEEE’s 39 technical societies for specialized resources and networking.</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8 mb-4">How to Join</h2>
        <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2">
          <li>Visit the official IEEE membership portal.</li>
          <li>Create an IEEE account or log in if you already have one.</li>
          <li>Choose your membership type and complete the application.</li>
          <li>Pay the membership fee online.</li>
        </ol>
        <div className="text-center mt-10">
          <a
            href="https://www.ieee.org/membership/join/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow transition-all duration-200"
          >
            Join IEEE Now
          </a>
        </div>
        <div className="mt-12 text-gray-400 text-sm text-center">
          <p>For more information, visit the <a href="https://www.ieee.org/membership/index.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">IEEE Membership page</a>.</p>
        </div>
      </div>
    </div>
  );
}
