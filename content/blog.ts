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

export type BlogSection = { heading: string; body: string; image?: string; imageAlt?: string };

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
  sections?: BlogSection[];
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
    coverImage: "/images/campus-student-hero.png",
    featured: true,
    sections: [
      {
        heading: "AI is no longer a future concept — it's a present reality",
        body: "Students today are entering a job market that has fundamentally shifted. Recruiters are using AI-powered screening tools, companies are deploying intelligent assistants in day-to-day workflows, and the very definition of an 'entry-level skill' has changed. Understanding how AI intersects with your career path is no longer optional — it's a baseline expectation.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "Expert talk series on AI and careers",
      },
      {
        heading: "From static resumes to dynamic skill graphs",
        body: "Traditional hiring was built around the static resume. Now, AI-driven platforms map candidates against live skill graphs — dynamic profiles that update based on certifications, project portfolios and assessments. Students who learn to build and maintain these profiles will stand out far above those who submit PDFs and wait. ZSkillup helps students build precisely this kind of verifiable skill identity.",
        image: "/images/events/hands-on-learning-lab.jpg",
        imageAlt: "Students working in a hands-on learning lab",
      },
      {
        heading: "Preparation is the only moat",
        body: "The students who will thrive in this AI-augmented world are not those who fear the technology, but those who learn to work alongside it. Structured exposure through mock interviews, AI-simulated assessments and industry mentorship programmes gives students a decisive advantage. The preparation gap is real — and it is closeable.",
        image: "/images/events/interactive-workshop.jpg",
        imageAlt: "Students in an interactive workshop session",
      },
    ],
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
    coverImage: "/images/events/expert-talk-series.jpg",
    sections: [
      {
        heading: "Communication still tops every list",
        body: "Across every industry vertical we spoke to — from fintech to FMCG — clear, confident communication remained the number one differentiator. Not vocabulary or grammar, but the ability to articulate ideas, listen actively and adjust your message to different audiences. Students who have practised this through group discussions, presentations and real-world internships arrive with a visible edge.",
        image: "/images/events/acca-career-workshop-session.jpg",
        imageAlt: "Students at a career workshop session",
      },
      {
        heading: "Attitude over aptitude, especially in the first 90 days",
        body: "Technical skills can be taught; attitude is much harder to change. Hiring managers consistently told us they would rather onboard a candidate with a learning mindset and coachable attitude than someone with a higher GPA who resists feedback. Show that you are genuinely curious about the industry, prepared to make mistakes and eager to grow.",
        image: "/images/events/group-activity-workshop.jpg",
        imageAlt: "Group activity workshop",
      },
      {
        heading: "Awareness of the business context",
        body: "The freshers who impress most in interviews are those who have done their homework — not just on the company, but on its sector, competitors and current challenges. Five minutes of contextual research signals genuine interest and is almost always rewarded.",
        image: "/images/events/industry-expert-session.jpg",
        imageAlt: "Industry expert session",
      },
    ],
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
    coverImage: "/images/events/institutional-collaboration.jpg",
    sections: [
      {
        heading: "Start with an honest skills audit",
        body: "Many institutions find it uncomfortable to measure the gap between what students learn and what employers need. Running an annual skills audit — surveying alumni, partner companies and placement data — gives colleges actionable numbers rather than vague impressions. The institutions with the strongest placement records universally begin here.",
        image: "/images/events/institutional-collaboration.jpg",
        imageAlt: "Institutional collaboration meeting",
      },
      {
        heading: "Embed industry exposure into the curriculum",
        body: "Guest lectures are good; structured industry immersion is better. Partnering with companies to co-design modules, run live case studies or host in-campus bootcamps gives students real-world context that no textbook can replicate. Colleges that have formalised these partnerships see measurable improvements in placement rates within two to three academic cycles.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "Expert talk series on campus",
      },
      {
        heading: "Build a placement culture, not just a placement cell",
        body: "The placement cell is a support function, not the entire answer. When career readiness is woven into the cultural fabric of campus life — through clubs, competitions, mentorship circles and peer accountability groups — students arrive at their final year with confidence rather than anxiety.",
        image: "/images/events/student-community-cohort.jpg",
        imageAlt: "Student community cohort",
      },
    ],
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
    coverImage: "/images/events/student-community-cohort.jpg",
    sections: [
      {
        heading: "Riya — from zero callbacks to three offers",
        body: "Riya was in her final semester with a strong academic record but no interview calls. After joining a structured placement readiness programme, she rebuilt her resume around outcomes rather than duties, practised case interviews with a peer cohort and researched her target companies in depth. Within six weeks she had three offers on the table. 'It was not about being smarter,' she told us. 'It was about being prepared.'",
        image: "/images/learners/ritika-singh.jpg",
        imageAlt: "Student success story",
      },
      {
        heading: "Aditya — finding the right fit, not just any offer",
        body: "Aditya's challenge was different: he had offers but none that matched his goals. Through a structured self-assessment and mentorship sessions, he clarified what he was actually looking for — a role with ownership and a steep learning curve. He eventually joined a growth-stage company in a role that did not exist in the initial job description because he was able to articulate exactly how he could contribute.",
        image: "/images/events/acca-career-workshop-session.jpg",
        imageAlt: "Career workshop and mentorship session",
      },
      {
        heading: "Sneha — turning a gap year into a differentiator",
        body: "Sneha took a year off after graduation and worried it would be a red flag. Her mentor helped her reframe it as a story of intentional exploration — she had freelanced, volunteered and built a small portfolio. In interviews, the gap became her strongest talking point. Authenticity, it turns out, is a hiring differentiator.",
        image: "/images/learners/sneha-patel.jpg",
        imageAlt: "Sneha Patel — student journey",
      },
    ],
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
    coverImage: "/images/events/hands-on-learning-lab.jpg",
    sections: [
      {
        heading: "Define what 'ready' actually means",
        body: "Placement readiness is not a feeling — it is a measurable state. Start by defining the competencies, behaviours and knowledge that a 'placement-ready' student demonstrates. This definition should be built collaboratively with your industry partners, not derived from historical assumptions. Once defined, everything else becomes a matter of tracking progress toward it.",
        image: "/images/events/interactive-workshop.jpg",
        imageAlt: "Interactive workshop defining readiness",
      },
      {
        heading: "Assess early, not just before the season",
        body: "The biggest mistake colleges make is treating placement preparation as a final-year activity. Students who begin structured readiness work in their first or second year have dramatically better outcomes. Baseline assessments in year one reveal gaps early enough to address them — not in a six-week sprint before companies arrive on campus.",
        image: "/images/events/hands-on-learning-lab.jpg",
        imageAlt: "Hands-on learning lab assessment",
      },
      {
        heading: "Track, iterate, and share the data",
        body: "Data-driven placement programmes outperform those run on intuition. Track which preparation interventions correlate with better outcomes, which students are progressing and which need additional support, and share aggregate findings with faculty and industry partners. Transparency creates accountability and accelerates improvement.",
        image: "/images/events/certificate-distribution.jpg",
        imageAlt: "Certificate distribution event",
      },
    ],
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
    coverImage: "/images/events/acca-career-workshop-session.jpg",
    sections: [
      {
        heading: "Prompt engineering is the new spreadsheet literacy",
        body: "Just as the ability to use a spreadsheet became a baseline office skill in the 1990s, the ability to write effective prompts for AI tools is rapidly becoming table stakes. By 2027, candidates who cannot demonstrate fluency with AI-assisted workflows — drafting, summarising, analysing, automating — will find themselves filtered out before the first interview.",
        image: "/images/events/expert-talk-series.jpg",
        imageAlt: "Expert talk on AI literacy",
      },
      {
        heading: "Critical evaluation of AI outputs matters more than the tools",
        body: "AI tools will proliferate and change. What will not change is the need for human judgment in evaluating what those tools produce. Students who can identify AI errors, hallucinations and bias will be far more valuable than those who simply accept the output. This critical lens is the core employability skill of the AI era.",
        image: "/images/events/group-activity-workshop.jpg",
        imageAlt: "Group activity evaluating AI outputs",
      },
      {
        heading: "Ethical and responsible AI use is a professional expectation",
        body: "Organisations are increasingly introducing AI governance policies, and new hires are expected to know and follow them. Understanding data privacy, intellectual property implications and the ethical use of generative AI is no longer a specialist topic — it is a professional baseline that hiring teams will assess.",
        image: "/images/events/institutional-collaboration.jpg",
        imageAlt: "Institutional session on responsible AI",
      },
    ],
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
    coverImage: "/images/events/group-activity-workshop.jpg",
    sections: [
      {
        heading: "Culture is built in year one, not year four",
        body: "The most placement-successful campuses we work with share one trait: they introduce career awareness in the very first semester. Not pressure — awareness. Exposing first-year students to alumni journeys, industry interactions and career mapping exercises normalises the conversation and removes the stigma of not having everything figured out immediately.",
        image: "/images/events/student-community-cohort.jpg",
        imageAlt: "Student community cohort gathering",
      },
      {
        heading: "Peer learning accelerates more than faculty instruction",
        body: "Students listen to students. Peer mentorship programmes — where final-year students guide juniors through placement preparation — create a powerful learning loop that compounds year over year. The mentors reinforce their own skills by teaching, and the mentees get guidance from someone who was recently in their exact position.",
        image: "/images/events/interactive-workshop.jpg",
        imageAlt: "Peer learning workshop",
      },
      {
        heading: "Recognition shapes behaviour",
        body: "What gets recognised gets repeated. Institutions that publicly celebrate not just placement offers but placement preparation milestones — a student who completed a mock interview, a team that won a case competition, a peer mentor who supported ten juniors — create a culture where career readiness is seen as an achievement worth pursuing, not a chore to be endured at the end of four years.",
        image: "/images/events/certificate-distribution.jpg",
        imageAlt: "Certificate distribution celebrating student milestones",
      },
    ],
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
