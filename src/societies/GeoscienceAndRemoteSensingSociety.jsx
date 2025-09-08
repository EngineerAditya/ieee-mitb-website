import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function GeoscienceAndRemoteSensingSociety() {
  const students = [
    { name: 'Sampreet', role: 'Chair', photo: '', email: 'sampreet.byali@iee.org', linkedin: '' }, { name: 'GRSS Student', role: 'Chair', photo: '', email: 'grss@example.com', linkedin: '' }, { name: 'GRSS Student', role: 'Chair', photo: '', email: 'grss@example.com', linkedin: '' }, { name: 'GRSS Student', role: 'Chair', photo: '', email: 'grss@example.com', linkedin: '' }, { name: 'GRSS Student', role: 'Chair', photo: '', email: 'grss@example.com', linkedin: '' }, { name: 'GRSS Student', role: 'Chair', photo: '', email: 'grss@example.com', linkedin: '' }, { name: 'GRSS Student', role: 'Chair', photo: '', email: 'grss@example.com', linkedin: '' },{ name: 'GRSS Student', role: 'Chair', photo: '', email: 'grss@example.com', linkedin: '' },
  ];
  const faculty = [{ name: 'Dr. V. Rao', title: 'Faculty Advisor', photo: '', email: 'vrao@college.edu', linkedin: '' }];
  const contact = { email: 'grss@ieee.example', instagram: '', linkedin: '' };

  return (
    <SocietiesPage
      title="Geoscience and Remote Sensing Society"
      logoUrl="/logo.png"
      about="GRSS focuses on earth observation, remote sensing techniques and satellite data analysis. We organise workshops on image processing and GIS applications."
      students={students}
      faculty={faculty}
      contact={contact}
    />
  );
}
