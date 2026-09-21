export type BlogCategory =
  | "career-insights"
  | "campus"
  | "student-stories"
  | "future-of-work"
  | "placement-readiness"
  | "future-skills"
  | "campus-to-career"
  | "employability"
  | "ai-education";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  categoryLabel: string;
  date: string;
  readTime: number;
  author: { name: string; avatar?: string };
  coverImage?: string;
  featured?: boolean;
};

export const trendingTopics: { label: string; value: BlogCategory | "all" }[] = [
  { label: "AI in Education", value: "ai-education" },
  { label: "Placement Readiness", value: "placement-readiness" },
  { label: "Future Skills", value: "future-skills" },
  { label: "Campus to Career", value: "campus-to-career" },
  { label: "Employability", value: "employability" },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "rise-of-ai-in-career-preparation",
    title: "The Rise of AI in Career Preparation",
    excerpt:
      "How AI is reshaping student learning, career guidance and recruitment — and what this means for the next generation.",
    category: "future-of-work",
    categoryLabel: "Future of Work",
    date: "2024-03-14",
    readTime: 7,
    author: { name: "Neha Kapoor" },
    featured: true,
  },
  {
    slug: "what-recruiters-expect-from-fresh-graduates",
    title: "What Recruiters Expect from Fresh Graduates",
    excerpt:
      "Industry hiring managers share the soft skills, technical awareness and mindset they look for in campus hires.",
    category: "career-insights",
    categoryLabel: "Career Insights",
    date: "2024-03-10",
    readTime: 5,
    author: { name: "Arjun Mehta" },
  },
  {
    slug: "how-colleges-can-improve-employability-outcomes",
    title: "How Colleges Can Improve Employability Outcomes",
    excerpt:
      "Practical steps institutions can take to bridge the gap between academic learning and workplace expectations.",
    category: "campus",
    categoryLabel: "Campus",
    date: "2024-03-06",
    readTime: 6,
    author: { name: "Priya Nair" },
  },
  {
    slug: "from-campus-to-career-real-student-journeys",
    title: "From Campus to Career: Real Student Journeys",
    excerpt:
      "Three students share how structured placement preparation changed the trajectory of their careers.",
    category: "student-stories",
    categoryLabel: "Student Stories",
    date: "2024-03-06",
    readTime: 8,
    author: { name: "Editorial Team" },
  },
  {
    slug: "how-to-build-placement-readiness-for-students",
    title: "How to Build Placement Readiness for Students",
    excerpt:
      "A framework institutions can use to assess, develop and track campus placement readiness at scale.",
    category: "placement-readiness",
    categoryLabel: "Placement Readiness",
    date: "2024-03-05",
    readTime: 6,
    author: { name: "Lokesh R." },
  },
  {
    slug: "the-rise-of-ai-in-career-need-in-2027",
    title: "The Rise of AI in Career Need in 2027",
    excerpt:
      "An evidence-based look at which AI competencies will define employable graduates by 2027.",
    category: "ai-education",
    categoryLabel: "Career Tips",
    date: "2024-03-07",
    readTime: 7,
    author: { name: "Sneha Jadhav" },
  },
  {
    slug: "building-a-stronger-placement-culture",
    title: "Building a Stronger Student Placement Culture",
    excerpt:
      "How academic institutions can build a campus culture that normalises career planning from year one.",
    category: "campus",
    categoryLabel: "Campus",
    date: "2024-03-05",
    readTime: 8,
    author: { name: "Editorial Team" },
  },
];

export const categoryColors: Record<BlogCategory, string> = {
  "career-insights": "bg-[#e8f0fc] text-[#1a47a8]",
  campus: "bg-[#e8f6f4] text-[#025c55]",
  "student-stories": "bg-[#fdf3e8] text-[#8a6400]",
  "future-of-work": "bg-[#ede8fc] text-[#5b2bcb]",
  "placement-readiness": "bg-[#e8f6f4] text-[#025c55]",
  "future-skills": "bg-[#fdeaea] text-[#a12d2d]",
  "campus-to-career": "bg-[#e8f0fc] text-[#1a47a8]",
  employability: "bg-[#ede8fc] text-[#5b2bcb]",
  "ai-education": "bg-[#fdf3e8] text-[#8a6400]",
};
