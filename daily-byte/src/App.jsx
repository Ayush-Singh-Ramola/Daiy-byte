

import React, { useState, useMemo, useEffect } from "react";
import {
  Search, Menu, X, ArrowLeft, ArrowUpRight, ChevronRight, ChevronUp, ChevronDown,
  LayoutGrid, Newspaper, Users, FileText, Settings, LogOut, Plus, Trash2,
  Copy as CopyIcon, Eye, Share2, Bookmark, Mail, Check
} from "lucide-react";
import heroImage from "./assets/hero.png";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const COLORS = {
  paper: "#F7F5EF",
  paperDark: "#EEE8D9",
  ink: "#141210",
  inkSoft: "#4A4640",
  muted: "#8A8375",
  border: "#D6D1C7",
  borderStrong: "#B7AF9E",
  accent: "#8B1E1E",
  accentSoft: "#F1E3E0",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
.story-columns { column-count: 1; }
@media (min-width: 640px) { .story-columns { column-count: 3; } }`;

const serif = { fontFamily: "'Libre Baskerville', Georgia, serif" };
const sans = { fontFamily: "'IBM Plex Sans', system-ui, sans-serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };

/* ============================================================
   CONTENT DATA (original placeholder editorial copy)
   ============================================================ */
const CATEGORIES = [
  "Artificial Intelligence", "Startups", "Programming", "Business",
  "Science", "Design", "Internet", "Security", "Creators",
];

let STORIES = [
  {
    slug: "ai-quietly-changing-software",
    category: "Artificial Intelligence",
    title: "AI Is Quietly Changing How Software Gets Built",
    dek: "The tools are still clumsy in places, but the daily rhythm of writing software is already different than it was a year ago.",
    summary: "Engineering teams are spending less time typing and more time reviewing, directing, and deciding — a shift that looks small day to day and enormous in aggregate.",
    author: "Editorial Desk",
    date: "September 9, 2026",
    readTime: "8 min read",
    source: "Original reporting",
    art: "ai",
    paragraphs: [
      "Walk onto most engineering floors today and the keyboards are quieter than they used to be. Not because people are typing less code — more of it is being produced than ever — but because a growing share of it is drafted, revised, and tested before a human reads a single line.",
      "The change hasn't arrived as a single dramatic moment. It has crept in through code review queues, through pull requests with unfamiliar authorship, through the slow normalization of asking a model to attempt something first and a person to judge the result second.",
      "What's changing is not just speed. It's the shape of the job. Engineers increasingly describe their week in terms of specification and verification rather than construction — closer to an editor's relationship with a manuscript than a builder's relationship with a wall.",
      "The risk, several teams told us, is treating this as a productivity story alone. The harder and more interesting question is what happens to judgment, taste, and institutional memory when fewer people write the first draft of anything.",
    ],
  },
  {
    slug: "small-teams-bigger-companies",
    category: "Startups",
    title: "Why Small Teams Are Building Bigger Companies",
    dek: "Headcount used to be a proxy for ambition. A new generation of founders is proving that proxy wrong.",
    summary: "Lean teams with automated operations are reaching revenue milestones that once required departments — and investors are starting to price that difference in.",
    author: "Editorial Desk",
    date: "September 9, 2026",
    readTime: "6 min read",
    source: "Original reporting",
    art: "startups",
    paragraphs: [
      "A decade ago, a company crossing eight figures in revenue without fifty employees would have been treated as an anomaly worth studying. This year it's closer to a pattern.",
      "The founders behind these companies describe a similar discipline: automate the parts of the business that don't require judgment, and hire only for the parts that do. Support, billing, and reporting increasingly run with minimal human intervention.",
      "Investors have noticed. Several growth-stage funds now ask about revenue per employee as a headline metric rather than a footnote, and are willing to pay a premium for founders who can defend a lean structure with real numbers.",
      "Not everyone is convinced this scales past a certain size. Culture, mentorship, and the slow work of building institutional knowledge still seem to want more people in the room — just, apparently, fewer than we assumed.",
    ],
  },
  {
    slug: "return-of-boring-software",
    category: "Programming",
    title: "The Return of Boring Software",
    dek: "After a decade chasing novel architectures, a quiet movement is arguing for the opposite: software that does less, and does it reliably.",
    summary: "A growing number of engineering teams are deliberately choosing older, duller technology — and reporting fewer incidents because of it.",
    author: "Editorial Desk",
    date: "September 8, 2026",
    readTime: "5 min read",
    source: "Original reporting",
    art: "programming",
    paragraphs: [
      "There's a term circulating in engineering forums this year: boring technology. It's used approvingly, which is new.",
      "The argument goes like this: every team has a limited budget of complexity it can safely manage. Spend that budget on the parts of the product that are actually novel, and choose the most boring, well-understood option everywhere else.",
      "In practice this has meant a retreat from some of the more exotic infrastructure choices of recent years, back toward relational databases, monoliths, and frameworks with a decade of hard-won documentation behind them.",
      "The appeal isn't nostalgia. It's operational: fewer surprises at 3 a.m., fewer engineers required to understand any one part of the system, and a much shorter list of things that can go wrong in ways nobody has seen before.",
    ],
  },
  {
    slug: "machines-learn-to-reason",
    category: "Science",
    title: "What Happens When Machines Learn to Reason?",
    dek: "Researchers are drawing a sharper line between systems that predict and systems that plan — and the distinction matters more than it sounds.",
    summary: "New benchmarks are attempting to measure something harder to fake than fluency: whether a system can hold a multi-step plan together under pressure.",
    author: "Editorial Desk",
    date: "September 7, 2026",
    readTime: "7 min read",
    source: "Original reporting",
    art: "science",
    paragraphs: [
      "For years, the easiest way to sound impressive was to sound fluent. Reasoning benchmarks are an attempt to separate the two — to test whether a system can hold a plan together across many steps, not just produce a convincing next sentence.",
      "The results so far are mixed in an instructive way. Systems that excel at short, well-specified puzzles often fall apart on longer tasks that require remembering an earlier decision and revising it later.",
      "Researchers describe this as a working-memory problem more than an intelligence problem — closer to asking someone to do long division without paper than to asking whether they understand arithmetic at all.",
      "The practical stakes are immediate: any product that promises to act on a user's behalf over multiple steps is, quietly, betting on this exact capability holding up outside the lab.",
    ],
  },
  {
    slug: "open-source-funding-problem",
    category: "Internet",
    title: "The Quiet Funding Problem Behind Open Source",
    dek: "Nearly every major piece of software depends on a small number of unpaid maintainers. The bill for that arrangement is starting to come due.",
    summary: "A string of maintainer burnouts is forcing companies to confront how much of the modern internet rests on unfunded, unglamorous labor.",
    author: "Editorial Desk",
    date: "September 6, 2026",
    readTime: "6 min read",
    source: "Original reporting",
    art: "internet",
    paragraphs: [
      "Somewhere in the dependency tree of nearly every application you've used this week sits a small library maintained by one or two people, usually for free, usually for years.",
      "That arrangement has worked well enough for a long time because the cost was invisible. It only becomes visible when a maintainer steps away, and a piece of infrastructure that half the internet quietly depends on stops getting patched.",
      "Some large companies have begun sponsoring maintainers directly, but the money is small relative to the value extracted, and it tends to flow toward already well-known projects rather than the obscure ones doing equally load-bearing work.",
      "The people closest to the problem describe it less as a funding gap and more as a recognition gap: nobody built a mechanism for a company to notice its own dependence until something breaks.",
    ],
  },
  {
    slug: "design-systems-eating-brands",
    category: "Design",
    title: "Design Systems Are Eating Brand Identity",
    dek: "As more products are assembled from the same component libraries, a familiar complaint has resurfaced: everything is starting to look the same.",
    summary: "Shared design systems make products faster to build and harder to tell apart — and some designers are pushing back on the tradeoff.",
    author: "Editorial Desk",
    date: "September 5, 2026",
    readTime: "5 min read",
    source: "Original reporting",
    art: "design",
    paragraphs: [
      "Open ten new products this month and a striking number will share the same rounded corners, the same soft shadow, the same three-color gradient. This isn't a coincidence; it's an artifact of how design systems propagate.",
      "The efficiency case is obvious. A shared library of accessible, tested components lets small teams ship interfaces they could never have built from scratch. The cost is quieter: a slow flattening of visual identity across unrelated products.",
      "A number of design leads are now pushing back deliberately, treating a handful of specific, opinionated choices as sacred even while adopting a shared system everywhere else — a typeface, a motion pattern, a single unusual color.",
      "The lesson several of them offered was the same: consistency is a tool for building faster, not a substitute for deciding what a product is supposed to feel like.",
    ],
  },
  {
    slug: "security-of-forgotten-apis",
    category: "Security",
    title: "The Danger Hiding in Forgotten APIs",
    dek: "The riskiest part of a company's infrastructure is rarely the system everyone is watching.",
    summary: "Old, undocumented, and rarely used endpoints are becoming a preferred target — precisely because nobody remembers they exist.",
    author: "Editorial Desk",
    date: "September 4, 2026",
    readTime: "6 min read",
    source: "Original reporting",
    art: "security",
    paragraphs: [
      "Security teams have gotten reasonably good at defending the systems they know about. The harder problem, several practitioners told us, is the growing pile of systems nobody remembers building.",
      "An API written for a feature that shipped and was later abandoned doesn't disappear. It keeps running, usually with weaker authentication than anything actively maintained, until someone finds it.",
      "The incidents this pattern produces rarely make headlines, because they don't look like sophisticated attacks. They look like someone politely asking an old door if it's still unlocked, and it is.",
      "The fix being discussed isn't more tooling so much as more discipline: a habit of retiring things on purpose, rather than letting them fade into infrastructure nobody is responsible for.",
    ],
  },
  {
    slug: "solo-creators-media-companies",
    category: "Creators",
    title: "Solo Creators Are Becoming Media Companies",
    dek: "A single person with an audience is starting to look, on a balance sheet, a lot like a small publisher.",
    summary: "As tooling for production, distribution, and monetization consolidates, individual creators are taking on functions once reserved for entire studios.",
    author: "Editorial Desk",
    date: "September 3, 2026",
    readTime: "5 min read",
    source: "Original reporting",
    art: "creators",
    paragraphs: [
      "The gap between an individual creator and a small media company has been narrowing for years, but this year it's become hard to see at all.",
      "One person can now write, produce, edit, distribute across formats, and manage a direct relationship with an audience through tools that used to require a staff. What's left to hire for is judgment and taste, not production capacity.",
      "This has produced a strange inversion: some of the most efficient media operations in the world are effectively one person and a laptop, out-publishing outlets many times their size.",
      "The tradeoff is fragility. A media company can survive one person leaving. A media company that is one person cannot — a fact several successful creators mentioned with more anxiety than the headlines about their success would suggest.",
    ],
  },
  {
    slug: "enterprise-software-slow-death",
    category: "Business",
    title: "The Slow, Quiet Death of Enterprise Software Bloat",
    dek: "For years the safe purchase was the platform that did everything. Buyers are starting to ask for the opposite.",
    summary: "Procurement teams are increasingly rejecting sprawling, all-in-one platforms in favor of smaller tools that do one thing well and integrate cleanly.",
    author: "Editorial Desk",
    date: "September 2, 2026",
    readTime: "6 min read",
    source: "Original reporting",
    art: "business",
    paragraphs: [
      "For most of the last two decades, the safest purchase a procurement team could make was the platform that promised to do everything. Fewer vendors, fewer contracts, fewer things to explain to the board.",
      "That instinct is fading. A newer generation of buyers, often having grown up using sharper, narrower consumer tools, is asking a different question: does this do the one thing we need, well, and does it talk to everything else we already own?",
      "Vendors have noticed the shift and are responding unevenly — some by genuinely narrowing their product, others by relabeling the same sprawling suite with a smaller marketing footprint.",
      "The buyers we spoke to were skeptical of the second kind, and increasingly willing to walk a purchase back to committee if a platform couldn't explain, specifically, what it does not do.",
    ],
  },
];

const saveStoriesToStorage = (nextStories) => {
  STORIES = nextStories;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("daily-byte-stories", JSON.stringify(nextStories));
    } catch (error) {
      console.warn("Unable to persist stories", error);
    }
  }
};

const loadStoriesFromStorage = () => {
  if (typeof window === "undefined") return STORIES;

  try {
    const saved = window.localStorage.getItem("daily-byte-stories");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Unable to load saved stories", error);
  }

  return STORIES;
};

STORIES = loadStoriesFromStorage();

const storyBySlug = (stories, slug) => stories.find((s) => s.slug === slug);

const ISSUES = [
  {
    slug: "issue-042",
    number: "042",
    date: "September 9, 2026",
    dek: "AI's quiet takeover of software work, the lean-team startup wave, and what it means when machines start to plan.",
    sections: [
      { name: "Top Stories", slugs: ["ai-quietly-changing-software", "small-teams-bigger-companies", "return-of-boring-software"] },
      { name: "Artificial Intelligence", slugs: ["ai-quietly-changing-software", "machines-learn-to-reason"] },
      { name: "Startups", slugs: ["small-teams-bigger-companies"] },
      { name: "Programming", slugs: ["return-of-boring-software"] },
    ],
  },
  {
    slug: "issue-041",
    number: "041",
    date: "September 8, 2026",
    dek: "Open source's unpaid backbone, design systems flattening the web, and the return of boring infrastructure.",
    sections: [
      { name: "Top Stories", slugs: ["open-source-funding-problem", "design-systems-eating-brands"] },
      { name: "The Internet", slugs: ["open-source-funding-problem"] },
      { name: "Design", slugs: ["design-systems-eating-brands"] },
      { name: "Programming", slugs: ["return-of-boring-software"] },
    ],
  },
  {
    slug: "issue-040",
    number: "040",
    date: "September 5, 2026",
    dek: "Forgotten APIs as the new attack surface, solo creators acting like studios, and enterprise software's identity crisis.",
    sections: [
      { name: "Top Stories", slugs: ["security-of-forgotten-apis", "enterprise-software-slow-death"] },
      { name: "Security", slugs: ["security-of-forgotten-apis"] },
      { name: "Creators", slugs: ["solo-creators-media-companies"] },
      { name: "Business", slugs: ["enterprise-software-slow-death"] },
    ],
  },
];

/* ============================================================
   EDITORIAL ART — abstract line-illustration per category
   (no photography; keeps a consistent, intentional visual system)
   ============================================================ */
function EditorialArt({ category, ratio = "16/9", subtle = false }) {
  const stroke = COLORS.ink;
  const accent = COLORS.accent;

  const shapes = {
    "Artificial Intelligence": (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <circle cx="60" cy="50" r="4" fill={accent} stroke="none" />
        <circle cx="140" cy="30" r="3.5" />
        <circle cx="200" cy="70" r="4" />
        <circle cx="160" cy="110" r="3.5" fill={accent} stroke="none" />
        <circle cx="90" cy="105" r="3" />
        <circle cx="40" cy="90" r="3" />
        <line x1="60" y1="50" x2="140" y2="30" />
        <line x1="140" y1="30" x2="200" y2="70" />
        <line x1="200" y1="70" x2="160" y2="110" />
        <line x1="160" y1="110" x2="90" y2="105" />
        <line x1="90" y1="105" x2="40" y2="90" />
        <line x1="40" y1="90" x2="60" y2="50" />
        <line x1="60" y1="50" x2="160" y2="110" />
        <line x1="140" y1="30" x2="90" y2="105" />
      </g>
    ),
    Startups: (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <line x1="30" y1="130" x2="230" y2="130" />
        <rect x="45" y="95" width="18" height="35" />
        <rect x="80" y="75" width="18" height="55" />
        <rect x="115" y="55" width="18" height="75" fill={accent} stroke="none" />
        <rect x="150" y="35" width="18" height="95" />
        <rect x="185" y="15" width="18" height="115" />
        <path d="M45 100 L98 78 L133 58 L168 38 L203 18" strokeDasharray="2 3" />
      </g>
    ),
    Programming: (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <rect x="30" y="20" width="200" height="110" />
        <path d="M55 60 L40 75 L55 90" />
        <path d="M105 60 L120 75 L105 90" fill="none" />
        <line x1="80" y1="95" x2="90" y2="55" stroke={accent} />
        <line x1="150" y1="45" x2="205" y2="45" />
        <line x1="150" y1="60" x2="190" y2="60" />
        <line x1="150" y1="75" x2="200" y2="75" />
      </g>
    ),
    Science: (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <circle cx="130" cy="75" r="8" fill={accent} stroke="none" />
        <ellipse cx="130" cy="75" rx="95" ry="30" />
        <ellipse cx="130" cy="75" rx="95" ry="30" transform="rotate(60 130 75)" />
        <ellipse cx="130" cy="75" rx="95" ry="30" transform="rotate(120 130 75)" />
      </g>
    ),
    "The Internet": (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M20 60 Q 55 30, 90 60 T 160 60 T 230 60" />
        <path d="M20 90 Q 55 60, 90 90 T 160 90 T 230 90" stroke={accent} />
        <path d="M20 120 Q 55 90, 90 120 T 160 120 T 230 120" />
      </g>
    ),
    Internet: (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M20 60 Q 55 30, 90 60 T 160 60 T 230 60" />
        <path d="M20 90 Q 55 60, 90 90 T 160 90 T 230 90" stroke={accent} />
        <path d="M20 120 Q 55 90, 90 120 T 160 120 T 230 120" />
      </g>
    ),
    Design: (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <rect x="35" y="25" width="110" height="80" />
        <rect x="75" y="55" width="130" height="80" stroke={accent} />
      </g>
    ),
    Security: (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M130 15 L200 35 V80 C200 115 168 135 130 145 C92 135 60 115 60 80 V35 Z" />
        <circle cx="130" cy="75" r="12" fill={accent} stroke="none" />
        <line x1="130" y1="87" x2="130" y2="105" strokeWidth="4" stroke={accent} />
      </g>
    ),
    Creators: (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <rect x="30" y="30" width="90" height="60" />
        <path d="M60 45 L60 75 L88 60 Z" fill={accent} stroke="none" />
        <rect x="140" y="55" width="90" height="60" />
        <path d="M170 70 L170 100 L198 85 Z" fill="none" />
      </g>
    ),
    Business: (
      <g fill="none" stroke={stroke} strokeWidth="1.4">
        <line x1="30" y1="130" x2="230" y2="130" />
        <line x1="30" y1="20" x2="30" y2="130" />
        <path d="M30 110 L80 90 L120 100 L165 55 L215 65" />
        <circle cx="215" cy="65" r="4" fill={accent} stroke="none" />
      </g>
    ),
  };

  return (
    <div
      style={{ aspectRatio: ratio, background: subtle ? COLORS.paperDark : COLORS.paper, border: `1px solid ${COLORS.border}` }}
      className="w-full flex items-center justify-center overflow-hidden"
    >
      <svg viewBox="0 0 260 150" className="w-2/3 h-2/3">
        {shapes[category] || shapes["Programming"]}
      </svg>
    </div>
  );
}

/* ============================================================
   SMALL EDITORIAL PRIMITIVES
   ============================================================ */
function CategoryLabel({ children, size = "sm", onClick }) {
  const sizes = { sm: "text-[11px] tracking-[0.12em]", md: "text-xs tracking-[0.14em]" };
  return (
    <span
      onClick={onClick}
      style={{ ...sans, color: COLORS.accent, fontWeight: 600, cursor: onClick ? "pointer" : "default" }}
      className={`${sizes[size]} uppercase`}
    >
      {children}
    </span>
  );
}

function Byline({ author, date, readTime }) {
  return (
    <div style={{ ...sans, color: COLORS.muted }} className="text-[12.5px] flex flex-wrap gap-x-2">
      <span>By {author}</span>
      <span aria-hidden="true">·</span>
      <span>{date}</span>
      {readTime && (
        <>
          <span aria-hidden="true">·</span>
          <span>{readTime}</span>
        </>
      )}
    </div>
  );
}

function Rule({ double = false, className = "" }) {
  if (double) {
    return (
      <div className={className}>
        <div style={{ borderTop: `2px solid ${COLORS.ink}` }} />
        <div style={{ borderTop: `1px solid ${COLORS.ink}`, marginTop: "3px" }} />
      </div>
    );
  }
  return <div className={className} style={{ borderTop: `1px solid ${COLORS.border}` }} />;
}

function SectionHeader({ title, sub, onSeeAll }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 style={{ ...serif, color: COLORS.ink }} className="text-[26px] leading-none">
          {title}
        </h2>
        {sub && (
          <p style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.1em] mt-1.5">
            {sub}
          </p>
        )}
      </div>
      {onSeeAll && (
        <button onClick={onSeeAll} style={{ ...sans, color: COLORS.inkSoft }} className="text-[13px] hover:text-black flex items-center gap-1 pb-1">
          See all <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function PullQuote({ children }) {
  return (
    <blockquote
      style={{ ...serif, color: COLORS.ink, borderLeft: `3px solid ${COLORS.accent}` }}
      className="pl-6 py-1 my-8 text-[22px] leading-snug italic"
    >
      {children}
    </blockquote>
  );
}

/* ============================================================
   STORY CARD VARIANTS
   ============================================================ */
function HeroStory({ story, onOpen }) {
  return (
    <article className="cursor-pointer group" onClick={() => onOpen(story.slug)}>
      <EditorialArt category={story.category} ratio="16/9" />
      <div className="pt-4">
        <CategoryLabel>{story.category}</CategoryLabel>
        <h3
          style={{ ...serif, color: COLORS.ink }}
          className="text-[34px] leading-[1.08] mt-2 group-hover:underline decoration-1 underline-offset-4"
        >
          {story.title}
        </h3>
        <p style={{ ...sans, color: COLORS.inkSoft }} className="mt-3 text-[15px] leading-relaxed max-w-[52ch]">
          {story.summary}
        </p>
        <div className="mt-3">
          <Byline author={story.author} date={story.date} readTime={story.readTime} />
        </div>
      </div>
    </article>
  );
}

function StandardStory({ story, onOpen }) {
  return (
    <article className="cursor-pointer group" onClick={() => onOpen(story.slug)}>
      <EditorialArt category={story.category} ratio="4/3" />
      <div className="pt-3">
        <CategoryLabel>{story.category}</CategoryLabel>
        <h3
          style={{ ...serif, color: COLORS.ink }}
          className="text-[19px] leading-[1.2] mt-1.5 group-hover:underline decoration-1 underline-offset-4"
        >
          {story.title}
        </h3>
        <div className="mt-2">
          <Byline author={story.author} date={story.date} readTime={story.readTime} />
        </div>
      </div>
    </article>
  );
}

function CompactStory({ story, onOpen, showArt = true }) {
  return (
    <article
      className="cursor-pointer group flex gap-3 py-3"
      style={{ borderTop: `1px solid ${COLORS.border}` }}
      onClick={() => onOpen(story.slug)}
    >
      {showArt && (
        <div className="w-16 shrink-0">
          <EditorialArt category={story.category} ratio="1/1" />
        </div>
      )}
      <div className="min-w-0">
        <CategoryLabel size="sm">{story.category}</CategoryLabel>
        <h4 style={{ ...serif, color: COLORS.ink }} className="text-[15px] leading-snug mt-1 group-hover:underline decoration-1">
          {story.title}
        </h4>
      </div>
    </article>
  );
}

function HorizontalStory({ story, onOpen }) {
  return (
    <article
      className="cursor-pointer group grid grid-cols-[1fr_2fr] gap-5 py-5"
      style={{ borderTop: `1px solid ${COLORS.border}` }}
      onClick={() => onOpen(story.slug)}
    >
      <EditorialArt category={story.category} ratio="4/3" />
      <div>
        <CategoryLabel>{story.category}</CategoryLabel>
        <h3 style={{ ...serif, color: COLORS.ink }} className="text-[22px] leading-[1.15] mt-1.5 group-hover:underline decoration-1">
          {story.title}
        </h3>
        <p style={{ ...sans, color: COLORS.inkSoft }} className="mt-2 text-[14px] leading-relaxed hidden sm:block">
          {story.summary}
        </p>
        <div className="mt-2">
          <Byline author={story.author} date={story.date} readTime={story.readTime} />
        </div>
      </div>
    </article>
  );
}

function NumberedStory({ index, story, onOpen }) {
  return (
    <article
      className="cursor-pointer group flex gap-4 items-baseline py-4"
      style={{ borderTop: `1px solid ${COLORS.border}` }}
      onClick={() => onOpen(story.slug)}
    >
      <span style={{ ...serif, color: COLORS.border }} className="text-[32px] leading-none w-9 shrink-0">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <CategoryLabel size="sm">{story.category}</CategoryLabel>
        <h4 style={{ ...serif, color: COLORS.ink }} className="text-[17px] leading-snug mt-1 group-hover:underline decoration-1">
          {story.title}
        </h4>
      </div>
    </article>
  );
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function Masthead({ onNav, onSearch, onSubscribe, mobileOpen, setMobileOpen }) {
  const nav = ["Latest", "AI", "Startups", "Programming", "Business", "Science", "Design"];
  return (
    <header style={{ background: COLORS.paper }} className="sticky top-0 z-30">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between pt-5 pb-3">
          <button onClick={() => onNav("home")} className="text-left">
            <div style={{ ...serif, color: COLORS.ink }} className="text-[30px] sm:text-[36px] leading-none tracking-tight">
              The Daily Byte
            </div>
          </button>
          <div className="hidden sm:flex items-center gap-1" style={{ ...sans, color: COLORS.inkSoft }}>
            <span className="text-[12.5px]">Wednesday, Sept 9, 2026</span>
          </div>
          <button className="sm:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <Rule double />
        <div className="hidden sm:flex items-center justify-between py-2.5">
          <div style={{ ...sans, color: COLORS.muted }} className="text-[11px] uppercase tracking-[0.14em]">
            Technology &amp; Ideas
          </div>
          <nav style={sans} className="flex items-center gap-6 text-[13px]">
            {nav.map((n) => (
              <button
                key={n}
                onClick={() => onNav(n === "Latest" ? "home" : "category", n)}
                style={{ color: COLORS.inkSoft }}
                className="hover:text-black transition-colors"
              >
                {n}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={onSearch} aria-label="Search" style={{ color: COLORS.inkSoft }} className="hover:text-black">
              <Search size={17} />
            </button>
            <button
              onClick={onSubscribe}
              style={{ ...sans, background: COLORS.ink, color: COLORS.paper }}
              className="text-[12.5px] font-medium px-4 py-2"
            >
              Subscribe
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="sm:hidden pb-4 flex flex-col gap-3 pt-2" style={sans}>
            {nav.map((n) => (
              <button
                key={n}
                onClick={() => {
                  onNav(n === "Latest" ? "home" : "category", n);
                  setMobileOpen(false);
                }}
                className="text-left text-[15px]"
                style={{ color: COLORS.ink }}
              >
                {n}
              </button>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <button onClick={onSearch} className="text-[14px] flex items-center gap-2" style={{ color: COLORS.ink }}>
                <Search size={16} /> Search
              </button>
              <button onClick={onSubscribe} style={{ background: COLORS.ink, color: COLORS.paper }} className="text-[13px] px-4 py-2">
                Subscribe
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{ borderTop: `1px solid ${COLORS.border}` }} />
    </header>
  );
}

function Footer({ onNav }) {
  return (
    <footer style={{ borderTop: `1px solid ${COLORS.border}`, background: COLORS.paper }} className="mt-20">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <div style={{ ...serif, color: COLORS.ink }} className="text-[22px]">The Daily Byte</div>
          <p style={{ ...sans, color: COLORS.muted }} className="text-[13px] mt-2 leading-relaxed">
            Ten minutes of reading that keeps you informed. Published on weekday mornings.
          </p>
        </div>
        <div>
          <div style={{ ...sans, color: COLORS.ink }} className="text-[12px] uppercase tracking-[0.1em] mb-3">Sections</div>
          <div className="flex flex-col gap-2" style={{ ...sans, color: COLORS.inkSoft }}>
            {["Artificial Intelligence", "Startups", "Programming", "Design"].map((c) => (
              <button key={c} onClick={() => onNav("category", c)} className="text-left text-[13.5px] hover:text-black">{c}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ ...sans, color: COLORS.ink }} className="text-[12px] uppercase tracking-[0.1em] mb-3">Read</div>
          <div className="flex flex-col gap-2" style={{ ...sans, color: COLORS.inkSoft }}>
            <button onClick={() => onNav("issues")} className="text-left text-[13.5px] hover:text-black">Past issues</button>
            <button onClick={() => onNav("search")} className="text-left text-[13.5px] hover:text-black">Search</button>
            <button onClick={() => onNav("admin")} className="text-left text-[13.5px] hover:text-black">Editor login</button>
          </div>
        </div>
        <div>
          <div style={{ ...sans, color: COLORS.ink }} className="text-[12px] uppercase tracking-[0.1em] mb-3">About</div>
          <p style={{ ...sans, color: COLORS.inkSoft }} className="text-[13.5px] leading-relaxed">
            An independent technology publication. No sponsors influence editorial coverage.
          </p>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${COLORS.border}` }} className="max-w-[1400px] mx-auto px-5 sm:px-8 py-5 flex justify-between">
        <span style={{ ...sans, color: COLORS.muted }} className="text-[12px]">© 2026 The Daily Byte</span>
        <span style={{ ...sans, color: COLORS.muted }} className="text-[12px]">Made for people who read</span>
      </div>
    </footer>
  );
}

