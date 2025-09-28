import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function ComputationalIntelligenceSociety() {
  const students = [
    { name: 'Ameya Mhatre', role: 'Chair', photo: '', email: 'ameya.mitblr2024@learner.manipal.edu', linkedin: 'https://www.linkedin.com/in/ameya-mhatre-553003307/' },
    { name: 'Rishabh Surana', role: 'Vice Chair', photo: '', email: 'rishabh2.mitblr2024@learner.manipal.edu', linkedin: 'https://www.linkedin.com/in/rishabh-surana-4a06b02b3?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
    { name: 'Arunabhho Das', role: 'General Secretary', photo: '', email: 'arunabhho.mitblr2024@learner.manipal.edu', linkedin: 'https://www.linkedin.com/in/arunabhho-das-70685b351?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BOGnSvmMiQSifn5lXOvLtrg%3D%3D' },
    { name: 'Samraksha Nori', role: 'Technical Webmaster', photo: '', email: 'samraksha.mitblr@learner.manipal.edu', linkedin: 'https://www.linkedin.com/in/samraksha-nori-76401a299' },
    { name: 'Eshani Katiyar', role: 'Treasurer', photo: '', email: 'eshani.mitblr2024@learner.manipal.edu', linkedin: 'https://www.linkedin.com/in/eshani-katiyar-2a7737322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
  ];

  const faculty = [
    { name: 'Dr. Megha Arakeri', title: 'Faculty Advisor', photo: '', email: 'megha.arakeri@manipal.edu', linkedin: 'https://www.linkedin.com/in/dr-megha-arakeri?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BRC%2B8jy9DRMWbnVr%2F2Me1wA%3D%3D' }
  ];

  const contact = {
    email: 'cis@college.edu',
    instagram: 'https://www.instagram.com/ieee_cis.mitblr?igsh=emVrbHNudWNxbXdj',
    linkedin: 'https://www.linkedin.com/company/ieee-cis-mitblr'
  };

  return (
    <SocietiesPage
      title="Computational Intelligence Society"
      logoUrl="/logo.png"
      about="The Computational Intelligence Society focuses on neural networks, fuzzy systems, evolutionary computation and their applications. We host tutorials and project showcases."
      students={students}
      faculty={faculty}
      contact={contact}
    />
  );
}
