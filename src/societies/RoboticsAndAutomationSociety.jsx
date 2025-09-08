import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function RoboticsAndAutomationSociety() {
  const students = [
    { name: 'Robotics Student', role: 'Chair', photo: '', email: 'robotics@example.com', linkedin: '' },
  ];
  const faculty = [{ name: 'Dr. M. Srinivas', title: 'Faculty Advisor', photo: '', email: 'msrinivas@college.edu', linkedin: '' }];
  const contact = { email: 'ras@ieee.example', instagram: '', linkedin: '' };

  return (
    <SocietiesPage
      title="Robotics and Automation Society"
      logoUrl="/logo.png"
      about="RAS focuses on robotic systems, control, perception and automation. We run hands-on workshops, competitions and collaborative projects."
      students={students}
      faculty={faculty}
      contact={contact}
    />
  );
}
