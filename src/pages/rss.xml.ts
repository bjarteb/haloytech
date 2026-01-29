import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const posts = await getCollection('blog');
	const publishedPosts = posts
		.filter(post => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: 'haloy.tech - Developer Tips & Tricks',
		description: 'Practical solutions for developers',
		site: context.site || 'https://haloy.tech',
		items: publishedPosts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.slug}/`,
			categories: post.data.tags,
		})),
		customData: '<language>en-us</language>',
	});
}
