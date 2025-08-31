// generate-sitemap.js
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";

const hostname = "https://www.streamlineflo.com";

const pages = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/about", changefreq: "monthly", priority: 0.8 },
  { url: "/services", changefreq: "monthly", priority: 0.8 },
  { url: "/contact", changefreq: "yearly", priority: 0.6 },
];

// Create sitemap stream
const sitemap = new SitemapStream({ hostname });

pages.forEach((page) => sitemap.write(page));
sitemap.end();

// Save to /public/sitemap.xml
streamToPromise(sitemap).then((sm) => {
  createWriteStream("./public/sitemap.xml").write(sm.toString());
  console.log("✅ Sitemap generated at /public/sitemap.xml");
});
