import { clubById } from "./api/club/by-id";
import { clubByName } from "./api/club/by-name";
import { clubs } from "./api/club/clubs";
import { clubSearchClub } from "./api/club/search";
import { glossary } from "./api/glossary/glossary";
import { glossarySearch } from "./api/glossary/search";
import { home } from "./api/home";
import { rulesByChapter } from "./api/rules/by-chapter";
import { rules } from "./api/rules/rules";
import { rulesSearch } from "./api/rules/search";

Bun.serve({
	port: Bun.env.PORT || 3000,
	routes: {
		"/": home,
		"/clubs": clubs,
		"/clubs/search/:search": clubSearchClub,
		"/clubs/name/:name": clubByName,
		"/clubs/id/:id": clubById,
		"/rules": rules,
		"/rules/search/:search": rulesSearch,
		"/rules/chapter/:chapter": rulesByChapter,
		"/glossary": glossary,
		"/glossary/search/:search": glossarySearch,
	},
});

console.log(`Server is running on http://localhost:${Bun.env.PORT || 3000}`);
