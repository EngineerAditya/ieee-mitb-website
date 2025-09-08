import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function VehicularTechnologySociety() {
  const students = [
    { name: 'VTS Student', role: 'Chair', photo: '', email: 'vts@example.com', linkedin: '' },
  ];
  const faculty = [{ name: 'Dr. N. Verma', title: 'Faculty Advisor', photo: '', email: 'nverma@college.edu', linkedin: '' }];
  const contact = { email: 'vts@ieee.example', instagram: '', linkedin: '' };

  return (
    <SocietiesPage
      title="Vehicular Technology Society"
      logoUrl="/logo.png"
      about="VTS explores connected vehicles, V2X communications and smart transportation systems. We collaborate on projects and host technical seminars."
      students={students}
      faculty={faculty}
      contact={contact}
    />
  );
}
