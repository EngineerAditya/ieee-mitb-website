import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function PhotonicsSociety() {
  const students = [
    { name: 'Photonics Student', role: 'Chair', photo: '', email: 'photonics@example.com', linkedin: '' },
  ];
  const faculty = [{ name: 'Dr. R. Kumar', title: 'Faculty Advisor', photo: '', email: 'rkumar@college.edu', linkedin: '' }];
  const contact = { email: 'photonics@ieee.example', instagram: '', linkedin: '' };

  return (
    <SocietiesPage
      title="Photonics Society"
      logoUrl="/logo.png"
      about="Photonics Society explores light-based technologies, fiber optics and photonic devices. We host lab demos, projects and guest talks from industry experts."
      students={students}
      faculty={faculty}
      contact={contact}
    />
  );
}
