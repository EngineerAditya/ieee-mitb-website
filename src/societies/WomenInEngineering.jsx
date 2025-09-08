import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function WomenInEngineering() {
  const students = [
    { name: 'WIE Student', role: 'Chair', photo: '', email: 'wie@example.com', linkedin: '' },
  ];
  const faculty = [{ name: 'Dr. L. Menon', title: 'Faculty Advisor', photo: '', email: 'lmenon@college.edu', linkedin: '' }];
  const contact = { email: 'wie@ieee.example', instagram: '', linkedin: '' };

  return (
    <SocietiesPage
      title="Women in Engineering"
      logoUrl="/logo.png"
      about="WIE aims to promote and support women engineers through mentorship, events, professional development and networking."
      students={students}
      faculty={faculty}
      contact={contact}
    />
  );
}
