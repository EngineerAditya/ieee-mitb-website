import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function ComputationalIntelligenceSociety() {
  const students = [
    { name: 'C. I. Member 1', role: 'Chair', photo: '', email: 'ci1@example.com', linkedin: '' },
  ];
  const faculty = [{ name: 'Dr. A. Mentor', title: 'Faculty Advisor', photo: '', email: 'amentor@college.edu', linkedin: '' }];
  const contact = { email: 'ci@ieee.example', instagram: '', linkedin: '' };

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
