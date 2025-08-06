import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function home() {
	const htmlPath = join(process.cwd(), 'api', 'home', 'home.html');
	const htmlContent = readFileSync(htmlPath, 'utf-8');

	return new Response(htmlContent, {
		headers: {
			'content-type': 'text/html; charset=utf-8',
		},
	});
}
