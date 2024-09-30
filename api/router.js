import validator from 'validator';
import clubs from './../data/clubs.json';
import rules from './../data/rules.json';
import glossary from './../data/glossary.json';
import { clubSearchClub } from './club/search';
import { clubById } from './club/by-id';
import { clubByName } from './club/by-name';
import { home } from './home';
import { rulesByChapter } from './rules/by-chapter';
import { rulesSearch } from './rules/search';
import { glossarySearch } from './glossary/search';

export default {
	async fetch(req) {
		const url = new URL(req.url);

		const lastPath = validator.unescape(decodeURIComponent(url.pathname.split('/').pop()));

		let response;

		if (url.pathname === '/') response = home();
		else if (url.pathname.startsWith('/clubs')) {
			const restUrl = url.pathname.replace('/clubs', '');
			if (restUrl.startsWith('/search')) response = await clubSearchClub(req, lastPath);
			else if (restUrl.startsWith('/id')) response = await clubById(req, lastPath);
			else if (restUrl.startsWith('/name')) response = await clubByName(lastPath);
			else
				response = new Response(
					JSON.stringify(
						clubs.sort((a, b) => {
							const aTitle = a.titre || a.titre_court;
							const bTitle = b.titre || b.titre_court;
							return aTitle.localeCompare(bTitle);
						})
					)
				);
		} else if (url.pathname.startsWith('/rules')) {
			const restUrl = url.pathname.replace('/rules', '');
			if (restUrl.startsWith('/search')) response = rulesSearch(req, lastPath);
			else if (restUrl.startsWith('/chapter')) response = rulesByChapter(req, lastPath);
			else response = new Response(JSON.stringify(rules));
		} else if (url.pathname.startsWith('/glossary')) {
			const restUrl = url.pathname.replace('/glossary', '');
			if (restUrl.startsWith('/search')) response = await glossarySearch(req, lastPath);
			else response = new Response(JSON.stringify(glossary));
		} else {
			response = new Response('Not found', { status: 404 });
		}

		// Apply CORS headers
		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
		response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight options for 1 day

		return response;
	},
};
