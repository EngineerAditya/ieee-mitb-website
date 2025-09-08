import React from 'react';
import SocietiesPage from '../components/SocietiesPage';

export default function EngineeringInMedicineAndBiologySociety() {
  const students = [
    { name: 'EMBS Student', role: 'Chair', photo: '', email: 'embs@example.com', linkedin: '' },
  ];
  const faculty = [{ name: 'Dr. S. Gupta', title: 'Faculty Advisor', photo: '', email: 'sgupta@college.edu', linkedin: '' }];
  const contact = { email: 'embs@ieee.example', instagram: '', linkedin: '' };

  return (
    <SocietiesPage
      title="Engineering in Medicine and Biology Society"
      logoUrl="/logo.png"
      about="EMBS aims to foster the application of engineering principles in medicine and biology. Activities include biomedical device projects, guest lectures and hackathons."
      students={students}
      faculty={faculty}
      contact={contact}
    />
  );
}
