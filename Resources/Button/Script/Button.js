/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * Button class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.Component
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.Button = function Button(id, properties)
    {
        // define private properties
        let _instance = this,
            _contentElement,
            _sizeOption = componyx.UI.Button.SizeOption,
            _typeOption = componyx.UI.Button.TypeOption,
            _expandDirectionOption = componyx.UI.Button.ExpandDirectionOption,
            _alignOption = componyx.UI.Button.AlignOption,
            _decorationOption = componyx.UI.Button.DecorationOption,
            _divCommand, _divExpand, _handlers = [], _anchor,
            _ripple = new Map(),
            _rippleTimerId,
            _isKeyboardNavigation,
            _classOption =
            {
                SIZE_PREFIX: 'size-',
                CONTENT_ALIGN: 'content',
                SPLIT: 'split',
                TRANSPARENT: 'lucent',
                BASIC: 'basic',
                PRIMARY: 'pri',
                BORDER: 'border',
                COMMAND: 'command',
                ICON: 'icon',
                CONTENT_HOLDER: 'content-holder',
                EXPAND: 'expand',
                EXPAND_ICON: 'expand-icon',
                CHECK: 'check',
                RADIO: 'radio',
                RIPPLE: 'ripple',
                RIPPLE_MASK: 'ripple-mask',
                UNDERLINE: 'line-under',
                OVERLINE: 'line-over',
                FRONTLINE: 'line-front',
                BACKLINE: 'line-back'
            };

        // define public properties
        /**
         * Gets or sets the content align class. This class is followed by a hyphen (-) with the current align option and is appended to the button class. Default: content-left
         * @type {String}
         */
        this.cssClassContentAlign = '';

        /**
         * Gets or sets the icon align class. This class is followed by a hyphen (-) with the current align option and is appended to the button class. Default: icon-left       
         * @type {String}
         */
        this.cssClassIconAlign = '';

        /**
         * Gets or sets the css class for a split button.
         * @type {String}
         */
        this.cssClassSplit = '';

        /**
         * Gets or sets the css class of the command button in a split button.
         * @type {String}
         */
        this.cssClassCommand = '';

        /**
         * Gets or sets the css class of the expand button in a split button.
         * @type {String}
         */
        this.cssClassExpand = '';

        /**
         * Gets or sets the css class of the expand icon in a split button.
         * @type {String}
         */
        this.cssClassExpandIcon = '';

        /**
         * Gets or sets the css class of the button icon.
         * @type {String}
         */
        this.cssClassIcon = '';

        /**
         * Gets or sets the css class of the content holder within the button.
         * @type {String}
         */
        this.cssClassContentHolder = '';

        /**
         * Gets or sets the shortcut key to trigger this button e.g. 'z', 'ctrl+z', 'alt+s'. If no modifier is provided, `ctrl` is assumed by default.
         * @type {String|null}
         */
        this.shortcutKey = null;

        /**
         * Gets or sets the DOM element (or its identifier, or a function returning it) within which this shortcut is active. If `null`, the shortcut is globally active (i.e., it works anywhere).
         * @type {HTMLElement|String|Function|null}
         */
        this.shortcutScope = null;

        /**
         * Gets or sets a value indicating if the button keyboard navigation for expanding/collapsing is enabled when it has an expandable feature (menuId, boxId or expandCommand).
         * @type {Boolean}
         */
        this.keyboardExpand = true;

        /**
         * Gets or sets the href (hypertext reference) of the button. Applies to non-split buttons only.
         * @type {String|null}
         */
        this.href = null;

        /**
         * Gets or sets the href target of the button. Applies to non-split buttons only.
         * @type {String|null}
         */
        this.target = null;

        /**
         * Gets or sets the command action of the button.
         * @type {Function|String|null}
         */
        this.command = null;

        /**
         * Gets or sets an expand command action.
         * @type {Function|String|null}
         */
        this.expandCommand = null;

        /**
         * Gets or sets an collapse command action.
         * @type {Function|String|null}
         */
        this.collapseCommand = null;

        /**
         * Gets or sets the text of the button.
         * @type {String|null}
         */
        this.text = null;

        /**
         * Gets or sets the URL of the icon.
         * @type {String|null}
         */
        this.iconUrl = null;

        /**
         * Gets or sets the size option.
         * @type {componyx.UI.Button.SizeOption}
         */
        this.size = _sizeOption.MEDIUM;

        /**
         * Gets or sets the content alignment option.
         * @type {componyx.UI.Button.AlignOption}
         */
        this.contentAlign = _alignOption.CENTER;

        /**
         * Gets or sets the icon alignment option.
         * @type {componyx.UI.Button.AlignOption}
         */
        this.iconAlign = _alignOption.LEFT;

        /**
         * Gets or sets the type of the button.
         * @type {componyx.UI.Button.TypeOption}
         */
        this.type = _typeOption.COMMANDBUTTON;

        /**
         * Gets or sets the expand direction of the button.
         * @type {componyx.UI.Button.ExpandDirectionOption}
         */
        this.expandDirection = _expandDirectionOption.DOWN;

        /**
         * Gets or sets the decoration type used when the button is hovered/selected.
         * @type {componyx.UI.Button.DecorationOption}
         */
        this.decoration = _decorationOption.BACKGROUND;

        /**
         * Gets or sets the radio group id.
         * @type {String|null}
         */
        this.radioGroupId = null;

        /**
         * Gets or sets a value indicating if the identifier of the component is rendered in the HTML output of the root element.
         * @type {Boolean}
         */
        this.renderId = true;

        /**
         * Gets or sets a value indicating whether the PostBack event is automatically fired.
         * @type {Boolean}
         */
        this.autoPostBack = false;

        /**
         * Gets or sets if the icon span tag should be rendered.
         * @type {Boolean}
         */
        this.hasIcon = false;

        /**
         * Gets or sets a value indicating whether the button is disabled.
         * @type {Boolean}
         */
        this.disabled = false;

        /**
         * Gets or sets a value indicating whether the button is selected.
         * @type {Boolean}
         */
        this.selected = false;

        /**
         * Gets or sets a value indicating whether the button is in expanded state.
         * @type {Boolean}
         */
        this.expanded = false;;

        /**
         * Gets or sets a value indicating if the button has two actions.
         * @type {Boolean}
         */
        this.split = false;

        /**
         * Gets or sets a value indicating if the button's default background color is transparent.
         * @type {Boolean}
         */
        this.transparent = false;

        /**
         * Gets or sets a value indicating if the button's default border color is transparent.
         * @type {Boolean}
         */
        this.transparentBorder = true;

        /**
         * Gets or sets a value indicating if the button is a primary button. When disabled the button's default style will be less prominent (basic) unless styled otherwise.
         * @type {Boolean}
         */
        this.primary = true;

        /**
         * Gets or sets a value indicating if the ripple animation is activated on a command/expand click event.
         * @type {Boolean}
         */
        this.rippleAnimation = true;

        /**
         * Gets or sets which menu to expand when the expand button is clicked.
         * @type {String|null}
         */
        this.menuId = null;

        /**
         * Gets or sets a menu root item to expand on the corresponding menu when the expand button is clicked.
         * @type {String|null}
         */
        this.menuItemId = null;

        /**
         * Gets or sets which box to expand when the expand button is clicked.
         * @type {String|null}
         */
        this.boxId = null;

        /**
         * Gets or sets the tooltip manager used to display tooltips.
         * @type {String|null}
         */
        this.tooltipManagerId = null;

        /**
         * Gets or sets the id of the tooltip to show.
         * @type {String|null}
         */
        this.tooltipId = null;

        /**
         * Gets the element which contains the button content.
         * @type {HTMLElement}
         */
        Object.defineProperty(this, 'contentElement',
            {
                get: function () { return _contentElement; }
            });


        /**
          * @class
          * @augments componyx.UI.base.Events
          * @memberof componyx.UI.Button
          * @property {componyx.UI.base.Event} onFocus                - Fires when the button is focused. @see {@link componyx.UI.base.EventArgs}
          * @property {componyx.UI.base.Event} onBlur                 - Fires when the button is blurred. @see {@link componyx.UI.base.EventArgs}
          * @property {componyx.UI.base.Event} onPointerEnter          - Fires on pointerenter. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onPointerLeave          - Fires on pointerleave. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onPointerDown           - Fires on pointerdown. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onPointerUp             - Fires on pointerup. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onDblClick              - Fires on double click. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onSelect                - Fires on select. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onDeselect              - Fires on deselect. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onCommandClick          - Fires on command click. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onCommandPointerEnter   - Fires on command pointerenter. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onCommandPointerLeave   - Fires on command pointerleave. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onCommandPointerDown    - Fires on command pointerdown. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onCommandPointerUp      - Fires on command pointerup. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onCommandDblClick       - Fires on command double click. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onExpandClick           - Fires on expand click. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onExpandPointerEnter    - Fires on expand pointerenter. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onExpandPointerLeave    - Fires on expand pointerleave. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onExpandPointerDown     - Fires on expand pointerdown. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onExpandPointerUp       - Fires on expand pointerup. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @property {componyx.UI.base.Event} onExpandDblClick        - Fires on expand double click. @see {@link componyx.UI.Button.ButtonEventArgs}
          * @see {@link componyx.UI.base.Events}
          */
        function ButtonEvents(events)
        {
            Object.assign(this, events);

            // Base events
            const baseEvents = [
                'Focus', 'Blur',
                'PointerEnter', 'PointerLeave',
                'PointerDown', 'PointerUp', 'DblClick',
                'Select', 'Deselect'
            ];

            baseEvents.forEach(name =>
            {
                this[`on${name}`] = $base.static.createEvent(`on${name}`);
            });

            // Command + Expand groups
            ['Command', 'Expand'].forEach(prefix =>
            {
                ['Click', 'PointerEnter', 'PointerLeave', 'PointerDown', 'PointerUp', 'DblClick']
                    .forEach(name =>
                    {
                        this[`on${prefix}${name}`] = $base.static.createEvent(`on${prefix}${name}`);
                    });
            });
        };

        /**
         * Button events
          * @type {componyx.UI.Button.ButtonEvents}
        */
        this.events = new ButtonEvents(this.events);


        /**
         * @typedef {Object} componyx.UI.Button.ButtonEventArgs
         * @property {componyx.UI.Button} Button - The Button instance.
         * @property {Object} eventArgs - The event object containing more detailed information about the event.
         * @property {Event} eventArgs.event - The original event object.
         */

        // inherit base instance members
        $base.Component.apply(this, [id, properties]);


        /**
         * A value indicating if the last action was triggered via keyboard navigation.
         * @returns {boolean}
         */
        this.isKeyboardNavigation = function ()
        {
            return _isKeyboardNavigation;
        }

        /** 
        * Selects the button
        */
        this.toggleSelect = function ()
        {
            toggleSelect();
        }

        /** 
        * Selects the button
        */
        this.select = function ()
        {
            select();
        }

        /** 
        * Deselects the button
        */
        this.deselect = function ()
        {
            deselect();
        }

        /** 
        * Enables the button
        */
        this.enable = function ()
        {
            enable();
        }

        /** 
        * Disables the button
        * @param {Boolean} [keepSelected=false] A value indicating if the button must remain selected.
        */
        this.disable = function (keepSelected)
        {
            disable(keepSelected);
        }

        /** 
        * Sets focus on the button.
        */
        this.focus = function ()
        {
            focus();
        }

        /** 
        * Removes focus from the button.
        */
        this.blur = function ()
        {
            blur();
        }

        /** 
        * Executes the command click event.
        */
        this.commandClick = function ()
        {
            commandClick();
        }

        /** 
        * Executes the command click event.
        */
        this.expandClick = function ()
        {
            toggleExpand();
        }

        /** 
        * Gets the command button element.
        */
        this.getCommandButton = function ()
        {
            return (_instance.split) ? _divCommand : _instance.element;
        }

        /** 
        * Gets the expand button element.
        */
        this.getExpandButton = function ()
        {
            return (_instance.split) ? _divExpand : null;
        }

        /** 
        * Updates the button content with the specified template or text
        */
        this.updateContent = function ()
        {
            applyContent();
        }

        /** 
        * Sets the content template.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content The content template.
        */
        this.setContentTemplate = function (content)
        {
            _instance.addTemplate('Content', content, false);
        }

        /** 
        * Clones the source component. This method should not be invoked by client code directly but only from inside component code.
        * @param {componyx.UI.base.Component} source The source component.
        * @param {Boolean} [cloneTemplates=true] A value indicating if templates are cloned.
        * @param {Boolean} [cloneEvents=true] A value indicating if events are cloned.
        * @see {@link componyx.UI.base.methods#clone}
        * @function
        * @protected
        */
        this.clone = function (source, parent, cloneTemplates, cloneEvents)
        {
            $base.methods.clone.call(_instance, source, parent, cloneTemplates, cloneEvents);

            if (source)
                _instance.command = source.command;
        }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'button', true, 'a');
                return;
            }

            // render logic after loading resources
            draw();

            componyx.UI.Button.ShortcutManager.registerButton(_instance);

            if (!_instance.renderId)
                _instance.element.removeAttribute('id');
        }

        /**
        * Handles the post render procedure.
        */
        this.postRender = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING) // extra safety to never execute a postRender when the component state is incorrect
                return;

            if (_instance.tooltipManagerId && _instance.tooltipId)
                $UI.store[_instance.tooltipManagerId].addTrigger(_instance.element, _instance.tooltipId);

            let el = _instance.split ? _instance.getExpandButton() : _instance.element;

            if (_instance.menuId)
                el.setAttribute('aria-haspopup', 'menu');
            else if (_instance.boxId)
                el.setAttribute('aria-haspopup', 'dialog');

            $base.methods.postRender.call(_instance);
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
            return ['Button'];
        }

        function draw()
        {
            let button = _instance.element,
                spanIcon = document.createElement('span'),
                expandDirection = ($lib.isEmpty(_instance.expandDirection)) ? _expandDirectionOption.DOWN : _instance.expandDirection,
                expandable = (_instance.menuId || _instance.boxId || _instance.expandCommand),
                cssClassSplit = null,
                decoration = getDecoration(_instance.decoration);

            _contentElement = document.createElement('div');

            _instance.command = convertCommand(_instance.command);
            _instance.expandCommand = convertCommand(_instance.expandCommand);

            if (_instance.command && expandable)
                _instance.split = true;

            button.classList.add(_instance.primary ? _classOption.PRIMARY : _classOption.BASIC);

            if (_instance.transparent)
                button.classList.add(_classOption.TRANSPARENT);

            if (!_instance.transparentBorder)
                button.classList.add(_classOption.BORDER);

            if (decoration)
                button.classList.add(decoration);

            if (_instance.type == _typeOption.CHECKBUTTON)
                button.classList.add(_classOption.CHECK);
            else if (_instance.type == _typeOption.RADIOBUTTON)
                button.classList.add(_classOption.RADIO);

            if (_instance.size && _instance.size !== _sizeOption.MEDIUM)
                button.classList.add(_classOption.SIZE_PREFIX + _instance.size);

            _contentElement.className = _instance.cssClassContentHolder || _classOption.CONTENT_HOLDER;

            if (_instance.split)
            {
                _divCommand = document.createElement('div');
                _divExpand = document.createElement('div');

                cssClassSplit = _instance.cssClassSplit || _classOption.SPLIT;
                button.classList.add(cssClassSplit, _expandDirectionOption.getName(expandDirection));

                _divCommand.className = _instance.cssClassCommand || _classOption.COMMAND;
                _divExpand.className = _instance.cssClassExpand || _classOption.EXPAND;

                if (_instance.hasIcon)
                    _divCommand.appendChild(spanIcon);

                _divCommand.appendChild(_contentElement);
                button.appendChild(_divCommand);

                createExpandIcon(_divExpand);
                button.appendChild(_divExpand);
            }
            else
            {
                if (_instance.hasIcon)
                    button.appendChild(spanIcon);

                button.appendChild(_contentElement);

                if (expandable)
                {
                    button.classList.add(_expandDirectionOption.getName(expandDirection));
                    createExpandIcon(button);
                }

                setAnchor();
            }

            if (!_instance.href || _instance.split)
                button.setAttribute('role', 'button');

            setTabIndex((_instance.disabled) ? -1 : _instance.tabIndex);

            if (_instance.hasIcon)
            {
                if (_instance.iconAlign === _alignOption.CENTER)
                    _instance.iconAlign = _alignOption.LEFT;
                else if (_instance.iconAlign === _alignOption.RIGHT)
                    _contentElement.parentNode.insertBefore(_contentElement, spanIcon);

                button.className += ' ' + (_instance.cssClassIconAlign || _classOption.ICON) + '-' + getAlignment(_instance.iconAlign, _alignOption.LEFT);
                spanIcon.className = _instance.cssClassIcon || _classOption.ICON;
                spanIcon.classList.add(_classOption.ICON); // always include the base icon class

                if (_instance.iconURL)
                    spanIcon.style.backgroundImage = 'url(' + _instance.iconURL + ')';
            }

            applyContent();

            if (!_instance.disabled)
                bindGlobalEvents(button, _divCommand, _divExpand);

            if (_instance.selected)
            {
                _instance.selected = false;
                select();
            }

            if (_instance.disabled)
                disable(true);

            if (!_instance.menuId && !_instance.boxId)
            {
                _instance.postRender();
                return;
            }

            if (_instance.menuId)
            {
                if ($UI.store[_instance.menuId].renderState == $base.static.RenderState.RENDERED)
                {
                    _instance.postRender();
                }
                else
                {
                    $UI.store[_instance.menuId].events.onPostRender.priorityAdd(function ()
                    {
                        _instance.postRender();
                    }, null);
                }
            }
            else if ($UI.store[_instance.boxId].renderState == $base.static.RenderState.RENDERED)
            {
                _instance.postRender();
            }
            else
            {
                $UI.store[_instance.boxId].events.onPostRender.priorityAdd(function ()
                {
                    _instance.postRender();
                }, null);
            }
        }

        function setAnchor()
        {
            if ($lib.isEmpty(_instance.href))
                return;

            let button = _instance.element,
                a = button;

            if (button.nodeName.toLowerCase() !== 'a') // not anchor tag?
                _anchor = a = $lib.element(button, '', 'a');

            a.href = _instance.href;

            if (_instance.target)
                a.target = _instance.target;
        }

        function getDecoration(type)
        {
            if (!type)
                return '';

            if (type == _decorationOption.UNDERLINE)
                return _classOption.UNDERLINE;
            else if (type == _decorationOption.OVERLINE)
                return _classOption.OVERLINE;
            else if (type == _decorationOption.FRONTLINE)
                return _classOption.FRONTLINE;
            else
                return _classOption.BACKLINE;
        }

        function convertCommand(command)
        {
            return $base.static.getMethod(command);
        }

        function applyContent()
        {
            let button = _instance.element,
                cssClassContent = $lib.format('{0}-{1}', _instance.cssClassContentAlign || _classOption.CONTENT_ALIGN, getAlignment(_instance.contentAlign));

            _contentElement.style.display = _contentElement.innerHTML = '';
            button.classList.remove(cssClassContent);

            if (_instance.hasTemplate('Content'))
                _instance.applyTemplate(_contentElement, 'Content');
            else if (_instance.text != null)
                _contentElement.innerHTML = _instance.text;

            if (!$lib.isEmpty(_contentElement.innerHTML))
                button.classList.add(cssClassContent);
        }

        function createExpandIcon(container)
        {
            let spanExpandIcon = document.createElement('span');
            spanExpandIcon.className = _instance.cssClassExpandIcon || _classOption.EXPAND_ICON;
            container.appendChild(spanExpandIcon);
        }

        function bindGlobalEvents(button, divCommand, divExpand)
        {
            let element = _instance.split ? divCommand : button,
                expandable = (_instance.menuId || _instance.boxId || _instance.expandCommand),
                clickEnd = 'pointerup pointerenter pointerleave';

            _handlers = [];

            if (_instance.keyboardExpand && expandable)
            {
                $lib.on(_instance.element, 'keydown', handleKeyboardExpand);
            }

            // Helper to bind focus and blur with _instance context
            const bindFocusBlur = (el) =>
            {
                bind(el, 'focus', () => _instance.onFocus.call(_instance));
                bind(el, 'blur', () => _instance.onBlur.call(_instance));
            };

            // Consolidate pointerdown and pointerup/leave bindings on relevant elements
            const elementsToBind = _instance.split ? [divCommand, divExpand] : [button];

            elementsToBind.forEach(el =>
            {
                bind(el, 'pointerdown', $lib.addClass, [el, 'pressed']);
                bind(el, clickEnd, $lib.removeClass, [el, 'pressed']);
            });

            if (_instance.split)
            {
                bindFocusBlur(divExpand);
                bindFocusBlur(divCommand);

                if (_instance.rippleAnimation)
                {
                    createRipple(divExpand);
                    bind(divExpand, 'pointerdown', rippleAnimation, [divExpand], _instance);
                }

                bind(divExpand, 'click', e => { return toggleExpand(); });
                bindEvents(divExpand, 'onExpand');
            }
            else
            {
                bindFocusBlur(button);
            }

            if (_instance.rippleAnimation)
            {
                createRipple(element);
                bind(element, 'pointerdown', rippleAnimation, [element], _instance);
            }

            bind(element, 'click', e =>
            {
                if (_instance.type > 0)
                    toggleSelect();

                return commandClick();
            });

            bind(button, 'keydown', e =>
            {
                if (e.key === 'Enter' || e.key === ' ')
                {
                    rippleAnimation(element, e);

                    if (_instance.type > 0)
                        toggleSelect();

                    _isKeyboardNavigation = true;
                    return commandClick();
                    _isKeyboardNavigation = false;
                }
            });

            bindEvents(element, 'onCommand');
            bindEvents(button, 'on');

            if (_anchor)
            {
                bind(button, 'click', () => { _anchor.click(); _instance.element.focus(); });
            }
        }

        function bind(el, type, fn, args, context)
        {
            let id = $lib.on(el, type, fn, args, context);
            _handlers.push({ el: el, type: type, id: id });
        }

        function bindEvents(element, prefix)
        {
            $lib.each(['PointerEnter', 'PointerLeave', 'PointerDown', 'PointerUp', 'DblClick'], function (event)
            {
                bind(element, event.toLowerCase(), function ()
                {
                    _instance.events[prefix + event].fire(_instance, createEventArgs());
                });
            });
        }

        function unbindEvents()
        {
            $lib.each(_handlers, function (item)
            {
                $lib.off(item.el, item.type, item.id);
            });
            _handlers = [];
        }

        function createEventArgs()
        {
            return { event: $lib.event };
        }

        function handleKeyboardExpand(event)
        {
            if (_instance.disabled)
                return;

            const key = event.key,
                expanded = _instance.expanded,
                direction = _instance.expandDirection || _expandDirectionOption.DOWN,
                isVertical = direction === _expandDirectionOption.UP || direction === _expandDirectionOption.DOWN,
                shouldExpand = !expanded && ((isVertical && key === 'ArrowDown') || (!isVertical && key === 'ArrowRight')),
                shouldCollapse = expanded && (key === 'Escape' || (isVertical && key === 'ArrowUp') || (!isVertical && key === 'ArrowLeft'));

            if (shouldExpand || shouldCollapse)
            {
                _isKeyboardNavigation = true;
                toggleExpand(true);

                if (_instance.split)
                    rippleAnimation(_divExpand, event);

                _isKeyboardNavigation = false;
            }
        }

        function createRipple(el)
        {
            let ripple = $lib.element($lib.element(el), '', 'span');
            _ripple.set(el, ripple);
            ripple.parentNode.className = _classOption.RIPPLE_MASK;
            ripple.parentNode.style.display = 'none';
        }

        function rippleAnimation(el, e)
        {
            if (e.type === 'keydown' && (e.key != ' ' && e.key != 'Enter'))
                return;

            if (getComputedStyle(_instance.element).pointerEvents === 'none')
                return;

            let ripple = _ripple.get(el);
            clearTimeout(_rippleTimerId);
            ripple.className = '';

            setTimeout(function (el, e, ripple)
            {
                let pos = $lib.getPos(el, null, true);

                if (!ripple.parentNode)
                    return;

                ripple.parentNode.style.display = '';
                ripple.style.top = ($lib.clientY(e) - pos.top) + 'px';
                ripple.style.left = ($lib.clientX(e) - pos.left) + 'px';
                ripple.addEventListener('animationend', function ()
                {
                    _rippleTimerId = setTimeout(function ()
                    {
                        if (!_ripple)
                            return;

                        let ripple = _ripple.get(el);

                        if (ripple && ripple.parentNode)
                            ripple.parentNode.style.display = 'none';
                    }, 0);
                });

                ripple.className = _classOption.RIPPLE;

            }.bind(this, el, e, ripple), 0);
        }

        function commandClick()
        {
            let returnValue = true,
                expandable = (_instance.menuId || _instance.boxId || _instance.expandCommand);

            if (_instance.disabled)
                return false;

            if (_instance.command)
                returnValue = _instance.command();
            else if (!_instance.split && expandable)
                returnValue = toggleExpand(); // expand action witout command

            if (returnValue === false)
                return false;

            _instance.events.onCommandClick.fire(_instance, createEventArgs());

            if (_instance.autoPostBack)
                _instance.postBack();
        }

        function toggleExpand()
        {
            let returnValue = true;

            if (_instance.disabled)
                return;

            if (_instance.expanded && _instance.collapseCommand)
                returnValue = _instance.collapseCommand();
            else if (!_instance.expanded && _instance.expandCommand)
                returnValue = _instance.expandCommand();

            if (!$lib.isEmpty(returnValue) && returnValue == false)
                return false;

            if (_instance.menuId || _instance.boxId)
                expandWidget(); // toggle action

            _instance.expanded = !_instance.expanded;
            _instance.events.onExpandClick.fire(_instance, createEventArgs());
        }

        function toggleSelect()
        {
            if (!_instance.selected)
                select();
            else if (_instance.type == _typeOption.CHECKBUTTON)
                deselect();
        }

        function select()
        {
            if (_instance.disabled || _instance.selected)
                return;

            let element = (!_instance.split) ? _instance.element : _instance.element.firstElementChild;

            if (_instance.type == _typeOption.RADIOBUTTON)
            {
                if (componyx.UI.Button.RadioGroups[_instance.radioGroupId])
                    componyx.UI.Button.RadioGroups[_instance.radioGroupId].deselect();

                componyx.UI.Button.RadioGroups[_instance.radioGroupId] = _instance;
            }

            _instance.selected = true;
            element.classList.add('selected');
            _instance.events.onSelect.fire(_instance, createEventArgs());
        }

        function deselect()
        {
            if (_instance.disabled || !_instance.selected)
                return;

            let element = (!_instance.split) ? _instance.element : _instance.element.firstElementChild;

            if (_instance.type == _typeOption.RADIOBUTTON && _instance.radioGroupId)
                delete componyx.UI.Button.RadioGroups[_instance.radioGroupId];

            _instance.selected = false;
            element.classList.remove('selected');
            _instance.events.onDeselect.fire(_instance, createEventArgs());
        }

        function enable()
        {
            let button = _instance.element;

            _instance.disabled = false;
            button.classList.remove('disabled');
            setTabIndex(_instance.tabIndex);

            if (_handlers.length == 0)
                bindGlobalEvents(button, _divCommand, _divExpand);
        }

        function disable(keepSelected)
        {
            if (_instance.selected && !keepSelected)
                deselect();

            _instance.disabled = true;
            _instance.element.classList.add('disabled');
            setTabIndex(-1);
            unbindEvents();
        }

        function setTabIndex(tabIndex)
        {
            const index = Number(tabIndex) || 0;
            _instance.element.setAttribute('tabindex', index);
        }

        function getAlignment(align, def)
        {
            align = ($lib.isEmpty(align)) ? (def) ? def : _alignOption.CENTER : align;
            return _alignOption.getName(align)
        }

        function focus()
        {
            blur();

            if (_instance.split)
                _divCommand.focus();
            else
                _instance.element.focus();
        }

        function blur()
        {
            if (_instance.split)
            {
                _divCommand.blur();
                _divExpand.blur();
            }
            else
                _instance.element.blur();
        }

        function expandWidget()
        {
            if (_instance.menuId)
                expandMenu();
            else
                expandBox();
        }

        function expandMenu()
        {
            let menu = $UI.store[_instance.menuId],
                isKeyboardNavigation = _instance.isKeyboardNavigation();

            menu.rootExpandDirection = ($lib.isEmpty(_instance.expandDirection)) ? _expandDirectionOption.DOWN : _instance.expandDirection;
            menu.events.onLastItemCollapseComplete.priorityAdd(() => { _instance.expanded = false; }, null, true);
            menu.events.onItemExpandComplete.priorityAdd(() =>
            {
                _instance.expanded = true;

                if (isKeyboardNavigation)
                    setTimeout(() => { menu.element.focus() });

            }, null, true);

            menu.expand(_instance.menuItemId, _instance.element, true);
        }

        function expandBox()
        {
            let box = $UI.store[_instance.boxId];
            box.expander = _instance.element;
            box.expandDirection = ($lib.isEmpty(_instance.expandDirection)) ? _expandDirectionOption.DOWN : _instance.expandDirection;
            box.autoPosition = componyx.UI.Box.AutoPositionOption.EXPAND;

            box.events.onHideComplete.priorityAdd(() => { _instance.expanded = false; }, null, true);
            box.toggle();
        }

        function dispose()
        {
            let groups = componyx.UI.Button.RadioGroups;

            if (groups[_instance.radioGroupId] === _instance)
                delete groups[_instance.radioGroupId];

            _instance.split = false;
            _anchor = null;
            _ripple = new Map();
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.Button.prototype = Object.create($base.methods);
    componyx.UI.Button.prototype.constructor = componyx.UI.Button;

    /**
    * RadioGroups
    * @type {object.<string, string>} 
    * @readonly
    */
    componyx.UI.Button.RadioGroups = {};

    /**
     * A singleton ShortcutManager attached to the Button class.
     * Manages registration and dispatch of keyboard shortcuts (Ctrl on Windows, ⌘ on Mac).
     * Buttons register/unregister themselves by key combo and optional scope element.
     * @namespace componyx.UI.Button.ShortcutManager
     * @ignore
     */
    componyx.UI.Button.ShortcutManager = (() =>
    {
        const shortcutButtons = new Map(),
            isMac = navigator.userAgent.toLowerCase().includes('Mac');

        /**
         * Build a normalized key combo string from a KeyboardEvent.
         * E.g. "ctrl+z", "ctrl+shift+s", "alt+f".
         * @param {KeyboardEvent} e
         * @returns {string}
         * @ignore
         */
        function getKeyCombo(e)
        {
            const parts = [];
            if (e.ctrlKey || (isMac && e.metaKey)) parts.push('ctrl');
            if (e.altKey) parts.push('alt');
            if (e.shiftKey) parts.push('shift');

            if (e.key)
                parts.push(e.key.toLowerCase());

            return parts.join('+');
        }

        /**
         * Global keydown handler that dispatches to the first matching button.
         * @param {KeyboardEvent} e
         * @ignore
         */
        function keydown(e)
        {
            const key = getKeyCombo(e),
                buttons = shortcutButtons.get(key);

            if (!buttons)
                return;

            const button = getActiveButton(buttons, e);

            if (button)
            {
                button.commandClick();
                e.preventDefault();
            }
        }

        function getActiveButton(buttons, e)
        {
            const doc = e.target?.ownerDocument || document,
                activeEl = doc.activeElement;

            for (const btn of buttons)
            {
                const scopeEl = getScopedElement(btn);

                if (scopeEl === activeEl) return btn;
            }

            // Otherwise, traverse up from activeElement
            let el = activeEl;
            while (el)
            {
                for (const btn of buttons)
                {
                    const scopeEl = getScopedElement(btn);

                    if (scopeEl && scopeEl.contains(el)) return btn;
                }
                el = el.parentElement;
            }

            return null; // no matching button
        }

        function getScopedElement(button)
        {
            const scope = button.shortcutScope,
                scopeEl = (typeof scope === 'function') ? scope() :
                    (typeof scope === 'string') ? $lib('#' + scope) : scope;

            return scopeEl;
        }

        return {
            /**
             * Register a Button instance for its key combo.
             * @param {componyx.UI.Button} button The Button to register in the ShortcutManager.
             * @ignore
             */
            registerButton(button)
            {
                if (!button.shortcutKey)
                    return;

                let key = button.shortcutKey.toLowerCase(),
                    doc = button.element.ownerDocument;

                if (!/^(ctrl|alt|shift)\+/.test(key))
                    key = 'ctrl+' + key;

                if (!shortcutButtons.has(key))
                    shortcutButtons.set(key, new Set());

                shortcutButtons.get(key).add(button);

                if (!$lib.has(doc, 'keydown', keydown))
                    $lib.on(doc, 'keydown', keydown);
            },

            /**
             * Unregister a Button instance, removing its shortcut.
             * @param {componyx.UI.Button} button The Button to register in the ShortcutManager.
             * @ignore
             */
            unregisterButton(button)
            {
                if (!button.key)
                    return;

                let key = button.shortcutKey.toLowerCase(),
                    doc = button.element.ownerDocument;

                if (!/^(ctrl|alt|shift)\+/.test(key))
                    key = 'ctrl+' + key;

                shortcutButtons.get(key)?.delete(button);

                if (shortcutButtons.size === 0)
                    $lib.off(doc, 'keydown', keydown);
            }
        };
    })();



    /** 
    * Gets the selected button for the specified radio group.
    * @name componyx.UI.Button#getSelected
    * @static
    * @function
    */
    componyx.UI.Button.getSelected = function (radioGroupId)
    {
        return componyx.UI.Button.RadioGroups[radioGroupId];
    }

    /**
    * SizeOption
    * @readonly
    * @enum {string}
    */
    componyx.UI.Button.SizeOption =
    {
        SMALL: 's',
        MEDIUM: 'm',
        LARGE: 'l',
        XLARGE: 'xl'
    }

    /**
    * TypeOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Button.TypeOption =
    {
        COMMANDBUTTON: 0,
        CHECKBUTTON: 1,
        RADIOBUTTON: 2
    }

    /**
    * ExpandDirectionOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Button.ExpandDirectionOption =
    {
        DOWN: 0,
        RIGHT: 1,
        UP: 2,
        LEFT: 3,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * AlignOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Button.AlignOption =
    {
        LEFT: 0,
        CENTER: 1,
        RIGHT: 2,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }

    /**
    * DecorationOption
    * @readonly
    * @enum {number}
    */
    componyx.UI.Button.DecorationOption =
    {
        BACKGROUND: 0,
        UNDERLINE: 1,
        OVERLINE: 2,
        FRONTLINE: 3,
        BACKLINE: 4,

        getName: function (value) { return $base.static.getKeyByValue(this, value).toLowerCase(); }
    }
})(window);