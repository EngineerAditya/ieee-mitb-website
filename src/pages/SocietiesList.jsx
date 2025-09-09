import React from "react";

const societies = [
  {
    name: "Antennas and Propagation Society",
    info:
      "Founded in 1952, IEEE APS advances the theory, design, and application of antennas and electromagnetic wave propagation. Its scope includes antenna theory, propagation modeling, remote sensing, and radar. Globally, APS connects over 8,000 members, publishes leading journals, and hosts the flagship IEEE International Symposium. The MIT B'luru student chapter inspires research, offers hands-on workshops, design challenges, and connects students to global opportunities, travel grants, and industry experts."
  },
  {
    name: "Computer Society",
    info:
      "IEEE Computer Society is one of the largest global chapters, uniting computer science professionals across hardware, software, AI/ML, and app development. At MIT B'luru, IEEE CS hosts events on cutting-edge topics, fosters competitive coding, and provides a platform for learning, networking, and innovation in all fields of computing."
  },
  {
    name: "Computational Intelligence Society",
    info:
      "IEEE CIS focuses on the theory, design, application, and development of biologically and linguistically motivated computational paradigms. This includes neural networks, fuzzy systems, and evolutionary computation. The MIT B'luru chapter encourages research, organizes workshops, and promotes innovation in AI, machine learning, and intelligent systems."
  },
  {
    name: "Engineering in Medicine and Biology Society",
    info:
      "IEEE EMBS is the world’s largest society for engineering, technology, and computing in medicine and biology. The MIT Bengaluru chapter is a student-led community focused on research, innovation, and practical healthcare technology. We organize guest lectures, workshops, and foster collaboration to inspire students to become future leaders in biomedical engineering and global healthcare advancement."
  },
  {
    name: "Geoscience and Remote Sensing Society",
    info:
      "IEEE GRSS advances science, engineering, and education in geoscience and remote sensing. The MIT Bengaluru chapter inspires students to explore and protect our planet using satellites, sensors, drones, and AI-powered data analysis. Through hands-on workshops, research, and global partnerships, members turn curiosity into real-world impact—tracking disasters, studying the environment, and shaping the future of Earth observation. Connect with a global network and discover ‘from pixels to possibilities.’"
  },
  {
    name: "Microwave Theory and Technology Society",
    info:
      "IEEE MTT-S advances microwave theory, RF, millimeter-wave, and terahertz systems. With 11,000+ members globally, it covers circuits, devices, photonics, radar, and biomedical applications. The MITB student chapter builds technical skills in high-frequency design, promotes research, and connects students to industry through expert talks, industry visits, and global competitions."
  },
  {
    name: "Photonics Society",
    info:
      "The IEEE Photonics Society at MIT BLR advances photonics and optics through research, innovation, and collaboration. We explore fiber-optic communications, solar energy, and LED tech, offering workshops, seminars, and hands-on projects. Our mission is to inspire students and foster professional growth in the dynamic field of photonics."
  },
  {
    name: "Robotics and Automation Society",
    info:
      "IEEE RAS MITB unites students from diverse fields to collaborate on robotics, automation, AI/ML, and electronics. We design impactful solutions, publish research, and explore real-world tech through hands-on projects and technical discussions. RAS provides a vibrant platform to push boundaries, exchange knowledge, and drive the future of intelligent systems."
  },
  {
    name: "Vehicular Technology Society",
    info:
      "IEEE VTS focuses on the theoretical, experimental, and operational aspects of electrical and electronic engineering in mobile radio, motor vehicles, and land transportation. The MIT B'luru chapter explores connected vehicles, intelligent transport systems, and automotive electronics, offering workshops, research opportunities, and industry engagement."
  },
  {
    name: "Women in Engineering",
    info:
      "WIE is a global network dedicated to advancing women in engineering and science. It provides mentorship, professional development, and a collaborative community, actively accelerating the academic and professional growth of women. Through robust programs and advocacy, WIE dismantles barriers and fosters an environment where women thrive, enriching the scientific landscape with diverse perspectives."
  }
];

export default function SocietiesList() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">IEEE Societies</h1>
        <p className="text-lg text-gray-300 mb-10 text-center">
          Explore the diverse technical societies at IEEE MIT Bengaluru. Each society offers unique opportunities for learning, networking, and professional growth.
        </p>
        <div className="space-y-8">
          {societies.map((soc, idx) => (
            <div key={soc.name} className="bg-white/5 rounded-xl p-6 shadow border border-white/10">
              <h2 className="text-2xl font-semibold mb-2 text-blue-300">{idx + 1}. {soc.name}</h2>
              <p className="text-gray-200 text-base">{soc.info}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
