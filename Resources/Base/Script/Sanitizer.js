/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.base_modules = componyx.base_modules || {};

/**
* Sanitizes HTML content by removing unsafe tags, attributes, and styles.
 * @class
 * @property {String[]} allowTags											- A list of HTML tags to allow during HTML sanitization.
 * @property {Array<String|RegExp>} denyAttributes							- A list of attributes to deny during HTML sanitization. String attributes are matched using 'starts with', while regex can be used for more complex matching. Attributes allowing JavaScript are denied by default.
 * @property {Array<String|RegExp>} allowCss                                - A list of css properties to allow during HTML sanitization. String attributes are matched using equal to, while regex can be used for more complex matching.
 */
componyx.base_modules.Sanitizer = class Sanitizer
{
	#allowTags = ['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'b', 'bdi', 'big', 'blockquote', 'br', 'button',
		'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dir', 'div', 'dl', 'dt',
		'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'i', 'img',
		'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'main', 'map', 'mark', 'menu', 'menuitem', 'meter', 'nav', 'ol', 'optgroup', 'option',
		'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'summary',
		'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'tt', 'u', 'ul', 'var', 'wbr'];
	#denyAttributes = [
		/^data-bindary/i,
		/^b-/i,
		/^mso-/i,
		/^o:/i,
		/^w:/i,
		/^v:/i,
		/^xmlns(:.*)?$/i
	];
	#allowCss = ['display', 'color', 'background-color', /^font(-.*)?$/, /^text(-.*)?$/,
		'margin', /^margin(-.*)?$/, 'padding', /^padding(-.*)?$/, 'border', /^border(-.*)?$/,
		'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height', 'opacity',
		/^flex(-.*)?$/, 'justify-content', 'align-items', 'align-content', 'align-self', 'order',
		/^grid(-.*)?$/];
	#attributeValueFilters = {
		class: value => value.split(/\s+/).filter(c => !/^mso/i.test(c)).join(' ') 
	};

	/**
	 * @param {object} options
	 * @param {String[]} options.allowTags															- A list of HTML tags to allow during HTML sanitization.
	 * @param {Array<String|RegExp>} options.denyAttributes											- A list of attributes to deny during HTML sanitization. String attributes are matched using 'starts with', while regex can be used for more complex matching. Attributes allowing JavaScript are denied by default.
	 * @param {Array<String|RegExp>} options.allowCss												- A list of css properties to allow during HTML sanitization. String attributes are matched using equal to, while regex can be used for more complex matching.
	 * @param {Object<string, function(string): string>} options.attributeValueFilters				- An object with attribute name as key and a transformation function as value. If the function returns an empty string, the attribute will be removed.
	 */
	constructor(options = {}) 
	{
		this.allowTags = options.allowTags || this.#allowTags;
		this.denyAttributes = options.denyAttributes || this.#denyAttributes;
		this.allowCss = options.allowCss || this.#allowCss;
		this.attributeValueFilters = options.attributeValueFilters || this.#attributeValueFilters;
	}

	/**
	 * Sanitize given HTML string
	 * @param {string} html 
	 * @returns {string} sanitized HTML
	 */
	sanitize(html)
	{
		let temp = document.createElement('div');

		temp.innerHTML = html;
		this.sanitizeNode(temp);
		return temp.innerHTML;
	}

	/**
	 * Recursively sanitize a DOM node and its children
	 * @param {Node} parent 
	 */
	sanitizeNode(parent) 
	{
		let node = parent.firstChild;

		while (node)
		{
			const nodeType = node.nodeType;
			let next = node.nextSibling;

			if (nodeType === 1)
			{
				const tag = node.nodeName.toLowerCase();

				if (this.allowTags.includes(tag))
				{
					for (let index = node.attributes.length - 1; index >= 0; index--)
					{
						const attr = node.attributes[index],
							attrName = attr.name.toLowerCase(),
							attrValue = attr.value,
							isEventHandler = attrName.startsWith('on'),
							isDeniedAttr = this.denyAttributes.some(item => item instanceof RegExp ? item.test(attrName) : attrName.startsWith(item)),
							isSafe = this.isSafeAttrValue(attrName, attrValue);

						if (isEventHandler || isDeniedAttr || !isSafe)
						{
							node.removeAttribute(attr.name);
						}
						else if (this.attributeValueFilters?.[attrName])
						{
							const newValue = this.applyAttributeValueFilter(attrName, attrValue);

							if (newValue)
								node.setAttribute(attrName, newValue);
							else
								node.removeAttribute(attrName);
						}
						else if (attrName === 'style')
						{
							const safeStyle = this.sanitizeStyleAttr(attrValue);
							if (safeStyle)
								node.setAttribute('style', safeStyle);
							else
								node.removeAttribute('style');
						}
					}

					this.sanitizeNode(node);
				}
				else
				{
					next = node.nextSibling;

					while (node.attributes.length > 0)
						node.removeAttribute(node.attributes[0].name); // first remove all attributes otherwise 'on' events can still fire

					node.remove();
				}
			}
			else if (nodeType != 3)
			{
				next = node.nextSibling;
				node.remove();
			}

			node = next || node.nextSibling;
		}
	}

	/**
	 * Decode HTML entities in a string
	 * @param {string} str 
	 * @returns {string}
	 */
	decodeHTML(str) 
	{
		const txt = document.createElement('textarea');
		txt.innerHTML = str;
		return txt.value;
	}

	/**
	 * Check if CSS property name is allowed
	 * @param {string} prop 
	 * @returns {boolean}
	 */
	isAllowedCssProperty(prop) 
	{
		return this.allowCss.some(item =>
		{
			if (typeof item === 'string')
			{
				return item === prop;
			}
			else if (item instanceof RegExp)
			{
				return item.test(prop);
			}
			return false;
		});
	}

	/**
	 * Check if URI protocol/value is safe (does not contain dangerous protocols)
	 * @param {string} decoded 
	 * @returns {boolean}
	 */
	isSafeProtocol(decoded) 
	{
		try 
		{
			const normalized = decoded
					.replace(/\\[nrtf]/gi, '')                    // Remove \n \t etc (escaped)
					.replace(/[\s\u0000-\u001F]+/g, '')           // Remove actual whitespace + control chars
					.toLowerCase();

			if (normalized.includes('javascript:') || normalized.includes('data:text/html'))
				return false;

			if (normalized.includes('data:') && !/^data:image\/(png|jpeg|jpg|gif|webp);base64,[a-z0-9+/=]+$/i.test(normalized))
				return false;

			return true;
		}
		catch (e) 
		{
			return false;
		}
	}

	/**
	 * Check if CSS value is safe
	 * @param {string} value 
	 * @returns {boolean}
	 */
	isSafeCssValue(value) 
	{
		const v = value.toLowerCase().trim();

		if (v.includes('expression(') || v.includes('javascript:') || v.startsWith('@') || v.startsWith('_'))
			return false;

		if (v.includes('data:') && !v.includes('data:image/'))
		{
			return false;
		}

		return true;
	}

	/**
	 * Sanitize style attribute value and return safe subset CSS string
	 * @param {string} styleValue 
	 * @returns {string} sanitized style string
	 */
	sanitizeStyleAttr(styleValue) 
	{
		const el = document.createElement('div');
		el.style.cssText = styleValue;

		const safeProps = [];

		for (let index = 0; index < el.style.length; index++)
		{
			const propName = el.style[index].toLowerCase(),
				propValue = el.style.getPropertyValue(propName).trim();

			if (this.isAllowedCssProperty(propName) && this.isSafeCssValue(propValue))
			{
				safeProps.push(`${propName}: ${propValue}`);
			}
		}

		return safeProps.join('; ');
	}

	/**
	 * Check if attribute value is safe for the attribute
	 * @param {string} attrName 
	 * @param {string} attrValue 
	 * @returns {boolean}
	 */
	isSafeAttrValue(attrName, attrValue) 
	{
		try 
		{
			if (attrName === 'style')
				return true;

			const decoded = this.decodeHTML(attrValue);

			if (!this.isSafeProtocol(decoded))
				return false;

			return true;
		}
		catch (e) 
		{
			return false;
		}
	}

	/**
	 * Apply configured attribute value filter to a given attribute value.
	 * @param {string} attrName - The attribute name.
	 * @param {string} attrValue - The original attribute value.
	 * @returns {string} The transformed attribute value, or empty string if filtered out.
	 */
	applyAttributeValueFilter(attrName, attrValue)
	{
		const filter = this.attributeValueFilters?.[attrName];
		if (!filter) return attrValue;
		return filter(attrValue);
	}
}

export default componyx.base_modules.Sanitizer;
