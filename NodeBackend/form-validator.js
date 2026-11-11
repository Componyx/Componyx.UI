/**
 * Server-side validation of submitted Form values.
 * Checks the values a client posts against the Form definition, using the same rules the Form component applies in the browser,
 * so a request that bypasses the client validation is still rejected.
 * @namespace FormValidator
 * @memberof componyx.ui
 */

// Port of Componyx.UI.FormValidator (C#), without dependencies.

/**
* Data type options, the subset of componyx.UI.Validator.DataTypeOption that is validated on the server.
* @readonly
* @enum {number}
*/
const DataTypeOption =
{
    INTEGER: 0,
    FLOAT: 1,
    DATETIME: 2,
    EMAIL: 3,
    URL: 4
};

/**
* Rule type options, the subset of componyx.UI.Validator.TypeOption that is validated on the server.
* @readonly
* @enum {number}
*/
const TypeOption =
{
    REQUIRED: 0,
    DATATYPE: 1,
    LENGTH: 2,
    RANGE: 3,
    REGEX: 4,
    COMPARE: 5
};

const _stateActions = new Set(['show', 'hide', 'enable', 'disable', 'required', 'optional']);

const _integerPattern = /^\s*[+-]?\d+\s*$/,
    _floatPattern = /^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\s*$/,
    _datePattern = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/; // yyyy-mm-dd, optionally with a time (no time zone)

/**
 * Validates the submitted form values against the form definition.
 * Fields that no rule can show, hide, enable, disable or make required/optional are validated by their definition, submitted or not. Fields a rule can change are only validated when submitted.
 * Pass valuesJson as received, without re-serializing it with options that drop nulls or rename keys!
 * @param {string} definitionJson The form definition JSON.
 * @param {string} valuesJson The submitted form values JSON. Fields are stored by name or binding key. A repeatable field set is stored as an object key, where the key is the field set id and the value is the array of repeated values.
 * @param {function(object): boolean} [isActive] An extra check whether a field is validated (default: all fields).
 * @returns {{ isValid: boolean, errors: Object<string, number[]> }} The validation result with the failed rule types per value path.
 * @example
 * import { validate } from './form-validator.js';
 *
 * const result = validate(definitionJson, valuesJson);
 *
 * if (!result.isValid)
 * {
 *     // result.errors looks like: { "email": [1], "addresses[0].zipCode": [0] }
 * }
 * @memberof componyx.ui.FormValidator
 */
function validate(definitionJson, valuesJson, isActive)
{
    const rootSets = JSON.parse(definitionJson), // the root sections or field sets
        values = (valuesJson == null || valuesJson.trim() === '') ? {} : JSON.parse(valuesJson),
        entries = [],
        errors = {};

    if (!Array.isArray(rootSets))
        throw new Error('The form definition must be an array.');

    if (!isObject(values))
        throw new Error('The form values must be an object.');

    const conditionalIds = new Set(),
        parents = new Map(); // node -> parent node, plain objects don't know their parent

    if (!isActive)
        isActive = field => true;

    for (const node of rootSets)
    {
        mapParents(node, null, parents);
        collectConditionalIds(node, conditionalIds);
        collectFields(node, null, values, values, '', entries, errors);
    }

    collectSkippableSections(rootSets, conditionalIds); // a section that can be skipped counts like a field set a rule can hide

    for (const entry of entries)
    {
        const conditional = isConditional(entry.field, conditionalIds, parents);

        if (!isActive(entry.field) || (conditional ? !entry.present : !isActiveByDesign(entry.field, parents))) // a rule may have hidden or disabled it, so only its key tells
            continue;

        const compareFieldId = str(get(entry.field, 'validationSettings'), 'compareFieldId'),
            compareEntry = (compareFieldId !== null) ? findCompareEntry(entry, entries, compareFieldId) : null,
            failedRules = validateField(entry, compareEntry);

        if (failedRules.length > 0)
            errors[entry.path] = failedRules;
    }

    return { isValid: Object.keys(errors).length === 0, errors: errors };
}

