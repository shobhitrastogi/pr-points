import React from "react";
import {
  FileCheck2,
  Calendar,
  Languages,
  Plane,
  Building2,
  GraduationCap,
  BookOpen,
  MapPin,
  FlaskConical,
  Briefcase,
  HeartHandshake,
  MessageSquareDot,
} from "lucide-react";

export const PASS_MARK = 65;


export const SECTION_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  subclass: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", dot: "#3b82f6" },
  age: { bg: "#fffbeb", text: "#b45309", border: "#fde68a", dot: "#f59e0b" },
  english: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", dot: "#22c55e" },
  overseasExp: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff", dot: "#a855f7" },
  ausExp: { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0", dot: "#10b981" },
  qualification: { bg: "#fff1f2", text: "#be123c", border: "#fecdd3", dot: "#f43f5e" },
  ausStudy: { bg: "#eef2ff", text: "#3730a3", border: "#c7d2fe", dot: "#6366f1" },
  regionalStudy: { bg: "#f0fdfa", text: "#0f766e", border: "#99f6e4", dot: "#14b8a6" },
  specialist: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", dot: "#f97316" },
  professionalYear: { bg: "#fdf4ff", text: "#86198f", border: "#f0abfc", dot: "#d946ef" },
  partner: { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3", dot: "#e11d48" },
  naati: { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe", dot: "#8b5cf6" },
};

export type Option = { label: string; points: number };
export type Question = {
  id: string;
  section: string;
  title: string;
  icon: React.ReactNode;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    id: "subclass",
    section: "Visa Subclass",
    title: "Which subclass are you applying for?",
    icon: <FileCheck2 size={16} />,
    options: [
      { label: "Skilled Work Regional 491 (Provisional) — state/territory or regional relative sponsorship", points: 15 },
      { label: "Skilled Nominated 190 (Permanent) — state or territory government nomination", points: 5 },
      { label: "Skilled Independent 189 (Permanent) — no sponsorship required", points: 0 },
    ],
  },
  {
    id: "age",
    section: "Age",
    title: "How old are you?",
    icon: <Calendar size={16} />,
    options: [
      { label: "18 to 24 years", points: 25 },
      { label: "25 to 32 years", points: 30 },
      { label: "33 to 39 years", points: 25 },
      { label: "40 to 44 years", points: 15 },
      { label: "45 years or older", points: 0 },
    ],
  },
  {
    id: "english",
    section: "English Language",
    title: "What is your English language ability?",
    icon: <Languages size={16} />,
    options: [
      { label: "Superior English — IELTS 8+ in each band (or equivalent)", points: 20 },
      { label: "Proficient English — IELTS 7+ in each band (or equivalent)", points: 10 },
      { label: "Competent English — IELTS 6+ in each band (or equivalent)", points: 0 },
    ],
  },
  {
    id: "overseasExp",
    section: "Overseas Work Experience",
    title: "Overseas work in nominated occupation (last 10 years)",
    icon: <Plane size={16} />,
    options: [
      { label: "8 years or more", points: 15 },
      { label: "5 years or more", points: 10 },
      { label: "3 years or more", points: 5 },
      { label: "Less than 3 years / none", points: 0 },
    ],
  },
  {
    id: "ausExp",
    section: "Australian Work Experience",
    title: "Australian skilled employment in nominated occupation (last 10 years)",
    icon: <Building2 size={16} />,
    options: [
      { label: "8 years or more", points: 20 },
      { label: "5 years or more", points: 15 },
      { label: "3 years or more", points: 10 },
      { label: "1 year or more", points: 5 },
      { label: "Less than 1 year / none", points: 0 },
    ],
  },
  {
    id: "qualification",
    section: "Qualifications",
    title: "What is your highest recognised qualification?",
    icon: <GraduationCap size={16} />,
    options: [
      { label: "PhD (Doctorate) — Australian or recognised overseas", points: 20 },
      { label: "Bachelor degree or higher — Australian or recognised overseas", points: 15 },
      { label: "Diploma or recognised trade qualification", points: 10 },
      { label: "No recognised qualifications", points: 0 },
    ],
  },
  {
    id: "ausStudy",
    section: "Australian Study",
    title: "Did you study in Australia for at least 2 years (92 weeks)?",
    icon: <BookOpen size={16} />,
    options: [
      { label: "Yes — resulting in a degree, diploma or trade qualification", points: 5 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: "regionalStudy",
    section: "Regional Study",
    title: "Did you study and live in a regional area of Australia for 2+ years?",
    icon: <MapPin size={16} />,
    options: [
      { label: "Yes", points: 5 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: "specialist",
    section: "Specialist Qualification",
    title: "Do you hold an Australian Masters (by research) or Doctorate in a STEM field?",
    icon: <FlaskConical size={16} />,
    options: [
      { label: "Yes — at least 2 academic years in natural sciences, IT or engineering", points: 10 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: "professionalYear",
    section: "Professional Year",
    title: "Did you complete a Professional Year in Australia in your occupation?",
    icon: <Briefcase size={16} />,
    options: [
      { label: "Yes — available for accountants, engineers and IT professionals", points: 5 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: "partner",
    section: "Partner Skills",
    title: "Which partner situation applies to you?",
    icon: <HeartHandshake size={16} />,
    options: [
      { label: "Partner has skills assessment + competent English", points: 10 },
      { label: "I am single, or my partner is an Australian citizen / PR", points: 10 },
      { label: "Partner has competent English only", points: 5 },
      { label: "Partner does not meet the above criteria", points: 0 },
    ],
  },
  {
    id: "naati",
    section: "NAATI Accreditation",
    title: "Are you NAATI accredited in a designated language?",
    icon: <MessageSquareDot size={16} />,
    options: [
      { label: "Yes — paraprofessional, certified provisional or above", points: 5 },
      { label: "No", points: 0 },
    ],
  },
];