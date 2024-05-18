export function home() {
	return new Response(
		`<!DOCTYPE html>
        <html>
        <head>
          <title>Club API</title>
        </head>
        <body>
          <h1>Welcome to Club API</h1>
          <p>Use the following endpoints to access club information:</p>
          <ul>
            <li><a href="/clubs">/clubs</a></li>
            <li><a href="/clubs/search/rouen">/clubs/search/rouen</a></li>
            <li><a href="/clubs/name/arrd">/clubs/name/arrd</a></li>
            <li><a href="/clubs/id/W052003960">/clubs/id/W052003960</a></li>
          </ul>
        </body>
        </html>`,
		{ headers: { 'content-type': 'text/html' } }
	);
}
