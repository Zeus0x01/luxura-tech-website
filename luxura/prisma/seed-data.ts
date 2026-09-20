// Initial content for a fresh database. Everything here is editable from the
// admin dashboard afterwards. Nothing below states a client, award, statistic,
// certification, partnership, or result — only what the company has supplied.

export const industries = [
  {
    name: "Automotive & Mobility",
    slug: "automotive-mobility",
    icon: "Car",
    image: "/images/showroom.jpg",
    description:
      "Consulting and technology support for organizations in the automotive value chain and the wider mobility landscape, from vehicle-related businesses to new approaches to how people and goods move.",
    seoDescription: "Consulting and technology support for automotive and mobility organizations from Luxura Tech USA LLC.",
  },
  {
    name: "Transportation",
    slug: "transportation",
    icon: "Truck",
    image: "/images/freeway.jpg",
    description:
      "Operational efficiency, fleet management, and data-driven planning for transportation and logistics-minded businesses that depend on vehicles, routes, and reliable execution.",
    seoDescription: "Fleet management and operational efficiency for transportation businesses from Luxura Tech USA LLC.",
  },
  {
    name: "Technology",
    slug: "technology",
    icon: "Cpu",
    image: "/images/data-wall.jpg",
    description:
      "Strategy, positioning, and go-to-market support for technology-driven companies, alongside practical help adopting AI, analytics, and automation inside their own operations.",
    seoDescription: "Strategy and marketing support for technology companies from Luxura Tech USA LLC.",
  },
  {
    name: "Business Services",
    slug: "business-services",
    icon: "Building2",
    image: "/images/office.jpg",
    description:
      "Performance optimization, business development, and growth planning for professional and business service firms looking to sharpen how they operate and how they are perceived in the market.",
    seoDescription: "Business development and performance optimization for service firms from Luxura Tech USA LLC.",
  },
  {
    name: "Consumer & Commercial Businesses",
    slug: "consumer-commercial",
    icon: "Store",
    image: "/images/workspace.jpg",
    description:
      "Brand strategy, marketing, and operational improvement for businesses that serve consumers or commercial customers and want to strengthen their position in competitive markets.",
    seoDescription: "Brand, marketing, and growth strategy for consumer and commercial businesses from Luxura Tech USA LLC.",
  },
] as const;

