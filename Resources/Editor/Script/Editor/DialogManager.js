/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.editor_modules = componyx.UI.editor_modules || {};

/**
 * Dialog Manager — manages editor dialogs.
 * @class DialogManager
 * @memberof componyx.UI.editor_modules
 * @ignore
 */
componyx.UI.editor_modules.DialogManager = class DialogManager
{
    #activeDialog = null;
    #sourceDialog;
    #bookmarkDialog;
    #linkDialog;
    #imageDialog;
    #mediaDialog;
    #tableDialog;

    constructor(editor)
    {
        this.editor = editor;
        this.cf = editor.componentFactory;
        this.utility = editor.utility;
        this.validator = this.cf.createValidator();

        const getId = this.#getId.bind(this);
        const shared = {
            validator: this.validator,
            addValidatorRules: (dialog, rules) => this.#addDialogValidatorRules(dialog, rules)
        };

        this.#sourceDialog = new SourceDialog(editor, this.cf, getId);
        this.#bookmarkDialog = new BookmarkDialog(editor, this.cf, getId, shared);
        this.#linkDialog = new LinkDialog(editor, this.cf, getId, shared);
        this.#imageDialog = new ImageDialog(editor, this.cf, this.utility, getId, shared);
        this.#mediaDialog = new MediaDialog(editor, this.cf, getId, shared);
        this.#tableDialog = new componyx.UI.editor_modules.TableDialog(editor);
        this.createTableDialog();
    }

    get activeDialog() { return this.#activeDialog; }
    set activeDialog(dialog) { this.#activeDialog = dialog; }

    get sourceDialog() { return this.#sourceDialog.dialog; }
    get bookmarkDialog() { return this.#bookmarkDialog.dialog; }
    get linkDialog() { return this.#linkDialog.dialog; }
    get imageDialog() { return this.#imageDialog.dialog; }
    get mediaDialog() { return this.#mediaDialog.dialog; }
    get tableDialog() { return this.#tableDialog; }

    createSourceDialog() { this.#sourceDialog.create(); }
    createBookmarkDialog() { this.#bookmarkDialog.create(); }
    createLinkDialog() { this.#linkDialog.create(); }
    createImageDialog() { this.#imageDialog.create(); }
    createMediaDialog() { this.#mediaDialog.create(); }
    createTableDialog() { this.#tableDialog.create(); }

    #addDialogValidatorRules(dialog, rules)
    {
        this.#activeDialog = dialog;
        this.validator.clear();

        $lib.each(rules, (rule) =>
        {
            const name = rule.name;
            const dataType = rule.dataType;

            this.validator.addRule(name, { live: true }, 0);

            if (dataType)
                this.validator.addRule(name, { dataType: dataType, live: true }, 1);
        });

        this.validator.validate();
    }

    #getId(id)
    {
        return this.utility.getId(id);
    }
};

class SourceDialog
{
    #dialog = null;
    #editor;
    #cf;
    #getId;

    constructor(editor, cf, getId)
    {
        this.#editor = editor;
        this.#cf = cf;
        this.#getId = getId;
    }

    get dialog() { return this.#dialog; }

    create()
    {
        const editor = this.#editor,
            cf = this.#cf,
            getId = this.#getId,
            header = $lib.element('', '', '', editor.labels.sourceViewDialogHeader),
            content = $lib.element('', '', '', '', {
                class: editor.getCssClass(editor.classOption.SOURCE_VIEW)
            });

        this.#dialog = cf.createDialog('SourceDialog', editor.sourceDialogId, {
            cssClass: editor.getCssClass(editor.classOption.SOURCE_DIALOG),
            header: header,
            content: content,
            onShowComplete: () =>
            {
                editor.createSourceViewBuilder(editor.getEditorElement(), content);
            },
            onConfirm: () =>
            {
                editor.setSourceViewBuilderHTML(editor.getEditorElement());
            },
            onHide: () =>
            {
                editor.getSourceViewStore().delete(editor.getEditorElement());
                $UI.store[getId('source')].deselect();
            }
        });
    }

    show() { this.#dialog?.show(); }
}

class BookmarkDialog
{
    #dialog = null;
    #editor;
    #cf;
    #getId;
    #shared;

    constructor(editor, cf, getId, shared)
    {
        this.#editor = editor;
        this.#cf = cf;
        this.#getId = getId;
        this.#shared = shared;
    }

    get dialog() { return this.#dialog; }

    create()
    {
        const editor = this.#editor,
            cf = this.#cf,
            getId = this.#getId,
            header = $lib.element('', '', '', editor.labels.bookmarkDialogHeader),
            input = $lib.element('', '', 'input', '', {
                type: "text",
                name: getId('bookmark'),
                placeholder: editor.labels.bookmarkInputPlaceholder
            }),
            content = $lib.element('', '', '', input);

        this.#dialog = cf.createDialog('BookmarkDialog', editor.bookmarkDialogId, {
            cssClass: editor.getCssClass(editor.classOption.BOOKMARK_DIALOG),
            header: header,
            content: content,
            onShowComplete: () =>
            {
                input.value = editor.layoutState.activeLayout.bookmark
                    ? editor.layoutState.activeLayout.bookmark.id
                    : '';
                this.#shared.addValidatorRules(this.#dialog, [{ name: input.name }]);
            },
            onConfirm: () =>
            {
                if (editor.layoutState.activeLayout.bookmark)
                {
                    editor.layoutState.activeLayout.bookmark.id = input.value;
                }
                else
                {
                    editor.contentManager.insertHTML({
                        tag: 'a',
                        selectable: true,
                        allowContent: false,
                        attributes: {
                            id: input.value,
                            [editor.utility.attrPrefix + 'bookmark']: ''
                        }
                    });
                }
            },
            onHide: () =>
            {
                input.value = '';
            }
        });
    }

    show() { this.#dialog?.show(); }
}

class LinkDialog
{
    #dialog = null;
    #editor;
    #cf;
    #getId;
    #shared;

    constructor(editor, cf, getId, shared)
    {
        this.#editor = editor;
        this.#cf = cf;
        this.#getId = getId;
        this.#shared = shared;
    }

    get dialog() { return this.#dialog; }

    create()
    {
        const editor = this.#editor,
            cf = this.#cf,
            getId = this.#getId,
            header = $lib.element('', '', '', editor.labels.linkDialogHeader),
            footer = $lib.element(),
            content = $lib.element(),
            temp = $lib.element(),
            hrefContainer = $lib.element(),
            targetContainer = $lib.element(),
            downloadableCheckbox = $lib.element('', '', 'input', '', { id: getId('linkDownloadable'), type: 'checkbox' }),
            text = $lib.element('', '', 'input', '', { id: getId('linkText'), name: getId('linkText') }),
            title = $lib.element('', '', 'input', '', { id: getId('linkTitle') }),
            href = cf.createComboBox('linkHref', editor.linkDialogHrefComboBoxId, hrefContainer,
                {
                    allowInput: true,
                    allowCustomValue: true,
                    noResultTemplate: editor.labels.comboBoxNoResult,
                    onItemSelect: () => this.#shared.validator.validate(),
                    onClear: () => this.#shared.validator.validate()
                }
            ),
            target = cf.createComboBox('linkTarget', editor.linkDialogTargetComboBoxId, targetContainer,
                {
                    allowInput: false
                }
            ),
            removeButton = cf.createButton('removeLink', editor.linkDialogRemoveButtonId, footer,
                {
                    transparent: false,
                    transparentBorder: false,
                    text: editor.labels.removeLink,
                    command: () => editor.removeLink(),
                    cssClass: this.#editor.getCssClass(this.#editor.classOption.REMOVE)
                }
            );

        const fields = {};
        fields.href = cf.createFormField('fldHref', editor.linkDialogHrefFormFieldId, temp, { label: editor.labels.linkHref, field: hrefContainer.firstElementChild }).element;
        fields.text = cf.createFormField('fldText', editor.linkDialogTextFormFieldId, temp, { label: editor.labels.linkText, field: text }).element;
        fields.title = cf.createFormField('fldTitle', editor.linkDialogTitleFormFieldId, temp, { label: editor.labels.linkTitle, field: title }).element;
        fields.target = cf.createFormField('fldTarget', editor.linkDialogTargetFormFieldId, temp, { label: editor.labels.linkTarget, field: targetContainer.firstElementChild }).element;

        removeButton.render();

        cf.createFormField('fldDownloadable', editor.linkDialogDownloadableFormFieldId, footer, { label: editor.labels.linkDownloadable, field: downloadableCheckbox, labelDisplay: 5, switch: true });

        let defaultTemplate = '{href}{text}{title}{target}',
            templateId = 'LinkDialogContent',
            defaultTemplateId = 'Default' + templateId,
            hasCustomTemplate = editor.hasTemplate(templateId);

        if (!editor.hasTemplate(templateId))
        {
            editor.addTemplate(defaultTemplateId, defaultTemplate, false);
            templateId = defaultTemplateId;
        }

        editor.applyTemplate(content, templateId, fields);

        if (!content.querySelector(`#${getId('fldHref')}`))
        {
            fields.href.style.display = 'none';
            content.appendChild(fields.href);
        }

        this.#dialog = cf.createDialog('LinkDialog', editor.linkDialogId, {
            cssClass: editor.getCssClass(editor.classOption.LINK_DIALOG),
            header: header,
            footer: footer,
            content: content,
            onShowComplete: () =>
            {
                const input = href.element.querySelector('input[type=text]');
                const range = editor.selectionRange.getRange();
                const link = editor.layoutState.activeLayout.link;

                this.#loadComboBox(this.#fillHrefComboBox(href));
                this.#loadComboBox(this.#fillTargetComboBox(target));

                text.disabled = !range.collapsed || editor.layoutState.activeLayout.link;
                title.value = '';
                input.name = getId('linkHref');
                downloadableCheckbox.checked = false;
                removeButton.hide();

                if (link)
                {
                    text.value = link.textContent;
                    title.value = link.getAttribute('title');
                    href.setValue(link.getAttribute('href'));
                    target.setValue(link.target);

                    if (link.hasAttribute('download'))
                        downloadableCheckbox.checked = true;

                    removeButton.show();
                }
                else if (!range.collapsed)
                {
                    text.value = range.toString();
                }

                this.#setConfirmState(hasCustomTemplate, href.getValue(), [{ name: input.name, dataType: 4 }]);

                const activeItem = link ? {
                    href: link.getAttribute('href'),
                    text: link.textContent,
                    title: link.getAttribute('title'),
                    target: link.target,
                    downloadable: link.hasAttribute('download')
                } : null;

                editor.events.onLinkDialogShow.fire(editor,
                    {
                        container: content,
                        activeItem,
                        confirmSelection: (url, linkText, linkTitle) => this.#confirmSelection(url, linkText, linkTitle, href, text, title)
                    });
            },
            onConfirm: () =>
            {
                this.#confirmDialog(href, text, title, target, downloadableCheckbox);
            },
            onHide: () =>
            {
                text.value = '';
            }
        });
    }

    show() { this.#dialog?.show(); }

    #setConfirmState(hasCustomTemplate, fieldValue, validatorRules)
    {
        this.#addValidatorRules(validatorRules);

        if (hasCustomTemplate)
        {
            const confirmButton = $UI.store[this.#dialog.id + '_Confirm'];
            if (fieldValue)
                confirmButton.enable();
            else
                confirmButton.disable();
        }
    }

    #addValidatorRules(rules)
    {
        const getId = this.#getId;
        const linkHref = getId('linkHref');
        const validator = this.#shared.validator;

        validator.clear();

        $lib.each(rules, (rule) =>
        {
            const name = rule.name;
            const dataType = rule.dataType;

            validator.addRule(name, { live: true }, 0);

            if (name == linkHref)
            {
                validator.addRule(name, {
                    onValidation: (v, args) =>
                    {
                        const valid = validator.validateType({ dataType: dataType }, args.fieldValue);
                        const combo = $UI.store[linkHref];
                        if (valid) return true;
                        return $lib.indexOf(combo.itemList, item => item.text === args.fieldValue) > -1;
                    },
                    live: true,
                    alwaysCheck: true
                }, 6);
            }
            else if (dataType)
            {
                validator.addRule(name, { dataType: dataType, live: true }, 1);
            }
        });

        validator.validate();
    }

    #confirmSelection(url, linkText, linkTitle, href, text, title)
    {
        href.setValue(url);
        if (linkText) text.value = linkText;
        if (linkTitle) title.value = linkTitle;
        $UI.store[this.#dialog.id + '_Confirm'].enable();
    }

    #confirmDialog(href, text, title, target, downloadableCheckbox)
    {
        const editor = this.#editor;
        const hrefValue = href.getValue();
        const targetValue = target.getValue();

        if (editor.layoutState.activeLayout.link)
        {
            const linkEl = editor.layoutState.activeLayout.link;
            linkEl.href = hrefValue;
            linkEl.target = targetValue;
            linkEl.title = title.value;

            if (downloadableCheckbox.checked)
                linkEl.setAttribute('download', '');
            else
                linkEl.removeAttribute('download');

            if (!text.disabled)
                linkEl.textContent = text.value || hrefValue;

            editor.history.addItem();
        }
        else
        {
            const range = editor.selectionRange.getRange();
            const settings = {
                tag: 'a',
                attributes: {
                    href: hrefValue,
                    title: title.value,
                    target: targetValue,
                    rel: "noreferer",
                    download: downloadableCheckbox.checked ? '' : undefined
                },
                selectable: true,
                allowContent: true,
                textContent: range.collapsed ? (text.value || hrefValue) : null
            };

            if (range.collapsed)
                editor.contentManager.insertHTML(settings);
            else
                editor.format.pasteFormat([editor.nodeManager.createNode(settings)], false);
        }
    }

    #fillHrefComboBox(combo)
    {
        const links = this.#editor.getEditorElement().getElementsByTagName('a');
        this.#createComboBoxItemList(combo);

        $lib.each(links, link =>
        {
            if (link.hasAttribute('href') && $lib.startsWith(link.getAttribute('href'), '#'))
                return;

            const href = link.getAttribute('href');
            let item;

            if (href)
                item = { id: href, text: href };
            else if (link.id)
                item = { id: '#' + link.id, text: this.#editor.labels.bookmarkPrefix + ': ' + link.id };

            if (item)
                combo.itemList.push(item);
        });

        return combo;
    }

    #fillTargetComboBox(combo)
    {
        const targets = this.#editor.getDoc().getElementsByTagName('iframe');
        const labels = this.#editor.labels;

        this.#createComboBoxItemList(combo);
        combo.itemList.push({ id: '_self', text: labels.linkTargetCurrent, selected: true });
        combo.itemList.push({ id: '_blank', text: labels.linkTargetNew });

        $lib.each(targets, target =>
        {
            if (target.name)
                combo.itemList.push({ text: target.name });
        });

        return combo;
    }

    #createComboBoxItemList(combo)
    {
        if (combo.itemList && combo.itemList.length)
            combo.itemList.length = 0;
        else
            combo.itemList = [];

        if (combo.renderState == 2)
            combo.clear();
    }

    #loadComboBox(combo)
    {
        if (combo.renderState == 2)
            combo.load(false, null, false);
    }
}

class ImageDialog
{
    #dialog = null;
    #editor;
    #cf;
    #utility;
    #getId;
    #shared;

    constructor(editor, cf, utility, getId, shared)
    {
        this.#editor = editor;
        this.#cf = cf;
        this.#utility = utility;
        this.#getId = getId;
        this.#shared = shared;
    }

    get dialog() { return this.#dialog; }

    create()
    {
        const editor = this.#editor,
            cf = this.#cf,
            getId = this.#getId,
            cssClassHalf = editor.getCssClass(editor.classOption.FIELD_HALF),
            imgId = getId('imgSrc'),
            header = $lib.element('', '', '', editor.labels.imageDialogHeader),
            footer = $lib.element(),
            content = $lib.element(),
            temp = $lib.element(),
            srcContainer = $lib.element(),
            heightContainer = $lib.element(),
            events = this.#createEvents(() =>
            {
                $UI.store[getId('ImageDialog_Confirm')].enable();
            }),
            radio = this.#createRadioButtons(),
            alt = $lib.element('', '', 'input', '', { id: getId('imgAlt') }),
            caption = $lib.element('', '', 'input', '', { id: getId('imgCaption') }),
            width = $lib.element('', '', 'input', '', { id: getId('imgWidth') }),
            height = $lib.element(heightContainer, '', 'input', '', { id: getId('imgHeight') }),
            src = $lib.element(srcContainer, '', 'input', '', { id: imgId, name: imgId }, { readOnly: !editor.allowImageUrlInput }),
            inlineCheckbox = $lib.element('', '', 'input', '', {
                id: getId('imgInline'),
                type: 'checkbox'
            }, {
                onclick: function ()
                {
                    caption.disabled = this.checked;
                    radio.hideAll();
                    if (this.checked)
                        radio.toggle([0, 1, 2, 3, 4], true);
                    else
                        radio.toggle([5, 6, 7], true);
                }
            });

        if (editor.allowImageFileSelect)
            this.#createFileButton(srcContainer, events);

        this.#createUnlockButton(heightContainer);

        [width, height].forEach(el => $lib.on(el, 'input', events.constrainProportions));
        $lib.on(src, 'change', events.urlChange);

        if (!editor.allowImageUrlInput)
        {
            $lib.on(src, 'click', () =>
            {
                srcContainer.querySelector('input[type="file"]').click();
            });
        }

        const fields = {};
        fields.source = cf.createFormField('fldImgSrc', editor.imageDialogSourceFormFieldId, temp, { label: editor.labels.imageSource, field: srcContainer }).element;
        fields.alt = cf.createFormField('fldImgAlt', editor.imageDialogAltFormFieldId, temp, { label: editor.labels.imageAlt, field: alt }).element;
        fields.width = cf.createFormField('fldImgWidth', editor.imageDialogWidthFormFieldId, temp, { label: editor.labels.imageWidth, field: width, inline: true, cssClass: cssClassHalf }).element;
        fields.height = cf.createFormField('fldImgHeight', editor.imageDialogHeightFormFieldId, temp, { label: editor.labels.imageHeight, field: heightContainer, inline: true, cssClass: cssClassHalf }).element;
        fields.caption = cf.createFormField('fldImgCaption', editor.imageDialogCaptionFormFieldId, temp, { label: editor.labels.caption, field: caption }).element;
        fields.alignment = cf.createFormField('fldImgAlignment', editor.imageDialogAlignmentFormFieldId, temp, { label: editor.labels.imageAlignment, field: radio.content }).element;
        fields.inline = cf.createFormField('fldImgInline', editor.imageDialogInlineFormFieldId, footer, { label: editor.labels.imageInline, field: inlineCheckbox, switch: true, labelDisplay: 5 }).element;

        let defaultTemplate = '{source}{alt}{width}{height}{caption}{alignment}',
            templateId = 'ImageDialogContent',
            hasCustomTemplate = editor.hasTemplate(templateId),
            defaultTemplateId = 'Default' + templateId;

        if (!editor.hasTemplate(templateId))
        {
            editor.addTemplate(defaultTemplateId, defaultTemplate, false);
            templateId = defaultTemplateId;
        }

        editor.applyTemplate(content, templateId, fields);

        if (!content.querySelector(`#${getId('fldImgSrc')}`))
        {
            fields.source.style.display = 'none';
            content.appendChild(fields.source);
        }
 
        this.#dialog = cf.createDialog('ImageDialog', editor.imageDialogId, {
            cssClass: editor.classOption.IMAGE_DIALOG,
            header: header,
            footer: footer,
            content: content,
            onShowComplete: () =>
            {
                const img = editor.layoutState.activeLayout.image,
                    range = editor.selectionRange.getRange(),
                    rootNode = editor.nodeManager.getRootNode(range.startContainer);

                radio.hideAll();

                if (img)
                {
                    const figure = img.parentElement;
                    const captionEl = figure.querySelector('figcaption');

                    src.value = img.getAttribute('src');;
                    alt.value = img.alt;
                    width.value = img.width;
                    height.value = img.height;
                    events.widthRatio = img.__widthRatio || (img.width / img.height);
                    caption.value = captionEl ? captionEl.textContent : '';

                    if (figure.nodeName == 'SPAN')
                    {
                        caption.disabled = inlineCheckbox.checked = true;
                        radio.toggle([0, 1, 2, 3, 4], true);
                    }
                    else
                    {
                        caption.disabled = inlineCheckbox.checked = false;
                        radio.toggle([5, 6, 7], true);
                    }

                    radio.select(figure);
                }
                else
                {
                    src.value = alt.value = width.value = height.value = caption.value = '';

                    if (rootNode && rootNode.textContent.length)
                    {
                        inlineCheckbox.checked = caption.disabled = true;
                        radio.toggle([0, 1, 2, 3, 4], true);
                    }
                    else
                    {
                        inlineCheckbox.checked = caption.disabled = false;
                        radio.toggle([5, 6, 7], true);
                    }
                }

                this.#setConfirmState(hasCustomTemplate, src.value, [{ name: src.name, dataType: 5 }]);

                const activeItem = img ? {
                    src: img.getAttribute('src'),
                    alt: img.alt,
                    width: img.width,
                    height: img.height,
                    caption: caption.value
                } : null;

                editor.events.onImageDialogShow.fire(editor,
                    {
                        container: content,
                        activeItem,
                        confirmSelection: (url, altText, captionText) => this.#confirmSelection(url, altText, captionText, src, alt, caption, events)
                    });
            },
            onConfirm: () =>
            {
                this.#confirmDialog(src, alt, width, height, caption, inlineCheckbox, radio, events);
            }
        });
    }

    show() { this.#dialog?.show(); }

    #setConfirmState(hasCustomTemplate, fieldValue, validatorRules)
    {
        if (this.#editor.allowImageUrlInput)
        {
            this.#shared.addValidatorRules(this.#dialog, validatorRules);
        }
        else
        {
            const confirmButton = $UI.store[this.#dialog.id + '_Confirm'];
            if (fieldValue)
                confirmButton.enable();
            else
                confirmButton.disable();
        }
    }

    #confirmSelection(url, altText, captionText, src, alt, caption, events)
    {
        src.value = url;

        if (altText && alt) alt.value = altText;
        if (captionText && caption) caption.value = captionText;

        const img = new Image();
        img.onload = events.onLoad.bind(img);
        img.src = url;

        $UI.store[this.#dialog.id + '_Confirm'].enable();
    }

    #confirmDialog(src, alt, width, height, caption, inlineCheckbox, radio, events)
    {
        const editor = this.#editor;
        let img,
            captionHTML = '',
            figure = editor.layoutState.activeLayout.image ? editor.layoutState.activeLayout.image.parentNode : null;

        if (editor.layoutState.activeLayout.image &&
            ((figure.nodeName == 'FIGURE' && !inlineCheckbox.checked) ||
                (figure.nodeName == 'SPAN' && inlineCheckbox.checked)))
        {
            img = editor.layoutState.activeLayout.image;

            this.#configureImage(img, { src, alt, width, height, events });

            let captionEl = img.parentElement.querySelector('figcaption');

            if (!captionEl && caption.value)
            {
                captionEl = $lib.element('', '', 'figcaption', caption.value);
                img.parentElement.appendChild(captionEl);
            }
            else if (captionEl)
            {
                if (caption.value)
                    captionEl.textContent = caption.value;
                else
                    captionEl.remove();
            }
        }
        else
        {
            if (figure)
                figure.remove();

            img = this.#configureImage($lib.element('', '', 'img'), { src, alt, width, height, events });

            if (!caption.disabled && caption.value)
                captionHTML = $lib.element('', '', 'figcaption', caption.value).outerHTML;

            figure = editor.history.noHistory(() =>
                editor.contentManager.insertHTML({
                    tag: inlineCheckbox.checked ? 'span' : 'figure',
                    styles: !inlineCheckbox.checked ? { width: 'fit-content' } : { display: 'inline-block', width: 'fit-content' },
                    isPhrasingContent: inlineCheckbox.checked,
                    selectable: true,
                    select: true,
                    allowContent: false,
                    innerHTML: img.outerHTML + captionHTML,
                })
            );

            figure.firstElementChild.__widthRatio = events.widthRatio;
        }

        if (inlineCheckbox.checked)
        {
            const alignClass = radio.selected.cssClass.replace('button ', '').trim();
            this.#applyImageAlignStyle(figure, alignClass);
        }
        else
        {
            const alignClass = radio.selected.cssClass.replace('button ', '').trim();
            this.#applyImageAlignStyle(figure, alignClass);
        }

        editor.history.addItem();
    }

    #applyImageAlignStyle(figure, alignClass)
    {
        figure.style.removeProperty('float');
        figure.style.removeProperty('vertical-align');
        figure.style.removeProperty('margin-left');
        figure.style.removeProperty('margin-right');

        switch (alignClass)
        {
            case 'img-inline-align-default-top': figure.style.verticalAlign = 'top'; break;
            case 'img-inline-align-default-center': figure.style.verticalAlign = 'middle'; break;
            case 'img-inline-align-default-bottom': figure.style.verticalAlign = 'bottom'; break;
            case 'img-inline-align-left': figure.style.float = 'left'; break;
            case 'img-inline-align-right': figure.style.float = 'right'; break;
            case 'img-align-center': figure.style.marginLeft = 'auto'; figure.style.marginRight = 'auto'; break;
            case 'img-align-right': figure.style.marginLeft = 'auto'; break;
        }
    }

    #configureImage(img, settings)
    {
        img.contentEditable = false;
        img.src = settings.src.value;
        img.alt = settings.alt.value;
        img.width = settings.width.value;
        img.height = settings.height.value;
        img.__widthRatio = settings.events.widthRatio;
        img.style.removeProperty('width');
        img.style.removeProperty('height');
        return img;
    }

    #createFileButton(container, events)
    {
        const getId = this.#getId;
        const guid = getId('fileButtonInput');
        const label = $lib.element(container, '', 'label', '');
        const button = this.#cf.createButton('imgFileButton', this.#editor.imageDialogFileButtonId, label,
            {

                cssClass: this.#editor.getCssClass(this.#editor.classOption.FILE_SELECT),
                cssClassIcon: 'ico-upload',
                tooltip: this.#editor.labels.imageFileButtonTooltip
            }
        );

        label.htmlFor = guid;
        button.render();
        $lib.element(label, '', 'input', '', '', {
            id: guid,
            type: 'file',
            accept: 'image/*',
            hidden: true,
            onchange: events.fileChange
        });

        return button;
    }

    #createUnlockButton(container)
    {
        const button = this.#cf.createButton('imgUnlockButton', this.#editor.imageDialogConstrainButtonId, container,
            {
                cssClass: this.#editor.getCssClass(this.#editor.classOption.LOCK),
                cssClassIcon: this.#utility.iconPrefix + 'lock',
                type: 1,
                tooltip: this.#editor.labels.imageConstrainButtonTooltip
            }
        );

        button.render();
        return button;
    }

    #createEvents(fileSelected)
    {
        const getId = this.#getId;
        const editor = this.#editor;
        const validator = this.#shared.validator;

        const events = {
            widthRatio: null,

            urlChange: function (e)
            {
                const img = new Image();
                img.onload = events.onLoad.bind(img);
                img.src = this.value;
            },

            fileChange: function (e)
            {
                const file = this.files[0],
                    url = window.URL.createObjectURL(file),
                    img = new Image();

                $lib('#' + getId('imgSrc')).value = url;
                img.onload = events.onLoad.bind(img, file);
                img.src = url;
                editor.events.onImageSelect.fire(editor, { imageElement: this, file: file || null });

                this.value = '';
                fileSelected();
            },

            onLoad: function (file)
            {
                $lib('#' + getId('imgWidth')).value = this.width;
                $lib('#' + getId('imgHeight')).value = this.height;
                events.widthRatio = this.width / this.height;
                editor.events.onImageLoad.fire(editor, { imageElement: this, file: file || null });
            },

            constrainProportions: function (e)
            {
                const el = this,
                    isWidthEl = el.id.indexOf('Width') > -1,
                    linkedEl = isWidthEl ? $lib('#' + getId('imgHeight')) : $lib('#' + getId('imgWidth')),
                    value = parseFloat(el.value),
                    ratio = events.widthRatio;

                if (isNaN(value) || $lib('#' + getId('imgSrc')).value == '' || $UI.store[getId('imgUnlockButton')].selected)
                    return;

                linkedEl.value = Math.round(isWidthEl ? value * (1 / ratio) : value * ratio);
            }
        };

        return events;
    }

    #createRadioButtons()
    {
        const cf = this.#cf,
            editor = this.#editor,
            utility = this.#utility,
            radio = {
                buttons: [],
                content: $lib.element(),
                selected: null,

                create: function (settings)
                {
                    settings.onSelect = function (button) { this.selected = button; }.bind(this);
                    this.buttons.push(cf.createButton(settings.id,
                        editor.imageDialogAlignButtonId,
                        this.content,
                        settings
                    ));
                },

                hideAll: function ()
                {
                    $lib.each(this.buttons, f => { f.deselect(); f.hide(); });
                },

                toggle: function (buttons, show)
                {
                    $lib.each(buttons, (f, i) =>
                    {
                        const button = this.buttons[f];
                        if (!i) button.select();
                        show ? button.show() : button.hide();
                    });
                },

                select: function (figure)
                {
                    const style = figure.style;
                    let alignClass = '';

                    if (style.float == 'left') alignClass = 'img-inline-align-left';
                    else if (style.float == 'right') alignClass = 'img-inline-align-right';
                    else if (style.verticalAlign == 'top') alignClass = 'img-inline-align-default-top';
                    else if (style.verticalAlign == 'middle') alignClass = 'img-inline-align-default-center';
                    else if (style.verticalAlign == 'bottom') alignClass = 'img-inline-align-default-bottom';
                    else if (style.marginLeft == 'auto' && style.marginRight == 'auto') alignClass = 'img-align-center';
                    else if (style.marginLeft == 'auto') alignClass = 'img-align-right';

                    $lib.each(this.buttons, button =>
                    {
                        if (button.cssClass.includes(alignClass))
                        {
                            button.select();
                            return false;
                        }
                    });
                }
            };

        const labels = editor.labels,
            classOption = editor.classOption;

        radio.create({ id: 'imgInlineAlignDefaultBottom', text: labels.alignBottom, cssClass: editor.getCssClass(classOption.IMG_INLINE_ALIGN_DEFAULT_BOTTOM), cssClassIcon: utility.iconPrefix + editor.getCssClass(classOption.IMG_INLINE_ALIGN_DEFAULT_BOTTOM), radioGroupId: 'imageAlign1' });
        radio.create({ id: 'imgInlineAlignDefaultCenter', text: labels.alignMiddle, cssClass: editor.getCssClass(classOption.IMG_INLINE_ALIGN_DEFAULT_CENTER), cssClassIcon: utility.iconPrefix + editor.getCssClass(classOption.IMG_INLINE_ALIGN_DEFAULT_CENTER), radioGroupId: 'imageAlign1' });
        radio.create({ id: 'imgInlineAlignDefaultTop', text: labels.alignTop, cssClass: editor.getCssClass(classOption.IMG_INLINE_ALIGN_DEFAULT_TOP), cssClassIcon: utility.iconPrefix + editor.getCssClass(classOption.IMG_INLINE_ALIGN_DEFAULT_TOP), radioGroupId: 'imageAlign1' });
        radio.create({ id: 'imgInlineAlignLeft', text: labels.alignLeft, cssClass: editor.getCssClass(classOption.IMG_INLINE_ALIGN_LEFT), cssClassIcon: utility.iconPrefix + editor.getCssClass(classOption.IMG_INLINE_ALIGN_LEFT), radioGroupId: 'imageAlign1' });
        radio.create({ id: 'imgInlineAlignRight', text: labels.alignRight, cssClass: editor.getCssClass(classOption.IMG_INLINE_ALIGN_RIGHT), cssClassIcon: utility.iconPrefix + editor.getCssClass(classOption.IMG_INLINE_ALIGN_RIGHT), radioGroupId: 'imageAlign1' });
        radio.create({ id: 'imgAlignLeft', text: labels.alignLeft, cssClass: editor.getCssClass(classOption.IMG_ALIGN_LEFT), cssClassIcon: utility.iconPrefix + editor.getCssClass(classOption.IMG_ALIGN_LEFT), radioGroupId: 'imageAlign2' });
        radio.create({ id: 'imgAlignCenter', text: labels.alignCenter, cssClass: editor.getCssClass(classOption.IMG_ALIGN_CENTER), cssClassIcon: utility.iconPrefix + editor.getCssClass(classOption.IMG_ALIGN_CENTER), radioGroupId: 'imageAlign2' });
        radio.create({ id: 'imgAlignRight', text: labels.alignRight, cssClass: editor.getCssClass(classOption.IMG_ALIGN_RIGHT), cssClassIcon: utility.iconPrefix + editor.getCssClass(classOption.IMG_ALIGN_RIGHT), radioGroupId: 'imageAlign2' });

        return radio;
    }
}

class MediaDialog
{
    #dialog = null;
    #editor;
    #cf;
    #getId;
    #shared;

    constructor(editor, cf, getId, shared)
    {
        this.#editor = editor;
        this.#cf = cf;
        this.#getId = getId;
        this.#shared = shared;
    }

    get dialog() { return this.#dialog; }

    create()
    {
        const editor = this.#editor,
            cf = this.#cf,
            getId = this.#getId,
            mediaId = getId('mediaSrc'),
            mediaEmbedId = getId('mediaEmbed'),
            embedAttr = editor.utility.attrPrefix + 'embed',
            header = $lib.element('', '', '', editor.labels.mediaDialogHeader),
            content = $lib.element(),
            temp = $lib.element(),
            src = $lib.element('', '', 'input', '', { id: mediaId, name: mediaId }),
            embed = $lib.element('', '', 'textarea', '', { id: mediaEmbedId, name: mediaEmbedId }),
            caption = $lib.element('', '', 'input', '', { id: getId('mediaCaption') }),
            width = $lib.element('', '', 'input', '', { id: getId('mediaWidth') });

        const events = {
            inputChanged: function (e)
            {
                const el = e.target;
                const elToDisable = (el == src) ? embed : src;
                elToDisable.disabled = (el.value != '');

                if (el == src)
                    this.#shared.addValidatorRules(this.#dialog, [{ name: src.name, dataType: 4 }]);
                else
                    this.#shared.addValidatorRules(this.#dialog, [{ name: embed.name }]);
            }.bind(this)
        };

        [src, embed].forEach(node => $lib.on(node, 'input', events.inputChanged));

        const fields = {};
        fields.source = cf.createFormField('fldMediaSrc', editor.mediaDialogSourceFormFieldId, temp, { label: editor.labels.mediaSource, field: src }).element;
        fields.embed = cf.createFormField('fldMediaEmbed', editor.mediaDialogEmbedFormFieldId, temp, { label: editor.labels.mediaEmbed, field: embed }).element;
        fields.width = cf.createFormField('fldMediaWidth', editor.mediaDialogWidthFormFieldId, temp, { label: editor.labels.mediaWidth, field: width }).element;
        fields.caption = cf.createFormField('fldCaption', editor.mediaDialogCaptionFormFieldId, temp, { label: editor.labels.caption, field: caption }).element;

        let defaultTemplate = '{source}{embed}{caption}{width}',
            templateId = 'MediaDialogContent',
            defaultTemplateId = 'Default' + templateId,
            hasCustomTemplate = editor.hasTemplate(templateId);

        if (!editor.hasTemplate(templateId))
        {
            editor.addTemplate(defaultTemplateId, defaultTemplate, false);
            templateId = defaultTemplateId;
        }

        editor.applyTemplate(content, templateId, fields);

        if (!content.querySelector(`#${getId('fldMediaSrc')}`))
        {
            fields.source.style.display = 'none';
            content.appendChild(fields.source);
        }

        if (!content.querySelector(`#${getId('fldMediaEmbed')}`))
        {
            fields.embed.style.display = 'none';
            content.appendChild(fields.embed);
        }

        this.#dialog = cf.createDialog('MediaDialog', editor.mediaDialogId, {
            cssClass: editor.getCssClass(editor.classOption.MEDIA_DIALOG),
            header: header,
            content: content,
            onShowComplete: () =>
            {
                const media = editor.layoutState.activeLayout.media;

                src.value = embed.value = width.value = '';
                src.disabled = embed.disabled = false;

                if (media)
                {
                    if (media.hasAttribute(embedAttr))
                    {
                        embed.value = media.firstElementChild.innerHTML;
                        src.disabled = true;
                    }
                    else
                    {
                        src.value = media.firstElementChild.firstElementChild.src;
                        embed.disabled = true;
                    }

                    width.value = media.style.width;
                }

                this.#setConfirmState(hasCustomTemplate, src.value, embed.value ? [{ name: embed.name }] : [{ name: src.name, dataType: 4 }]);

                const activeItem = media ? {
                    src: media.hasAttribute(embedAttr) ? null : src.value,
                    embed: media.hasAttribute(embedAttr) ? embed.value : null,
                    width: width.value,
                    caption: media.querySelector('figcaption')?.textContent || ''
                } : null;

                editor.events.onMediaDialogShow.fire(editor,
                    {
                        container: content,
                        activeItem,
                        confirmSelection: (url, captionText) => this.#confirmSelection(url, captionText, src, caption)
                    });
            },
            onConfirm: () =>
            {
                this.#confirmDialog(src, embed, caption, width, embedAttr);
            }
        });
    }

    show() { this.#dialog?.show(); }

    #setConfirmState(hasCustomTemplate, fieldValue, validatorRules)
    {
        this.#shared.addValidatorRules(this.#dialog, validatorRules);

        if (hasCustomTemplate)
        {
            const confirmButton = $UI.store[this.#dialog.id + '_Confirm'];
            if (fieldValue)
                confirmButton.enable();
            else
                confirmButton.disable();
        }
    }

    #confirmSelection(url, captionText, src, caption)
    {
        src.value = url;
        if (captionText) caption.value = captionText;
        $UI.store[this.#dialog.id + '_Confirm'].enable();
    }

    #confirmDialog(src, embed, caption, width, embedAttr)
    {
        const editor = this.#editor;

        $lib.each(editor.mediaURLReplacement, item =>
        {
            if (src.value.match(item.match))
                src.value = src.value.replace(item.match, item.replace);
        });

        let media = editor.layoutState.activeLayout.media,
            mediaRatio = $lib.element(),
            captionHTML = '',
            mediaContent = embed.value
                ? embed.value
                : $lib.element('', '', 'iframe', '', {
                    allow: 'encrypted-media',
                    allowfullscreen: 'true',
                    contenteditable: 'false'
                }, { src: src.value }).outerHTML;

        mediaRatio.setAttribute('style', 'position: relative; padding-bottom: 56.25%;');
        mediaRatio.innerHTML = mediaContent;

        const iframe = mediaRatio.querySelector('iframe');

        if (iframe)
            iframe.setAttribute('style', 'position: absolute; left: 0; top: 0; width: 100%; height: 100%; border: 0;');

        mediaContent = mediaRatio.outerHTML;

        if (media)
        {
            media.removeAttribute(embedAttr);
            media.style.width = width.value ? $lib.unit(width.value) : null;
            media.innerHTML = mediaContent;

            if (caption.value)
                media.appendChild($lib.element('', '', 'figcaption', caption.value));

            editor.history.addItem();
        }
        else
        {
            if (caption.value)
                captionHTML = $lib.element('', '', 'figcaption', caption.value).outerHTML;

            media = editor.history.noHistory(() =>
                editor.contentManager.insertHTML({
                    tag: 'figure',
                    styles: { 'width': width.value ? $lib.unit(width.value) : null },
                    attributes: { [editor.utility.attrPrefix + 'media']: '' },
                    selectable: true,
                    select: true,
                    allowContent: false,
                    isPhrasingContent: false,
                    innerHTML: mediaContent + captionHTML,
                })
            );
        }

        if (embed.value)
            media.setAttribute(embedAttr, '');

        editor.history.addItem();
    }
}

export default componyx.UI.editor_modules.DialogManager;