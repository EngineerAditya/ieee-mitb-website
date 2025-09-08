import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function ComputerSociety() {
  const students = [
    { name: 'Alice Johnson', role: 'Chair', photo: '', email: 'alice@example.com', linkedin: '' },
    { name: 'Bob Lee', role: 'Vice Chair', photo: '', email: 'bob@example.com', linkedin: '' },
  ];

  const faculty = [
    { name: 'Dr. R. K. Sharma', title: 'Faculty Advisor', photo: '', email: 'rk.sharma@college.edu', linkedin: '' },
  ];

  const contact = { email: 'cs@ieee.example', instagram: '', linkedin: '' };

  return (
    <SocietiesPage
      title="Computer Society"
      logoUrl="/logo.png"
      about="The Computer Society advances computing as a science and profession. We organise coding contests, workshops on systems and software, and seminars on emerging topics like ML/AI and distributed systems."
      students={students}
      faculty={faculty}
      contact={contact}
    />
  );
}
