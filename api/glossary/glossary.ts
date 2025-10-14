import glossaryJson from '../../data/glossary.json';

export function glossary() {
	return Response.json(glossaryJson, {
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	});
}
