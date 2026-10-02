/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
    * Dialog class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.Box
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {Object} An instance of the component.
    */
    componyx.UI.Dialog = function Dialog(id, properties)
    {
        // define private properties
        var _instance = this,
            _themeOption = $base.static.ThemeOption;

        // define public properties
        /**
         * Gets or sets the css class of the box, which is used for the dialog layout.
         * @type {String}
         */
        this.cssClassBox = '';

        /**
         * Gets or sets the css class of the content header.
         * @type {String}
         */
        this.cssClassContentHeader = '';

        /**
         * Gets or sets the css class of the content footer.
         * @type {String}
         */
        this.cssClassContentFooter = '';

        /**
         * Gets or sets the css class of the content holder.
         * @type {String}
         */
        this.cssClassContentHolder = '';

        /**
         * Gets or sets the css class of the button holder for both the header and footer of the dialog.
         * @type {String}
         */
        this.cssClassButtonHolder = '';

        /**
         * Gets or sets a value indicating whether the dialog will be automatically closed on a button event.
         * @type {Boolean}
         */
        this.autoClose = true;

        /**
         * Gets or sets a value indicating whether the dialog confirm action is executed when the enter-key is pressed within a field inside the box element.
         * @type {Boolean}
         */
        this.confirmOnEnterKey = true;

        /**
         * Gets or sets the button settings.
         * @type {Object}
         */
        this.buttons = {
            /**
             * Gets or sets a value indicating if the close button is displayed.
             * @type {Boolean}
             */
            close: true,

            /**
             * Gets or sets a value indicating if the confirm button is displayed.
             * @type {Boolean}
             */
            confirm: true,

            /**
             * Gets or sets a value indicating if the deny button is displayed.
             * @type {Boolean}
             */
            deny: true,

            /**
             * Gets or sets a value indicating if the cancel button is displayed.
             * @type {Boolean}
             */
            cancel: true,

            /**
             * Gets or sets the confirm button text.
             * @type {String}
             */
            confirmText: 'OK',

            /**
             * Gets or sets the deny button text.
             * @type {String}
             */
            denyText: 'No',

            /**
             * Gets or sets the cancel button text.
             * @type {String}
             */
            cancelText: 'Cancel',

            /**
             * Gets or sets the id of the button component used as base for the close button.
             * @type {String|null}
             */
            closeButtonId: null,

            /**
             * Gets or sets the id of the button component used as base for the confirm button.
             * @type {String|null}
             */
            confirmButtonId: null,

            /**
             * Gets or sets the id of the button component used as base for the deny button.
             * @type {String|null}
             */
            denyButtonId: null,

            /**
             * Gets or sets the id of the button component used as base for the cancel button.
             * @type {String|null}
             */
            cancelButtonId: null,
        };

        /**
         * @class
         * @augments componyx.UI.base.Events
         * @memberof componyx.UI.Dialog
         * @property {componyx.UI.base.Event} onConfirm       - Event which fires when the dialog is confirmed. @see {@link componyx.UI.Dialog.DialogEventArgs}
         * @property {componyx.UI.base.Event} onDeny          - Event which fires when the dialog is denied. @see {@link componyx.UI.Dialog.DialogEventArgs}
         * @property {componyx.UI.base.Event} onCancel        - Event which fires when the dialog is cancelled. @see {@link componyx.UI.Dialog.DialogEventArgs}
         * @property {componyx.UI.base.Event} onClose         - Event which fires when the dialog is closed. @see {@link componyx.UI.Dialog.DialogEventArgs}
         * @property {componyx.UI.base.Event} onShowComplete  - Event which fires when the show animation has completed. Also called when animation type is 'none'. @see {@link componyx.UI.Dialog.DialogEventArgs}
         * @property {componyx.UI.base.Event} onHideComplete  - Event which fires when the hide animation has completed. Also called when animation type is 'none'. @see {@link componyx.UI.Dialog.DialogEventArgs}
         * @see {@link componyx.UI.base.Events}
         */
        function DialogEvents(events)
        {
            Object.assign(this, events);

            this.onConfirm = $base.static.createEvent('onConfirm');
            this.onDeny = $base.static.createEvent('onDeny');
            this.onCancel = $base.static.createEvent('onCancel');
            this.onClose = $base.static.createEvent('onClose');
            this.onShowComplete = $base.static.createEvent('onShowComplete');
            this.onHideComplete = $base.static.createEvent('onHideComplete');
        };

        /**
         * Dialog events
         * @type {componyx.UI.Dialog.DialogEvents}
         */
        this.events = new DialogEvents(this.events);

        /**
         * @typedef {Object} componyx.UI.Dialog.DialogEventArgs
         * @property {componyx.UI.Dialog} Dialog - The Dialog instance.
         */

        // inherit base and box members
        $base.Component.apply(this, [id, properties, componyx.UI.Box]);

        /** 
        * Sets the header template
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        * @see {@link componyx.UI.base.addTemplate}
        */
        this.setHeaderTemplate = function (content)
        {
            _instance.addTemplate('Header', content, false);
        }

        /** 
        * Sets the footer template
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        * @see {@link componyx.UI.base.addTemplate}
        */
        this.setFooterTemplate = function (content)
        {
            _instance.addTemplate('Footer', content, false);
        }

        /** 
        * Sets the content template
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} content HTML string or element node as content. Pass null or empty string to remove the existing template.
        * @see {@link componyx.UI.base.addTemplate}
        */
        this.setContentTemplate = function (content)
        {
            _instance.addTemplate('Content', content, false);
        }

        /** 
        * Gets the underlaying box component.
        * @returns {componyx.UI.Box}
        */
        this.getBox = function ()
        {
            return $UI.store[_instance.id + '_Box'];
        }

        /** 
        * Shows the component.
        */
        this.show = function ()
        {
            $base.methods.show.call(_instance);
            show();
        }

        /** 
        * Shows the dialog in confirmation mode.
        * @param {Function} callBack A callback function to invoke after confirmation.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} [header] HTML string or element node as content.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} [content] HTML string or element node as content.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} [footer] HTML string or element node as content.
        * @param {String} [confirmText] The text of the confirmation button.
        * @param {String} [denyText] The text of the deny button.
        */
        this.confirm = function (callBack, header, content, footer, confirmText, denyText)
        {
            _instance.destroy();

            _instance.buttons.cancel = false;
            _instance.buttons.confirmText = (confirmText) ? confirmText : this.buttons.confirmText;
            _instance.buttons.denyText = (denyText) ? denyText : this.buttons.denyText;
            _instance.autoClose = _instance.modal = true;
            _instance.autoPosition = _instance.autoPosition || componyx.UI.Box.AutoPositionOption.CENTER;

            if (callBack)
            {
                _instance.events.onConfirm.priorityAdd(callBack, [_instance, true], true);
                _instance.events.onDeny.priorityAdd(callBack, [_instance, false], true);
            }

            if (header)
                _instance.setHeaderTemplate(header);

            if (content)
                _instance.setContentTemplate(content);

            if (footer)
                _instance.setFooterTemplate(footer);

            _instance.show();
        }

        /** 
        * Shows the dialog in alert mode.
        * @param {Function} callBack A callback function to invoke after confirmation.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} [header] HTML string or element node as content.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} [content] HTML string or element node as content.
        * @param {HTMLElement|HTMLElement[]|DocumentFragment|String} [footer] HTML string or element node as content.
        * @param {String} [confirmText] The text of the confirmation button.
        */
        this.alert = function (callBack, header, content, footer, confirmText)
        {
            _instance.destroy();

            _instance.buttons.deny = _instance.buttons.cancel = false;
            _instance.buttons.confirmText = (confirmText) ? confirmText : this.buttons.confirmText;
            _instance.autoClose = _instance.modal = true;
            _instance.autoPosition = _instance.autoPosition || componyx.UI.Box.AutoPositionOption.CENTER;

            if (callBack)
                _instance.events.onConfirm.priorityAdd(callBack, [_instance]);

            if (header)
                _instance.setHeaderTemplate(header);

            if (content)
                _instance.setContentTemplate(content);

            if (footer)
                _instance.setFooterTemplate(footer);

            _instance.show();
        }

        /** 
        * Hides the component
        */
        this.hide = function ()
        {
            hide();
        }

        /** 
        * Renders the component
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'dialog');
                return;
            }

            // render logic after loading resources
            if (_instance.ajax.load && _instance.ajax.load.isDefined())
                load();
            else
                draw();
        }

        /**
        * Executes the post render procedure.
        */
        this.postRender = function ()
        {
            if (_instance.renderState == $base.static.RenderState.RENDERED)
                return;

            $base.methods.postRender.call(_instance);
        }

        /** 
         * Destroys the component.
         * @see {@link componyx.UI.base.methods#destroy}
         */
        this.destroy = function (...args)
        {
            var store = $UI.store;

            // destroy box to complete possible animation and fire hide complete event
            if (store[_instance.id + '_Box'])
                store[_instance.id + '_Box'].destroy();

            $base.methods.destroy.call(this, ...args);
        }


        function show()
        {
            _instance.showing = true;

            if (_instance.renderState != $base.static.RenderState.RENDERED)
                return;

            var box = $UI.store[_instance.id + '_Box'];
            box.style = _instance.style;
            box.top = _instance.top;
            box.right = _instance.right;
            box.bottom = _instance.bottom;
            box.left = _instance.left;
            box.width = _instance.width;
            box.height = _instance.height;
            box.autoPosition = $lib.isEmpty(_instance.autoPosition) ? componyx.UI.Box.AutoPositionOption.CENTER : _instance.autoPosition;
            box.expander = _instance.expander;
            box.autoFit = _instance.autoFit;
            box.autoInvertFit = _instance.autoInvertFit;
            box.autoResizeFit = _instance.autoResizeFit;
            box.invertMarginHorizontal = _instance.invertMarginHorizontal;
            box.invertMarginVertical = _instance.invertMarginVertical;
            box.show();
        }

        function hide()
        {
            if (!_instance.showing)
                return;

            _instance.showing = false;
            _instance.events.onHide.fire(_instance);

            if (_instance.renderState != $base.static.RenderState.RENDERED)
                return;

            var box = $UI.store[_instance.id + '_Box'];

            if (box.showing)
                box.hide();
        }

        function showComplete()
        {
            _instance.events.onShowComplete.fire(_instance)
        }

        function hideComplete()
        {
            _instance.showing = false;
            $base.methods.hide.call(_instance, false);
            _instance.events.onHideComplete.fire(_instance);
        }

        function preRender()
        {
            // initialize script and css
            return ['Dialog', ['Box', 'Button']];
        }

        function load(parentItem, initialLoad)
        {
            _instance.ajaxCall('load', null, { onSuccess: dataLoaded });
        }

        function dataLoaded(ajaxArgs)
        {
            draw(ajaxArgs.data);
        }

        function draw(data)
        {
            $lib.setStyle(_instance.element, '');

            createBox(data);
            _instance.renderChildren();
        }

        function createBox(data)
        {
            var box = $UI.createComponent(componyx.UI.Box, { id: _instance.id + '_Box' });
            var divContent = document.createElement('div');
            var divHeader = document.createElement('div');
            var divHeaderButtonHolder = document.createElement('div');
            var divContentHolder = document.createElement('div');
            var divFooter = document.createElement('div');
            var divFooterButtonHolder = document.createElement('div');

            divHeader.id = _instance.id + '_Header';
            divHeader.className = _instance.cssClassContentHeader || 'header';
            divContentHolder.className = _instance.cssClassContentHolder || 'content-holder';
            divFooter.className = _instance.cssClassContentFooter || 'footer';
            divHeaderButtonHolder.id = _instance.id + '_HButtonHolder';
            divFooterButtonHolder.id = _instance.id + '_FButtonHolder';
            divFooterButtonHolder.className = divHeaderButtonHolder.className = _instance.cssClassButtonHolder || 'button-holder';

            _instance.applyTemplate(divHeader, 'Header');
            _instance.applyTemplate(divFooter, 'Footer');

            if (data)
            {
                divContentHolder.innerHTML = data;
            }
            else
            {
                _instance.applyTemplate(divContentHolder, 'Content');
            }

            divHeader.appendChild(divHeaderButtonHolder);
            divFooter.appendChild(divFooterButtonHolder);
            createButtons(divHeaderButtonHolder, divFooterButtonHolder);

            divContent.appendChild(divContentHolder);
            divContent.appendChild(divFooter);
            divContent.appendChild(divHeader);

            // copy dialog properties to the box
            box.clone(_instance, _instance, false, false);
            box.containerElement = _instance.element;
            box.element = null;
            box.renderState = $base.static.RenderState.NONE;
            box.theme = $base.static.ThemeOption.NONE;
            box.cssClass = _instance.cssClassBox || 'box dialog-box';
            box.setContentTemplate(divContent);
            box.showing = false;
            box.dragSettings.dragHandle = divHeader.id;
            box.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);
            box.events.onHide.priorityAdd(hide, null);
            box.events.onShowComplete.priorityAdd(function (args) { showComplete(); }, null);
            box.events.onHideComplete.priorityAdd(function (args) { hideComplete(); }, null);
        }

        function createButtons(header, footer)
        {
            if (_instance.buttons.close)
                createButton(_instance.id + '_Close', _instance.buttons.closeButtonId, header, close, { cssClass: 'close', hasIcon: true, primary: true });

            if (_instance.buttons.confirm)
                createButton(_instance.id + '_Confirm', _instance.buttons.confirmButtonId, footer, confirm, { cssClass: 'confirm', text: _instance.buttons.confirmText, primary: true });

            if (_instance.buttons.deny)
                createButton(_instance.id + '_Deny', _instance.buttons.denyButtonId, footer, deny, { cssClass: 'deny', text: _instance.buttons.denyText });

            if (_instance.buttons.cancel)
                createButton(_instance.id + '_Cancel', _instance.buttons.cancelButtonId, footer, cancel, { cssClass: 'cancel', text: _instance.buttons.cancelText });
        }

        function createButton(id, cloneId, container, command, props)
        {
            let button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container });

            button.clone($UI.store[cloneId], _instance);
            button.transparentBorder = button.primary = (props.primary) ? true : false;
            button.cssClass = button.cssClass || props.cssClass || '';

            if (!button.hasIcon)
                button.hasIcon = button.transparent = props.hasIcon;

            button.text = button.text || props.text || '';
            button.events.onPostRender.priorityAdd(function (command, button, args)
            {
                var buttonCommand = button.command;
                button.command = function ()
                {
                    var returnValue = true;

                    if (buttonCommand)
                        returnValue = buttonCommand(button, args);

                    if (!$lib.isEmpty(returnValue) && returnValue == false)
                        return false;

                    command();
                }.bind(_instance);

                if (_instance.confirmOnEnterKey && id.indexOf('_Confirm') > -1)
                    $UI.store[_instance.id + '_Box'].enterKeySubmitter = button.getCommandButton();

            }.bind(_instance, command), null);

            button.events.onPostRender.priorityAdd(() => { _instance.isReady.apply(_instance); }, null);
            button.showing = true;
        }

        function close()
        {
            _instance.events.onClose.fire(_instance);
            _instance.hide();
        }

        function confirm()
        {
            _instance.events.onConfirm.fire(_instance);

            if (_instance.autoClose)
                close();
        }

        function deny()
        {
            _instance.events.onDeny.fire(_instance);

            if (_instance.autoClose)
                close();
        }

        function cancel()
        {
            _instance.events.onCancel.fire(_instance);

            if (_instance.autoClose)
                close();
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.Dialog.prototype = Object.create($base.methods);
    componyx.UI.Dialog.prototype.constructor = componyx.UI.Dialog;
})(window);