/**
 * Collects all fields with the values scope they read from, mirroring the client: fields inside a repeatable field set
 * read from that set's array item (keyed by the set's id), all other fields read from the root values.
 */
function collectFields(node, parent, root, scope, prefix, entries, errors)
{
    if (!isObject(node) || str(node, 'repeatGroupId') !== null) // clones of a repeated set are covered by the original's value array
        return;

    const type = str(node, 'type');

    if (type === 'Field')
    {
        const key = str(node, 'bindingKey') || str(node, 'name') || '';

        entries.push({ field: node, parent: parent, value: getValue(scope, key), path: prefix + key, present: hasKey(scope, key) });
        return;
    }

    if (type === 'FieldSet' && bool(node, 'repeatable'))
    {
        const id = str(node, 'id') || '',
            items = Array.isArray(get(root, id)) ? get(root, id) : [],
            maxRepeats = int(node, 'maxRepeats') || 0,
            count = Math.max(items.length, 1); // validate at least one item, like the rendered original

        if (maxRepeats > 0 && items.length > maxRepeats) // the client prevents this, so only a tampered request gets here
            errors[id] = [TypeOption.RANGE];

        for (let index = 0; index < count; index++)
        {
            const item = (index < items.length) ? items[index] : null;

            for (const field of children(node, 'fields'))
                collectFields(field, node, root, item, id + '[' + index + '].', entries, errors);

            if (index === 0)
            {
                for (const set of children(node, 'fieldSets'))
                    collectFields(set, node, root, root, '', entries, errors);
            }
        }

        return;
    }

    for (const child of children(node, 'fieldSets').concat(children(node, 'fields')))
        collectFields(child, node, root, root, '', entries, errors);
}

function validateField(entry, compareEntry)
{
    const field = entry.field,
        settings = get(field, 'validationSettings'),
        dataType = int(settings, 'dataType'),
        text = entry.value,
        failed = [];

    if (text === null || text === '')
    {
        if (bool(field, 'required'))
            failed.push(TypeOption.REQUIRED);

        return failed;
    }

    if (!isOptionValue(field, text))
    {
        failed.push(TypeOption.DATATYPE);
        return failed;
    }

    const minLength = int(settings, 'minLength') || 0, // 0 means not set, like the client
        maxLength = int(settings, 'maxLength') || Infinity;

    if (typeof text !== 'string') // multi-value field (list): only required and length (the number of selected values) apply
    {
        if (text.length < minLength || text.length > maxLength)
            failed.push(TypeOption.LENGTH);

        return failed;
    }

    const typedValue = convert(text, dataType);

    if (typedValue === undefined)
    {
        failed.push(TypeOption.DATATYPE);
        return failed;
    }

    if ((dataType === DataTypeOption.EMAIL && !isEmail(text)) || (dataType === DataTypeOption.URL && !isUrl(text)))
        failed.push(TypeOption.DATATYPE);

    const isNumber = (dataType === DataTypeOption.INTEGER || dataType === DataTypeOption.FLOAT),
        isText = (!isNumber && dataType !== DataTypeOption.DATETIME),
        minRange = dbl(settings, 'minRange'),
        maxRange = dbl(settings, 'maxRange'),
        pattern = str(settings, 'pattern');

    if (isText && (text.length < minLength || text.length > maxLength))
        failed.push(TypeOption.LENGTH);

    if (isNumber && ((minRange !== null && typedValue < minRange) || (maxRange !== null && typedValue > maxRange)))
        failed.push(TypeOption.RANGE);

    if (isText && pattern && !isMatch(text, pattern))
        failed.push(TypeOption.REGEX);

    if (compareEntry !== null && !compare(text, compareEntry.value, dataType, str(settings, 'compareOperator')))
        failed.push(TypeOption.COMPARE);

    return failed;
}

