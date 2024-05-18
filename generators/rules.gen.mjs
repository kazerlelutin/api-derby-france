import { GLOSSARY_FILE, RULES_FILE, TEMP_FOLDER, TEMP_RULES_FILE } from './constants.mjs';
import fs from 'fs/promises';
import pdf from 'pdf-parse';
import path from 'path';

function render_page(pageData) {
	let render_options = {
		normalizeWhitespace: true,
		disableCombineTextItems: false,
	};

	return pageData.getTextContent(render_options).then(function (textContent) {
		let lastY,
			text = '';
		for (let item of textContent.items) {
			lastY == item.transform[5] || !lastY ? (text += item.str + ' ') : (text += '\n' + item.str + ' ');
			lastY = item.transform[5];
		}
		return text;
	});
}

async function processRulesFile() {
	try {
		const data = await fs.readFile(TEMP_RULES_FILE, 'utf-8');

		// === DATA EXTRACTION ===
		const rules = [];
		const glossary = [];

		// === PARSE DATA ===
		let currentRulesIndex = 0;
		let currentGlossaryIndex = 0;
		let description = '';

		const lines = data.split('\n');

		const ParamMatchIdx = lines.findIndex((line) => line.includes('1. Par'));
		const appendiceIdx = lines.findIndex((line) => line.includes('Appendice'));
		const glossaryIdx = lines.findIndex((line) => line.includes('Glossaire'));
		const situationIdx = lines.findIndex((line, index) => index > glossaryIdx && line.includes('Livret de mises en'));

		const filter = (line) => {
			const cleanLine = line
				.replace(/[\u200B-\u200D\uFEFF]/g, '')
				.trim()
				.toLocaleLowerCase();
			if (cleanLine.startsWith('Table des matières')) return false;
			if (cleanLine.startsWith('WFTDA Règles')) return false;
			if (cleanLine.startsWith('page')) return false;
			if (cleanLine.startsWith('©')) return false;

			return true;
		};

		lines
			.filter(filter)
			.slice(ParamMatchIdx, appendiceIdx)
			.forEach((line) => {
				const firstChar = line.charAt(0);
				const secondChar = line.charAt(1);

				// Extract the rules
				const chapterArr = [];
				if (parseInt(firstChar) > 0 && isNaN(parseInt(secondChar)) && !line.includes(')')) {
					const splitLineByPoint = line.split('.');
					splitLineByPoint.forEach((item) => {
						const cleanItem = item.split(' ')[0];
						if (parseInt(cleanItem) > 0) chapterArr.push(cleanItem);
					});

					let title = line.trim();
					while (title.charAt(0).match(/[0-9.]/)) title = title.slice(1).trim();

					if (chapterArr.length) {
						rules.push({ chapter: chapterArr.join('.'), title, description: '' });
						currentRulesIndex = rules.length - 1;
						description = '';
						//supprimer la prochaine ligne si elle est vide
						if (lines[lines.indexOf(line) + 1].trim() === '') lines.splice(lines.indexOf(line) + 1, 1);
					}
				} else {
					description += line.trim() + ' ';

					if (rules[currentRulesIndex]) {
						rules[currentRulesIndex].description = description;
					}
				}
			});

		await fs.writeFile(
			RULES_FILE,
			JSON.stringify(
				rules.filter((it) => it.chapter.length && it.description.length),
				null,
				2
			),
			'utf-8'
		);

		// Reset the description for the glossary
		description = '';

		lines
			.slice(glossaryIdx, situationIdx)
			.filter(filter)
			.forEach((line) => {
				// TITLE
				if (line.length < 55 && !line.includes('.')) {
					glossary.push({ title: line.trim(), description: '' });
					currentGlossaryIndex++;
					description = '';
					return;
				} else {
					description += line.trim() + ' ';
					glossary[currentGlossaryIndex - 1].description = description;
				}
			});

		await fs.writeFile(
			GLOSSARY_FILE,
			JSON.stringify(
				glossary.filter((it) => it.description.length && it.title.length),
				null,
				2
			),
			'utf-8'
		);

		return { rules, glossary };
	} catch (error) {
		console.error('Error processing the file:', error);
	}
}

async function genRules() {
	const url = 'https://static.wftda.com/rules/wftda-rules-french.pdf';
	const tempDir = path.resolve(TEMP_FOLDER);

	try {
		// Ensure the _temp directory exists
		await fs.mkdir(tempDir, { recursive: true });

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const buffer = await response.arrayBuffer();
		const data = await pdf(buffer, {
			pagerender: render_page,
		});

		// Save the extracted text to a file in the _temp directory
		await fs.writeFile(TEMP_RULES_FILE, data.text, 'utf-8');
		await processRulesFile();

		console.log('Rules and glossary generated successfully');
	} catch (error) {
		console.error('Error extracting PDF text:', error);
	}
}

genRules();
