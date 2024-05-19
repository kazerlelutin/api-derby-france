import rules from '../../data/rules.json';
import { distance } from 'fastest-levenshtein';

// TODO traiter les ●
export function rulesSearch(_req, search) {
	return new Response(
		JSON.stringify(
			rules.filter((rule) => {
				if (rule.description.includes(search)) return true;
				if (search.length < 4) return false;
				const splitSearch = search.split(' ');

				let distanceValues = [];

				const words = rule.description
					.toLowerCase()
					.replace(/[^a-zA-Z0-9\s]/g, ' ')
					.split(' ')
					.filter((word) => word.length > 4);

				words.forEach((word) => {
					splitSearch.forEach((s) => {
						const dist = distance(s, word);
						if (dist < 2) distanceValues.push(dist);
					});
				});

				// moyenne des distances
				const averageDistance = distanceValues.reduce((acc, cur) => acc + cur, 0) / distanceValues.length;
				if (averageDistance < 2) return true;
				return false;
			})
		)
	);
}
