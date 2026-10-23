/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

(function ()
{
    const _svgNamespace = 'http://www.w3.org/2000/svg',
        _pathDataPattern = /^[MLQ0-9.\- ]*$/; // the only characters our own drawing instructions use

    /**
    * SignaturePad class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.WebComponent
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {componyx.UI.SignaturePad} An instance of the component.
    */
    class SignaturePad extends componyx.UI.base.WebComponent
    {
        /**
        * Internal CSS class name constants.
        * You can override any of these classes on the Component instance by defining a property named
        * `cssClass<Key>` where <Key> is the PascalCase key from this object.
        * Example:
        *  'CLEAR' -> 'cssClassClear'
        * Be cautious: overriding these classes without including the default names may break styling and functionality.
        * @constant
        * @type {Readonly<Object<string, string>>}
        */
        classOption =
            {
                PAD: 'pad',
                CLEAR: 'clear',
                EMPTY: 'empty',
                DISABLED: 'disabled'
            };

        #input = null;
        #svg = null;            // the drawing area
        #clearButton = null;
        #path = null;           // the <path> element of the line that is being drawn
        #pathData = '';         // the drawing instructions of the current line (its "d" attribute)
        #points = [];           // the pointer positions of the current line
        #matrix = null;         // converts screen positions to drawing positions, read once per line
        #drawing = false;       // a value to indicate we are in drawing mode (true while the pointer is down)
        #label = 'Signature';
        #value = '';
        #disabled = false;
        #readOnly = false;

        constructor(id, properties)
        {
            super(id, properties);

            /**
             * Gets or sets the width of the drawn line.
             * @type {Number}
             */
            this.lineWidth = 2;

            /**
             * Gets or sets the color of the drawn line. When not set, the CSS color of the drawing area is used, so the line follows the theme.
             * @type {String|null}
             */
            this.lineColor = null;

            /**
             * Gets or sets the line color used by toPng.
             * @type {String}
             */
            this.exportColor = '#000';

            /**
             * Gets or sets the background color used by toPng. Use 'transparent' or an empty value for a transparent background.
             * @type {String}
             */
            this.exportBackgroundColor = '#fff';

            /**
             * Gets or sets a value indicating if the clear button is shown.
             * @type {Boolean}
             */
            this.showClearButton = true;

            /**
             * Gets or sets the id of the HTML input to use.
             * @type {String}
             */
            this.inputId = null;

            /**
             * Gets or sets the id of a Button component whose settings are cloned to the clear button.
             * @type {String}
             */
            this.clearButtonId = null;

            /**
            * @class
            * @augments componyx.UI.base.Events
            * @memberof componyx.UI.SignaturePad
            * @property {componyx.UI.base.Event} onChanged      - Fires when the signature has changed (after drawing a line or clearing). @see {@link componyx.UI.SignaturePad.SignaturePadEventArgs}
            * @see {@link componyx.UI.base.Events}
            */
            function SignaturePadEvents(events)
            {
                Object.assign(this, events);

                this.onChanged = $base.static.createEvent('onChanged');
            };

            /**
             * SignaturePad events
             * @type {componyx.UI.SignaturePad.SignaturePadEvents}
             */
            this.events = new SignaturePadEvents(this.events);

            /**
            * @typedef {Object} SignaturePadEventArgs
            * @memberof componyx.UI.SignaturePad
            * @property {componyx.UI.SignaturePad} signaturePad - The SignaturePad instance.
            * @property {Object} eventArgs - The event object containing more detailed information about the event.
            * @property {String} eventArgs.value - The current value (SVG markup, or an empty string when there is no signature).
            * @property {Event} eventArgs.event - The original event object.
            */
        }

        /**
         * Gets the input element.
         * @type {HTMLInputElement}
        */
        get input()
        {
            return this.#input;
        }

        /**
         * Gets or sets the signature as SVG markup, or an empty string when there is no signature.
         * @type {String}
        */
        get value()
        {
            return this.#value;
        }

        /**
         * Sets the signature.
         * @param {String} value SVG markup, or an empty value to clear the signature.
         */
        set value(value)
        {
            if ($lib.isEmpty(value))
                value = '';

            if (value === this.#value)
                return;

            this.#value = value;

            if (this.renderState === $base.static.RenderState.RENDERED)
                this.renderValue();
        }

        /**
         * Gets or sets the accessible label of the drawing area.
         * @type {String}
        */
        get label()
        {
            return this.#label;
        }

        /**
         * Sets the accessible label.
         * @param {String} value
         */
        set label(value)
        {
            this.#label = value;

            if (this.renderState === $base.static.RenderState.RENDERED)
                this.#svg.setAttribute('aria-label', value);
        }

        /**
         * Gets or sets a value indicating if the component is disabled.
         * @type {Boolean}
        */
        get disabled()
        {
            return this.#disabled;
        }

        /**
         * Sets the disabled state.
         * @param {Boolean} value
         */
        set disabled(value)
        {
            this.#disabled = !!value;

            if (this.renderState === $base.static.RenderState.RENDERED)
                this.#updateState();
        }

        /**
         * Gets or sets a value indicating if the signature is read-only (shown, but cannot be changed).
         * @type {Boolean}
        */
        get readOnly()
        {
            return this.#readOnly;
        }

        /**
         * Sets the read-only state.
         * @param {Boolean} value
         */
        set readOnly(value)
        {
            this.#readOnly = !!value;

            if (this.renderState === $base.static.RenderState.RENDERED)
                this.#updateState();
        }

        /**
         * Gets the signature as SVG markup, or an empty string when there is no signature.
         * @returns {String}
        */
        getValue()
        {
            return this.value;
        }

        /**
         * Sets the signature.
         * @param {String} value SVG markup, or an empty value to clear the signature.
        */
        setValue(value)
        {
            this.value = value;
        }

        /**
         * Returns true if there is no signature, otherwise false.
         * @returns {Boolean}
        */
        isEmpty()
        {
            return this.#value === '';
        }

        /**
         * Clears the signature.
        */
        clear()
        {
            this.value = '';
        }

        /**
         * Creates a PNG image of the signature, using exportColor for the line and exportBackgroundColor for the background.
         * When only a width is given, the height follows the proportions of the signature.
         * @param {Number} [width] The width of the image in pixels. Defaults to the width of the drawing area when the signature was made.
         * @param {Number} [height] The height of the image in pixels.
         * @returns {Promise<String>} A PNG data URL, or an empty string when there is no signature.
        */
        async toPng(width, height)
        {
            if (this.isEmpty())
                return '';

            const size = this.#getViewBox();

            width = width || size[2];
            height = height || width * (size[3] / size[2]); // keep the proportions of the signature

            const image = await this.#loadImage(this.#buildSvg(this.exportColor)),
                canvas = $lib.element({ tag: 'canvas' }), // temporary, never added to the page
                context = canvas.getContext('2d');

            canvas.width = Math.round(width);
            canvas.height = Math.round(height);

            // a canvas starts transparent, so paint the background first
            if (this.exportBackgroundColor && this.exportBackgroundColor !== 'transparent')
            {
                context.fillStyle = this.exportBackgroundColor;
                context.fillRect(0, 0, canvas.width, canvas.height);
            }

            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            return canvas.toDataURL('image/png');
        }

        /**
        * Renders the component.
        */
        render()
        {
            if (this.renderState != $base.static.RenderState.RENDERING)
            {
                super.render(this.#preRender, 'signature-pad', false);
                return;
            }

            // render logic after loading resources
            this.#draw();
            this.renderChildren();
        }

        /**
        * Destroys the component.
        * @param {Boolean} keepEvents A value indicating if component events should be kept.
        * @param {Boolean} removeElement=true A value indicating if the corresponding HTML Element should be removed.
        * @see {@link componyx.UI.base.methods#destroy}
        * @function
        */
        destroy(keepEvents, removeElement = true)
        {
            this.#disposeEvents();
            this.#clearButton = null;
            super.destroy(keepEvents, removeElement);
        }

        /**
         * Renders the current value on the drawing area and in the input.
        */
        renderValue()
        {
            this.#svg.replaceChildren(); // remove all lines
            this.#applyLineStyle();

            if (this.#value)
                this.#loadValue(this.#value);
            else
                this.#svg.removeAttribute('viewBox'); // an empty drawing area takes its size again at the next line

            this.#input.__setValue(this.#value);
            this.#updateState();
        }

        #preRender()
        {
            return [SignaturePad.name, ['Button']];
        }

        #draw()
        {
            // the input carries the signature (as text) when the form is posted,
            // and brings in an existing signature from the server when the page loads
            this.#input = this.createSyncedInput(this.inputId, function (instance)
            {
                instance.value = this.value; // triggers value setter on component
            });

            if (!$lib.isEmpty(this.#input.value))
                this.#value = this.#input.value;

            this.#svg = $lib.element({
                container: this.element,
                tag: 'svg',
                isSvg: true,
                attrs: {
                    class: this.#getCssClass(this.classOption.PAD),
                    role: 'img',
                    'aria-label': this.label,
                    fill: 'none',
                    'stroke-linecap': 'round',  // round ends on every line
                    'stroke-linejoin': 'round'  // round corners where line pieces meet
                }
            });

            if (this.showClearButton)
                this.#createClearButton(this.element);

            this.renderValue();
            this.#bindEvents();
        }

        #createClearButton(container)
        {
            const id = this.id + '_Clear';

            this.#clearButton = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container });
            this.#clearButton.clone($UI.store[this.clearButtonId], this);
            this.#clearButton.hasIcon = true;
            this.#clearButton.transparent = true;
            this.#clearButton.cssClass = this.#clearButton.cssClass || this.#getCssClass(this.classOption.CLEAR);
            this.#clearButton.command = (e) => this.#clearCommand(e);
            this.#clearButton.disabled = this.#disabled || this.#readOnly || this.isEmpty();
            this.#clearButton.delegateFocusEvents(this);
            this.#clearButton.events.onPostRender.priorityAdd(() => { this.isReady(); }, null);
            this.#clearButton.showing = true;
        }

        #bindEvents()
        {
            // pointer events work the same for mouse, touch and pen
            $lib.on(this.#svg, 'pointerdown', this.#pointerDown, null, this, true);
            $lib.on(this.#svg, 'pointermove', this.#pointerMove, null, this, true);
            $lib.on(this.#svg, 'pointerup pointercancel', this.#pointerUp, null, this, true);
        }

        #disposeEvents()
        {
            if (!this.#svg)
                return;

            $lib.off(this.#svg, 'pointerdown', this.#pointerDown);
            $lib.off(this.#svg, 'pointermove', this.#pointerMove);
            $lib.off(this.#svg, 'pointerup pointercancel', this.#pointerUp);
        }

        #pointerDown(e)
        {
            // e.button is 0 for the left mouse button, touch and pen. higher numbers are other mouse buttons, we ignore those
            if (this.#disabled || this.#readOnly || e.button > 0)
                return;

            e.preventDefault(); // stop the browser from doing its own thing, like selecting text
            this.#svg.setPointerCapture(e.pointerId); // keep receiving pointer events, even outside the drawing area
            this.#drawing = true;

            // the viewBox is the drawing's own coordinate system: "0 0 300 150" means 300 wide and 150 high.
            // an empty drawing area takes its current size on screen. after that it stays fixed and the browser scales the drawing when the area gets bigger or smaller
            if (!this.#svg.firstChild)
            {
                const rect = this.#svg.getBoundingClientRect();
                this.#svg.setAttribute('viewBox', `0 0 ${this.#round(rect.width)} ${this.#round(rect.height)}`);
            }

            // a conversion from screen positions to drawing positions, including any scaling.
            // it can't change while drawing (touch-action: none prevents scrolling), so we read it once per line
            this.#matrix = this.#svg.getScreenCTM().inverse();
            this.#applyLineStyle();

            const point = this.#getPoint(e);

            this.#points = [point];

            // move to the point and draw a line of zero length to that same point:
            // with round line ends, that shows as a dot (like a pen touching paper)
            this.#pathData = `M ${point.x} ${point.y} L ${point.x} ${point.y}`;
            this.#path = $lib.element({ container: this.#svg, tag: 'path', isSvg: true, attrs: { d: this.#pathData } });
        }

        #pointerMove(e)
        {
            if (!this.#drawing)
                return;

            const points = this.#points,
                previous = points.at(-1), // A
                current = this.#getPoint(e), // B
                end = this.#getMidPoint(previous, current); // halfway A-B: the end of this curve, and the start of the next one

            points.push(current);

            //                      B      
            //                      :
            //                      *      end: halfway A-B, where this curve stops
            //                     /
            //    ------*------..-'
            //        start         A  
            // "Q" adds a curve: it starts where the path ends (the previous halfway point), bends toward A (the previous pointer position), and ends halfway between A and B.
            /// We finish the curve halfway between A and B, so the next curve can start there and bend toward B(the current pointer position). On pointer up, we finish the line with a straight piece to where the pointer actually stopped.
            this.#pathData += ` Q ${previous.x} ${previous.y} ${end.x} ${end.y}`;
            this.#path.setAttribute('d', this.#pathData);
        }

        #pointerUp(e)
        {
            if (!this.#drawing)
                return;

            const points = this.#points,
                last = points[points.length - 1];

            this.#drawing = false;

            if (this.#svg.hasPointerCapture(e.pointerId))
                this.#svg.releasePointerCapture(e.pointerId);

            // the curves always stop halfway between two points, so finish the line
            // with a straight piece to where the pointer actually stopped
            if (points.length > 1)
            {
                this.#pathData += ` L ${last.x} ${last.y}`;
                this.#path.setAttribute('d', this.#pathData);
            }

            this.#points = [];
            this.#path = null;
            this.#value = this.#buildSvg(this.lineColor || 'currentColor');
            this.#input.__setValue(this.#value);
            this.#updateState();
            this.events.onChanged.fire(this, { value: this.#value, event: e });
        }

        #clearCommand(e)
        {
            if (this.#disabled || this.#readOnly || this.isEmpty())
                return;

            this.clear();
            this.events.onChanged.fire(this, { value: this.#value, event: e });
        }

        // converts the pointer position on screen to a position in the drawing
        #getPoint(e)
        {
            const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(this.#matrix);
            return { x: this.#round(point.x), y: this.#round(point.y) };
        }

        // returns the point exactly halfway between two points (the average of both x values and both y values)
        #getMidPoint(point1, point2)
        {
            return { x: this.#round((point1.x + point2.x) / 2), y: this.#round((point1.y + point2.y) / 2) };
        }

        // one decimal is precise enough and keeps the stored signature small
        #round(number)
        {
            return $lib.roundNumber(number, 1);
        }

        #applyLineStyle()
        {
            this.#svg.setAttribute('stroke', this.lineColor || 'currentColor'); // currentColor: the CSS color, so the line follows the theme
            this.#svg.setAttribute('stroke-width', this.lineWidth);
        }

        // returns the viewBox as numbers: [0, 0, width, height]
        #getViewBox()
        {
            return this.#svg.getAttribute('viewBox').split(' ').map(Number);
        }

        // builds the SVG markup of the signature with the given line color
        #buildSvg(stroke)
        {
            const size = this.#getViewBox(),
                paths = Array.from(this.#svg.querySelectorAll('path')).map(path => `<path d="${path.getAttribute('d')}"/>`).join('');

            return `<svg xmlns="${_svgNamespace}" viewBox="${size.join(' ')}" width="${size[2]}" height="${size[3]}" fill="none" stroke="${stroke}" stroke-width="${this.lineWidth}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
        }

        // shows a stored signature. the value comes from outside (input, server), so we never insert it as HTML:
        // we only take the size and the drawing instructions, and build our own elements from them
        #loadValue(value)
        {
            const source = new DOMParser().parseFromString(value, 'image/svg+xml').documentElement,
                size = (source.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);

            this.#svg.setAttribute('viewBox', size.join(' '));

            source.querySelectorAll('path').forEach(sourcePath =>
            {
                const pathData = sourcePath.getAttribute('d') || '';

                if (!_pathDataPattern.test(pathData)) // anything else than our own drawing instructions is ignored
                    return;

                $lib.element({ container: this.#svg, tag: 'path', isSvg: true, attrs: { d: pathData } });
            });
        }

        // loads SVG markup as an image, so it can be drawn on a canvas
        #loadImage(svgText)
        {
            return new Promise((resolve, reject) =>
            {
                const image = new Image();

                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error('SignaturePad: the signature could not be loaded as image.'));
                image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
            });
        }

        #updateState()
        {
            const locked = this.#disabled || this.#readOnly;

            this.classList.toggle(this.#getCssClass(this.classOption.EMPTY), this.isEmpty());
            this.classList.toggle(this.#getCssClass(this.classOption.DISABLED), this.#disabled);

            if (this.#input)
                this.#input.disabled = this.#disabled;

            if (!this.#clearButton)
                return;

            if (locked || this.isEmpty())
                this.#clearButton.disable();
            else
                this.#clearButton.enable();
        }

        #getCssClass(cssClassValue)
        {
            return super.getCssClass(this.classOption, cssClassValue);
        }
    }

    // Preserve HTMLElement prototype and extend it with $base.methods
    Object.assign(SignaturePad.prototype, Object.fromEntries(Object.entries($base.methods).filter(([key]) => !['render', 'destroy', 'getCssClass'].includes(key))));

    // Restore the constructor reference
    SignaturePad.prototype.constructor = SignaturePad;
    componyx.UI.SignaturePad = SignaturePad;

    // Define the custom element
    customElements.define(`${componyx.UI.tagPrefix}${SignaturePad.name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`, SignaturePad); // cui-signature-pad
})();