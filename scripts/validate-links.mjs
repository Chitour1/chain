import fs from 'node:fs';

const raw = fs.readFileSync('index.html', 'utf8');
const html = raw.replace(/<script[\s\S]*?<\/script>/g, '');
const matches = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
const allowed = ['/', '/forum', '/social', '/news', '/tags', '/a21', '/a22', '/a23', '/a24', '/a25', '/search', '/a28', '/auth?return=%2F'];
const patterns = [/^\/auth\?return=.+/, /^\/forum\/t\/.+/, /^\/social\/p\/.+/, /^\/news\/a\/.+/];
const errors = [];
for (const href of matches) {
  if (href.includes('#') || href.includes('javascript:void')) errors.push(`Forbidden placeholder: ${href}`);
  if (!href.startsWith('/')) errors.push(`Internal href must start with /: ${href}`);
  const ok = allowed.includes(href) || patterns.some((p) => p.test(href));
  if (!ok) errors.push(`Href outside contract: ${href}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('Link contract validation passed');
