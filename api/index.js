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
            <li><a href="/clubs?search=some_term">/clubs?search=some_term</a></li>
            <li><a href="/clubs?name=some_name">/clubs?name=some_name</a></li>
            <li><a href="/clubs?id=some_id">/clubs?id=some_id</a></li>
          </ul>
        </body>
        </html>`,
		{ headers: { 'content-type': 'text/html' } }
	);
}
