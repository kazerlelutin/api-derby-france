const AdmZip = require('adm-zip');
import iconv from 'iconv-lite';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { CLUB_FILE, DATA_FOLDER, TEMP_FOLDER } from './constants.js';
import type { Club } from './club.type.js';

const BASE_URL = 'https://media.interieur.gouv.fr/rna/rna_waldec_[DATE].zip';

function getUrl(otherMonth = 0) {
	const date = new Date();
	const year = date.getFullYear();
	const month = otherMonth || date.getMonth() + 1;
	const day = '01';
	const formattedDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
	return BASE_URL.replace('[DATE]', formattedDate);
}

async function downloadAndExtractZip(url: string) {
	try {
		console.log('Téléchargement du fichier ZIP...');
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);

		const zipPath = path.join(process.cwd(), TEMP_FOLDER, 'all.zip');
		const arrayBuffer = await response.arrayBuffer();
		writeFileSync(zipPath, Buffer.from(arrayBuffer));
		console.log(`Téléchargement terminé: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(1)}MB`);

		console.log('Extraction du ZIP...');
		const zip = AdmZip(zipPath);

		const entries = zip.getEntries();
		let extractedCount = 0;

		for (const entry of entries) {
			if (entry.isDirectory) continue;

			// Extraire seulement les fichiers CSV
			if (entry.entryName.toLowerCase().endsWith('.csv')) {
				zip.extractEntryTo(entry.entryName, TEMP_FOLDER, false, true);
				extractedCount++;
				console.log(`Extrait: ${entry.entryName}`);

				// Pause après chaque extraction pour réduire la charge
				console.log('⏸️  Pause de 300ms après extraction...');
				await new Promise(resolve => setTimeout(resolve, 300));
			}
		}

		console.log(`Extraction terminée: ${extractedCount} fichiers CSV`);
		rmSync(zipPath);

		// Pause après extraction pour laisser le système se stabiliser
		console.log('⏸️  Pause de 2 secondes après extraction...');
		await new Promise(resolve => setTimeout(resolve, 2000));
	} catch (error) {
		console.error('Failed to download or extract the ZIP file:', error);
		throw error;
	}
}