/* ============================================================
   SUBSCRIBE
   ============================================================ */
function SubscribeBlock({ onSubscribed }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That doesn't look like a valid email address.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to subscribe right now.");
      }

      onSubscribed(email);
    } catch (submitError) {
      setError(submitError.message || "Unable to subscribe right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ background: COLORS.ink }} className="py-16">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 grid sm:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div>
          <div style={{ ...sans, color: "#C9AFAF" }} className="text-[11px] uppercase tracking-[0.14em] mb-3">
            Get The Daily Byte
          </div>
          <h2 style={{ ...serif, color: COLORS.paper }} className="text-[32px] sm:text-[40px] leading-[1.1]">
            The most interesting technology stories, delivered to your inbox.
          </h2>
        </div>
        <form onSubmit={submit} className="w-full">
          <div className="flex flex-col sm:flex-row gap-0 border" style={{ borderColor: "#3A3632" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ ...sans, background: "transparent", color: COLORS.paper }}
              className="flex-1 px-4 py-3.5 text-[15px] placeholder:text-[#8A8375] focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              style={{ ...sans, background: COLORS.accent, color: COLORS.paper, opacity: submitting ? 0.7 : 1 }}
              className="px-6 py-3.5 text-[14px] font-medium shrink-0"
            >
              {submitting ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
          {error && <p style={{ ...sans, color: "#E7A6A6" }} className="text-[12.5px] mt-2">{error}</p>}
          <p style={{ ...sans, color: "#8A8375" }} className="text-[12px] mt-3">
            No spam. One email on weekday mornings. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  );
}

function SubscribeSuccess({ email, onDone }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${COLORS.ink}` }}>
          <Check size={20} style={{ color: COLORS.accent }} />
        </div>
        <div style={{ ...sans, color: COLORS.muted }} className="text-[11px] uppercase tracking-[0.14em] mb-3">Subscription confirmed</div>
        <h1 style={{ ...serif, color: COLORS.ink }} className="text-[38px] leading-tight">You're in.</h1>
        <p style={{ ...sans, color: COLORS.inkSoft }} className="mt-4 text-[15px] leading-relaxed">
          Your next edition will arrive at <span style={{ color: COLORS.ink, fontWeight: 600 }}>{email || "your inbox"}</span>. Check your email to confirm your subscription.
        </p>
        <Rule className="my-8" />
        <button onClick={onDone} style={{ ...sans, color: COLORS.ink, border: `1px solid ${COLORS.ink}` }} className="px-5 py-2.5 text-[13px]">
          Back to the front page
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   PUBLIC PAGES
   ============================================================ */
function HomePage({ onOpenStory, onNav, onSubscribed, stories }) {
  const hero = stories[0];
  const secondary = [stories[1], stories[2], stories[3]];
  const aiSection = stories.filter((s) => s.category === "Artificial Intelligence");
  const startupSection = stories.filter((s) => s.category === "Startups" || s.category === "Business");
  const restForRail = stories.slice(4);

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-8">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <span style={{ ...sans, color: COLORS.accent }} className="text-[12px] uppercase tracking-[0.14em] font-semibold">
              Issue #042
            </span>
            <span style={{ ...sans, color: COLORS.muted }} className="text-[12px] ml-3">September 9, 2026</span>
          </div>
          <button onClick={() => onNav("issue", "issue-042")} style={{ ...sans, color: COLORS.inkSoft }} className="text-[13px] hover:text-black flex items-center gap-1">
            Read full issue <ChevronRight size={14} />
          </button>
        </div>
        <h1 style={{ ...serif, color: COLORS.ink }} className="text-[22px] italic mt-2 max-w-[60ch]">
          Technology, startups, ideas and the internet — curated.
        </h1>
      </div>

      <Rule className="max-w-[1400px] mx-auto mt-6" />

      {/* main editorial grid */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <HeroStory story={hero} onOpen={onOpenStory} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-0">
          {secondary.map((s) => (
            <CompactStory key={s.slug} story={s} onOpen={onOpenStory} showArt={false} />
          ))}
          <div style={{ borderTop: `1px solid ${COLORS.border}` }} />
        </div>
      </div>

      {/* AI section */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
        <SectionHeader title="Artificial Intelligence" sub="The machines section" onSeeAll={() => onNav("category", "Artificial Intelligence")} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[...aiSection, STORIES[4]].map((s) => (
            <StandardStory key={s.slug} story={s} onOpen={onOpenStory} />
          ))}
        </div>
      </div>

      <SubscribeBlock onSubscribed={onSubscribed} />

      {/* startups + rail */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <SectionHeader title="Startups &amp; Business" onSeeAll={() => onNav("category", "Startups")} />
          {startupSection.map((s) => (
            <HorizontalStory key={s.slug} story={s} onOpen={onOpenStory} />
          ))}
        </div>
        <div className="lg:col-span-4">
          <SectionHeader title="Also today" />
          {restForRail.map((s, i) => (
            <NumberedStory key={s.slug} index={i + 1} story={s} onOpen={onOpenStory} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryPage({ category, onOpenStory, onNav, stories }) {
  const list = stories.filter((s) => s.category === category);
  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
      <button onClick={() => onNav("home")} style={{ ...sans, color: COLORS.muted }} className="text-[13px] flex items-center gap-1 mb-6 hover:text-black">
        <ArrowLeft size={14} /> Front page
      </button>
      <SectionHeader title={category} sub={`${list.length} ${list.length === 1 ? "story" : "stories"}`} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {list.length ? list.map((s) => <StandardStory key={s.slug} story={s} onOpen={onOpenStory} />) : (
          <p style={{ ...sans, color: COLORS.muted }} className="text-[14px]">No stories in this section yet.</p>
        )}
      </div>
    </div>
  );
}

function BoxedQuote({ quote, attribution }) {
  return (
    <div
      style={{ border: `1.5px solid ${COLORS.ink}`, breakInside: "avoid" }}
      className="p-5 my-2"
    >
      <p style={{ ...serif, color: COLORS.ink }} className="italic text-[17px] leading-snug text-center">
        &ldquo;{quote}&rdquo;
      </p>
      {attribution && (
        <p style={{ ...sans, color: COLORS.muted }} className="text-[12px] text-center mt-3 uppercase tracking-[0.08em]">
          — {attribution}
        </p>
      )}
    </div>
  );
}

function StoryPage({ slug, onOpenStory, onNav, stories }) {
  const story = storyBySlug(stories, slug);
  const [saved, setSaved] = useState(false);
  if (!story) return null;
  const related = stories.filter((s) => s.category === story.category && s.slug !== slug).slice(0, 3);
  const midpoint = Math.ceil(story.paragraphs.length / 2);
  const bodyParagraphs = story.paragraphs;

  return (
    <article className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
      {/* outer newspaper frame */}
      <div style={{ border: `1px solid ${COLORS.ink}` }} className="p-3 sm:p-6">
        <div style={{ border: `1px solid ${COLORS.ink}` }} className="p-5 sm:p-10">
          {/* top meta strip */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => onNav("home")} style={{ color: COLORS.ink }} className="hover:opacity-60">
              <ArrowLeft size={20} />
            </button>
            <div style={{ ...sans, color: COLORS.inkSoft }} className="text-[11px] uppercase tracking-[0.12em] text-right">
              Published {story.date} · Circulation: 12,482 readers
            </div>
          </div>

          <Rule double />

          {/* masthead-style headline block */}
          <div className="text-center py-8">
            <CategoryLabel size="md" onClick={() => onNav("category", story.category)}>
              {story.category}
            </CategoryLabel>
            <h1
              style={{ ...serif, color: COLORS.ink, letterSpacing: "0.01em" }}
              className="uppercase text-[34px] sm:text-[56px] leading-[1.05] mt-4 max-w-[16ch] mx-auto"
            >
              {story.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Byline author={story.author} date={story.date} readTime={story.readTime} />
            </div>
          </div>

          <Rule double />

          {/* photo + intro, two columns like the reference page */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-9">
            <div>
              <div
                style={{ boxShadow: "6px 6px 0 rgba(20,18,16,0.08)" }}
                className="overflow-hidden border border-[var(--ink)]"
              >
                <img
                  src={heroImage}
                  alt={story.title}
                  className="block w-full h-auto object-cover"
                />
              </div>
              <p style={{ ...serif, color: COLORS.inkSoft }} className="italic text-[13px] mt-3 text-center">
                A visual representation of the ideas discussed in this story.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <h2 style={{ ...serif, color: COLORS.ink }} className="uppercase text-[19px] tracking-[0.02em] mb-3 leading-snug">
                {story.dek}
              </h2>
              <p style={{ ...serif, color: COLORS.ink, textAlign: "justify" }} className="text-[15.5px] leading-[1.7]">
                {story.summary}
              </p>
              <div className="flex items-center gap-5 mt-5">
                <button onClick={() => setSaved(!saved)} style={{ ...sans, color: saved ? COLORS.accent : COLORS.inkSoft }} className="text-[12px] flex items-center gap-1.5">
                  <Bookmark size={13} fill={saved ? COLORS.accent : "none"} /> {saved ? "Saved" : "Save"}
                </button>
                <button style={{ ...sans, color: COLORS.inkSoft }} className="text-[12px] flex items-center gap-1.5">
                  <Share2 size={13} /> Share
                </button>
              </div>
            </div>
          </div>

          <Rule double />

          {/* headline repeated, broadsheet style, then multi-column justified body */}
          <div className="pt-9">
            <h3 style={{ ...serif, color: COLORS.ink }} className="uppercase text-[22px] sm:text-[26px] text-center mb-8 tracking-[0.01em]">
              {story.title}
            </h3>

            <div
              style={{ columnGap: "2.5rem", columnRule: `1px solid ${COLORS.border}` }}
              className="story-columns"
            >
              {bodyParagraphs.map((p, i) => (
                <React.Fragment key={i}>
                  <p
                    style={{ ...serif, color: COLORS.ink, textAlign: "justify", breakInside: "avoid" }}
                    className="text-[14.5px] leading-[1.75] mb-4"
                  >
                    {i === 0 && <span style={{ ...serif }} className="float-left text-[46px] leading-[0.8] pr-2 pt-1">{p.charAt(0)}</span>}
                    {i === 0 ? p.slice(1) : p}
                  </p>
                  {i === midpoint && <BoxedQuote quote={story.dek} attribution={story.author} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <Rule className="mt-8 mb-5" />

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div style={{ ...sans, color: COLORS.muted }} className="text-[12.5px]">
              Source: {story.source}
            </div>
            <button style={{ ...sans, color: COLORS.ink, borderBottom: `1px solid ${COLORS.ink}` }} className="text-[12.5px] flex items-center gap-1.5 pb-0.5 hover:opacity-70">
              Visit site <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-[1400px] mx-auto mt-16">
          <SectionHeader title="Related stories" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {related.map((s) => <StandardStory key={s.slug} story={s} onOpen={onOpenStory} />)}
          </div>
        </div>
      )}
    </article>
  );
}

function IssuesPage({ onOpenIssue, onNav }) {
  return (
    <div className="max-w-[1000px] mx-auto px-5 sm:px-8 py-10">
      <div style={{ ...sans, color: COLORS.muted }} className="text-[11px] uppercase tracking-[0.14em] mb-2">The Daily Byte</div>
      <h1 style={{ ...serif, color: COLORS.ink }} className="text-[38px] mb-8">Past Issues</h1>
      <div>
        {ISSUES.map((issue) => (
          <article
            key={issue.slug}
            className="cursor-pointer group py-7 grid grid-cols-1 sm:grid-cols-[110px_1fr_auto] gap-4 items-center"
            style={{ borderTop: `1px solid ${COLORS.border}` }}
            onClick={() => onOpenIssue(issue.slug)}
          >
            <div style={{ ...serif, color: COLORS.accent }} className="text-[30px] leading-none">
              #{issue.number}
            </div>
            <div>
              <div style={{ ...sans, color: COLORS.muted }} className="text-[12px] mb-1">{issue.date}</div>
              <p style={{ ...serif, color: COLORS.ink }} className="text-[17px] leading-snug group-hover:underline decoration-1 max-w-[60ch]">
                {issue.dek}
              </p>
            </div>
            <div style={{ ...sans, color: COLORS.inkSoft }} className="text-[13px] flex items-center gap-1 justify-start sm:justify-end">
              Read issue <ChevronRight size={14} />
            </div>
          </article>
        ))}
        <div style={{ borderTop: `1px solid ${COLORS.border}` }} />
      </div>
    </div>
  );
}

function IssueReaderPage({ slug, onOpenStory, onNav, stories }) {
  const issue = ISSUES.find((i) => i.slug === slug);
  if (!issue) return null;
  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10">
      <button onClick={() => onNav("issues")} style={{ ...sans, color: COLORS.muted }} className="text-[13px] flex items-center gap-1 mb-8 hover:text-black">
        <ArrowLeft size={14} /> All issues
      </button>

      <div className="text-center max-w-[600px] mx-auto">
        <div style={{ ...serif, color: COLORS.ink }} className="text-[26px]">The Daily Byte</div>
        <Rule double className="my-4" />
        <div style={{ ...sans, color: COLORS.accent }} className="text-[13px] uppercase tracking-[0.14em] font-semibold">Issue #{issue.number}</div>
        <div style={{ ...sans, color: COLORS.muted }} className="text-[13px] mt-1">{issue.date}</div>
        <p style={{ ...serif, color: COLORS.inkSoft }} className="italic text-[17px] mt-4 leading-relaxed">{issue.dek}</p>
      </div>

      {issue.sections.map((section, si) => {
        const sectionStories = section.slugs.map((slug) => storyBySlug(stories, slug)).filter(Boolean);
        if (!sectionStories.length) return null;
        return (
          <div key={section.name} className="mt-16">
            <div className="text-center mb-8">
              <div style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.16em]">{section.name}</div>
              <Rule className="max-w-[120px] mx-auto mt-3" />
            </div>
            {si === 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7">
                  <HeroStory story={sectionStories[0]} onOpen={onOpenStory} />
                </div>
                <div className="lg:col-span-5">
                  {sectionStories.slice(1).map((s) => <CompactStory key={s.slug} story={s} onOpen={onOpenStory} />)}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {sectionStories.map((s) => <StandardStory key={s.slug} story={s} onOpen={onOpenStory} />)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SearchPage({ onOpenStory, onNav, stories }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!q.trim()) return stories;
    const lower = q.toLowerCase();
    return stories.filter(
      (s) => s.title.toLowerCase().includes(lower) || s.category.toLowerCase().includes(lower) || s.summary.toLowerCase().includes(lower)
    );
  }, [q]);

  return (
    <div className="max-w-[800px] mx-auto px-5 sm:px-8 py-10">
      <div style={{ ...sans, color: COLORS.muted }} className="text-[11px] uppercase tracking-[0.14em] mb-2 text-center">Search The Daily Byte</div>
      <div className="relative mb-2">
        <Search size={16} style={{ color: COLORS.muted }} className="absolute left-0 top-1/2 -translate-y-1/2" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stories, categories, topics…"
          style={{ ...serif, color: COLORS.ink, borderBottom: `2px solid ${COLORS.ink}` }}
          className="w-full pl-6 pr-2 py-3 text-[22px] bg-transparent focus:outline-none placeholder:not-italic"
        />
      </div>
      <div style={{ ...sans, color: COLORS.muted }} className="text-[12px] mb-8">
        {results.length} {results.length === 1 ? "result" : "results"}
      </div>
      <div>
        {results.map((s) => <CompactStory key={s.slug} story={s} onOpen={onOpenStory} />)}
        <div style={{ borderTop: `1px solid ${COLORS.border}` }} />
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN
   ============================================================ */
function AdminShell({ page, onNav, children }) {
  const items = [
    { key: "admin", label: "Dashboard", icon: LayoutGrid },
    { key: "admin-issues", label: "Issues", icon: Newspaper },
    { key: "admin-stories", label: "Stories", icon: FileText },
    { key: "admin-subscribers", label: "Subscribers", icon: Users },
    { key: "admin-settings", label: "Settings", icon: Settings },
  ];
  return (
    <div style={{ background: COLORS.paper, minHeight: "100vh" }} className="flex flex-col sm:flex-row">
      <aside style={{ borderRight: `1px solid ${COLORS.border}` }} className="sm:w-56 shrink-0 px-5 py-6 flex sm:flex-col justify-between">
        <div>
          <div style={{ ...serif, color: COLORS.ink }} className="text-[22px] mb-8">The Daily Byte</div>
          <nav className="flex sm:flex-col gap-1 flex-wrap">
            {items.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onNav(key)}
                style={{
                  ...sans,
                  color: page === key ? COLORS.paper : COLORS.inkSoft,
                  background: page === key ? COLORS.ink : "transparent",
                }}
                className="text-[13.5px] flex items-center gap-2.5 px-3 py-2 text-left"
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => onNav("home")} style={{ ...sans, color: COLORS.muted }} className="text-[13px] flex items-center gap-2 hover:text-black">
          <LogOut size={14} /> Exit admin
        </button>
      </aside>
      <main className="flex-1 px-6 sm:px-10 py-8 overflow-x-hidden">{children}</main>
    </div>
  );
}

function StatCard({ label, value, delta }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}` }} className="p-5">
      <div style={{ ...sans, color: COLORS.muted }} className="text-[11px] uppercase tracking-[0.1em]">{label}</div>
      <div style={{ ...serif, color: COLORS.ink }} className="text-[30px] mt-2">{value}</div>
      {delta && <div style={{ ...sans, color: COLORS.accent }} className="text-[12px] mt-1">{delta}</div>}
    </div>
  );
}

