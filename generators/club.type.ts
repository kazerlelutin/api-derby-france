

export type ClubLite = {
	id: string;
	nom: string;
	adresse: string;
	code_postal: string;
	ville: string;
	email: string;
	site_web: string;
	telephone: string;
};

export type Club = {
	id: string;
	id_ex: string;
	siret: string;
	rup_mi: string;
	gestion: string;
	date_creat: string;
	date_decla: string;
	date_publi: string;
	date_disso: string;
	nature: string;
	groupement: string;
	titre: string;
	titre_court: string;
	objet: string;
	objet_social1: string;
	objet_social2: string;
	adrs_complement: string;
	adrs_numvoie: string;
	adrs_repetition: string;
	adrs_typevoie: string;
	adrs_libvoie: string;
	adrs_distrib: string;
	adrs_codeinsee: string;
	adrs_codepostal: string;
	adrs_libcommune: string;
	adrg_declarant: string;
	adrg_complemid: string;
	adrg_complemgeo: string;
	adrg_libvoie: string;
	adrg_distrib: string;
	adrg_codepostal: string;
	adrg_achemine: string;
	adrg_pays: string;
	dir_civilite: string;
	siteweb: string;
	publiweb: string;
	observation: string;
	position: string;
	maj_time: string;
	api_updated_at: string;
};
