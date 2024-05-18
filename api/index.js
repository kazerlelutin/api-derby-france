const endpoints = [
	{
		path: '/clubs',
		description: 'Liste des clubs',
		href: '/clubs',
	},
	{
		path: '/clubs/search/:search',
		description: 'Recherche de clubs',
		href: '/clubs/search/rouen',
	},
	{
		path: '/clubs/name/:name',
		description: 'Recherche de clubs par nom',
		href: '/clubs/name/arrd',
	},
	{
		path: '/clubs/id/:id',
		description: 'Recherche de clubs par id',
		href: '/clubs/id/W052003960',
	},
	{
		path: '/rules',
		description: 'Liste des règles',
		href: '/rules',
	},
	{
		path: '/glossary',
		description: 'Liste des termes du glossaire',
		href: '/glossary',
	},
];

export function home() {
	return new Response(
		`<!DOCTYPE html>
        <html>
        <head>
          <title>API DERBY FRANCE</title>
        </head>
        <body>
          <h1>Bienvenue sur API DERBY FRANCE</h1>
		  		  <div >
		 <script type='text/javascript' src='https://storage.ko-fi.com/cdn/widget/Widget_2.js'></script><script type='text/javascript'>kofiwidget2.init('Supportez-moi', '#249c28', 'V7V46KBQ9');kofiwidget2.draw();</script>
		 </div> 
          <p>Voici les ENDPOINTS disponibles:</p>
          <ul>
            ${endpoints.map((endpoint) => `<li><a href="${endpoint.href}">${endpoint.path}</a> - ${endpoint.description}</li>`).join('')}		
          </ul>
		  <script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>


        </body>
        </html>`,
		{ headers: { 'content-type': 'text/html' } }
	);
}
