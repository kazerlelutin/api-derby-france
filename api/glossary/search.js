import { distance } from 'fastest-levenshtein';
import glossary from './../../data/glossary.json';

export function glossarySearch(_req, search) {
	return new Response(
		JSON.stringify(
			glossary.filter(({ title, description }) => {
				if (title.includes(search)) return true;
				if (search.length < 4) return false;
				const splitSearch = search.toLowerCase().split(' ');

				let distanceValues = [];
				[title, description].forEach((v) => {
					const words = v
						.toLowerCase()
						.replace(/[^a-zA-Z0-9\s]/g, ' ')
						.split(' ')
						.filter((word) => word.length > 4);

					console.log('words', words);
					words.forEach((word) => {
						splitSearch.forEach((s) => {
							const dist = distance(s, word);
							if (dist < 2) distanceValues.push(dist);
						});
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
