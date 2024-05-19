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

		if (url.pathname === '/') return home();

		if (url.pathname.startsWith('/clubs')) {
			const restUrl = url.pathname.replace('/clubs', '');
			if (restUrl.startsWith('/search')) return await clubSearchClub(req, lastPath);
			if (restUrl.startsWith('/id')) return await clubById(req, lastPath);
			if (restUrl.startsWith('/name')) return await clubByName(lastPath);

			return new Response(JSON.stringify(clubs));
		}

		if (url.pathname.startsWith('/rules')) {
			const restUrl = url.pathname.replace('/rules', '');

			if (restUrl.startsWith('/search')) return rulesSearch(req, lastPath);
			if (restUrl.startsWith('/chapter')) return rulesByChapter(req, lastPath);

			return new Response(JSON.stringify(rules));
		}

		if (url.pathname.startsWith('/glossary')) {
			const restUrl = url.pathname.replace('/glossary', '');

			if (restUrl.startsWith('/search')) return await glossarySearch(req, lastPath);
			return new Response(JSON.stringify(glossary));
		}
		return new Response('Not found', { status: 404 });
	},
};
