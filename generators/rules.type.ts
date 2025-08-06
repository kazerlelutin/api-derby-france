export type Rule = {
	chapter: string;
	title: string;
	description: string;
};

export type GlossaryItem = {
	title: string;
	description: string;
};

export type RulesData = {
	rules: Rule[];
	glossary: GlossaryItem[];
};
