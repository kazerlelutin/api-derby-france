import clubsJson from '../../data/clubs.json';
import type { Club } from '../../generators/club.type';

export async function clubById(req: { params: { id: string } }) {
	const { id } = req.params

	const clubs = clubsJson as Club[]

	const result = clubs.find((club) => club?.id?.toLocaleLowerCase() === id.toLowerCase());
	const status = result ? 200 : 404;
	return Response.json(result || { error: 'Club non trouvé' }, { status, headers: { 'Access-Control-Allow-Origin': '*' } });
}
