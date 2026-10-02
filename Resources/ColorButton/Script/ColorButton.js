/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * ColorButton class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
	componyx.UI.ColorButton = function ColorButton(id, properties)
    {
        // define private properties
        var _instance = this, _button,
            _themeOption = $base.static.ThemeOption, _colorPicker, _rgba,
        _hidden,
        _classOption =
        {
            COLORBOX: 'color-box'
        };

        // define public properties
        /**
         * Gets or sets the css class of the color box.
         * @type {String}
         */
        this.cssClassColorBox = '';

        /**
         * Gets or sets the color in the format Hue, Saturation, Brightness, Alpha.
         * @type {String|null}
         */
        this.hsba = null;

        /**
         * Gets or sets the color in the format Red, Green, Blue, Alpha.
         * @type {String|null}
         */
        this.rgba = null;

        /**
         * Gets or sets the color in the hexadecimal format.
         * @type {String}
         */
        this.hex = '';

        /**
         * Gets or sets the color in either hexadecimal or RGBA format.
         * @type {String}
         */
        this.value = '';

        /**
         * Gets or sets the clientid of the button.
         * @type {String|null}
         */
        this.buttonId = null;

        /**
         * Gets or sets the id of the corresponding colorpicker.
         * @type {String|null}
         */
        this.colorPickerId = null;

        /**
         * Gets or sets the id of the hidden input from which the settings are cloned.
         * @type {String|null}
         */
        this.hiddenInputId = null;


        /**
        * @class
        * @augments componyx.UI.base.Events
        * @memberof componyx.UI.ColorButton
        * @property {componyx.UI.base.Event} onConfirm    - Event which fires on a color change confirmation. @see {@link componyx.UI.ColorButton.ConfirmEventArgs}
        * @see {@link componyx.UI.base.Events}
        */
        function ColorButtonEvents(events)
        {
            Object.assign(this, events);

            this.onConfirm = $base.static.createEvent('onConfirm');
        };

        /**
         * ColorButton events
         * @type {componyx.UI.ColorButton.ColorButtonEvents}
         */
        this.events = new ColorButtonEvents(this.events);

        /**
         * ColorButton confirm event arguments.
         * @typedef {Object} ConfirmEventArgs
         * @memberof componyx.UI.ColorButton
         * @property {Number[]} rgba - The confirmed RGBA color value as [r, g, b, a].
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /**
         * Gets the RGBA color value.
         * @returns {String} The RGBA string value as in 'r,g,b,a' or '' if no color was set.
         */
        this.getValue = function ()
        {
            return _hidden.value;
        }

        /**
         * Sets the RGBA color value.
         * @param {String} rgbaValue The RGBA string value as in 'r,g,b,a'
         */
        this.setValue = function (rgbaValue)
        {
            this.setRGBA.apply(this, rgbaValue.split(','));
        }

        /**
         * Gets the RGBA color value
         * @returns {Array<Number>} The RGBA color value as array of numbers.
         */
        this.getRGBA = function ()
        {
            return _rgba.slice();
        }
        
        /** 
        * Sets the selected color to the specified RGBA color value.
        * @param {String} r Red value (0-255).
        * @param {String} g Green value (0-255).
        * @param {String} b Blue value (0-255).
        * @param {String} a=1 Alpha value (0-1).
        */
        this.setRGBA = function (r, g, b, a = 1)
        {
            _rgba = [r, g, b, a].map((v) => parseFloat(v));
            setColor.apply(_instance, _rgba);
        }

        /** 
        * Returns the current selected hex color value.
        */
        this.getHex = function ()
        {
            return $lib.rgbToHex.apply(_instance, _rgba);
        }

        /** 
        * Sets the selected color to the specified hex color value.
        * @param {String} value Hex color value.
        */
        this.setHex = function (value)
        {
            _rgba = $lib.hexToRgb(value);
            setColor.apply(_instance, _rgba);
        }

        /**
        * Returns the underlying Button component instance.
        * @returns {componyx.UI.Button}
        */
        this.getButton = function() { return _button; }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'color-button', false);
                return;
            }

            // render logic after loading resources
            draw();
        }
        
        /** 
        * Handles the post render procedure.
        */
        this.postRender = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING) // extra safety to never execute a postRender when the component state is incorrect
                return;

            postRender();
        }

        function preRender()
        {
            // initialize script and css
            return ['ColorButton', ['Button']];
        }

        function postRender()
        {
            var hsba;

            if (_instance.value)
            {
                if (_instance.value.startsWith('#')) // hex value
                    _rgba = $lib.hexToRgb(_instance.value.replace('#', ''));
                else
                    _rgba = _instance.value.split(',').map(v => parseFloat(v));
            }
            else if (_instance.rgba)
            {
                _rgba = _instance.rgba.split(',');
                $lib.each(_rgba, function (item, index)
                {
                    _rgba[index] = (index == 3) ? parseFloat(item) : parseInt(item, 10);
                });
            }
            else if (_instance.hsba)
            {
                hsba = _instance.hsba.split(',').map(v => parseFloat(v));
                _rgba = componyx.UI.ColorPicker.hsvToRgb.apply(_instance, hsba);
                _rgba[3] = hsba[3];
            }
            else
            {
                _rgba = [255, 0, 0, 0]; // red, but alpha level zero so no (real) color set
            }

            setColor.apply(_instance, _rgba);
            $base.methods.postRender.call(_instance);
        }

        function draw()
        {
            _hidden = _instance.createSyncedInput(_instance.hiddenInputId, function ()
            {
                _instance.setValue(this.value);
            });

            createButton(_instance.buttonId, _instance.element);

            if (_instance.colorPickerId)
            {
                _colorPicker = $UI.store[_instance.colorPickerId];

                if (_colorPicker.renderState == $base.static.RenderState.RENDERED)
                {
                    _instance.renderChildren();
                }
                else
                {
                    _colorPicker.events.onPostRender.priorityAdd(function ()
                    {
                        _instance.renderChildren();
                    });
                }
            }
            else
                _instance.renderChildren();
        }

        function createButton(cloneId, container)
        {
            var id = _instance.id + '_' + (cloneId || $lib.guid());
            _button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container });

            _button.primary = _button.transparentBorder = false;
            _button.transparent = true;
            _button.clone($UI.store[cloneId], _instance);
            _button.command = _button.command || expand;
            _button.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
            _button.showing = true;
            _button.setContentTemplate(createColorBox());
        }

        function createColorBox()
        {
            var div = document.createElement('div');
            div.appendChild(document.createElement('div'));
            div.className = _instance.cssClassColorBox || _classOption.COLORBOX;
            return div;
        }

        function expand()
        {
        	if (!_colorPicker)
        		return;

            const color = _rgba.slice();

            if (color[3] == 0)
                color[3] = 1;

            _colorPicker.expand(_button.element, color, confirm);
        }

        function confirm(colorPicker, args)
        {
            _rgba = args.rgba;
            setColor.apply(_instance, _rgba);
            _instance.events.onConfirm.fire(_instance, args);
        }

        function setColor(r, g, b, a)
        {
            if (a == undefined)
                a = 1;

            const value = [r, g, b, a].join(',');
            getColorBox().firstChild.style.backgroundColor = `rgba(${value})`;
            _hidden.__setValue(_instance.getRGBA()[3] === 0 ? '' : value); // not a real color if alpha is zero
        }

        function getColorBox()
        {
            return $lib(_instance.cssClassColorBox || _classOption.COLORBOX, _button.element, '', true);
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.ColorButton.prototype = Object.create($base.methods);
    componyx.UI.ColorButton.prototype.constructor = componyx.UI.ColorButton;

})(window);