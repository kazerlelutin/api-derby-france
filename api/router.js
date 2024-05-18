import validator from 'validator';
import clubs from './../data/clubs.json';
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
	},
};
