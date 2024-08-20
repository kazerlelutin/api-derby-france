import AdmZip from 'adm-zip';
import iconv from 'iconv-lite';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { CLUB_FILE, DATA_FOLDER, TEMP_FOLDER } from './constants.mjs';

const BASE_URL = 'https://media.interieur.gouv.fr/rna/rna_waldec_[DATE].zip';

function getUrl(otherMonth = 0) {
	const date = new Date();
	const year = date.getFullYear();
	const month = otherMonth || date.getMonth() + 1;
	const day = '01';
	const formattedDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
	return BASE_URL.replace('[DATE]', formattedDate);
}

async function downloadAndExtractZip(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);

		const blob = await response.blob();
		const arrayBuffer = await blob.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const path = TEMP_FOLDER + '/all.zip';
		writeFileSync(path, buffer, 'binary');

		const zip = new AdmZip(path);
		zip.extractAllTo(TEMP_FOLDER, true);
		rmSync(path);
		console.log('Extraction completed!');
	} catch (error) {
		console.error('Failed to download or extract the ZIP file:', error);
	}
}

async function clubGen() {
	console.log('🚀');
	const url = getUrl();

	console.log('Création du dossier temporaire...');
	const isExist = existsSync(path.join(process.cwd(), TEMP_FOLDER));
	if (isExist) rmSync(TEMP_FOLDER, { recursive: true, force: true });
	if (!isExist) mkdirSync(path.join(process.cwd(), TEMP_FOLDER));
	console.log('Récupération du fichier ZIP et extraction...');
	await downloadAndExtractZip(url);

	const pathFolder = path.join(process.cwd(), TEMP_FOLDER);
	const files = readdirSync(pathFolder, { withFileTypes: true });

	const isDataDirExist = existsSync(path.join(process.cwd(), DATA_FOLDER));
	if (!isDataDirExist) mkdirSync(path.join(process.cwd(), DATA_FOLDER));

	const isClubFileExist = existsSync(path.join(process.cwd(), CLUB_FILE));
	if (!isClubFileExist) writeFileSync(path.join(process.cwd(), CLUB_FILE), '[]');

	const clubs = [];

	console.log('Lecture des fichiers...');
	for (const file of files) {
		if (!file.isFile()) continue;
		const filePath = pathFolder + '/' + file.name;
		const content = iconv.decode(readFileSync(filePath), 'latin1');
		content
			.split('\n')
			.filter((line) => /roller/i.test(line) && /derby/i.test(line))
			.forEach((line) => {
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
					api_updated_at: new Date().toISOString(),
				});
			});
	}

	console.log('Sauvegarde des données...');
	writeFileSync(path.join(process.cwd(), CLUB_FILE), JSON.stringify(clubs, null, 2));

	console.log('Suppression du dossier temporaire...');
	rmSync(TEMP_FOLDER, { recursive: true, force: true });
	//TODO emoji fire
	console.log('🔥 Terminé ! le fichier est prêt: ', pathFolder);
}

clubGen();
