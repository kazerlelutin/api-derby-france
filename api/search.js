import { distance } from 'fastest-levenshtein';
import clubs from './../data/clubs.json';

export async function searchClub(_req, search) {
	return new Response(
		JSON.stringify(
			clubs.filter((club) => {
				const values = Object.values(club)
					.filter((v) => typeof v === 'string' || (typeof v === 'number' && v !== 0))
					.map((v) => v.toString().toLocaleLowerCase())
					.filter((v) => v.length > 1);

				if (values.join(' ').includes(search)) return true;
				if (search.length < 4) return false;
				const splitSearch = search.split(' ');

				let distanceValues = [];
				values.forEach((v) => {
					const words = v.split(' ');

					words.forEach((word) => {
						if (word.length < 4) return;
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