export const services = [
  {
    title: "Technology Solutions",
    slug: "technology-solutions",
    icon: "Cpu",
    coverImage: "/images/data-wall.jpg",
    shortDescription:
      "AI integration, analytics, digital transformation, technology strategy, automation, and data-driven solutions.",
    description:
      "Technology should make an organization faster, clearer, and more resilient. We help you decide where AI, analytics, and automation genuinely fit, and how to introduce them without disrupting the business.\n\nOur approach starts with your processes and your data. From there we shape a technology strategy that is realistic for your team, your budget, and your timeline, and support you as it moves from plan to practice.",
    capabilities: [
      "AI Integration",
      "Data & Analytics",
      "Digital Transformation",
      "Technology Strategy",
      "Process Automation",
      "Digital Solutions",
    ],
    businessValue:
      "Clearer decisions from better use of data, less manual effort through automation, and a technology roadmap that connects directly to business goals rather than to trends.",
    industries: ["automotive-mobility", "technology", "business-services", "consumer-commercial"],
    seoTitle: "Technology Solutions",
    seoDescription:
      "AI integration, data and analytics, digital transformation, and process automation from Luxura Tech USA LLC.",
  },
  {
    title: "Automotive & Transportation",
    slug: "automotive-transportation",
    icon: "Car",
    coverImage: "/images/car-detail.jpg",
    shortDescription:
      "Automotive consulting, fleet management, operational efficiency, mobility strategy, and transportation solutions.",
    description:
      "Vehicles, fleets, and mobility services generate enormous operational detail. We help organizations turn that detail into better planning, lower friction, and more dependable performance.\n\nWhether you operate a fleet, work within the automotive sector, or are shaping a mobility offering, we combine automotive knowledge with technology and business strategy so recommendations hold up in real operations.",
    capabilities: [
      "Automotive Consulting",
      "Fleet Management",
      "Operational Efficiency",
      "Mobility Strategy",
      "Transportation Solutions",
      "Fleet Technology",
      "Data-driven Operations",
    ],
    businessValue:
      "More efficient operations, better visibility into how vehicles and routes are used, and a mobility strategy grounded in how your business actually runs.",
    industries: ["automotive-mobility", "transportation", "consumer-commercial"],
    seoTitle: "Automotive & Transportation Consulting",
    seoDescription:
      "Automotive consulting, fleet management, mobility strategy, and transportation solutions from Luxura Tech USA LLC.",
  },
  {
    title: "Business Consulting & Strategy",
    slug: "business-consulting",
    icon: "Briefcase",
    coverImage: "/images/office.jpg",
    shortDescription:
      "Global market insights, strategic planning, performance optimization, business development, and growth strategy.",
    description:
      "Good strategy is specific to the organization that has to carry it out. We work with leadership teams to understand the market, define priorities, and build plans that people can execute.\n\nOur perspective is international and cross-industry, which helps us spot options and risks that are easy to miss from inside a single sector.",
    capabilities: [
      "Business Strategy",
      "Market Insights",
      "Performance Optimization",
      "Business Development",
      "Growth Strategy",
      "Operational Improvement",
    ],
    businessValue:
      "A shared view of where to focus, plans tied to measurable objectives, and a clearer path to sustainable growth and improved performance.",
    industries: ["business-services", "technology", "transportation", "consumer-commercial"],
    seoTitle: "Business Consulting & Strategy",
    seoDescription:
      "Market insights, strategic planning, performance optimization, and growth strategy from Luxura Tech USA LLC.",
  },
  {
    title: "Advertising, Publicity & Marketing",
    slug: "advertising-marketing",
    icon: "Megaphone",
    coverImage: "/images/workspace.jpg",
    shortDescription:
      "Brand strategy, advertising, publicity, digital marketing, campaign planning, audience engagement, and market positioning.",
    description:
      "Marketing works when the message, the audience, and the channel line up. We help organizations define how they want to be seen, then plan campaigns that reach the right people in the right way.\n\nBecause we also work in technology, mobility, and strategy, our marketing recommendations stay connected to what the business does and where it wants to go.",
    capabilities: [
      "Brand Strategy",
      "Digital Marketing",
      "Advertising",
      "Publicity",
      "Campaign Strategy",
      "Audience Engagement",
      "Market Positioning",
    ],
    businessValue:
      "A clearer market position, more coherent communication across channels, and campaigns designed around your audience and your objectives.",
    industries: ["automotive-mobility", "technology", "business-services", "consumer-commercial"],
    seoTitle: "Advertising, Publicity & Marketing",
    seoDescription:
      "Brand strategy, advertising, publicity, digital marketing, and campaign planning from Luxura Tech USA LLC.",
  },
] as const;

export const homepage = {
  HERO: {
    title: "Technology, Automotive & Business Solutions for a Changing World",
    subtitle:
      "Luxura Tech USA LLC combines technology, automotive expertise, business strategy, and marketing to help organizations improve performance, adapt to change, and grow in competitive markets.",
    image: "/images/highway.jpg",
    primaryCtaLabel: "Request a Consultation",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "Explore Our Services",
    secondaryCtaHref: "/services",
  },
  ABOUT: {
    title: "One practice for technology, mobility, strategy, and marketing.",
    subtitle: "A consulting firm that connects disciplines so your plans work together.",
    body:
      "At Luxura Tech USA LLC, we combine technology, automotive expertise, and business consulting to deliver innovative solutions for today's global market.\n\nWith over 25 years of international experience in management, consulting, and marketing, our CEO has built a company that reflects excellence, vision, and trust.",
    image: "/images/skyline.jpg",
    primaryCtaLabel: "About the firm",
    primaryCtaHref: "/about",
  },
  SERVICES: {
    title: "Core services",
    subtitle: "Four practice areas, planned to work as one.",
  },
  HOW_WE_HELP: {
    title: "How we help",
    subtitle: "A clear, practical path from first conversation to results you can build on.",
    items: [
      { title: "Understand", body: "We learn your organization, your market, and what you are trying to achieve before proposing anything." },
      { title: "Shape the strategy", body: "We turn what we learn into a tailored plan that fits your team, your resources, and your timeline." },
      { title: "Put it into practice", body: "We support execution across technology, operations, and marketing so the plan becomes real." },
      { title: "Refine and grow", body: "We review what is working, adjust, and keep your organization moving toward its goals." },
    ],
  },
  INDUSTRIES: {
    title: "Industries",
    subtitle: "Experience across sectors where technology, mobility, and commercial strategy meet.",
  },
  WHY_LUXURA: {
    title: "Why Luxura",
    subtitle: "An approach built on experience, breadth, and attention to your specific situation.",
    items: [
      { title: "25+ years of international leadership experience", body: "Our CEO brings more than two decades of international experience in management, consulting, and marketing." },
      { title: "A cross-industry perspective", body: "Working across sectors helps us see patterns and opportunities that a single-industry view can miss." },
      { title: "Technology and business expertise, together", body: "We connect technical possibilities with commercial realities so solutions serve the business." },
      { title: "Automotive knowledge", body: "Familiarity with the automotive and transportation world informs our mobility and fleet work." },
      { title: "Customized strategies", body: "Recommendations are shaped around your organization rather than pulled from a template." },
      { title: "Focus on efficiency and growth", body: "We aim for practical improvements in how you operate and a stronger position in your market." },
      { title: "An international market perspective", body: "We read markets with a global outlook, which matters as competition and customers cross borders." },
    ],
  },
  FINAL_CTA: {
    title: "Ready to talk about what's next?",
    subtitle: "Tell us about your goals and we will help you find a sensible way forward.",
    image: "/images/skyline.jpg",
    primaryCtaLabel: "Request a Consultation",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "Explore Our Services",
    secondaryCtaHref: "/services",
  },
} as const;