/**
 * Finds the compared field: in the same repeat item when both fields share a field set, otherwise its first occurrence.
 */
function findCompareEntry(entry, entries, compareFieldId)
{
    let first = null;

    for (const other of entries)
    {
        if (str(other.field, 'id') !== compareFieldId)
            continue;

        if (other.parent === entry.parent && getItemPrefix(other.path) === getItemPrefix(entry.path))
            return other;

        if (first === null)
            first = other;
    }

    return first;
}

function getItemPrefix(path)
{
    return path.substring(0, path.lastIndexOf(']') + 1); // empty when the path is not inside a repeat item
}

function getValue(scope, key)
{
    let node = scope;

    for (const part of key.split('.'))
        node = get(node, part);

    if (node === undefined || node === null)
        return null;

    if (Array.isArray(node))
        return (node.length > 0) ? node : null;

    if (typeof node === 'boolean')
        return node ? 'true' : null; // unchecked counts as empty, like the client

    if (typeof node === 'string')
        return node;

    return (typeof node === 'number') ? String(node) : JSON.stringify(node); // numbers in invariant notation
}

function hasKey(scope, key)
{
    let node = scope;

    for (const part of key.split('.'))
    {
        if (!isObject(node) || !Object.hasOwn(node, part)) // own keys only, also true for a key with a null value
            return false;

        node = node[part];
    }

    return true;
}

function mapParents(node, parent, parents)
{
    if (!isObject(node))
        return;

    parents.set(node, parent);

    for (const child of children(node, 'fieldSets').concat(children(node, 'fields')))
        mapParents(child, node, parents);
}

function collectConditionalIds(node, ids)
{
    for (const ruleCase of children(node, 'ruleCases'))
    {
        for (const action of children(ruleCase, 'actions'))
        {
            if (_stateActions.has(str(action, 'runtimeActionId')))
                ids.add(str(action, 'targetFieldSetId') ?? str(node, 'id')); // the action targets the field itself or a field set
        }
    }

    for (const child of children(node, 'fieldSets').concat(children(node, 'fields')))
        collectConditionalIds(child, ids);
}

function collectSkippableSections(rootSets, ids)
{
    const sections = rootSets.filter(node => str(node, 'type') === 'Section');

    for (let index = 0; index < sections.length; index++)
    {
        const fields = [];
        collectFieldNodes(sections[index], fields); // all fields inside this section

        for (const field of fields)
        {
            for (const ruleCase of children(field, 'ruleCases'))
            {
                const from = (str(ruleCase, 'runVisibility') === 'section_hidden') ? 0 : index; // also runs from other pages, so it may jump before the user gets here

                for (const action of children(ruleCase, 'actions'))
                {
                    const actionId = str(action, 'runtimeActionId');
                    let to;

                    if (actionId === 'end_form')
                        to = sections.length;
                    else if (actionId === 'show_section')
                        to = sections.findIndex(section => str(section, 'id') === str(action, 'value'));
                    else
                        continue;

                    for (let skipped = from + 1; skipped < to; skipped++) // the sections jumped over (none for a jump back)
                        ids.add(str(sections[skipped], 'id'));
                }
            }
        }
    }
}

function collectFieldNodes(node, fields)
{
    if (str(node, 'type') === 'Field')
    {
        fields.push(node);
        return;
    }

    for (const child of children(node, 'fieldSets').concat(children(node, 'fields')))
        collectFieldNodes(child, fields);
}

function isConditional(field, conditionalIds, parents)
{
    for (let node = field; node; node = parents.get(node))
    {
        if (conditionalIds.has(str(node, 'id')))
            return true;
    }

    return false;
}

function isActiveByDesign(field, parents)
{
    for (let node = field; node; node = parents.get(node))
    {
        if (bool(node, 'disabled') || (str(node, 'type') !== 'Section' && !bool(node, 'visible', true))) // a section's visible state is just the current page
            return false;
    }

    return true;
}