async function clubGen() {
	console.log('🚀');
	const url = getUrl();

	console.log('Création du dossier temporaire...');
	const isExist = existsSync(path.join(process.cwd(), TEMP_FOLDER));
	if (isExist) rmSync(TEMP_FOLDER, { recursive: true, force: true });
	mkdirSync(path.join(process.cwd(), TEMP_FOLDER));
	console.log('Récupération du fichier ZIP et extraction...');
	await downloadAndExtractZip(url);

	const pathFolder = path.join(process.cwd(), TEMP_FOLDER);
	const files = readdirSync(pathFolder, { withFileTypes: true });

	const isDataDirExist = existsSync(path.join(process.cwd(), DATA_FOLDER));
	if (!isDataDirExist) mkdirSync(path.join(process.cwd(), DATA_FOLDER));

	const isClubFileExist = existsSync(path.join(process.cwd(), CLUB_FILE));
	if (!isClubFileExist) writeFileSync(path.join(process.cwd(), CLUB_FILE), '[]');

	const clubs: Club[] = [];

	console.log('Lecture des fichiers...');
	let totalLines = 0;
	let processedLines = 0;

	for (const file of files) {
		if (!file.isFile()) continue;
		const filePath = pathFolder + '/' + file.name;
		console.log(`Lecture de ${file.name}...`);

		// Pause entre chaque fichier pour réduire la charge
		if (files.indexOf(file) > 0) {
			console.log('⏸️  Pause de 1 seconde entre les fichiers...');
			await new Promise(resolve => setTimeout(resolve, 1000));
		}

		// Lecture par chunks pour économiser la mémoire
		const content = iconv.decode(readFileSync(filePath), 'latin1');
		const lines = content.split('\n');
		totalLines += lines.length;

		// Filtrage et traitement optimisé
		const relevantLines = lines.filter((line) =>
			(/roller/i.test(line) && /derby/i.test(line)) || /roller|skate/i.test(line)
		);

		console.log(`Fichier ${file.name}: ${lines.length} lignes totales, ${relevantLines.length} lignes pertinentes`);

		// Traitement par lots avec pauses
		const batchSize = 50; // Traiter par lots de 50 clubs
		for (let i = 0; i < relevantLines.length; i += batchSize) {
			const batch = relevantLines.slice(i, i + batchSize);

			batch.forEach((line) => {
				processedLines++;
				if (processedLines % 100 === 0) {
					console.log(`Traitement: ${processedLines} clubs traités...`);
				}

				const [
					id,
					id_ex,
					siret,
					rup_mi,
					gestion,
					date_creat,
					date_decla,
					date_publi,
					date_disso,
					nature,
					groupement,
					titre,
					titre_court,
					objet,
					objet_social1,
					objet_social2,
					adrs_complement,
					adrs_numvoie,
					adrs_repetition,
					adrs_typevoie,
					adrs_libvoie,
					adrs_distrib,
					adrs_codeinsee,
					adrs_codepostal,
					adrs_libcommune,
					adrg_declarant,
					adrg_complemid,
					adrg_complemgeo,
					adrg_libvoie,
					adrg_distrib,
					adrg_codepostal,
					adrg_achemine,
					adrg_pays,
					dir_civilite,
					siteweb,
					publiweb,
					observation,
					position,
					maj_time,
				] = line.replace(/"/g, '').split(';');

				clubs.push({
					id: id || '',
					id_ex: id_ex || '',
					siret: siret || '',
					rup_mi: rup_mi || '',
					gestion: gestion || '',
					date_creat: date_creat || '',
					date_decla: date_decla || '',
					date_publi: date_publi || '',
					date_disso: date_disso || '',
					nature: nature || '',
					groupement: groupement || '',
					titre: titre || '',
					titre_court: titre_court || '',
					objet: objet || '',
					objet_social1: objet_social1 || '',
					objet_social2: objet_social2 || '',
					adrs_complement: adrs_complement || '',
					adrs_numvoie: adrs_numvoie || '',
					adrs_repetition: adrs_repetition || '',
					adrs_typevoie: adrs_typevoie || '',
					adrs_libvoie: adrs_libvoie || '',
					adrs_distrib: adrs_distrib || '',
					adrs_codeinsee: adrs_codeinsee || '',
					adrs_codepostal: adrs_codepostal || '',
					adrs_libcommune: adrs_libcommune || '',
					adrg_declarant: adrg_declarant || '',
					adrg_complemid: adrg_complemid || '',
					adrg_complemgeo: adrg_complemgeo || '',
					adrg_libvoie: adrg_libvoie || '',
					adrg_distrib: adrg_distrib || '',
					adrg_codepostal: adrg_codepostal || '',
					adrg_achemine: adrg_achemine || '',
					adrg_pays: adrg_pays || '',
					dir_civilite: dir_civilite || '',
					siteweb: siteweb || '',
					publiweb: publiweb || '',
					observation: observation || '',
					position: position || '',
					maj_time: maj_time || '',
					api_updated_at: new Date().toISOString(),
				});
			});

			// Pause entre les lots pour réduire la charge
			if (i + batchSize < relevantLines.length) {
				console.log('⏸️  Pause de 500ms entre les lots...');
				await new Promise(resolve => setTimeout(resolve, 500));
			}
		}
	}

	console.log('Sauvegarde des données...');
	// Pause avant la sauvegarde pour stabiliser le système
	console.log('⏸️  Pause de 1 seconde avant sauvegarde...');
	await new Promise(resolve => setTimeout(resolve, 1000));
	writeFileSync(path.join(process.cwd(), CLUB_FILE), JSON.stringify(clubs, null, 2));
	console.log('Suppression du dossier temporaire...');
	rmSync(TEMP_FOLDER, { recursive: true, force: true });

	console.log('🔥 Terminé !');
	console.log(`📊 Résumé:`);
	console.log(`   - ${totalLines} lignes totales traitées`);
	console.log(`   - ${clubs.length} clubs de roller derby trouvés`);
	console.log(`   - Fichier sauvegardé: ${CLUB_FILE}`);
	console.log(`   - Taille du fichier: ${(JSON.stringify(clubs).length / 1024 / 1024).toFixed(2)}MB`);

}

clubGen();
