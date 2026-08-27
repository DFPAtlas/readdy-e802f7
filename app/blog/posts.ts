export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'automation-without-the-chaos',
    title: 'Automation Without the Chaos: Where Independent Businesses Should Actually Start',
    excerpt:
      'Most businesses try to automate too much, too quickly, and end up with a tangle of disconnected tools. The smarter path is to start with the repetitive, high-volume tasks that quietly eat your team\u2019s time every week. We break down how to identify the right first automations, how to avoid the common pitfalls, and how to measure whether a workflow is genuinely saving you hours or just adding complexity.',
    category: 'Automation',
    date: '18 August 2026',
    readTime: '7 min read',
    author: 'Digital Footprint Team',
    authorRole: 'Product & Automation',
    featured: true,
  },
  {
    slug: 'client-portals-that-save-time',
    title: 'Client Portals That Actually Save You Time (Not Just Look Impressive)',
    excerpt:
      'A client portal is only valuable if it removes back-and-forth email and phone calls. The best portals give clients a single place to see project progress, approve work, raise questions, and access files without chasing your team. Here is what separates a portal that earns its keep from one that simply adds another login for everyone to manage.',
    category: 'Client Experience',
    date: '4 August 2026',
    readTime: '6 min read',
    author: 'Digital Footprint Team',
    authorRole: 'Product & Automation',
  },
  {
    slug: 'ai-in-small-business',
    title: 'AI in Small Business: Practical Uses That Are Not Hype',
    excerpt:
      'Beyond the headlines, AI has a handful of genuinely useful applications for independent UK businesses: drafting and summarising, triaging enquiries, and assisting with routine data tasks. We look at where AI earns a place in a real workflow today, where it still needs human oversight, and how to introduce it without exposing sensitive customer information.',
    category: 'AI & Innovation',
    date: '21 July 2026',
    readTime: '8 min read',
    author: 'Digital Footprint Team',
    authorRole: 'Product & Automation',
  },
  {
    slug: 'why-your-website-is-costing-you-leads',
    title: 'Why Your Website Is Quietly Costing You Leads',
    excerpt:
      'A website that loads slowly, hides its contact details, or makes visitors hunt for the next step will leak enquiries before they ever reach you. We walk through the most common conversion killers we see on small business sites, and the specific changes that tend to move the needle fastest.',
    category: 'Websites',
    date: '8 July 2026',
    readTime: '5 min read',
    author: 'Digital Footprint Team',
    authorRole: 'Product & Automation',
  },
  {
    slug: 'the-cdd-method',
    title: 'The CDD Method: Taking an Idea from Concept to a Live System',
    excerpt:
      'Conception, Development, and Deployment are the three stages we use to turn a loose idea into a working digital product. Each stage has its own focus, its own risks, and its own definition of done. Here is how the method keeps projects moving without losing sight of the outcome the business actually needs.',
    category: 'Our Method',
    date: '24 June 2026',
    readTime: '6 min read',
    author: 'Digital Footprint Team',
    authorRole: 'Product & Automation',
  },
  {
    slug: 'choosing-cloud-setup',
    title: 'Choosing the Right Cloud Setup for a Growing Business',
    excerpt:
      'Cloud infrastructure is not one-size-fits-all. The right choice depends on your traffic, your tolerance for downtime, your compliance obligations, and how much you can realistically manage yourself. We explain the trade-offs between managed platforms and more custom setups, and how to avoid overpaying for capacity you do not yet need.',
    category: 'Infrastructure',
    date: '10 June 2026',
    readTime: '7 min read',
    author: 'Digital Footprint Team',
    authorRole: 'Product & Automation',
  },
];