import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function MicrowaveTheoryAndTechnologySociety() {
  const students = [
    { name: 'MTT Student', role: 'Chair', photo: '', email: 'mtt@example.com', linkedin: '' },
  ];
  const faculty = [{ name: 'Dr. K. Menon', title: 'Faculty Advisor', photo: '', email: 'kmenon@college.edu', linkedin: '' }];
  const contact = { email: 'mtt@ieee.example', instagram: '', linkedin: '' };

  return (
    <SocietiesPage
      title="Microwave Theory and Technology Society"
      logoUrl="/logo.png"
      about="MTT-S covers RF and microwave engineering, including antenna feeds, RF circuit design and high-frequency measurements. We host lab sessions and industry talks."
      students={students}
      faculty={faculty}
      contact={contact}
    />
  );
}
