import clubsJson from '../../data/clubs.json';
import type { Club } from '../../generators/club.type';

export async function clubByName(req: { params: { name: string } }) {

	const { name } = req.params

	const clubs = clubsJson as Club[]

	const result = clubs.find(
		(club) =>
			club?.titre_court?.toLocaleLowerCase() === name.toLowerCase() || club?.titre?.toLocaleLowerCase().includes(name.toLocaleLowerCase())
	);

	const status = result ? 200 : 404;

	return Response.json(result || { error: 'Club non trouvé' }, { status, headers: { 'Access-Control-Allow-Origin': '*' } });
}
