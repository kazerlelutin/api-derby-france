import clubs from '../../data/clubs.json';

export async function clubById(_req, id) {
	const result = clubs.find((club) => club?.id?.toLocaleLowerCase() === id.toLowerCase());
	const status = result ? 200 : 404;
	return new Response(JSON.stringify(result || { error: 'Club non trouvé' }, { status }));
}
