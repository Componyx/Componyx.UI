/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * Utility module - common helper functions.
 * @class Utility
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.Utility = class Utility
{
    constructor(editor)
    {
        this.editor = editor;
        this.webFonts = ["Helvetica", "Arial", "Arial Black", "Verdana", "Tahoma", "Trebuchet MS", "Impact", "Gill Sans", "Times New Roman", "Georgia", "Palatino", "Baskerville", "Andal� Mon", "Courier", "Lucida", "Monaco", "Bradley Hand", "Brush Script MT", "Luminari", "Comic Sans MS"];
        this.zeroWidthChar = '\uFEFF';
        this.tabChar = '\u2003';
        this.attrPrefix = 'data-ui-editor-';
        this.iconPrefix = 'ico-editor-';
        this.markerAttr = this.attrPrefix + 'marker';
        this.selAttr = this.attrPrefix + 'selected';
        this.tableIdAttr = this.attrPrefix + 'te-id';
        this.localStoragePrefix = 'componyx.UI.Editor.';
        this.zeroWidthRegEx = /[\uFEFF]/gm;
        this.prevWordRegEx = /([\s])*([^\s]*$|[\uFEFF]+$)/m;
        this.nextWordRegEx = /(^[^\s]*|^[\uFEFF]+)([\s]*)/m;
        this.voidNodeRegEx = /^(AREA|BASE|BR|COL|EMBED|HR|IMG|INPUT|LINK|META|SOURCE|TRACK|WBR)$/i;
        this.blockNodeRegEx = /^(FIGURE|UL|OL|DIV|P|H\d+)$/i;
        this.wrappedNodesRegEx = /^(TABLE|HR|OBJECT|EMBED|SVG|VIDEO)$/i;
        this.figureNodesRegEx = /^(IMG|VIDEO|TABLE|SVG|EMBED|OBJECT)$/i;
        this.layoutNodeNames = ['strong', 'em', 'u', 's', 'sub', 'sup', 'span'];
        this.listFilter = 'UL,OL';
        this.buttonCss = 'button theme basic';
        this.buttonLucentCss = this.buttonCss + ' lucent';
        this.cssVariables = {
            fontColor: '--font-color',
            fontBGColor: '--font-bg-color'
        };
    }

    /** Returns a new identifier. */
    newGuid()
    {
        return this.editor.id + '_' + $lib.guid();
    }

    /**
     * Gets an ID with the editor prefix
     * @param {string} id 
     */
    getId(id)
    {
        return this.editor.id + '_' + id;
    }

    /**
     * Returns a value indicating if the key is a printable character.
     * @param {Event} e
     */
    isPrintableChar(e)
    {
        return ' capslock shift backspace control tab enter insert delete home end pageup pagedown arrowleft arrowright arrowup arrowdown numlock '.indexOf(' ' + e.key.toLowerCase() + ' ') == -1 && !e.ctrlKey;
    }

    /**
     * Converts the color to CSS rgba string.
     * @param {string[]|string} color
     */
    toCSSColor(color)
    {
        if ($lib.isArray(color))
            return `rgba(${color.join(',')})`;
        else
            return color;
    }

    /**
     * Saves scroll position
     * @param {HTMLElement} source 
     */
    saveScroll(source)
    {
        let values = [source.scrollTop, source.scrollLeft];
        source.scrollTop = source.scrollLeft = 0;
        return values;
    }

    /**
     * Resets scroll position
     * @param {HTMLElement} source 
     * @param {Array} values 
     */
    resetScroll(source, values)
    {
        source.scrollTop = values[0];
        source.scrollLeft = values[1];
    }

    /**
     * Gets the corresponding content editable element.
     * @param {any} activeNode
     */
    getContentEditable(activeNode)
    {
        let element = activeNode;

        if (element && element.window === element) // focus/blur in iframe mode fire on the window
            element = element.document.body;
        else if (element && element.nodeType !== Node.ELEMENT_NODE)  // selection nodes are often text nodes, which have no closest()
            element = element.parentElement;

        if (!element)
            return null;

        return element.closest(`.editor[contenteditable="true"]`) || element.closest(`.${this.editor.getCssClass(this.editor.classOption.CONTENT)}[contenteditable="true"]`);
    }

    /**
     * Fetches the data resource with the specified path.
     * @param {string} path The path of the resource file.
     */
    async fetchData(path)
    {
        let response = await fetch(path);
        return await response.json();
    }
};

export default componyx.UI.editor_modules.Utility;
