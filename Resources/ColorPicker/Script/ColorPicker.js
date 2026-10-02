/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * ColorPicker class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    */
    componyx.UI.ColorPicker = function ColorPicker(id, properties)
    {
        // define private properties
        var _instance = this,
            _draggableSatPicker, _draggableHuePicker, _hex, _popupContent, _box,
            _confirm, _cancel, _clear, _rgba, _confirmCallback,
            _themeOption = $base.static.ThemeOption,
            _classOption =
            {
                SATURATION: 'saturation',
                HUE: 'hue',
                PREVIEW: 'preview',
                INPUTCONTAINER: 'input-container',
                PICKER: 'picker',
                RGB: 'rgb',
                HSB: 'hsb',
                ALPHA: 'alpha',
                HEX: 'hex',
                BUTTON: 'button'
            };

        // define public properties
        /**
         * Gets or sets the css class of the preview color box.
         * @type {String}
         */
        this.cssClassPreview = '';

        /**
         * Gets or sets the css class of the saturation palette.
         * @type {String}
         */
        this.cssClassSaturation = '';

        /**
         * Gets or sets the css class of the hue palette.
         * @type {String}
         */
        this.cssClassHue = '';

        /**
         * Gets or sets the css class of the input container.
         * @type {String}
         */
        this.cssClassInputContainer = '';

        /**
         * Gets or sets the css class of the saturation and hue picker.
         * @type {String}
         */
        this.cssClassPicker = '';

        /**
         * Gets or sets the css class of the hue-saturation-brightness(value) input container.
         * @type {String}
         */
        this.cssClassHSB = '';

        /**
         * Gets or sets the css class of the red-green-blue input container.
         * @type {String}
         */
        this.cssClassRGB = '';

        /**
         * Gets or sets the css class of the alpha input container.
         * @type {String}
         */
        this.cssClassAlpha = '';

        /**
         * Gets or sets the css class of the hex input container.
         * @type {String}
         */
        this.cssClassHex = '';

        /**
         * Gets or sets the css class appended to the confirm button.
         * @type {String}
         */
        this.cssClassConfirmButton = '';

        /**
         * Gets or sets the css class appended to the cancel button.
         * @type {String}
         */
        this.cssClassCancelButton = '';

        /**
         * Gets or sets the css class appended to the clear button.
         * @type {String}
         */
        this.cssClassClearButton = '';

        /**
         * Gets or sets the text label of the confirm button.
         * @type {String}
         */
        this.confirmButtonLabel = 'OK';

        /**
         * Gets or sets the text label of the cancel button.
         * @type {String}
         */
        this.cancelButtonLabel = 'Cancel';

        /**
         * Gets or sets the text label of the clear button.
         * @type {String}
         */
        this.clearButtonLabel = 'No Color';

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
         * Gets or sets a value indicating if the color picker is displayed within a popup with a color box as popup trigger.
         * @type {Boolean}
         */
        this.popupView = false;

        /**
         * Gets or sets the clientid of the numeric box.
         * @type {String|null}
         */
        this.numericBoxId = null;

        /**
         * Gets or sets the clientid of the popup box.
         * @type {String|null}
         */
        this.boxId = null;

        /**
         * Gets or sets the id of the component from which the settings are cloned for the confirm button.
         * @type {String|null}
         */
        this.confirmButtonId = null;

        /**
         * Gets or sets the id of the component from which the settings are cloned for the cancel button.
         * @type {String|null}
         */
        this.cancelButtonId = null;

        /**
         * Gets or sets the id of the component from which the settings are cloned for the clear button.
         * @type {String|null}
         */
        this.clearButtonId = null;


        /**
        * @class
        * @augments componyx.UI.base.Events
        * @memberof componyx.UI.ColorPicker
        * @property {componyx.UI.base.Event} onChange    - Event which fires on a color change. @see {@link componyx.UI.ColorPicker.ColorPickerEventArgs}
        * @property {componyx.UI.base.Event} onConfirm   - Event which fires on a color change confirmation. @see {@link componyx.UI.ColorPicker.ColorPickerEventArgs}
        * @see {@link componyx.UI.base.Events}
        */
        function ColorPickerEvents(events)
        {
            Object.assign(this, events);

            this.onChange = $base.static.createEvent('onChange');
            this.onConfirm = $base.static.createEvent('onConfirm');
        };

        /**
         * ColorPicker events
         * @type {componyx.UI.ColorPicker.ColorPickerEvents}
         */
        this.events = new ColorPickerEvents(this.events);

        /**
         * @typedef {Object} componyx.UI.ColorPicker.ColorPickerEventArgs
         * @property {componyx.UI.ColorPicker} ColorPicker - The ColorPicker instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {number[]} eventArgs.rgba - The RGBA color value as [r, g, b, a].
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);

        /**
        * Gets the corresponding box component.
        * @returns {componyx.UI.Box} The box component.
        */
        this.getBox = function ()
        {
            return _box;
        }

        /** 
        * Expands the colorpicker popup box.
        * @param {HTMLElement|String} [expander] The expander element or id of the expander element.
        * @param {String[]} [rgba] RGBA color value.
        * @param {Function} [confirmCallback] The callback function to call when the color is confirmed through the confirm button.
        * @param {componyx.UI.Box.AutoPositionOption} [boxPosition] The popup box autoPosition.
        * @param {Boolean} [modal] A value indicating if the colorpicker popup is shown as modal.
        * @param {Boolean} [toggle] A value indicating if the colorpicker popup hides when already showing.
        */
        this.expand = function (expander, rgba, confirmCallback, boxPosition, modal, toggle)
        {
            _confirmCallback = confirmCallback;

            if (expander)
            {
                _box.expander = expander;
                _box.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND;
            }
            else
            {
                _box.expander = null;
                _box.autoPosition = componyx.UI.Box.AutoPositionOption.CENTER;
            }

            if (boxPosition)
                _box.position = boxPosition;

            if (rgba)
            {
                _rgba = rgba;
                this.setRGBA.apply(_instance, rgba);
            }

            _box.modal = modal || false;

            if (toggle)
                togglePopup();
            else
                _box.show();
        }

        /** 
        * Returns the current selected HSBA color value.
        */
        this.getHSBA = function ()
        {
            return getHSBA();
        }

        /** 
        * Sets the selected color to the specified HSBA color value.
        * @param {Number} h Hue value (0-1).
        * @param {Number} s Saturation value (0-1).
        * @param {Number} b Brightness value (0-1).
        * @param {Number} a Alpha value (0-1).
        */
        this.setHSBA = function (h, s, b, a)
        {
            setHSBA(h, s, b, ($lib.isEmpty(a)) ? 1 : a);
            hsbChanged();
        }

        /** 
        * Returns the current selected RGBA color value.
        */
        this.getRGBA = function ()
        {
            return getRGBA();
        }

        /** 
        * Sets the selected color to the specified RGBA color value.
        * @param {Number} r Red value (0-255).
        * @param {Number} g Green value (0-255).
        * @param {Number} b Blue value (0-255).
        * @param {Number} a Alpha value (0-1).
        */
        this.setRGBA = function (r, g, b, a)
        {
            setRGBA(r, g, b, ($lib.isEmpty(a)) ? 1 : a);
            rgbChanged();
        }

        /** 
        * Returns the current selected hex color value.
        */
        this.getHex = function ()
        {
            return getHex();
        }

        /** 
        * Sets the selected color to the specified hex color value.
        * @param {String} value Hex color value.
        */
        this.setHex = function (value)
        {
            setHex(value)
            hexChanged();
        }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'color-picker', false);
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

        /** 
         * Destroys the component.
         * @see {@link componyx.UI.base.methods#destroy}
         */
        this.destroy = function (...args)
        {
            dispose();
            $base.methods.destroy.call(this, ...args);
        }

        function preRender()
        {
            // initialize script and css
            var script = ['NumericBox'];

            if (_instance.popupView)
            {
                script.push('Button');
                script.push('Box');
            }

            return ['ColorPicker', script];
        }

        function postRender()
        {
            var hsba;

            if (_box)
                _box.update(_popupContent);

            if (_instance.rgba)
            {
                _rgba = _instance.rgba.split(',');

                $lib.each(_rgba, function (item, index)
                {
                    _rgba[index] = (index == 3) ? parseFloat(item) : parseInt(item, 10);
                });

                setRGBA.apply(_instance, _rgba);
                rgbChanged();
            }
            else if (_instance.hsba)
            {
                hsba = _instance.hsba.split(',');
                $lib.each(hsba, function (item, index)
                {
                    hsba[index] = parseFloat(item);
                });

                setHSBA.apply(_instance, _instance.hsba.split(/\D/));
                hsbChanged();
            }
            else
            {
                setHex(_instance.hex || 'ff0000');
                hexChanged();
            }

            _rgba = getRGBA();
            $base.methods.postRender.call(_instance);
        }

        function draw()
        {
            var el = _instance.element;

            if (_instance.popupView)
                createPopup(el);
            else
                createContent(el);

            _instance.renderChildren();
        }

        function createContent(container)
        {
            var divSB = document.createElement('div'),
                divHue = document.createElement('div'),
                divInputContainer = document.createElement('div'),
                divHSB = document.createElement('div'),
                divRGB = document.createElement('div'),
                divAlpha = document.createElement('div'),
                divHex = document.createElement('div');

            divSB.className = _instance.cssClassSaturation || _classOption.SATURATION;
            divHue.className = _instance.cssClassHue || _classOption.HUE;
            divInputContainer.className = _instance.cssClassInputContainer || _classOption.INPUTCONTAINER;
            divHSB.className = _instance.cssClassHSB || _classOption.HSB;
            divRGB.className = _instance.cssClassRGB || _classOption.RGB;
            divAlpha.className = _instance.cssClassAlpha || _classOption.ALPHA;
            divHex.className = _instance.cssClassHex || _classOption.HEX;

            container.appendChild(divSB);
            container.appendChild(divHue);
            container.appendChild(divInputContainer);

            createColorBox(divInputContainer, _instance.cssClassPreview || _classOption.PREVIEW);
            divInputContainer.appendChild(divHSB)
            divInputContainer.appendChild(divRGB);
            divInputContainer.appendChild(divAlpha);
            divInputContainer.appendChild(divHex);

            createSaturationPicker(divSB);
            createHuePicker(divHue);
            createNumericBox(divHSB, 'h', 360, hsbChanged);
            createNumericBox(divHSB, 's', 100, hsbChanged);
            createNumericBox(divHSB, 'v', 100, hsbChanged);
            createNumericBox(divRGB, 'r', 255, rgbChanged);
            createNumericBox(divRGB, 'g', 255, rgbChanged);
            createNumericBox(divRGB, 'b', 255, rgbChanged);
            createNumericBox(divAlpha, 'a', 100, alphaChanged);
            createTextBox(divHex, 'hex', hexChanged);
            $lib.on(divSB, 'mousedown', saturationSelect);
            $lib.on(divHue, 'mousedown', hueSelect);

            return container;
        }

        function createButton(container, id, cloneId, config)
        {
            var id = _instance.id + id,
                button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container });

            button.transparentBorder = button.primary = false;
            button.clone($UI.store[cloneId], _instance);
            button.cssClass = button.cssClass || (_classOption.BUTTON + (config.cssClass ? " " + config.cssClass : ""));
            button.text = config.text;
            button.command = config.command;
            button.primary = config.primary || false;
            button.transparent = config.transparent || false;
            button.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
            button.showing = true;

            return button;
        }

        function createColorBox(container, css)
        {
            var div = document.createElement('div');
            div.appendChild(document.createElement('div'));
            div.className = css;
            container.appendChild(div);
        }

        function createPopup()
        {
            var id = _instance.id + '_Box', buttonContainer;

            _box = $UI.createComponent(componyx.UI.Box, { id: id, containerElement: _instance.element });

            _box.clone($UI.store[_instance.boxId], _instance);
            _box.cssClass = _box.cssClass || _instance.cssClassPopupBox || _classOption.BOX;
            _box.showing = false;
            _box.hideOnOutsideClick = _box.autoResizeFit = _box.autoInvertFit = true;
            _box.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND;
            _box.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);

            _popupContent = _instance.element.appendChild(document.createElement('div'));
            createContent(_popupContent);

            buttonContainer = _popupContent.appendChild(document.createElement('div'));
            _confirm = createButton(buttonContainer, 'confirm', _instance.confirmButtonId,
                {
                    cssClass: _instance.cssClassConfirmButton,
                    text: _instance.confirmButtonLabel,
                    command: confirm,
                    primary: true
                });
            _cancel = createButton(buttonContainer, 'cancel', _instance.cancelButtonId,
                {
                    cssClass: _instance.cssClassCancelButton,
                    text: _instance.cancelButtonLabel,
                    command: cancel
                });
            _clear = createButton(buttonContainer, 'clear', _instance.clearButtonId,
                {
                    cssClass: _instance.cssClassClearButton,
                    text: _instance.clearButtonLabel,
                    command: clear,
                    transparent: true
                });
        }

        function createSaturationPicker(container)
        {
            var divPicker = createPicker(container), pos,
                overshootX = $lib.styleValue(divPicker, 'left', true),
                overshootY = $lib.styleValue(divPicker, 'top', true);

            overshootX = (!$lib.isEmpty(overshootX)) ? Math.abs(parseInt(overshootX, 10)) : 0;
            overshootY = (!$lib.isEmpty(overshootY)) ? Math.abs(parseInt(overshootY, 10)) : 0;

            divPicker.style.top = $lib.unit(overshootY * -1);
            divPicker.style.left = $lib.unit(255 - overshootX);

            _draggableSatPicker = $lib.draggable(divPicker,
                {
                    boundaryZone: container,
                    boundaryOvershootLeft: overshootX,
                    boundaryOvershootRight: overshootX,
                    boundaryOvershootTop: overshootY,
                    boundaryOvershootBottom: overshootY,
                    onDrag: function (args)
                    {
                        $lib.defer(drag.bind(this, args));
                    }.bind(this)
                });

            return divPicker;
        }

        function createHuePicker(container)
        {
            var divPicker = createPicker(container), pos,
                overshootY = $lib.styleValue(divPicker, 'top', true);

            overshootY = (!$lib.isEmpty(overshootY)) ? Math.abs(parseInt(overshootY, 10)) : 0;
            divPicker.style.top = $lib.unit(overshootY * -1);

            _draggableHuePicker = $lib.draggable(divPicker,
                {
                    boundaryZone: container,
                    boundaryOvershootTop: overshootY,
                    boundaryOvershootBottom: overshootY,
                    dragX: false,
                    onDrag: function (args)
                    {
                        $lib.defer(drag.bind(this, args));
                    }.bind(this)
                });

            return divPicker;
        }

        function drag(args)
        {
            let el = args.element,
                elPos = $lib.getPos(el),
                transform = el.style.transform,
                left = el.style.left,
                top = el.style.top;

            el.style.transform = "";
            el.style.left = el.style.top = '';
            $.setPos(el, { left: elPos.left, top: elPos.top }); // force element at position
            sliderChanged();
            el.style.transform = transform;
            el.style.left = left;
            el.style.top = top;
        }


        function createPicker(container)
        {
            var divPicker = container.appendChild(document.createElement('div'));
            divPicker.className = _instance.cssClassPicker || _classOption.PICKER;
            return divPicker;
        }

        function createNumericBox(container, id, maxValue, onChange)
        {
            id = _instance.id + '_' + id;
            var input = $UI.createComponent(componyx.UI.NumericBox, { id: id, containerElement: container });

            input.clone($UI.store[_instance.numericBoxId], _instance);
            input.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);
            input.maxLength = 3;
            input.minValue = 0;
            input.maxValue = maxValue;
            input.showing = true;
            input.events.onChange.priorityAdd(onChange, null);
        }

        function createTextBox(container)
        {
            var div = container.appendChild(document.createElement('div'));

            _hex = div.appendChild(document.createElement('input'));
            _hex.id = _instance.id + '_hex';
            _hex.type = 'text';
            _hex.maxLength = 6;

            $lib.on(_hex, 'keydown', function (e)
            {
                var key = e.key;

                return (e.ctrlKey || (' End Home ArrowLeft ArrowUp ArrowRight ArrowDown Delete Backspace Tab 0 1 2 3 4 5 6 7 8 9 A B C D E F '.indexOf(' ' + key.toString() + ' ') > -1));
            });

            $lib.on(_hex, 'keyup', hexChanged);
        }

        function togglePopup()
        {
            if (!_box.showing)
                _box.show();
            else
                _box.hide();
        }

        function confirm()
        {
            _rgba = getRGBA();
            _box.hide();

            if (_confirmCallback)
                _confirmCallback(_instance, { rgba: _rgba });

            _confirmCallback = null;
            _instance.events.onConfirm.fire(_instance, { rgba: _rgba });
        }

        function cancel()
        {
            setRGBA.apply(_instance, _rgba);
            rgbChanged();
            _box.hide();
        }
        function clear()
        {
            const color = _rgba.slice();

            color[3] = 0;
            setRGBA.apply(_instance, color);
            rgbChanged();
        }

        function saturationSelect()
        {
            var scroll = $lib.getScrollPosition(),
                overshootX = _draggableSatPicker.settings.boundaryOvershootLeft,
                overshootY = _draggableSatPicker.settings.boundaryOvershootTop,
                parentNode = _draggableSatPicker.element.parentNode,
                parentPos = $lib.getPos(parentNode),
                parentDev = $lib.borderAndPadding(parentNode),
                minY = (parentPos.top + parentDev.borderTop) - overshootY,
                maxY = (parentPos.top + parentDev.borderTop) + (255 - overshootY),
                minX = (parentPos.left + parentDev.borderLeft) - overshootX,
                maxX = (parentPos.left + parentDev.borderLeft) + (255 - overshootX),
                clientX = ($lib.clientX($lib.event) + scroll.scrollLeft) - overshootX,
                clientY = ($lib.clientY($lib.event) + scroll.scrollTop) - overshootY;

            if (clientX < minX)
                clientX = minX;
            if (clientX > maxX)
                clientX = maxX;

            if (clientY < minY)
                clientY = minY;
            if (clientY > maxY)
                clientY = maxY;

            $lib.setPos(_draggableSatPicker.element, { top: clientY, left: clientX });
            sliderChanged();
            _draggableSatPicker.startDrag($lib.event);
        }

        function hueSelect(e)
        {
            var scroll = $lib.getScrollPosition(),
                overshootY = _draggableHuePicker.settings.boundaryOvershootTop,
                parentNode = _draggableHuePicker.element.parentNode,
                parentPos = $lib.getPos(parentNode),
                parentDev = $lib.borderAndPadding(parentNode),
                minY = (parentPos.top + parentDev.borderTop) - overshootY,
                maxY = (parentPos.top + parentDev.borderTop) + (255 - overshootY),
                clientY = ($lib.clientY(e) + scroll.scrollTop) - overshootY;

            if (clientY < minY)
                clientY = minY;
            if (clientY > maxY)
                clientY = maxY;

            $lib.setPos(_draggableHuePicker.element, { top: clientY });
            sliderChanged();
            _draggableHuePicker.startDrag(e);
        }

        function sliderChanged()
        {
            var hPicker = _draggableHuePicker, sPicker = _draggableSatPicker,
                h = 1 - (Math.round(hPicker.element.style.top.replace(/[^0-9\.\-]/g, '')) + hPicker.settings.boundaryOvershootTop) / 255,
                s = (Math.round(sPicker.element.style.left.replace(/[^0-9\.\-]/g, '')) + sPicker.settings.boundaryOvershootLeft) / 255,
                b = 1 - (Math.round(sPicker.element.style.top.replace(/[^0-9\.\-]/g, '')) + sPicker.settings.boundaryOvershootTop) / 255,
                rgba = hsvToRgb(h, s, b),
                alpha = getAlpha();

            if (alpha === 0)
            {
                alpha = 1;
                setAlpha(alpha);
            }

            rgba.push(alpha);
            setSaturationBaseColor(h);
            setPreview.apply(_instance, rgba);
            setHSBA(h, s, b);
            setRGBA.apply(_instance, rgba);
            setHex($lib.rgbToHex.apply(_instance, rgba));
            changed();
        }

        function hsbChanged()
        {
            var hsb = [], rgba;
            hsb[0] = $UI.store[_instance.id + '_h'].getValue() || 0;
            hsb[1] = $UI.store[_instance.id + '_s'].getValue() || 0;
            hsb[2] = $UI.store[_instance.id + '_v'].getValue() || 0;

            hsb[0] /= 360;
            hsb[1] /= 100;
            hsb[2] /= 100;
            rgba = hsvToRgb.apply(_instance, hsb);
            rgba.push(getAlpha());

            setSaturationBaseColor(hsb[0]);
            setPreview.apply(_instance, rgba);
            setRGBA.apply(_instance, rgba);
            setHex($lib.rgbToHex.apply(_instance, rgba));
            setSliders.apply(_instance, hsb);
            changed();
        }

        function rgbChanged()
        {
            var rgba = getRGBA(),
                hsb = rgbToHsv.apply(_instance, rgba);

            hsb.push(getAlpha());
            setSaturationBaseColor(hsb[0]);
            setPreview.apply(_instance, rgba);
            setHSBA.apply(_instance, hsb);
            setHex($lib.rgbToHex.apply(_instance, rgba));
            setSliders.apply(_instance, hsb);
            changed();
        }

        function alphaChanged()
        {
            setPreview.apply(_instance, getRGBA());
            changed();
        }

        function hexChanged()
        {
            var rgba = $lib.hexToRgb($lib('#' + _instance.id + '_hex').value || 0),
                hsb = rgbToHsv.apply(_instance, rgba);

            rgba.push(getAlpha());
            setSaturationBaseColor(hsb[0]);
            setPreview.apply(_instance, rgba);
            setHSBA.apply(_instance, hsb);
            setRGBA.apply(_instance, rgba);
            setSliders.apply(_instance, hsb);
            changed();
        }

        function changed()
        {
            _instance.events.onChange.fire(_instance, { rgba: getRGBA() });
        }

        function setSaturationBaseColor(h)
        {
            var step = h / (1 / 6),
                pos = step - Math.floor(step),
                r = 0, g = 0, b = 0;

            if (step == 6)
                step = 0;

            switch (Math.floor(step))
            {
                case 0:
                    r = 255;
                    g = pos * 255;
                    break;
                case 1:
                    r = 255 - (pos * 255);
                    g = 255;
                    break;
                case 2:
                    g = 255;
                    b = pos * 255;
                    break;
                case 3:
                    g = 255 - (pos * 255);
                    b = 255;
                    break;
                case 4:
                    r = pos * 255;
                    b = 255;
                    break;
                case 5:
                    r = 255;
                    b = 255 - (pos * 255);
                    break;
            }

            $lib(_instance.cssClassSaturation || _classOption.SATURATION, _instance.element, 'div', true).style.backgroundColor = "rgba(" + [Math.round(r), Math.round(g), Math.round(b), 1].join(',') + ")";
        }

        function setSliders(h, s, b)
        {
            _draggableHuePicker.element.style.top = $lib.unit(((1 - h) * 255) - _draggableHuePicker.settings.boundaryOvershootTop);
            _draggableSatPicker.element.style.left = $lib.unit((s * 255) - _draggableSatPicker.settings.boundaryOvershootLeft);
            _draggableSatPicker.element.style.top = $lib.unit(((1 - b) * 255) - _draggableSatPicker.settings.boundaryOvershootTop);
        }

        function setHSBA(h, s, b, a)
        {
            h = Math.round(h * 360);
            $UI.store[_instance.id + '_h'].setValue((h == 360) ? 0 : h);
            $UI.store[_instance.id + '_s'].setValue(Math.round(s * 100));
            $UI.store[_instance.id + '_v'].setValue(Math.round(b * 100));
            setAlpha(a);
        }

        function setRGBA(r, g, b, a)
        {
            $UI.store[_instance.id + '_r'].setValue(r);
            $UI.store[_instance.id + '_g'].setValue(g);
            $UI.store[_instance.id + '_b'].setValue(b);
            setAlpha(a)
        }

        function setAlpha(a)
        {
            if (!$lib.isEmpty(a))
                $UI.store[_instance.id + '_a'].setValue(Math.round(a * 100));
            else if ($lib.isEmpty($UI.store[_instance.id + '_a'].getValue()))
                $UI.store[_instance.id + '_a'].setValue(100);
        }

        function setHex(hex)
        {
            _hex.value = hex.replace('#', '');
        }

        function setPreview(r, g, b, a)
        {
            a = ($lib.isEmpty(a)) ? 100 : a;
            $lib(_instance.cssClassPreview || _classOption.PREVIEW, _instance.element, 'div', true).firstChild.style.backgroundColor = "rgba(" + [r, g, b, a].join(',') + ")";
        }

        function getHSBA()
        {
            var hsba = [];

            hsba[0] = parseInt($UI.store[_instance.id + '_h'].getValue() || 0, 10);
            hsba[1] = parseInt($UI.store[_instance.id + '_s'].getValue() || 0, 10);
            hsba[2] = parseInt($UI.store[_instance.id + '_v'].getValue() || 0, 10);
            hsba[3] = getAlpha();

            return hsba;
        }

        function getRGBA()
        {
            var rgba = [];
            rgba[0] = parseInt($UI.store[_instance.id + '_r'].getValue() || 0, 10);
            rgba[1] = parseInt($UI.store[_instance.id + '_g'].getValue() || 0, 10);
            rgba[2] = parseInt($UI.store[_instance.id + '_b'].getValue() || 0, 10);
            rgba[3] = getAlpha();
            return rgba;
        }

        function getHex()
        {
            return '#' + _hex.value;
        }

        function getAlpha()
        {
            return parseInt($UI.store[_instance.id + '_a'].getValue() || 100, 10) / 100;
        }

        function rgbToHsv(r, g, b) { return componyx.UI.ColorPicker.rgbToHsv(r, g, b); }
        function hsvToRgb(h, s, v) { return componyx.UI.ColorPicker.hsvToRgb(h, s, v); }

        function dispose()
        {
            _box = null;
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.ColorPicker.prototype = Object.create($base.methods);
    componyx.UI.ColorPicker.prototype.constructor = componyx.UI.ColorPicker;

    /** 
    * Converts the rgb value to hsv.
    * @param {Number} r The red value 0-255.
    * @param {Number} g The green value 0-255.
    * @param {Number} b The blue value 0-255.
    * @returns {Number[]} The hue saturation value.
    */
    componyx.UI.ColorPicker.rgbToHsv = function (r, g, b)
    {
        return $lib.rgbToHsv(r, g, b);
    }

    /** 
    * Converts the hsv value to rgb.
    * @param {Number} h The hue value 0-1.
    * @param {Number} s The saturation value 0-1.
    * @param {Number} v The lightness value 0-1.
    * @returns {Number[]} The rgb value.
    */
    componyx.UI.ColorPicker.hsvToRgb = function (h, s, v)
    {
        return $lib.hsvToRgb(h, s, v);
    }
})(window);