function AdminDashboard({ onNav }) {
  return (
    <AdminShell page="admin" onNav={onNav}>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ ...serif, color: COLORS.ink }} className="text-[28px]">Dashboard</h1>
        <button
          onClick={() => onNav("admin-editor")}
          style={{ ...sans, background: COLORS.ink, color: COLORS.paper }}
          className="text-[13px] px-4 py-2.5 flex items-center gap-2"
        >
          <Plus size={14} /> Create issue
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Subscribers" value="12,482" delta="+214 this month" />
        <StatCard label="Published issues" value="42" />
        <StatCard label="Draft issues" value="1" />
        <StatCard label="Stories" value="386" />
      </div>

      <SectionHeader title="Recent issues" />
      <div className="mb-10">
        {[{ n: "042", d: "September 9, 2026", s: "Published" }, { n: "041", d: "September 8, 2026", s: "Published" }, { n: "040", d: "September 5, 2026", s: "Published" }].map((i) => (
          <div key={i.n} className="flex items-center justify-between py-3.5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center gap-4">
              <span style={{ ...serif, color: COLORS.accent }} className="text-[18px]">#{i.n}</span>
              <span style={{ ...sans, color: COLORS.inkSoft }} className="text-[13.5px]">{i.d}</span>
            </div>
            <span style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">{i.s}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${COLORS.border}` }} />
      </div>

      <SectionHeader title="Recent subscribers" />
      <div>
        {["j.hendricks@mailbox.com", "priya.k@workmail.io", "trentonwrites@proton.me", "a.nakamura@studio.dev"].map((e) => (
          <div key={e} className="flex items-center justify-between py-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <span style={{ ...sans, color: COLORS.inkSoft }} className="text-[13.5px]">{e}</span>
            <span style={{ ...sans, color: COLORS.muted }} className="text-[12px]">Active</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${COLORS.border}` }} />
      </div>
    </AdminShell>
  );
}

function AdminIssuesList({ onNav }) {
  return (
    <AdminShell page="admin-issues" onNav={onNav}>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ ...serif, color: COLORS.ink }} className="text-[28px]">Issues</h1>
        <button onClick={() => onNav("admin-editor")} style={{ ...sans, background: COLORS.ink, color: COLORS.paper }} className="text-[13px] px-4 py-2.5 flex items-center gap-2">
          <Plus size={14} /> Create issue
        </button>
      </div>
      {ISSUES.map((issue) => (
        <div key={issue.slug} className="flex items-center justify-between py-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <div className="flex items-center gap-4">
            <span style={{ ...serif, color: COLORS.accent }} className="text-[20px]">#{issue.number}</span>
            <div>
              <div style={{ ...sans, color: COLORS.ink }} className="text-[14px]">{issue.date}</div>
              <div style={{ ...sans, color: COLORS.muted }} className="text-[12.5px] max-w-[50ch]">{issue.dek}</div>
            </div>
          </div>
          <span style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Published</span>
        </div>
      ))}
      <div style={{ borderTop: `1px solid ${COLORS.border}` }} />
    </AdminShell>
  );
}

function AdminStoriesList({ onNav }) {
  return (
    <AdminShell page="admin-stories" onNav={onNav}>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ ...serif, color: COLORS.ink }} className="text-[28px]">Stories</h1>
        <button onClick={() => onNav("admin-story-editor")} style={{ ...sans, background: COLORS.ink, color: COLORS.paper }} className="text-[13px] px-4 py-2.5 flex items-center gap-2">
          <Plus size={14} /> New story
        </button>
      </div>
      {STORIES.map((s) => (
        <div key={s.slug} className="flex items-center justify-between py-3.5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <div>
            <div style={{ ...sans, color: COLORS.accent }} className="text-[10.5px] uppercase tracking-[0.1em] mb-1">{s.category}</div>
            <div style={{ ...serif, color: COLORS.ink }} className="text-[15px]">{s.title}</div>
          </div>
          <span style={{ ...sans, color: COLORS.muted }} className="text-[12px]">Published</span>
        </div>
      ))}
      <div style={{ borderTop: `1px solid ${COLORS.border}` }} />
    </AdminShell>
  );
}

function AdminStoryEditor({ onNav }) {
  const defaultDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [form, setForm] = useState({
    title: "",
    category: "Programming",
    dek: "",
    summary: "",
    author: "Editorial Desk",
    date: defaultDate,
    readTime: "5 min read",
    source: "Original reporting",
    paragraphs: "",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getArtType = (category) => {
    const lower = category.toLowerCase();
    if (lower.includes("ai")) return "ai";
    if (lower.includes("startup")) return "startups";
    if (lower.includes("program")) return "programming";
    if (lower.includes("science")) return "science";
    if (lower.includes("internet")) return "internet";
    if (lower.includes("design")) return "design";
    if (lower.includes("security")) return "security";
    if (lower.includes("creator")) return "creators";
    if (lower.includes("business")) return "business";
    return "programming";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) return;

    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `story-${Date.now()}`;

    const paragraphs = form.paragraphs
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const nextStory = {
      slug,
      category: form.category,
      title,
      dek: form.dek.trim(),
      summary: form.summary.trim(),
      author: form.author.trim(),
      date: form.date,
      readTime: form.readTime.trim(),
      source: form.source.trim(),
      art: getArtType(form.category),
      paragraphs,
    };

    const nextStories = [nextStory, ...STORIES];
    saveStoriesToStorage(nextStories);
    onNav("admin-stories");
  };

  return (
    <AdminShell page="admin-stories" onNav={onNav}>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ ...serif, color: COLORS.ink }} className="text-[28px]">Write a new story</h1>
        <button onClick={() => onNav("admin-stories")} style={{ ...sans, border: `1px solid ${COLORS.border}`, color: COLORS.inkSoft }} className="text-[13px] px-4 py-2.5">
          Back to stories
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Title</label>
            <input value={form.title} onChange={(e) => updateField("title", e.target.value)} style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" />
          </div>
          <div>
            <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Category</label>
            <select value={form.category} onChange={(e) => updateField("category", e.target.value)} style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Deck</label>
          <input value={form.dek} onChange={(e) => updateField("dek", e.target.value)} style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" />
        </div>

        <div>
          <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Summary</label>
          <textarea value={form.summary} onChange={(e) => updateField("summary", e.target.value)} rows="3" style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Author</label>
            <input value={form.author} onChange={(e) => updateField("author", e.target.value)} style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" />
          </div>
          <div>
            <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Date</label>
            <input value={form.date} onChange={(e) => updateField("date", e.target.value)} style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" />
          </div>
          <div>
            <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Read time</label>
            <input value={form.readTime} onChange={(e) => updateField("readTime", e.target.value)} style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Source</label>
            <input value={form.source} onChange={(e) => updateField("source", e.target.value)} style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" />
          </div>
        </div>

        <div>
          <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Body paragraphs</label>
          <textarea value={form.paragraphs} onChange={(e) => updateField("paragraphs", e.target.value)} rows="10" style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" placeholder="Write one paragraph per block, separated by a blank line." />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => onNav("admin-stories")} style={{ ...sans, border: `1px solid ${COLORS.border}`, color: COLORS.inkSoft }} className="text-[13px] px-4 py-2.5">
            Cancel
          </button>
          <button type="submit" style={{ ...sans, background: COLORS.accent, color: COLORS.paper }} className="text-[13px] px-4 py-2.5">
            Publish story
          </button>
        </div>
      </form>
    </AdminShell>
  );
}

function AdminSubscribers({ onNav }) {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });

  useEffect(() => {
    const loadSubscribers = async () => {
      try {
        const response = await fetch("/api/subscribers");
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || "Failed to load subscribers.");
        }

        setRows(data.subscribers || []);
        setStats(data.stats || { total: 0, active: 0, pending: 0 });
      } catch (error) {
        console.error(error);
      }
    };

    loadSubscribers();
  }, []);

  return (
    <AdminShell page="admin-subscribers" onNav={onNav}>
      <h1 style={{ ...serif, color: COLORS.ink }} className="text-[28px] mb-8">Subscribers</h1>
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg">
        <StatCard label="Total" value={stats.total.toLocaleString()} />
        <StatCard label="Active" value={stats.active.toLocaleString()} />
        <StatCard label="Pending" value={stats.pending.toLocaleString()} />
      </div>
      <table className="w-full" style={sans}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${COLORS.ink}` }}>
            {['Email', 'Status', 'Subscribed'].map((h) => (
              <th key={h} style={{ color: COLORS.muted }} className="text-left text-[11px] uppercase tracking-[0.08em] pb-2 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.email} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <td style={{ color: COLORS.ink }} className="text-[13.5px] py-3">{r.email}</td>
              <td style={{ color: r.status === 'Active' ? COLORS.accent : COLORS.muted }} className="text-[13px] py-3">{r.status}</td>
              <td style={{ color: COLORS.muted }} className="text-[13px] py-3">{new Date(r.subscribedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}

function AdminSettings({ onNav }) {
  return (
    <AdminShell page="admin-settings" onNav={onNav}>
      <h1 style={{ ...serif, color: COLORS.ink }} className="text-[28px] mb-8">Settings</h1>
      <div className="max-w-md flex flex-col gap-6">
        <div>
          <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Publication name</label>
          <input defaultValue="The Daily Byte" style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" />
        </div>
        <div>
          <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Send time</label>
          <input defaultValue="7:00 AM" style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" />
        </div>
        <div>
          <label style={{ ...sans, color: COLORS.muted }} className="text-[12px] uppercase tracking-[0.08em]">Reply-to address</label>
          <input defaultValue="editor@dailybyte.co" style={{ ...sans, border: `1px solid ${COLORS.border}` }} className="w-full mt-2 px-3 py-2.5 text-[14px] bg-transparent" />
        </div>
        <button style={{ ...sans, background: COLORS.ink, color: COLORS.paper }} className="text-[13px] px-4 py-2.5 self-start">Save changes</button>
      </div>
    </AdminShell>
  );
}

/* --- newsletter block editor --- */
const BLOCK_TYPES = [
  "Hero Story", "Story", "Two Stories", "Three Stories", "Quote",
  "Section Header", "Divider", "Image", "Text", "Newsletter CTA", "Related Stories",
];

function AdminIssueEditor({ onNav }) {
  const [blocks, setBlocks] = useState([
    { id: 1, type: "Hero Story", detail: "ai-quietly-changing-software" },
    { id: 2, type: "Section Header", detail: "Artificial Intelligence" },
    { id: 3, type: "Two Stories", detail: "machines-learn-to-reason, return-of-boring-software" },
    { id: 4, type: "Newsletter CTA", detail: "Subscribe block" },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [published, setPublished] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState("");

  const addBlock = (type) => {
    setBlocks((b) => [...b, { id: Date.now(), type, detail: "Untitled block" }]);
    setShowPicker(false);
  };
  const remove = (id) => setBlocks((b) => b.filter((x) => x.id !== id));
  const duplicate = (id) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const copy = { ...blocks[idx], id: Date.now() };
    setBlocks((b) => [...b.slice(0, idx + 1), copy, ...b.slice(idx + 1)]);
  };
  const move = (id, dir) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const swap = idx + dir;
    if (swap < 0 || swap >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setBlocks(next);
  };

  const handlePublish = async () => {
    setSending(true);
    setSendError("");
    setSendSuccess("");

    try {
      const response = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Daily Byte Issue #043",
          preview: "AI is quietly changing software work, startups are going lean, and boring tech is back.",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to send the newsletter.");
      }

      const recipientText = data.recipients?.length ? data.recipients.length : 0;
      setSendSuccess(
        data.demoMode
          ? `Demo newsletter queued for ${recipientText} recipient${recipientText === 1 ? '' : 's'}.`
          : `Newsletter sent to ${recipientText} recipient${recipientText === 1 ? '' : 's'}.`,
      );
      setConfirming(false);
      setPublished(true);
    } catch (error) {
      setSendError(error.message || "Failed to send the newsletter.");
    } finally {
      setSending(false);
    }
  };

  if (published) {
    return (
      <AdminShell page="admin-issues" onNav={onNav}>
        <div className="max-w-md py-16 text-center mx-auto">
          <div className="mx-auto mb-6 w-12 h-12 flex items-center justify-center" style={{ border: `1px solid ${COLORS.ink}` }}>
            <Check size={20} style={{ color: COLORS.accent }} />
          </div>
          <h1 style={{ ...serif, color: COLORS.ink }} className="text-[26px]">Issue #043 published</h1>
          <p style={{ ...sans, color: COLORS.inkSoft }} className="text-[14px] mt-3 leading-relaxed">
            The newsletter has been queued for delivery to 12,482 active subscribers via Resend.
          </p>
          <button onClick={() => onNav("admin-issues")} style={{ ...sans, border: `1px solid ${COLORS.ink}` }} className="mt-8 px-5 py-2.5 text-[13px]">
            Back to issues
          </button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell page="admin-issues" onNav={onNav}>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <div>
          <div style={{ ...sans, color: COLORS.muted }} className="text-[11px] uppercase tracking-[0.08em]">Draft</div>
          <h1 style={{ ...serif, color: COLORS.ink }} className="text-[28px]">Issue #043</h1>
        </div>
        <div className="flex items-center gap-2">
          <button style={{ ...sans, border: `1px solid ${COLORS.border}`, color: COLORS.inkSoft }} className="text-[13px] px-4 py-2.5 flex items-center gap-2">
            <Eye size={14} /> Preview
          </button>
          <button onClick={() => setConfirming(true)} style={{ ...sans, background: COLORS.accent, color: COLORS.paper }} className="text-[13px] px-4 py-2.5">
            Publish &amp; send
          </button>
        </div>
      </div>
      <p style={{ ...sans, color: COLORS.muted }} className="text-[13px] mb-8">Build this edition from blocks, then publish when ready.</p>

      <div className="max-w-2xl">
        {blocks.map((b, i) => (
          <div key={b.id} style={{ border: `1px solid ${COLORS.border}` }} className="flex items-center justify-between px-4 py-3.5 mb-3">
            <div>
              <div style={{ ...sans, color: COLORS.accent }} className="text-[10.5px] uppercase tracking-[0.08em] font-semibold">{b.type}</div>
              <div style={{ ...sans, color: COLORS.inkSoft }} className="text-[13px] mt-0.5">{b.detail}</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => move(b.id, -1)} disabled={i === 0} style={{ color: i === 0 ? COLORS.border : COLORS.inkSoft }} className="p-1.5"><ChevronUp size={15} /></button>
              <button onClick={() => move(b.id, 1)} disabled={i === blocks.length - 1} style={{ color: i === blocks.length - 1 ? COLORS.border : COLORS.inkSoft }} className="p-1.5"><ChevronDown size={15} /></button>
              <button onClick={() => duplicate(b.id)} style={{ color: COLORS.inkSoft }} className="p-1.5"><CopyIcon size={15} /></button>
              <button onClick={() => remove(b.id)} style={{ color: COLORS.accent }} className="p-1.5"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}

        <div className="relative mt-4">
          <button
            onClick={() => setShowPicker(!showPicker)}
            style={{ ...sans, border: `1px dashed ${COLORS.borderStrong}`, color: COLORS.inkSoft }}
            className="w-full py-3.5 text-[13px] flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add block
          </button>
          {showPicker && (
            <div style={{ border: `1px solid ${COLORS.border}`, background: COLORS.paper }} className="absolute z-10 left-0 right-0 mt-1 max-h-64 overflow-y-auto">
              {BLOCK_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => addBlock(t)}
                  style={{ ...sans, color: COLORS.ink, borderBottom: `1px solid ${COLORS.border}` }}
                  className="w-full text-left px-4 py-2.5 text-[13.5px] hover:bg-black/5"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-5" style={{ background: "rgba(20,18,16,0.5)" }}>
          <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.border}` }} className="max-w-sm w-full p-6">
            <h3 style={{ ...serif, color: COLORS.ink }} className="text-[20px] mb-2">Publish Issue #043?</h3>
            <p style={{ ...sans, color: COLORS.inkSoft }} className="text-[14px] leading-relaxed mb-6">
              This will send the newsletter to 12,482 active subscribers. This cannot be undone.
            </p>
            {sendError && (
              <p style={{ ...sans, color: COLORS.accent }} className="text-[12px] mb-4">
                {sendError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirming(false)} style={{ ...sans, color: COLORS.inkSoft }} className="text-[13px] px-4 py-2">Cancel</button>
              <button
                onClick={handlePublish}
                disabled={sending}
                style={{ ...sans, background: COLORS.accent, color: COLORS.paper, opacity: sending ? 0.7 : 1 }}
                className="text-[13px] px-4 py-2"
              >
                {sending ? "Sending..." : "Publish & send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

/* ============================================================
   APP SHELL / ROUTER
   ============================================================ */
export default function App() {
  const [route, setRoute] = useState({ name: "home", param: null });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState(null);

  const nav = (name, param = null) => {
    window.scrollTo?.(0, 0);
    setRoute({ name, param });
    setMobileOpen(false);
  };
  const openStory = (slug) => nav("story", slug);
  const openIssue = (slug) => nav("issue", slug);

  const handleSubscribed = (email) => {
    setSubscribedEmail(email);
    nav("subscribed");
  };

  const isAdmin = route.name.startsWith("admin");

  let page;
  switch (route.name) {
    case "home":
      page = <HomePage stories={STORIES} onOpenStory={openStory} onNav={nav} onSubscribed={handleSubscribed} />;
      break;
    case "category":
      page = <CategoryPage stories={STORIES} category={route.param} onOpenStory={openStory} onNav={nav} />;
      break;
    case "story":
      page = <StoryPage stories={STORIES} slug={route.param} onOpenStory={openStory} onNav={nav} />;
      break;
    case "issues":
      page = <IssuesPage onOpenIssue={openIssue} onNav={nav} />;
      break;
    case "issue":
      page = <IssueReaderPage stories={STORIES} slug={route.param} onOpenStory={openStory} onNav={nav} />;
      break;
    case "search":
      page = <SearchPage stories={STORIES} onOpenStory={openStory} onNav={nav} />;
      break;
    case "subscribed":
      page = <SubscribeSuccess email={subscribedEmail} onDone={() => nav("home")} />;
      break;
    case "admin":
      page = <AdminDashboard onNav={nav} />;
      break;
    case "admin-issues":
      page = <AdminIssuesList onNav={nav} />;
      break;
    case "admin-stories":
      page = <AdminStoriesList onNav={nav} />;
      break;
    case "admin-story-editor":
      page = <AdminStoryEditor onNav={nav} />;
      break;
    case "admin-subscribers":
      page = <AdminSubscribers onNav={nav} />;
      break;
    case "admin-settings":
      page = <AdminSettings onNav={nav} />;
      break;
    case "admin-editor":
      page = <AdminIssueEditor onNav={nav} />;
      break;
    default:
      page = <HomePage stories={STORIES} onOpenStory={openStory} onNav={nav} onSubscribed={handleSubscribed} />;
  }

  return (
    <div style={{ background: COLORS.paper, minHeight: "100vh" }}>
      <style>{FONT_IMPORT}</style>
      {!isAdmin && (
        <Masthead
          onNav={nav}
          onSearch={() => nav("search")}
          onSubscribe={() => nav("home")}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      )}
      {page}
      {!isAdmin && route.name !== "subscribed" && <Footer onNav={nav} />}
    </div>
  );
}
