/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * Resizer module — manages the resize handles and ghost overlay for resizable elements.
 * Resizable elements are determined by matcher functions instead of nodeName mapping.
 * @class Resizer
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.Resizer = class Resizer
{
    #resizable = null;
    #resizing = false;

    constructor(editor)
    {
        this.editor = editor;

        this.defaultConfig = {
            cssPrefix: 'image-resize'
        };

        // Matcher list
        this.resizableTypes = [
            {
                filter: node => node.nodeName === 'IMG',
                config: {}
            }
        ];
    }

    /**
     * Returns the currently active resizable instance.
     */
    get resizable() { return this.#resizable; }

    /**
     * Returns true while a drag is in progress.
     */
    get resizing() { return this.#resizing; }

    /**
     * Returns configuration for a node if it is resizable.
     * @param {HTMLElement} node
     * @returns {Object|null}
     */
    getConfig(node)
    {
        if (!node) return null;

        const entry = this.resizableTypes.find(m => m.filter(node));
        if (!entry) return null;

        return Object.assign({}, this.defaultConfig, entry.config);
    }

    /**
     * Attaches resize handles to the specified node if it is resizable.
     * @param {HTMLElement|null} node
     */
    set(node)
    {
        if (!node || (this.#resizable && this.#resizable.element === node))
            return;

        this.clear(true);

        const config = this.getConfig(node);
        if (!config)
            return;

        const editor = this.editor,
            editableEl = editor.getEditorElement();

        // Build the four corner handles
        let reHandleTL = $lib.element(editableEl, '', '', '', null, { className: config.cssPrefix + '-handle' }),
            reHandleTR = editableEl.appendChild(reHandleTL.cloneNode(false)),
            reHandleBL = editableEl.appendChild(reHandleTL.cloneNode(false)),
            reHandleBR = editableEl.appendChild(reHandleTL.cloneNode(false)),
            resizeGhost = editableEl.appendChild(node.cloneNode(false));

        resizeGhost.classList.add(config.cssPrefix + '-ghost');
        resizeGhost.style.display = 'none';

        reHandleTL.classList.add('nw');
        reHandleTR.classList.add('ne');
        reHandleBL.classList.add('sw');
        reHandleBR.classList.add('se');

        const setPos = (el) =>
        {
            let pos = $lib.getPos(el);
            $lib.setPos(reHandleTL, { top: pos.top, left: pos.left }, true);
            $lib.setPos(reHandleTR, { top: pos.top, left: pos.right }, true);
            $lib.setPos(reHandleBL, { top: pos.bottom, left: pos.left }, true);
            $lib.setPos(reHandleBR, { top: pos.bottom, left: pos.right }, true);
        };

        setPos(node);

        const resizeSettings = {
            defaultHandles: false,
            resizeHandles: [{ nw: reHandleTL, ne: reHandleTR }, { sw: reHandleBL, se: reHandleBR }],
            resizeGhost: resizeGhost,

            onResizeStart: () =>
            {
                this.#resizing = true;
            },

            onResize: (args) =>
            {
                args.event.preventDefault();
            },

            onResizeEnd: () =>
            {
                editor.activateDocument();

                const scrollValues = editor.utility.saveScroll(editableEl);
                setPos(node);

                editor.history.addItem();
                editor.activateDocument();
                this.set(node);
                editor.paragraphButtons.show(editableEl, node.parentNode);
                editor.utility.resetScroll(editableEl, scrollValues);
                editor.deactivateDocument();
            }
        };

        this.#resizable = $lib.resizable(node, resizeSettings);
    }

    /**
     * Removes the resize handles and ghost overlay.
     * @param {boolean} [force=false]
     * @returns {HTMLElement|undefined}
     */
    clear(force = false)
    {
        const resizable = this.#resizable,
            range = this.editor.getStoredRange();

        if (!resizable)
            return;

        const activeNode = range?.startContainer,
            stillResizable = activeNode
                ? resizable.element.contains(activeNode)
                : false;

        const shouldClear = force || (!this.#resizing && !stillResizable);

        if (!shouldClear)
            return;

        const el = resizable.element;

        const config = this.getConfig(el),
            editableEl = this.editor.getEditorElement();

        editableEl.querySelectorAll(`.${config.cssPrefix}-ghost,.${config.cssPrefix}-handle`).forEach(el => el.remove());

        resizable.disable();
        this.#resizable = null;
        this.#resizing = false;

        return el;
    }
};

export default componyx.UI.editor_modules.Resizer;