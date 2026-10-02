/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * ComponentFactory module - creates and configures UI components.
  * @class ComponentFactory
 * @memberof componyx.UI.editor_modules
 * @ignore
 */

componyx.UI.editor_modules.ComponentFactory = class ComponentFactory
{
    #colorSwatchBox = null;
    #colorPicker = null;
    #swatch = null;
    #activeColorButton = null;

    constructor(editor)
    {
        this.editor = editor;
        this.utility = editor.utility;

        const boxExpandOption = componyx.UI.Box.ExpandDirectionOption,
            expandDirection = (editor.toolbarDisplay == componyx.UI.Editor.ToolbarDisplayOption.FOOTER) ? boxExpandOption.DOWN : boxExpandOption.UP;

        this.tooltipManager = this.createTooltipManager('buttonTooltipManager', editor.buttonTooltipManagerId, editor.element, { selectableTooltipContent: false, showOnFocus: false, expandDirection });
    }

    get colorSwatchBox()
    {
        return this.#colorSwatchBox;
    }
    get colorPicker()
    {
        return this.#colorPicker;
    }

    setActiveExpandButton(button)
    {
        this.#activeColorButton = button;
    }

    /**
     * Creates and configures a Menu component.
     * @param {string} id - The ID to assign to the new menu
     * @param {string} cloneId - The store ID of the menu to clone from
     * @param {HTMLElement} container - The container element to render into
     * @param {Object} [settings={}] - Menu configuration options
     * @param {boolean} [settings.expandOnClick=true] - Whether menu items expand on click
     * @param {boolean} [settings.visibleRoot=false] - Whether the root menu is always visible
     * @param {boolean} [settings.horizontalRoot=false] - Whether the root menu is rendered horizontally
     * @param {boolean} [settings.collapseAllOnSelect=true] - Whether all submenus collapse after selection
     * @returns {componyx.UI.Menu}
     * @ignore
     */
    createMenu(id, cloneId, container, settings = {})
    {
        id = this.#getId(id);
        const menu = $UI.createComponent(componyx.UI.Menu, { id: id, containerElement: container });

        menu.clone($UI.store[cloneId], this.editor);
        menu.expandOnClick = settings.expandOnClick ?? true;
        menu.visibleRoot = settings.visibleRoot ?? false;
        menu.horizontalRoot = settings.horizontalRoot ?? false;
        menu.collapseAllOnSelect = settings.collapseAllOnSelect ?? true;
        menu.autoFit = true;
        menu.showing = true;
        menu.events.onPostRender.priorityAdd(() =>
        {
            this.editor.isReady.apply(this.editor);
        });

        return menu;
    }

    /**
     * Creates and configures a Box component.
     * @param {string} id - The ID to assign to the new box
     * @param {string} cloneId - The store ID of the box to clone from
     * @param {HTMLElement} container - The container element to render into
     * @param {Object} [settings={}] - Box configuration options
     * @param {string} [settings.cssClass] - CSS class to apply to the box
     * @param {boolean} [settings.hideOnOutsideClick=false] - Whether to hide when clicking outside
     * @param {number} [settings.autoPositionOption] - Auto position option (default: EXPAND)
     * @param {number} [settings.expandDirection] - Expand direction (default: DOWN)
     * @param {number} [settings.alignXOption] - Horizontal alignment option (default: CENTER)
     * @param {HTMLElement|HTMLElement[]} [settings.content] - Content template for the box
     * @returns {componyx.UI.Box}
     * @ignore
     */
    createBox(id, cloneId, container, settings = {})
    {
        id = this.#getId(id);

        const editor = this.editor;
        const box = $UI.createComponent(componyx.UI.Box, { id, containerElement: container });
        box.clone($UI.store[cloneId], editor);
        box.cssClass = settings.cssClass;
        box.hideOnOutsideClick = settings.hideOnOutsideClick || false;
        box.autoPosition = settings.autoPositionOption ?? componyx.UI.Box.AutoPositionOption.EXPAND;
        box.expandDirection = settings.expandDirection ?? componyx.UI.Box.ExpandDirectionOption.DOWN;
        box.alignX = settings.alignXOption || componyx.UI.Box.AlignXOption.CENTER;
        box.autoInvertFit = true;
        box.setContentTemplate(settings.content);

        box.events.onPostRender.priorityAdd(() => { editor.isReady.apply(editor); }, null);
        return box;
    }

    /**
     * Creates and configures a TooltipManager component, creating an associated Box if one is not already defined.
     * @param {string} id - The base ID to assign to the tooltip manager and its box
     * @param {string} cloneId - The store ID of the tooltip manager to clone from
     * @param {HTMLElement} container - The container element to render into
     * @param {Object} [settings={}] - TooltipManager configuration options
     * @param {string} [settings.cssClass] - CSS class to apply to the tooltip manager
     * @param {boolean} [settings.selectableTooltipContent=true] - Whether tooltip content is selectable
     * @param {boolean} [settings.showOnFocus=true] - Whether tooltips show on focus
     * @param {number} [settings.expandDirection] - Expand direction for the tooltip box
     * @param {string} [settings.showOnPointerEvent] - Pointer event type that triggers tooltip display
     * @returns {componyx.UI.TooltipManager}
     * @ignore
     */
    createTooltipManager(id, cloneId, container, settings = {})
    {
        let tooltipManager = $UI.createComponent(componyx.UI.TooltipManager, { id: this.#getId(id), containerElement: container });

        tooltipManager.clone($UI.store[cloneId], this.editor, true, true, { triggers: '' });

        if (!tooltipManager.boxId)
        {
            const box = this.createBox('_TooltipManagerBox', null, this.editor.element);
            box.animation.showType = box.animation.hideType = 0;
            tooltipManager.boxId = box.id;
        }

        tooltipManager.cssClass = settings.cssClass;
        tooltipManager.selectableTooltipContent = (settings.selectableTooltipContent == false) ? false : true;
        tooltipManager.showOnFocus = (settings.showOnFocus == false) ? false : true;
        tooltipManager.showing = true;

        if (!$lib.isEmpty(settings.showOnPointerEvent))
            tooltipManager.showOnPointerEvent = settings.showOnPointerEvent;

        tooltipManager.events.onPostRender.priorityAdd(() => { this.editor.isReady.apply(this.editor); }, null);
        return tooltipManager;
    }

    /**
     * Creates the validator component.
     * @returns {componyx.UI.Validator}
     * @ignore
     */
    createValidator()
    {
        const id = this.#getId('Validator'),
            validator = $UI.createComponent(componyx.UI.Validator, { id: id, containerElement: this.editor.element });

        validator.clone($UI.store[this.editor.validatorId], this.editor);

        validator.events.onPreInit.priorityAdd(() =>
        {
            this.editor.isReady.apply(this.editor);
        });

        validator.events.onInvalid.priorityAdd(() =>
        {
            let activeDialog = this.editor.dialogManager.activeDialog;

            if (activeDialog)
                $UI.store[activeDialog.id + '_Confirm'].disable();
        });

        validator.events.onValid.priorityAdd(() =>
        {
            let activeDialog = this.editor.dialogManager.activeDialog;

            if (activeDialog)
                $UI.store[activeDialog.id + '_Confirm'].enable();
        });

        return validator;
    }

    /**
     * Creates a dialog component.
     * @param {string} id - The dialog ID
     * @param {string} cloneId - The base dialog ID to clone from
     * @param {Object} settings - Dialog configuration
     * @param {string} settings.cssClass - CSS class for the dialog
     * @param {HTMLElement} settings.header - Header content
     * @param {HTMLElement} settings.content - Main content
     * @param {HTMLElement} [settings.footer] - Footer content (optional)
     * @param {boolean} [settings.modal] - Whether dialog is modal (default: true)
     * @param {number} [settings.autoPosition] - Auto position option (default: 5)
     * @param {Function} settings.onShowComplete - Callback when dialog is shown
     * @param {Function} settings.onConfirm - Callback when confirmed
     * @param {Function} settings.onHide - Callback when hidden
     * @returns {componyx.UI.Dialog}
     * @ignore
     */
    createDialog(id, cloneId, settings = {})
    {
        const dialog = $UI.createComponent(componyx.UI.Dialog, { id: this.#getId(id), containerElement: this.editor.element });

        dialog.clone($UI.store[cloneId], this.editor);
        dialog.cssClass = settings.cssClass || null;
        dialog.autoFit = false;
        dialog.buttons.deny = false;
        dialog.buttons.cancelText = this.editor.labels.dialogCancel;
        dialog.buttons.confirmText = this.editor.labels.dialogConfirm;
        dialog.modal = settings.modal !== undefined ? settings.modal : true;
        dialog.autoPosition = settings.autoPosition !== undefined ? settings.autoPosition : 5;

        dialog.setHeaderTemplate(settings.header);
        dialog.setContentTemplate(settings.content);

        if (settings.footer)
            dialog.setFooterTemplate(settings.footer);

        dialog.events.onPostRender.priorityAdd(() =>
        {
            this.editor.isReady.apply(this.editor);
        });

        dialog.events.onShow.priorityAdd(() =>
        {
            this.editor.hideTooltips();
        });

        dialog.events.onShowComplete.priorityAdd(() =>
        {
            this.editor.hideTooltips();
            this.editor.storeRange(this.editor.selectionRange.getRange().cloneRange());
            this.editor.eventManager.disposeEvents();

            if (settings.onShowComplete)
                settings.onShowComplete();
        });

        dialog.events.onConfirm.priorityAdd(() =>
        {
            this.editor.cancelSelectionChange = false;
            this.editor.activateDocument();
            this.editor.selectionRange.restoreRange(this.editor.getStoredRange());
            settings.onConfirm();
        });

        dialog.events.onHideComplete.priorityAdd(() =>
        {
            this.editor.cancelSelectionChange = false;
            this.editor.activateDocument();
            this.editor.eventManager.bindEvents();

            if (settings.onHide)
                settings.onHide();

            this.editor.dialogManager.activeDialog = null;

            requestAnimationFrame(() =>
            {
                this.editor.activateDocument();
                const el = this.editor.getEditorElement();
                this.editor.selectionRange.restoreRange(this.editor.getStoredRange());
                el.focus();
            });
        });

        return dialog;
    }

    /**
     * Creates and configures a Button component.
     * @param {string} id - The ID to assign to the new button
     * @param {string} cloneId - The store ID of the button to clone from
     * @param {HTMLElement} container - The container element to render into
     * @param {Object} settings - Button configuration options
     * @param {string} [settings.cssClass] - CSS class to apply to the button
     * @param {string} [settings.cssClassIcon] - Icon CSS class appended to the base icon class
     * @param {number} [settings.contentAlign] - Content alignment option (default: CENTER)
     * @param {boolean} [settings.transparent=true] - Whether the button has a transparent background
     * @param {boolean} [settings.transparentBorder=true] - Whether the button has a transparent border
     * @param {number} [settings.type=0] - Button type option
     * @param {string} [settings.menuItemId] - ID of the associated menu item
     * @param {string} [settings.menuId] - ID of the associated menu; defaults to the editor menu if menuItemId is set
     * @param {string} [settings.boxId] - ID of a box to associate with the button
     * @param {string} [settings.radioGroupId] - Radio group ID; also sets button type to RADIOBUTTON
     * @param {string} [settings.text] - Button label text
     * @param {string} [settings.shortcutKey] - Keyboard shortcut key character
     * @param {string} [settings.tooltip] - Tooltip text; falls back to name with shortcut if omitted
     * @param {string} [settings.cssVariable] - CSS custom property name to update when a color is selected
     * @param {Function} [settings.command] - Callback fired when the button is activated
     * @param {Function} [settings.onSelect] - Callback fired on button select event
     * @returns {componyx.UI.Button}
     * @ignore
     */
    createButton(id, cloneId, container, settings = {})
    {
        let button = $UI.createComponent(componyx.UI.Button, { id: this.#getId(id), containerElement: container });

        button.clone($UI.store[cloneId], this.editor);
        button.cssClass = settings.cssClass;
        button.cssClassIcon = 'icon ' + settings.cssClassIcon;
        button.contentAlign = ($lib.isEmpty(settings.contentAlign)) ? componyx.UI.Button.AlignOption.CENTER : settings.contentAlign;
        button.primary = false;
        button.transparent = (settings.transparent === false) ? false : true;
        button.transparentBorder = (settings.transparentBorder === false) ? false : true;
        button.type = (settings.type) ? settings.type : 0;
        button.hasIcon = (settings.cssClassIcon) ? true : false;
        button.menuItemId = settings.menuItemId;
        button.menuId = (settings.menuItemId && !settings.menuId) ? this.editor.id + '_Menu' : settings.menuId;
        button.boxId = (settings.boxId) ? this.#getId(settings.boxId) : null;
        button.radioGroupId = settings.radioGroupId || null;
        button.text = settings.text || null;
        button.tooltipManagerId = this.tooltipManager.id;
        button.tooltipId = this.#addButtonTooltip(settings);
        button.shortcutKey = settings.shortcutKey;
        button.shortcutScope = () => this.editor.getEditorElement();

        if (settings.radioGroupId)
            button.type = componyx.UI.Button.TypeOption.RADIOBUTTON;

        if (settings.command)
        {
            button.command = function (sender)
            {
                this.editor.paragraphButtons.destroy(this.editor.getEditorElement());
                settings.command(settings, sender);
            }.bind(this);
        }

        if (settings.onSelect)
            button.events.onSelect.priorityAdd(settings.onSelect, null);

        if (settings.boxId && settings.boxId == 'ColorSwatch')
            button.expandCommand = () => { this.setActiveExpandButton(button); };

        button.events.onPostRender.priorityAdd(() => { this.editor.isReady.apply(this.editor); }, null);
        button.showing = true;

        if (settings.cssVariable)
            button.__cssVariable = settings.cssVariable;

        return button;
    }

    /**
     * Creates and configures a ComboBox component.
     * @param {string} cloneId - The store ID of the combobox to clone from
     * @param {HTMLElement} container - The container element to render into
     * @param {Object} settings - ComboBox configuration options
     * @param {string} settings.id - The ID to assign to the new combobox
     * @param {string} [settings.cssClass] - CSS class to apply to the combobox
     * @param {boolean} [settings.allowInput] - Whether free-text input is allowed
     * @param {boolean} [settings.allowCustomValue] - Whether values outside the list are accepted
     * @param {HTMLElement} [settings.noResultTemplate] - Template shown when no results match
     * @param {Function} [settings.onItemSelect] - Callback fired when an item is selected
     * @param {Function} [settings.onClear] - Callback fired when the value is cleared
     * @returns {componyx.UI.ComboBox}
     * @ignore
     */
    createComboBox(id, cloneId, container, settings = {})
    {
        let comboBox = $UI.createComponent(componyx.UI.ComboBox, { id: this.#getId(id), containerElement: container });

        comboBox.clone($UI.store[cloneId], this.editor);
        comboBox.cssClass = settings.cssClass;
        comboBox.allowInput = settings.allowInput ?? false;
        comboBox.allowCustomValue = settings.allowCustomValue ?? false;
        comboBox.placeholder = (settings.allowInput) ? this.editor.labels.comboBoxPlaceholderEditable : this.editor.labels.comboBoxPlaceholderReadOnly;
        comboBox.events.onPostRender.priorityAdd(() => { this.editor.isReady.apply(this.editor); });
        
        if (settings.itemList)
            comboBox.itemList = settings.itemList;

        if (settings.noResultTemplate)
            comboBox.setNoResultTemplate(settings.noResultTemplate);

        if (settings.onItemSelect)
            comboBox.events.onItemSelect.priorityAdd(() => { settings.onItemSelect(); });

        if (settings.onClear)
            comboBox.events.onClear.priorityAdd(() => { settings.onClear(); });

        comboBox.show();

        return comboBox;
    }

    /**
     * Creates and configures a FormField component.
     * @param {string} id - The ID to assign to the new form field
     * @param {string} cloneId - The store ID of the form field to clone from
     * @param {HTMLElement} container - The container element to render into
     * @param {Object} settings - FormField configuration options
     * @param {string} [settings.cssClass] - CSS class to apply to the form field
     * @param {number} [settings.labelDisplay=3] - Label display mode
     * @param {boolean} [settings.inline=false] - Whether the field renders inline
     * @param {boolean} [settings.switch=false] - Whether the field renders as a toggle switch
     * @param {HTMLElement} settings.label - Label template content
     * @param {HTMLElement} settings.field - Field template content
     * @returns {componyx.UI.FormField}
     * @ignore
     */
    createFormField(id, cloneId, container, settings = {})
    {
        let fld = $UI.createComponent(componyx.UI.FormField, { id: this.#getId(id), containerElement: container });

        fld.clone($UI.store[cloneId], this.editor);
        fld.cssClass = settings.cssClass;
        fld.labelDisplay = settings.labelDisplay || 3;
        fld.inline = settings.inline || false;
        fld.switch = settings.switch || false;
        fld.setLabelTemplate(settings.label);
        fld.setFieldTemplate(settings.field);
        fld.show();

        return fld;
    }

    createColorButton(id, cloneId, container, settings = {})
    {
        let colorButton = $UI.createComponent(componyx.UI.ColorButton, { id: this.#getId(id), containerElement: container });

        if (settings.command) // we want to overwrite the command of the underlaying button
        {
            const button = $UI.createComponent(componyx.UI.Button, { id: id + '_Button', containerElement: this.editor.element, command: settings.command, primary: false, transparentBorder: false, transparent: true });
            colorButton.buttonId = button.id;
        }

        colorButton.clone($UI.store[cloneId], this.editor);
        colorButton.show();
        return colorButton;
    }

    createColorSwatch()
    {
        let swatch = $lib.element('', '', '', '', { class: this.editor.getCssClass(this.editor.classOption.SWATCH) }),
            footer = $lib.element('', '', 'footer'),
            customColors = this.#getStoredColorSwatch(),
            swatchCssClass = this.editor.getCssClass(this.editor.classOption.COLORSWATCH_BOX);

        $lib.each(this.editor.colorSwatchColors.concat(customColors), (color, index) =>
        {
            $lib.element(swatch, '', 'a', '', { id: this.#getId(`swatch-color-${index}`), class: this.editor.getCssClass(this.editor.classOption.SWATCH_COLOR), style: `background:${color}` }, { onclick: this.#selectSwatchColor.bind(this, color) });
        });

        this.#colorSwatchBox = this.createBox('ColorSwatch', this.editor.colorSwatchBoxId, this.editor.element, { cssClass: swatchCssClass, content: [swatch, footer] });
        this.#colorSwatchBox.render();
        this.#swatch = swatch;

        this.createButton('clearColor', this.editor.clearColorButtonId, footer, { command: () => this.#clearColor(), cssClass: this.editor.getCssClass(this.editor.classOption.CLEARCOLOR_BUTTON), cssClassIcon: 'ico-cross' });
        this.createButton('toggleColorPicker', this.editor.colorPickerButtonId, footer, { command: () => this.#toggleColorPicker(), cssClass: this.editor.getCssClass(this.editor.classOption.COLORPICKER_BUTTON), cssClassIcon: this.utility.iconPrefix + 'palette' });
    }

    createColorPicker()
    {
        let id = this.#getId('ColorPicker'), box;

        this.#colorPicker = $UI.createComponent(componyx.UI.ColorPicker, { id: id, containerElement: this.editor.element });
        this.#colorPicker.clone($UI.store[this.editor.colorPickerId], this.editor);
        this.#colorPicker.popupView = true;
        this.#colorPicker.showing = true;

        if (!this.#colorPicker.boxId)
        {
            box = $UI.createComponent(componyx.UI.Box, { id: id + '_ColorPickerBox', containerElement: this.editor.element });
            this.#colorPicker.boxId = box.id;
        }
        else
            box = $UI.store[this.#colorPicker.boxId];

        box.events.onShowComplete.priorityAdd(() => { this.editor.eventManager.disposeEvents(); }, null);
        box.events.onHideComplete.priorityAdd(() => { this.editor.eventManager.bindEvents(); }, null);

        this.#colorPicker.events.onPostRender.priorityAdd(() => { this.editor.isReady.apply(this.editor); }, null);
    }

    /**
     * Adds a tooltip to the tooltip manager.
     * @param {Object} settings The command settings.
     * @returns {string} The tooltip id.
     * @ignore
     */
    #addButtonTooltip(settings)
    {
        let key = settings.shortcutKey,
            id = settings.id,
            name = settings.name,
            text = settings.tooltip || name;

        if (key && !settings.tooltip)
            text += ` (Ctrl+${key.toUpperCase()})`;

        if (text)
            this.tooltipManager.addTooltip(id, text);

        return id;
    }

    #selectSwatchColor(color)
    {
        this.#activeColorButton.__color = color;

        if (this.#activeColorButton.__cssVariable)
            this.editor.element.style.setProperty(this.#activeColorButton.__cssVariable, (color) ? color : 'none');

        this.#colorSwatchBox.hide();
        this.#activeColorButton.command();
    }

    #getStoredColorSwatch()
    {
        return window.JSON.parse(window.localStorage.getItem(this.editor.localStoragePrefix + 'CustomSwatch') || '[]');
    }

    #updateColorSwatch(color)
    {
        let isNew = true;

        $lib.each(this.#swatch.childNodes, (n) =>
        {
            return isNew = (n.style.cssText.indexOf(color) == -1);
        });

        if (isNew)
            $lib.element(this.#swatch, '', '', '', { id: this.#getId(`swatch-color-${this.#swatch.childNodes.length}`), class: this.editor.getCssClass(this.editor.classOption.SWATCH_COLOR), style: `background: ${color}` });

        return isNew;
    }

    #clearColor()
    {
        this.#selectSwatchColor(null);
    }

    #toggleColorPicker()
    {
        this.#colorPicker.expand(null, null, (colorPicker, args) =>
        {
            let color = this.editor.utility.toCSSColor(args.rgba),
                isNew = this.#updateColorSwatch(color);

            if (isNew)
            {
                let swatch = this.#getStoredColorSwatch();
                swatch.push(color);
                window.localStorage.setItem(this.editor.localStoragePrefix + 'CustomSwatch', window.JSON.stringify(swatch));
            }

            this.editor.eventManager.bindEvents();
            this.#selectSwatchColor(color);

        }, null, true, true);
    }

    #getId(id)
    {
        return this.utility.getId(id);
    }
};

export default componyx.UI.editor_modules.ComponentFactory;