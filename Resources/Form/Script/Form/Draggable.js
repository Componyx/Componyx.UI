/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};
componyx.UI.form_modules.Draggable = class Draggable
{
    #classOption;
    constructor(form)
    {
        this.form = form;
        this.draggables = new Map();
        this.#classOption = form.classOption;
    }

    destroy()
    {
        this.draggables.forEach((value) =>
        {
            value.disable();
        });
    }

    /**
    * @typedef {Object} DragOption
    * @property {HTMLElement} element                                                   - Gets the field option row element to be dragged.
    * @property {componyx.UI.Form.Field} field                                       - Gets the corresponding field.
    * @property {componyx.UI.Form.FieldOption} option		                        - Gets the corresponding field option.
    * @property {componyx.UI.PanelBar.Panel} panel                                   - Gets the panel to which the field option belongs.
    */

    /**
     * Creates a draggable field option.
     * @param {DragOption} dragItem
     */
    createDraggableOption(dragItem)
    {
        let element = dragItem.element,
            dropZone = dragItem.panel.contentElement,
            dragHandle = element.querySelector('.' + this.#getCssClass(this.#classOption.DRAG_HANDLE)),
            onDragStart = this.#dragStartOption.bind(this),
            onDroppable = this.#droppableOption.bind(this),
            onDroppableLeave = this.#droppableOptionLeave.bind(this),
            onDrop = this.#dropOption.bind(this);

        this.createDraggable(dragItem, dragHandle, this.form.ownerDocument.documentElement, [dropZone], onDragStart, onDroppable, onDroppableLeave, onDrop);
    }

    /**
     * Creates a draggable build block, field or fieldset.
     * @param {componyx.UI.Form.FieldSet|componyx.UI.Form.Field|componyx.UI.Form.BuildBlock} dragItem
     */
    createDraggableField(dragItem)
    {
        if (this.form.displayMode !== this.form.constructor.DisplayModeOption.BUILD)
            return;

        let element = dragItem.element,
            isBlock = dragItem.type === 'BuildBlock',
            isSet = dragItem.type === 'FieldSet' || (isBlock && dragItem.blockType == this.form.constructor.BlockTypeOption.FIELD_SET),
            dragHandle = (!isBlock) ? element.querySelector('.' + this.#getCssClass(this.#classOption.DRAG_HANDLE)) : null,
            boundaryZone = this.form.ownerDocument.documentElement,
            getRootZones = () =>
            {
                // Use visible section if available, otherwise fall back to the form pane
                return [Array.from(this.form.querySelectorAll('section')).find(s => s.offsetParent)
                    || this.form.querySelector('.' + this.#getCssClass(this.#classOption.FORM_PANE))];
            },
            dropZones = () =>
            {
                return getRootZones().concat(this.#getDropZones((isSet || isBlock) ? element : null));
            },
            onDragStart = (isSet && !isBlock) ? this.#dragStartFieldSet.bind(this) :
                (this.form.isField(dragItem.type)) ? this.#dragStartField.bind(this) : this.#dragStartBuildBlock.bind(this),
            onDroppable = this.#droppableField.bind(this),
            onDroppableLeave = this.#droppableFieldLeave.bind(this),
            onDrop = (isSet) ? this.#dropFieldSet.bind(this) : this.#dropField.bind(this);

        this.createDraggable(dragItem, dragHandle, boundaryZone, dropZones, onDragStart, onDroppable, onDroppableLeave, onDrop);
    }

    createDraggable(dragItem, dragHandle, boundaryZone, dropZones, onDragStart, onDroppable, onDroppableLeave, onDrop)
    {
        if (this.draggables.has(dragItem.element))
        {
            this.draggables.get(dragItem.element).disable();
            this.draggables.delete(dragItem.element);
        }

        let draggable = $lib.draggable(dragItem.element, $base.static.initDragSettings({
            dragGhost: this.#createDragGhost(dragItem.element),
            dragHandle: dragHandle,
            autoGhostSize: false,
            moveOriginal: false,
            ignoreMargins: true,
            scrollX: true,
            scrollY: true,
            boundaryZone: boundaryZone,
            minDragX: 1,
            minDragY: 1,
            dropAcceptMode: 2,
            dragClass: this.#getCssClass(this.#classOption.DRAGGING),
            droppableClass: this.#getCssClass(this.#classOption.DROPPABLE),
            dropZones: dropZones,
            onDragStart: onDragStart,
            onDroppable: onDroppable,
            onDroppableLeave: onDroppableLeave,
            onDrop: onDrop,
            _dragItem: dragItem
        }, this.form.dragSettings));

        this.draggables.set(dragItem.element, draggable);
    }

    #getDropZones(excludeEl = null)
    {
        return Array.from(this.form.querySelectorAll('fieldset')).filter(element =>
            element !== excludeEl &&
            element.offsetParent !== null // include visible elements only
        );
    }

    #createDragGhost(element)
    {
        const container = element.classList.contains(this.#getCssClass(this.#classOption.FIELD_OPTIONS_ITEM))
            ? element.closest('.content') || element
            : element,
            dragGhost = $lib.element(container, null);

        dragGhost.classList.add(this.#getCssClass(this.#classOption.DRAG_GHOST));
        dragGhost.style.display = 'none';
        return dragGhost;
    }

    #dragStartOption(args)
    {
        const labelInput = args.element.querySelector('input');
        args.settings.dragGhost.innerHTML = labelInput.value.trim() || this.form.labels.FieldOption;
        args.settings.dragGhost.classList.add(this.#getCssClass(this.#classOption.FIELD_OPTIONS_ITEM_GHOST));
    }

    #dragStartBuildBlock(args)
    {
        const cloneEl = args.element.cloneNode(true),
            dragGhostClass = this.#getCssClass(this.#classOption.DRAG_GHOST),
            ghostEl = cloneEl.querySelector(`.${dragGhostClass}`),
            buttonEl = cloneEl.querySelector('.button');

        $lib.remove(buttonEl);
        $lib.remove(ghostEl);
        args.settings.dragGhost.innerHTML = cloneEl.outerHTML;
    }

    #dragStartField(args)
    {
        const dragItem = args.settings._dragItem,
            buildBlock = this.form.buildBlocks.find((b) =>
                (b.inputType ?? null) === (dragItem.inputType ?? null) &&
                (this.form.constructor.BlockTypeOption.getName(b.blockType) ?? null) === (dragItem.type ?? null) &&
                (b.customType ?? null) === (dragItem.customType ?? null));

        args.settings.dragGhost.innerHTML = '';
        this.form.buildPanelManager.createBuildBlockElement(buildBlock, args.settings.dragGhost);
    }

    #dragStartFieldSet(args)
    {
        let set = args.settings._dragItem,
            fieldCount = this.form.getFields(set).length,
            label = set.label || this.form.labels.fieldSet,
            fieldLabel = fieldCount === 1 ? this.form.labels.field : this.form.labels.fields;

        args.settings.dragGhost.classList.add(this.#getCssClass(this.#classOption.FIELD_SET));
        args.settings.dragGhost.innerHTML = `${label} (${fieldCount} ${fieldLabel})`;
    }

    #droppableOption(args)
    {
        const dropZone = args.dropZone,
            rows = Array.from(dropZone.querySelectorAll('.' + this.#getCssClass(this.#classOption.FIELD_OPTIONS_ITEM)))
                .filter(el => el !== args.element && !el.classList.contains(this.#getCssClass(this.#classOption.FIELD_OPTIONS_ITEM_NEW))),
            closestElData = this.#getClosestElement(rows, args.settings),
            dropAbove = this.#getDropAbove(),
            dropBelow = this.#getDropBelow();

        if (!closestElData.el || !closestElData.metrics)
            return;

        if (args.settings.closestOptionEl && args.settings.closestOptionEl !== closestElData.el)
            this.#clearDroppableOptionStyles(args);

        args.settings.closestOptionEl = closestElData.el;
        const cl = closestElData.el.classList;
        cl.remove(dropAbove);
        cl.remove(dropBelow);
        cl.add(this.#getCssClass(this.#classOption.DROPPABLE));

        if (closestElData.metrics.isAbove)
            cl.add(dropAbove);
        else
            cl.add(dropBelow);
    }

    #droppableField(args)
    {
        let dragItem = args.settings._dragItem,
            isBlock = dragItem.type === 'BuildBlock',
            isSet = dragItem.type === 'FieldSet' || (isBlock && dragItem.blockType == this.form.constructor.BlockTypeOption.FIELD_SET),
            fieldElements = Array.from(args.dropZone.querySelectorAll(isSet ? 'fieldset' : ':scope > .field-pane > .form-field')).filter(el => el !== args.element);

        if (isSet && args.dropZone.nodeName === 'FIELDSET' && args.dropZone !== args.element)
            fieldElements.push(args.dropZone);

        if (!this.#allowDrop(dragItem, args.dropZone))
        {
            this.#clearDroppableFieldStyles(args);
            args.dropZone.classList.add(this.#getCssClass(this.#classOption.DROP_DENIED));
            args.settings.dragGhost.classList.add(this.#getCssClass(this.#classOption.DROP_DENIED));
            args.settings._allowDrop = false;
        }
        else
        {
            args.settings._allowDrop = true;
            const closestElData = this.#getClosestElement(fieldElements, args.settings);

            if (args.settings.closestFieldEl && args.settings.closestFieldEl != closestElData.el)
                this.#clearDroppableFieldStyles(args);

            if (closestElData.el)
            {
                args.settings.closestFieldEl = closestElData.el;
                this.#showDropIndicator(closestElData.el, closestElData.metrics, isSet);
            }
            else
                args.dropZone.classList.add(this.#getDropInside());
        }
    }

    #getClosestElement(elements, settings)
    {
        const draggedEl = settings._dragItem.element,
            closestElData = { el: null, metrics: null, distance: Infinity };

        for (const el of elements)
        {
            if (draggedEl.contains(el)) continue;

            const metrics = this.#calculateDropMetrics(el, settings.dragGhost);

            if (metrics.isInsideX && metrics.isInsideY)
            {
                closestElData.el = el;
                closestElData.metrics = metrics;
                break; // perfect match found, no need to check others
            }

            if (metrics.distance < closestElData.distance)
            {
                closestElData.el = el;
                closestElData.metrics = metrics;
                closestElData.distance = metrics.distance;
            }
        };

        return closestElData;
    }

    #droppableOptionLeave(args)
    {
        this.#clearDroppableOptionStyles(args);
    }

    #droppableFieldLeave(args)
    {
        this.#clearDroppableFieldStyles(args);
    }

    #dropOption(args)
    {
        const draggedEl = args.settings._dragItem.element,
            field = args.settings._dragItem.field,
            option = args.settings._dragItem.option,
            closestOptionEl = args.settings.closestOptionEl,
            cl = closestOptionEl.classList;

        if (!closestOptionEl || draggedEl === closestOptionEl)
            return;

        if (cl.contains(this.#getDropAbove()))
            draggedEl.parentElement.insertBefore(draggedEl, closestOptionEl);
        else
            draggedEl.parentElement.insertBefore(draggedEl, closestOptionEl.nextElementSibling);

        this.#insertOption(option, field, closestOptionEl);
        this.form.updateFieldOptions(field);
        this.#clearDroppableOptionStyles(args);
    }

    #dropField(args)
    {
        if (!args.settings._allowDrop)
        {
            this.#clearDroppableFieldStyles(args);
            return;
        }

        let fieldSetEl = args.dropZone,
            fieldSet = this.form.findFieldSetByElement(this.form.fieldSets, fieldSetEl),
            droppedField = args.settings._dragItem,
            closestFieldEl = args.settings.closestFieldEl,
            field;

        if (droppedField.type === 'BuildBlock') // copy
        {
            field = this.form.createItemFromBuildBlock(droppedField);
        }
        else // move
        {
            field = droppedField;
            this.form.removeField(field); // remove before we re-insert
        }

        const closestField = (closestFieldEl) ? fieldSet.fields.find(f => f.element === closestFieldEl) : null;

        this.#insertFieldInFieldSet(field, fieldSet, closestField);
        field = fieldSet.fields.find(f => f.id === field.id); // make sure we get the inserted field proxy object

        if (closestFieldEl) // Scale if dropping next to the field (left or right)
        {
            const cl = closestFieldEl.classList;
            if (cl.contains(this.#getDropLeft()) || cl.contains(this.#getDropRight()))
            {
                this.form.scaleInlineSiblings(field);
            }
            else if ((!field.width || field.width.endsWith('%')) && (cl.contains(this.#getDropAbove()) || cl.contains(this.#getDropBelow())))
                field.width = '100%';
        }

        field.selected = true;
        this.form.renderField(field);
        this.form.rebindFieldElements(field.parent);
        this.form.events.onDropField.fire(this, { item: field });
        this.#clearDroppableFieldStyles(args);

        if (droppedField.type === 'Field')
            this.form.autoNameCandidates.add(field.id);
    }

    #dropFieldSet(args)
    {
        if (!args.settings._allowDrop)
        {
            this.#clearDroppableFieldStyles(args);
            return;
        }

        let droppedFieldSet = args.settings._dragItem,
            closestFieldEl = args.settings.closestFieldEl,
            fieldSet;

        if (droppedFieldSet.type === 'BuildBlock') // copy
        {
            fieldSet = this.form.createItemFromBuildBlock(droppedFieldSet);
        }
        else // move
        {
            fieldSet = droppedFieldSet;
            this.form.removeFieldSet(fieldSet); // remove before we re-insert
        }

        this.#insertFieldSet(fieldSet, args.dropZone, closestFieldEl);
        fieldSet.selected = true;
        this.form.renderFieldSet(fieldSet);
        this.form.rebindFieldSetLabels(fieldSet.parent);
        this.form.events.onDropField.fire(this, { item: fieldSet });
        this.#clearDroppableFieldStyles(args);
    }

    #allowDrop(dragItem, dropZone)
    {
        const isField = dragItem.type === 'Field',
            isSet = dragItem.type === 'FieldSet',
            isBlock = dragItem.type === 'BuildBlock',
            targetFS = (' FIELDSET SECTION '.indexOf(` ${dropZone.nodeName} `) > -1)
                ? this.form.findFieldSetByElement(this.form.fieldSets, dropZone)
                : null,
            dropZoneIsRoot = !targetFS || targetFS.type === 'SECTION';

        if (isField)
        {
            if (dropZoneIsRoot ||
                (targetFS.fieldSets && targetFS.fieldSets.length > 0) ||
                (targetFS.fields.length === 1 && targetFS.fields[0].id === dragItem.id))
                return false
            else
                return true;
        }

        if (isSet)
        {
            const isRoot = !dragItem.parent || dragItem.parent.type === 'SECTION',
                parentFieldSets = (dragItem.parent) ? dragItem.parent.fieldSets : this.form.fieldSets,
                isOnlyRoot = isRoot && parentFieldSets.length === 1;

            if (isOnlyRoot ||
                dragItem.element.contains(dropZone) ||
                (dropZoneIsRoot && !dragItem.allowAsRoot) ||
                (targetFS && targetFS.fieldSets?.length === 1 && targetFS.fieldSets[0].id === dragItem.id))
                return false;

            return true;
        }

        if (isBlock)
        {
            if ((dropZoneIsRoot && dragItem.blockType !== this.form.constructor.BlockTypeOption.FIELD_SET) ||
                (dropZoneIsRoot && dragItem.fieldSet && !dragItem.fieldSet.allowAsRoot))
                return false;

            if (dragItem.blockType === this.form.constructor.BlockTypeOption.FIELD &&
                targetFS && targetFS.fieldSets && targetFS.fieldSets.length > 0)
            {
                return false;
            }
        }

        return true;
    }

    /**
     * Calculates drop-related metrics for an element.
     * @param {HTMLElement} targetEl - The element being evaluated as a drop target.
     * @param {HTMLElement} dragGhost - The visual representation of the dragged element.
     * @returns {Object} - An object containing positioning and distance metrics.
     * @private
     */
    #calculateDropMetrics(targetEl, dragGhost)
    {
        const rect = targetEl.getBoundingClientRect(),
            margin = $lib.margin(targetEl),
            top = rect.top + margin.top,
            left = rect.left + margin.left,
            bottom = rect.bottom,
            right = rect.right,
            fieldWidth = (rect.right - rect.left) / 2,
            fieldHeight = (rect.bottom - rect.top) / 2,
            fieldCenterX = rect.left + fieldWidth,
            fieldCenterY = rect.top + fieldHeight,
            dragGhostRect = dragGhost.getBoundingClientRect(),
            dragCenterX = dragGhostRect.left + (dragGhostRect.width / 2),
            dragCenterY = dragGhostRect.top + (dragGhostRect.height / 2),
            isInsideX = dragCenterX > left && dragCenterX < right,
            isInsideY = dragCenterY > top && dragCenterY < bottom,
            isAbove = dragCenterY < fieldCenterY,
            isBelow = dragCenterY > fieldCenterY,
            isLeft = isInsideY && dragCenterX < fieldCenterX,
            isRight = isInsideY && dragCenterX > fieldCenterX,
            nearestX = Math.max(left, Math.min(dragCenterX, right)), // Clamp ghost's X to be within element's horizontal bounds.
            nearestY = Math.max(top, Math.min(dragCenterY, bottom)), // Clamp ghost's Y to be within element's vertical bounds.
            // Calculate the Euclidean distance (Pythagoras' theorem, diagonal line) from the ghost center to the nearest point on the element's rectangle. Will be 0 if the ghost is inside the element's bounds.
            // Equivalent to Math.sqrt((nearestX - dragCenterX) ** 2 + (nearestY - dragCenterY) ** 2). 
            distance = Math.hypot(nearestX - dragCenterX, nearestY - dragCenterY),
            centerProximityX = Math.abs(dragCenterX - fieldCenterX) / fieldWidth,
            centerProximityY = Math.abs(dragCenterY - fieldCenterY) / fieldHeight,
            isInsideCenter = centerProximityX < 0.3 && centerProximityY < 0.3;

        return { top, left, bottom, right, fieldCenterX, fieldCenterY, fieldWidth, fieldHeight, dragCenterX, dragCenterY, isInsideX, isInsideY, isAbove, isBelow, isLeft, isRight, isInsideCenter, distance };
    }

    #showDropIndicator(element, metrics, isFieldSet)
    {
        const dropClasses =
            [
                this.#getDropLeft(),
                this.#getDropRight(),
                this.#getDropBelow(),
                this.#getDropAbove(),
                this.#getDropInside()
            ],
            cl = element.classList;

        cl.add(this.#getCssClass(this.#classOption.DROPPABLE));

        let activeClass = "";

        if (metrics.isInsideCenter && isFieldSet)
            activeClass = this.#getDropInside();
        else if (metrics.isLeft)
            activeClass = this.#getDropLeft();
        else if (metrics.isRight)
            activeClass = this.#getDropRight();
        else if (metrics.isBelow)
            activeClass = this.#getDropBelow();
        else
            activeClass = this.#getDropAbove();

        dropClasses.forEach((cls) =>
        {
            if (cls !== activeClass)
                cl.remove(cls);
        });

        cl.add(activeClass);
    }

    #clearDroppableOptionStyles(args)
    {
        if (!args.settings.closestOptionEl)
            return;

        const closestOptionEl = args.settings.closestOptionEl,
            cl = closestOptionEl.classList;

        cl.remove(this.#getCssClass(this.#classOption.DROPPABLE));
        cl.remove(this.#getDropBelow());
        cl.remove(this.#getDropAbove());
        args.settings.closestOptionEl = null;
    }

    #clearDroppableFieldStyles(args)
    {
        const closestFieldEl = args.settings.closestFieldEl;

        args.dropZone.classList.remove(this.#getDropInside());
        args.dropZone.classList.remove(this.#getCssClass(this.#classOption.DROP_DENIED));
        args.settings.dragGhost.classList.remove(this.#getCssClass(this.#classOption.DROP_DENIED));

        if (!closestFieldEl)
            return;

        const cl = closestFieldEl.classList;
        cl.remove(this.#getCssClass(this.#classOption.DROPPABLE));
        cl.remove(this.#getDropBelow());
        cl.remove(this.#getDropAbove());
        cl.remove(this.#getDropRight());
        cl.remove(this.#getDropLeft());
        cl.remove(this.#getDropInside());
        args.settings.closestFieldEl = null;
    }

    #insertOption(option, field, closestOptionEl)
    {
        const options = field.options,
            cl = closestOptionEl.classList,
            targetId = closestOptionEl._option.id,
            currentIndex = options.findIndex(opt => String(opt.id) === String(option.id));

        if (currentIndex > -1)
            options.splice(currentIndex, 1);

        const targetIndex = options.findIndex(opt => String(opt.id) === targetId),
            insertIndex = cl.contains(this.#getDropAbove()) ? targetIndex : targetIndex + 1;

        options.splice(insertIndex, 0, option);
    }

    #insertFieldInFieldSet(field, fieldSet, closestField)
    {
        const hadLineBreak = field.lineBreak,
            cl = closestField?.element.classList;

        let lineBreak = false,
            insertIndex = fieldSet.fields.length;

        if (closestField)
        {
            const closestFieldIndex = fieldSet.fields.findIndex(f => f.id === closestField.id);

            if (cl.contains(this.#getDropAbove()))
            {
                let firstInRow = closestFieldIndex;
                while (firstInRow > 0 && !fieldSet.fields[firstInRow].lineBreak)
                {
                    firstInRow--;
                }

                insertIndex = firstInRow;
                lineBreak = true;
                this.form.addLineBreak(fieldSet.fields[firstInRow]);
            }
            else if (cl.contains(this.#getDropBelow()))
            {
                let lastInRow = closestFieldIndex + 1;
                while (lastInRow < fieldSet.fields.length && !fieldSet.fields[lastInRow].lineBreak)
                {
                    lastInRow++;
                }

                insertIndex = lastInRow;
                lineBreak = true;
            }
            else if (cl.contains(this.#getDropLeft()))
            {
                insertIndex = closestFieldIndex;
                if (closestField.lineBreak)
                {
                    this.form.removeLineBreak(closestField);
                    lineBreak = true;
                }
            }
            else if (cl.contains(this.#getDropRight()))
            {
                insertIndex = closestFieldIndex + 1;
            }
        }

        insertIndex = Math.min(insertIndex, fieldSet.fields.length);
        fieldSet.fields.splice(insertIndex, 0, field);

        this.form.getField(field.id, fieldSet).lineBreak = lineBreak; // set property on the proxy
        this.form.setParentReferences(fieldSet.fields || this.form.fieldSets, fieldSet);
    }

    #insertFieldSet(fieldSet, dropZoneEl, closestFieldEl)
    {
        let container, wrapperFieldSet,
            containerFieldSet,
            cl = closestFieldEl?.classList,
            lineBreak = false;

        const isDropAroundFieldSet = cl && (
            cl.contains(this.#getDropAbove()) ||
            cl.contains(this.#getDropBelow()) ||
            cl.contains(this.#getDropLeft()) ||
            cl.contains(this.#getDropRight())
        );

        if (dropZoneEl.classList.contains(this.#getCssClass(this.#classOption.FORM_PANE)))
        {
            container = this.form.fieldSets;
        }
        else if (dropZoneEl.tagName === 'SECTION')
        {
            // dropZoneEl is a section, find the matching fieldSet in form.fieldSets
            containerFieldSet = this.form.fieldSets.find(fs => fs.element === dropZoneEl);
            container = containerFieldSet ? (containerFieldSet.fieldSets || (containerFieldSet.fieldSets = [])) : this.form.fieldSets;
        }
        else if (closestFieldEl)
        {
            // dropping around a fieldset, use its parent as container
            const targetEl = isDropAroundFieldSet
                ? closestFieldEl.parentElement.closest('fieldset') || null
                : dropZoneEl;

            if (targetEl)
            {
                containerFieldSet = this.form.findFieldSetByElement(this.form.fieldSets, targetEl);
                container = containerFieldSet.fieldSets || (containerFieldSet.fieldSets = []);
            }
            else
                container = this.form.fieldSets;
        }

        let insertIndex = container.length,
            closestFieldSet = closestFieldEl ? container.find(fs => fs.element === closestFieldEl) : null;

        if (closestFieldSet)
        {
            const closestIndex = container.findIndex(fs => fs.id === closestFieldSet.id);

            if (cl.contains(this.#getDropAbove()))
            {
                let firstInRow = closestIndex;
                while (firstInRow > 0 && !container[firstInRow].lineBreak)
                {
                    firstInRow--;
                }
                insertIndex = firstInRow;
                lineBreak = true;
                this.form.addLineBreak(container[firstInRow]);
            }
            else if (cl.contains(this.#getDropBelow()))
            {
                let lastInRow = closestIndex + 1;
                while (lastInRow < container.length && !container[lastInRow].lineBreak)
                {
                    lastInRow++;
                }
                insertIndex = lastInRow;
                lineBreak = true;
            }
            else if (cl.contains(this.#getDropLeft()))
            {
                insertIndex = closestIndex;
                if (closestFieldSet.lineBreak)
                {
                    this.form.removeLineBreak(closestFieldSet);
                    lineBreak = true;
                }
            }
            else if (cl.contains(this.#getDropRight()))
            {
                insertIndex = closestIndex + 1;
            }
        }
        else if (dropZoneEl.classList.contains(this.#getDropInside()))
        {
            // When dropping inside another FieldSet, ensure that the target FieldSet does not have fields. If it does, wrap those fields into a new FieldSet.
            containerFieldSet = this.form.findFieldSetByElement(this.form.fieldSets, dropZoneEl);
            if (containerFieldSet)
            {
                if (containerFieldSet.fields && containerFieldSet.fields.length > 0)
                {
                    wrapperFieldSet = this.form.ensureItemId(new this.form.constructor.FieldSet({ layout: this.form.constructor.FieldSetLayoutOption.NONE }));
                    wrapperFieldSet.fields = containerFieldSet.fields;
                    containerFieldSet.fields = [];
                    containerFieldSet.fieldSets = containerFieldSet.fieldSets || [];
                    containerFieldSet.fieldSets.push(wrapperFieldSet);
                }
                container = containerFieldSet.fieldSets || (containerFieldSet.fieldSets = []);
                insertIndex = container.length;
            }
        }

        container.splice(insertIndex, 0, fieldSet);
        this.form.getFieldSet(fieldSet.id, container).lineBreak = lineBreak; // set property on the proxy

        this.form.setParentReferences(this.form.fieldSets);

        if (wrapperFieldSet)
        {
            wrapperFieldSet.fields.forEach(f => this.form.destroyField(f));
            this.form.renderFieldSet(wrapperFieldSet);
        }
    }

    #getDropAbove()
    {
        return this.#getCssClass(this.#classOption.DROP_ABOVE);
    }

    #getDropBelow()
    {
        return this.#getCssClass(this.#classOption.DROP_BELOW);
    }

    #getDropLeft()
    {
        return this.#getCssClass(this.#classOption.DROP_LEFT);
    }

    #getDropRight()
    {
        return this.#getCssClass(this.#classOption.DROP_RIGHT);
    }

    #getDropInside()
    {
        return this.#getCssClass(this.#classOption.DROP_INSIDE);
    }

    #getCssClass(cssClassValue)
    {
        return this.form.getCssClass(cssClassValue);
    }
}

export default componyx.UI.form_modules.Draggable;