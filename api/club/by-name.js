import clubs from '../../data/clubs.json';

export async function clubByName(name) {
	const result = clubs.find(
		(club) =>
			club?.titre_court?.toLocaleLowerCase() === name.toLowerCase() || club?.titre?.toLocaleLowerCase().includes(name.toLocaleLowerCase())
	);

	const status = result ? 200 : 404;

	return new Response(JSON.stringify(result || { error: 'Club non trouvé' }, { status }));
}
