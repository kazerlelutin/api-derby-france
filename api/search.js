import clubs from './../data/clubs.json';

export async function searchClub(_req, search) {
	return new Response(
		JSON.stringify(
			clubs.filter((club) => {
				const values = Object.values(club)
					.filter((v) => typeof v === 'string' || (typeof v === 'number' && v !== 0))
					.join(' ')
					.toLocaleLowerCase();
				return values.includes(search.toLowerCase());
			})
		)
	);
}
