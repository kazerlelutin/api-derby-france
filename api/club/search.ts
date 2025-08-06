import { distance } from 'fastest-levenshtein';
import clubsJson from '../../data/clubs.json';
import type { Club } from '../../generators/club.type';


export async function clubSearchClub(req: { params: { search: string } }) {

	const { search } = req.params

	const clubs = clubsJson as Club[]


	return Response.json(

		clubs
			.filter((club) => {
				const values = Object.values(club)
					.filter((v) => typeof v === 'string' || (typeof v === 'number' && v !== 0))
					.map((v) => v.toString().toLocaleLowerCase())
					.filter((v) => v.length > 1);

				if (values.join(' ').includes(search)) return true;
				if (search.length < 4) return false;
				const splitSearch = search.split(' ');

				let distanceValues: number[] = [];
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

				const averageDistance = distanceValues.reduce((acc, cur) => acc + cur, 0) / distanceValues.length;
				if (averageDistance < 2) return true;
				return false;
			})
			.filter((club) => !!club.titre || !!club.titre_court)
			.sort((a, b) => {
				const aTitle = a.titre || a.titre_court;
				const bTitle = b.titre || b.titre_court;
				return aTitle.localeCompare(bTitle);
			})

	);
}
