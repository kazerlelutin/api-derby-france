import rulesJson from '../../data/rules.json';

export function rulesByChapter(req: { params: { chapter: string } }) {

	const { chapter: chapterParam } = req.params

	const chapterNum = chapterParam.replace(/[-]/g, '.');

	const chapter = rulesJson.find((rule) => rule?.chapter?.toLocaleLowerCase() === chapterNum.toLowerCase());


	if (!chapter) {
		return new Response('Not found', { status: 404 });
	}

	if (!chapterNum.match(/[.-]/)) {
		const subChapters = rulesJson.filter((rule) => rule?.chapter?.startsWith(chapterNum) && rule?.chapter !== chapterNum);
		return Response.json({
			...chapter,
			subChapters,
		});
	}

	return new Response(JSON.stringify(rulesJson.find((rule) => rule?.chapter?.toLocaleLowerCase() === chapterNum.toLowerCase())), {
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	});
}
