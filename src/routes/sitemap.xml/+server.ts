import type { RequestHandler } from "./$types";
import { siteConfig } from "$lib/config";

export const GET: RequestHandler = async () => {
	const pages = ["", "mulai", "kontak", "ketentuan", "privasi"];
	const baseUrl = siteConfig.url;

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map((page) => {
		const loc = page ? `${baseUrl}/${page}` : baseUrl;
		return `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : page === "mulai" ? "0.9" : "0.5"}</priority>
  </url>`;
	})
	.join("\n")}
</urlset>`.trim();

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "max-age=0, s-maxage=3600"
		}
	});
};
