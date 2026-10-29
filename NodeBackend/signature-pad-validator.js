/**
 * Server-side validation of submitted SignaturePad values.
 * Accepts only the svg markup the SignaturePad component itself writes, so a tampered value (scripts, links, foreign elements or attributes) is rejected
 * before it is stored or rendered again.
 * @namespace SignaturePadValidator
 * @memberof componyx.ui
 */

/* A SignaturePad value looks like this:
 *   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" ...><path d="M 10 20 Q ..."/><path d="..."/></svg>
 * It's checked in three parts: the frame (<svg ... > and </svg>), the attributes of the svg, and the paths inside.
 * Each part may only contain what the SignaturePad itself writes. Valid pieces are removed, and if anything is left over, the value is invalid.
 * Port of Componyx.UI.SignaturePadValidator (C#), without dependencies.
 */

const _namespaceAttribute = ' xmlns="http://www.w3.org/2000/svg"';

// one svg attribute: a known name, and a value with only letters, digits and # ( ) , . % - and spaces (so no quotes, < > & : or /)
const _attributePattern = / (viewBox|width|height|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin)="[A-Za-z0-9#(),.% \-]*"/g;

// one path: only a "d" attribute, with the same characters as _pathDataPattern in SignaturePad.js
const _pathPattern = /<path d="[MLQ0-9.\- ]*"(\/>|><\/path>)/g;

/**
 * Validates a submitted SignaturePad value.
 * Returns true if the value is an empty signature or a valid SignaturePad svg, otherwise false.
 * @param {string} value The submitted value.
 * @param {number} [maxLength=200000] The maximum allowed length of the value in characters.
 * @returns {boolean}
 * @example
 * import { validate } from './signature-pad-validator.js';
 *
 * if (!validate(request.body.signature))
 *     throw new Error('Invalid signature.');
 * @memberof componyx.ui.SignaturePadValidator
 */
function validate(value, maxLength = 200000)
{
    if (value === undefined || value === null || value === '')
        return true;

    if (typeof value !== 'string' || value.length > maxLength)
        return false;

    // the frame: starts with <svg, ends with </svg>, and the first > (end of the svg tag) comes before </svg>
    if (!value.startsWith('<svg') || !value.endsWith('</svg>'))
        return false;

    const rootEnd = value.indexOf('>');

    if (rootEnd > value.length - 7)
        return false;

    const attributes = value.substring(4, rootEnd), // everything between "<svg" and ">"
        content = value.substring(rootEnd + 1, value.length - 6); // everything between ">" and "</svg>"

    // the attributes: the svg namespace is required, and after removing it and all known attributes, nothing may be left
    if (attributes.indexOf(_namespaceAttribute) === -1)
        return false;

    if (attributes.replace(_namespaceAttribute, '').replace(_attributePattern, '') !== '')
        return false;

    // the content: after removing all valid paths, nothing may be left
    return content.replace(_pathPattern, '') === '';
}

export { validate };