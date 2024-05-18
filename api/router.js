import validator from 'validator';
import clubs from './../data/clubs.json';
import rules from './../data/rules.json';
import glossary from './../data/glossary.json';
import { byId } from './by-id.js';
import { searchClub } from './search.js';
import { home } from './index.js';

export default {
	async fetch(req) {
		const url = new URL(req.url);

		const lastPath = validator.unescape(decodeURIComponent(url.pathname.split('/').pop()));

		if (url.pathname === '/') return home();

		if (url.pathname.startsWith('/clubs')) {
			const restUrl = url.pathname.replace('/clubs', '');
			if (restUrl.startsWith('/search')) return await searchClub(req, lastPath);
			if (restUrl.startsWith('/id')) return await byId(req, lastPath);

			return new Response(JSON.stringify(clubs));
		}

		if (url.pathname.startsWith('/rules')) {
			const restUrl = url.pathname.replace('/rules', '');

			// if (restUrl.startsWith('/search')) return await searchClub(req, lastPath);
			// if (restUrl.startsWith('/chapter')) return await byId(req, lastPath);

			return new Response(JSON.stringify(rules));
		}

		if (url.pathname.startsWith('/glossary')) {
			const restUrl = url.pathname.replace('/glossary', '');

			// if (restUrl.startsWith('/search')) return await searchClub(req, lastPath);
			// if (restUrl.startsWith('/chapter')) return await byId(req, lastPath);

			return new Response(JSON.stringify(glossary));
		}
		return new Response('Not found', { status: 404 });
	},
};
