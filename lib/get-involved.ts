// Options shared by the Get Involved form (client) and its email endpoint (server)

export const INTERESTS = [
  { id: "volunteer", label: "Volunteer", blurb: "Give your time to field, research, and outreach work" },
  { id: "partner", label: "Partner", blurb: "Join us as an organisation or institution" },
  { id: "collaborate", label: "Collaborate", blurb: "Work with us on research, projects, or programmes" },
] as const;

export type InterestId = (typeof INTERESTS)[number]["id"];

export const BACKGROUNDS = [
  "Student",
  "Early-career ocean professional",
  "Researcher / Academic",
  "Conservation professional",
  "Educator",
  "Organisation representative",
  "Other",
] as const;

export const FOCUS_AREAS = [
  "Marine and Coastal Research",
  "Terrestrial Conservation",
  "Advocacy and Awareness",
  "Education and Mentorship",
  "Community Engagement",
  "Ecosystem Resilience",
] as const;

export const AVAILABILITY = [
  "A few hours a month",
  "A few hours a week",
  "Part-time (10+ hours a week)",
  "Specific events or projects only",
] as const;

export const ORG_TYPES = [
  "University / Research institution",
  "NGO / Conservation organisation",
  "Government / Public body",
  "Company / Business",
  "School",
  "Community group",
  "Other",
] as const;

// Vercel caps request bodies at 4.5 MB, so the CV must stay under that with room for the form fields
export const CV_MAX_BYTES = 4 * 1024 * 1024;
export const CV_TYPES = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
} as const;
export const CV_ACCEPT = ".pdf,.doc,.docx";
