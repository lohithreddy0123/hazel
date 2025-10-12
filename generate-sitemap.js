const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const path = require('path');

// Create a sitemap stream
const smStream = new SitemapStream({
  hostname: 'https://bharatpetals.netlify.app',
});

// List of your URLs
const links = [
  { url: '/', changefreq: 'weekly', priority: 1.0, lastmod: new Date().toISOString() },
  { url: '/discover', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/login', changefreq: 'monthly', priority: 0.6, lastmod: new Date().toISOString() },
  { url: '/signup', changefreq: 'monthly', priority: 0.6, lastmod: new Date().toISOString() },
  { url: '/reset-password', changefreq: 'monthly', priority: 0.5, lastmod: new Date().toISOString() },
  { url: '/dashboard', changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() },
  { url: '/explore', changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() },
  { url: '/search', changefreq: 'weekly', priority: 0.6, lastmod: new Date().toISOString() },
  { url: '/TermsAndConditions', changefreq: 'yearly', priority: 0.3, lastmod: new Date().toISOString() }
];

// Write each URL into the stream
links.forEach(link => smStream.write(link));

// Close the stream and generate sitemap
smStream.end();

streamToPromise(smStream)
  .then(data => {
    fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), data.toString());
    console.log('✅ Sitemap successfully created for Bharat Petals!');
  })
  .catch(error => {
    console.error('❌ Error generating sitemap:', error);
  });
