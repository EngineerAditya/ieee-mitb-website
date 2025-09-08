import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function AntennasAndPropagationSociety() {
  const students = [
    { name: 'Prajwal Pandey', role: 'Chair', photo: '', email: 'prajwal@example.com', linkedin: '' },
    { name: 'Shubham Sachdeva', role: 'Vice Chair', photo: '', email: 'shubham@example.com', linkedin: '' },
  ];

  const faculty = [
    { name: 'Dr. Priya Sharma', title: 'Faculty Advisor', photo: '', email: 'priya.sharma@college.edu', linkedin: '' },
  ];

  const contact = { email: 'aps@ieee.example', instagram: '', linkedin: '' };

  return (
    <SocietiesPage
      title="Antennas and Propagation Society"
      logoUrl="/logo.png"
      about="The Antennas & Propagation Society focuses on antenna design, electromagnetic propagation, and RF systems. We run workshops, design challenges and technical talks to build skills in antenna theory and practical EM tools."
      students={students}
      faculty={faculty}
      contact={contact}
    />
  );
}
