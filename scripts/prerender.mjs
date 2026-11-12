// Runs after `vite build`. Writes one HTML file per public page (dist/faq.html, ...)
// with that page's own <title>, description, canonical and social tags, so search
// engines and link previews (WhatsApp, Facebook) see the right info for each URL.
// Vercel serves /faq from faq.html because "cleanUrls" is on in vercel.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_META, SITE_URL, faqJsonLd, breadcrumbJsonLd } from '../src/seo.js';

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const template = readFileSync(resolve(distDir, 'index.html'), 'utf8');

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const replaceOnce = (html, regex, replacement, label, file) => {
    if (!regex.test(html)) throw new Error(`prerender: could not find ${label} in template (for ${file})`);
    return html.replace(regex, replacement);
};

const jsonLdTag = (data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`;

for (const [key, meta] of Object.entries(PAGE_META)) {
    if (!meta.file) continue;
    const url = `${SITE_URL}${meta.path}`;
    const title = escapeAttr(meta.title);
    const desc = escapeAttr(meta.description);
    let html = template;

    html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, 'title', meta.file);
    html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`, 'description', meta.file);
    html = replaceOnce(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, 'canonical', meta.file);
    html = replaceOnce(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`, 'og:title', meta.file);
    html = replaceOnce(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`, 'og:description', meta.file);
    html = replaceOnce(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`, 'og:url', meta.file);
    html = replaceOnce(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`, 'twitter:title', meta.file);
    html = replaceOnce(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`, 'twitter:description', meta.file);

    const pageJsonLd = [];
    if (key !== 'home') pageJsonLd.push(jsonLdTag(breadcrumbJsonLd(key)));
    // Google asks for repeated FAQ content to be marked up only once, so only on /faq.
    if (key === 'faq') pageJsonLd.push(jsonLdTag(faqJsonLd()));
    html = replaceOnce(html, /<!--PAGE_JSONLD-->/, pageJsonLd.join('\n    '), 'PAGE_JSONLD marker', meta.file);

    writeFileSync(resolve(distDir, meta.file), html);
    console.log(`prerender: wrote dist/${meta.file}`);
}