function isOptionValue(field, value)
{
    const options = children(field, 'options');

    if (options.length === 0 || str(field, 'dataSourceId') !== null || bool(get(field, 'componentSettings'), 'allowInput'))
        return true; // no fixed options to check against

    if (options.some(option => str(option, 'name') !== null || str(option, 'bindingKey') !== null))
        return true; // options bound to their own keys hold booleans, not option values

    const allowed = new Set(options.map(option => toText(get(option, 'value'))));

    return Array.isArray(value) ? value.every(item => allowed.has(toText(item))) : allowed.has(value);
}

function toText(value)
{
    if (typeof value === 'string')
        return value;

    return (value === undefined || value === null) ? '' : JSON.stringify(value); // numbers and booleans as submitted text, like getValue
}

/**
 * Converts an invariant string to the value of the data type (replaces ModelValidator.TryConvert).
 * Returns undefined when the text cannot be converted, null for an empty text, the text itself for text types,
 * and a number for integer, float and date (milliseconds) values.
 */
function convert(text, dataType)
{
    if (dataType !== DataTypeOption.INTEGER && dataType !== DataTypeOption.FLOAT && dataType !== DataTypeOption.DATETIME)
        return text;

    if (text.length === 0)
        return null;

    if (dataType === DataTypeOption.INTEGER)
        return _integerPattern.test(text) ? Number(text) : undefined;

    if (dataType === DataTypeOption.FLOAT)
        return _floatPattern.test(text) ? Number(text) : undefined;

    return parseDate(text.trim());
}

function parseDate(text)
{
    const match = _datePattern.exec(text);

    if (match === null)
        return undefined;

    const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]),
        hour = Number(match[4] || 0), minute = Number(match[5] || 0), second = Number(match[6] || 0),
        millisecond = Number((match[7] || '0').padEnd(3, '0')),
        date = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));

    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day || hour > 23 || minute > 59 || second > 59) // e.g. 2026-02-30
        return undefined;

    return date.getTime();
}

function isEmail(text)
{
    const index = text.indexOf('@'); // exactly one @, not first or last, like .NET's EmailAddressAttribute
    return index > 0 && index < text.length - 1 && index === text.lastIndexOf('@');
}

function isUrl(text)
{
    return /^(https?|ftp):\/\//i.test(text); // like .NET's UrlAttribute
}

function isMatch(value, pattern)
{
    try
    {
        return new RegExp(pattern).test(value); // partial match, like the client; note: no timeout in JavaScript
    }
    catch (error) // invalid pattern
    {
        return false;
    }
}

function compare(value, otherValue, dataType, operator)
{
    if (typeof otherValue !== 'string') // empty or multi-value
        return false;

    const first = convert(value, dataType),
        second = convert(otherValue, dataType);

    if (first === undefined || first === null || second === undefined || second === null) // invalid or empty
        return false;

    switch (operator)
    {
        case '<': return first < second;
        case '<=': return first <= second;
        case '>': return first > second;
        case '>=': return first >= second;
        case '!=': return first !== second;
        default: return first === second;
    }
}

function children(node, key)
{
    const list = get(node, key);
    return Array.isArray(list) ? list.filter(child => child != null) : [];
}

function isObject(value)
{
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function get(node, key)
{
    return (isObject(node) && Object.hasOwn(node, key)) ? node[key] : undefined; // own keys only, so "constructor" or "toString" can't resolve to inherited members
}

function str(node, key)
{
    const value = get(node, key);
    return (typeof value === 'string') ? value : null;
}

function bool(node, key, defaultValue = false)
{
    const value = get(node, key);
    return (typeof value === 'boolean') ? value : defaultValue;
}

function int(node, key)
{
    const value = get(node, key);
    return Number.isInteger(value) ? value : null;
}

function dbl(node, key)
{
    const value = get(node, key);
    return (typeof value === 'number') ? value : null;
}

export { validate };