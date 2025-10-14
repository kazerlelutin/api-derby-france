import clubsJson from '../../data/clubs.json';

export function clubs() {
	return new Response(JSON.stringify(clubsJson), {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
	});
}
