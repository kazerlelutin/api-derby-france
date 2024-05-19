import rules from '../../data/rules.json';

export function rulesByChapter(_req, chapterReq) {
	const chapterNum = chapterReq.replace(/[-]/g, '.');

	const chapter = rules.find((rule) => rule?.chapter?.toLocaleLowerCase() === chapterNum.toLowerCase());

	if (!chapter) {
		return new Response('Not found', { status: 404 });
	}

	if (!chapterNum.match(/[.-]/)) {
		const subChapters = rules.filter((rule) => rule?.chapter?.startsWith(chapterNum) && rule?.chapter !== chapterNum);
		return new Response(
			JSON.stringify({
				...chapter,
				subChapters,
			})
		);
	}

	return new Response(JSON.stringify(rules.find((rule) => rule?.chapter?.toLocaleLowerCase() === chapterNum.toLowerCase())));
}
