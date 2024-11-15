// src/types/Options.ts
import type { FormTags } from "./FormTags";

export interface Options {
	enabled?: boolean | ((event: KeyboardEvent) => boolean);
	enableOnFormTags?: FormTags[] | boolean;
	enableOnContentEditable?: boolean;
	keyup?: boolean;
	keydown?: boolean;
	preventDefault?: boolean;
	description?: string;
	document?: Document;
	ignoreModifiers?: boolean;
}