export const settings = {
  companyName: "Luxura Tech USA LLC",
  footerText: "Technology, automotive, and business solutions for today's global market.",
  defaultSeoTitle: "Luxura Tech USA LLC — Technology, Automotive & Business Solutions",
  defaultSeoDescription:
    "Luxura Tech USA LLC combines technology, automotive expertise, and business consulting to deliver innovative solutions for today's global market.",
} as const;

export const categories = [
  { name: "Technology", slug: "technology" },
  { name: "Automotive & Mobility", slug: "automotive-mobility" },
  { name: "Business Strategy", slug: "business-strategy" },
  { name: "Marketing", slug: "marketing" },
] as const;

// Sample articles are created as DRAFTS so nothing unreviewed goes live.
export const sampleArticles = [
  {
    title: "Where to start with AI in a growing business",
    slug: "where-to-start-with-ai",
    category: "technology",
    excerpt: "Adopting AI works best when it begins with a business problem, not a tool. A few questions to ask before you commit.",
    featuredImage: "/images/data-wall.jpg",
    content:
      "Many organizations feel pressure to adopt AI quickly. The teams that get value from it usually begin somewhere less exciting: with a clearly defined problem.\n\n## Start with a decision, not a tool\n\nAsk which recurring decision or task costs your team the most time or produces the most inconsistency. Good early candidates are repetitive, data-rich, and have a clear definition of a good result.\n\n## Check your data honestly\n\nAI is only as useful as the information behind it. Before choosing technology, review where your data lives, who owns it, and how reliable it is.\n\n## Keep people in the loop\n\nIntroduce new tools alongside the people who will use them. Involve them early, explain what the tool does and does not do, and agree how results will be reviewed.\n\n## Begin small and measure\n\nPick one contained use case, define what success looks like, and review it after a short period. What you learn will shape the next step far better than a large plan made in advance.",
    seoDescription: "Practical questions to ask before adopting AI in a growing business.",
  },
  {
    title: "Fleet efficiency starts with the data you already have",
    slug: "fleet-efficiency-starts-with-data",
    category: "automotive-mobility",
    excerpt: "Before investing in new systems, many fleet operators can find meaningful improvements in information they already collect.",
    featuredImage: "/images/freeway.jpg",
    content:
      "Fleet operations generate a steady stream of information: routes, fuel use, maintenance records, driver schedules. Much of it goes unused simply because it sits in different places.\n\n## Bring the basics together\n\nStart by listing what you already track and where it is stored. Even a simple shared view of maintenance history and vehicle utilization can reveal patterns.\n\n## Ask operational questions\n\nWhich vehicles are idle most often? Where do delays repeat? Which routes or schedules create avoidable cost? Specific questions lead to specific improvements.\n\n## Then consider technology\n\nOnce you know what you need to see, it is far easier to choose the right tools, and to avoid paying for capabilities you will not use.",
    seoDescription: "Practical ways fleet operators can improve efficiency using information they already collect.",
  },
] as const;
