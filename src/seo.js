// Shared SEO data: used by the React app (client-side meta updates)
// and by scripts/prerender.mjs (static per-page HTML for search engines).

export const SITE_URL = 'https://www.radiancechessacademy.com';
export const SITE_NAME = 'Radiance Chess Academy';
export const OG_IMAGE = 'https://res.cloudinary.com/dknf3a0pt/image/upload/v1761023563/icon2_ypdhlx.png';

// One entry per public page. `file` is the static HTML file generated at build time.
export const PAGE_META = {
    home: {
        path: '/',
        file: 'index.html',
        title: 'Radiance Chess Academy | Online Chess Classes for Kids (5-16)',
        description: 'Join Radiance Chess Academy for fun and interactive online chess classes. Our FIDE-rated coaches help kids aged 5-16 master the game. Book a free trial class today!',
    },
    'book-free-trial': {
        path: '/book-free-trial',
        file: 'book-free-trial.html',
        title: 'Book a FREE Chess Trial Class for Kids | Radiance Chess Academy',
        description: 'Book a free, no-obligation 1-on-1 online chess trial class with a senior FIDE-rated coach. Get a performance assessment for your child (ages 5-16) and pick a time that suits you.',
    },
    services: {
        path: '/services',
        file: 'services.html',
        title: 'Chess Classes & Services for Kids | Radiance Chess Academy',
        description: 'Live online chess classes for kids aged 5-16: two 45-minute classes a week in small groups of 3-5, weekend practice, progress reports and a 6-level path from Beginner to Advanced.',
    },
    faq: {
        path: '/faq',
        file: 'faq.html',
        title: 'Chess Classes FAQ for Parents | Radiance Chess Academy',
        description: 'Answers to common questions about Radiance Chess Academy online chess classes: the right age to start, tournament preparation, batch timings and the free trial class.',
    },
    blog: {
        path: '/blog',
        file: 'blog.html',
        title: 'Smart Kids of the Month | Radiance Chess Academy Blog',
        description: 'Meet our Smart Kids of the Month: stories, progress and parent feedback from young chess players learning online at Radiance Chess Academy.',
    },
    hiring: {
        path: '/hiring',
        file: 'hiring.html',
        title: 'Chess Coach Jobs - Join Our Team | Radiance Chess Academy',
        description: 'Passionate about chess coaching? Apply to teach kids online with Radiance Chess Academy and help the next generation of chess champions grow.',
    },
    contact: {
        path: '/contact',
        file: 'contact.html',
        title: 'Contact Us | Radiance Chess Academy (USA & India)',
        description: 'Get in touch with Radiance Chess Academy. Offices in Chicago, USA and Chennai, India. Call, email or message us on WhatsApp about online chess classes for kids.',
    },
    terms: {
        path: '/terms',
        file: 'terms.html',
        title: 'Terms and Policies | Radiance Chess Academy',
        description: 'Terms, policies and conditions for using Radiance Chess Academy online chess classes.',
    },
    admin: {
        path: '/admin',
        title: 'Admin | Radiance Chess Academy',
        description: '',
        noindex: true,
    },
};

export const FAQS = [
    {
        q: 'What is the right age for a child to start learning chess?',
        a: "The ideal age to start learning chess is typically between 5 and 7 years old. However, we have programs tailored for children up to 16 years. It's never too late to start!",
    },
    {
        q: 'How does the free trial class work?',
        a: 'Fill in a short form and pick a convenient time slot. The 30-minute trial is a 1-on-1 online session with a senior coach, who assesses your child\'s strengths and weaknesses and shares a performance assessment with you.',
    },
    {
        q: 'Are the classes held online?',
        a: 'Yes. All classes are live and online, so your child can learn from anywhere. We teach students from over 30 countries.',
    },
    {
        q: 'Do you prepare students for rated tournaments?',
        a: 'Yes, absolutely. Our advanced curriculum is specifically designed to prepare students for FIDE-rated tournaments. We provide specialized training, opening preparation, and tournament strategy sessions.',
    },
    {
        q: 'Can we change our batch timings after enrollment?',
        a: 'We offer flexibility to change batches based on availability. Please contact our support team, and they will do their best to find a suitable slot that works for your new schedule.',
    },
];

export const faqJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
    })),
});

export const breadcrumbJsonLd = (pageKey) => {
    const meta = PAGE_META[pageKey];
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: meta.title.split('|')[0].trim(), item: `${SITE_URL}${meta.path}` },
        ],
    };
};
