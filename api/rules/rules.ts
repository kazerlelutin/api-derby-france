import rulesJson from '../../data/rules.json';
import type { Rule } from '../../generators/rules.type';

export function rules() {
	return Response.json(rulesJson as Rule[]);
}
