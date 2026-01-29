// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	// Custom domain configuration
	site: 'https://haloy.tech',
	// Note: base is removed for custom domain - site serves from root
	integrations: [sitemap()],
	markdown: {
		shikiConfig: {
			theme: 'nord',
			wrap: true,
		},
	},
});
