/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.UI.form_modules = componyx.UI.form_modules || {};
componyx.UI.form_modules.DataObserver = class DataObserver
{
    #processChangesTimerId;
    #dataRestoreTimerId;
    #isReplaying = false;
    #isProcessing = false;
    #ignoreProps = new Set(['ruleCases', 'name', 'selected', 'element', 'viewElement', 'editElement', 'lineBreakElement', 'parent']);
    #minorProps = {
        Section: new Set(['label']),
        FieldSet: new Set(['label', 'repeatLabel', 'layout', 'tooltip', 'repeatable', 'maxRepeats', 'lineBreak', 'visible', 'disabled']),
        Field: new Set(['label', 'labelDisplay', 'placeholder', 'value', 'width', 'tooltip', 'required', 'lineBreak', 'visible', 'readOnly', 'disabled', 'margin', 'padding', 'borderWidth', 'borderRadius', 'borderColor', 'backgroundColor', 'showDivider', 'height'])
    };
    #minorPropsPerInputType = {};
    #omitPropsPerInputType = {};
    #activeElementId = null;
    #cursorPosition = null;
    #changeProcessedResolver = null;
    #changeProcessedPromise = null;
    #changeLevelOption = {
        NONE: 0,
        MINOR: 1,
        MAJOR: 2
    };

    constructor(form)
    {
        this.form = form;
        this.eventName = `componyx.UI.Form.FieldSets.${this.form.id}`;
        this.history = [];
        this.historyIndex = -1;
        this.isTrackingHistory = true;
        this.shouldProcessChanges = false;
        this.pendingChanges = [];
        this.maxHistoryLength = form.maxHistoryLength;
        this.expandedPanelIds = [];
        this.activeElement = null;

        this.#minorPropsPerInputType = {
            [this.form.constructor.InputTypeOption.DATEPICKER]: new Set(['today']),
            [this.form.constructor.InputTypeOption.MASKEDTEXTBOX]: new Set(['mask']),
        };
    }

    destroy()
    {
        this.history = [];
        this.historyIndex = -1;
        this.pendingChanges = [];
        this.expandedPanelIds = [];
        this.form.removeEventListener(this.eventName, this.#onChange);
    }

    observe()
    {
        this.destroy();

        if (!this.form.isBuildMode())
            this.form.values = $bindary.observe(this.form.values, `$UI.store.${this.form.id}.values`, { element: this.form });

        if (this.form.isBuildMode())
        {
            this.form.addEventListener(this.eventName, this.#onChange);
            this.form.fieldSets = $bindary.observe(this.form.fieldSets, `$UI.store.${this.form.id}.fieldSets`, {
                createEvent: () => new CustomEvent(this.eventName, { detail: {}, cancelable: true }),
                element: this.form
            });
        }
    }

    restoreActiveState()
    {
        this.#restoreActiveState();
    }

    canUndo()
    {
        return this.historyIndex > 0;
    }

    canRedo()
    {
        return this.historyIndex < this.history.length - 1;
    }

    undo()
    {
        if (!this.canUndo()) return;

        const batch = this.history[this.historyIndex];
        this.#isReplaying = true;

        this.#changeProcessedPromise = new Promise(resolve =>
        {
            this.#changeProcessedResolver = resolve;
        });

        this.#restoreData(batch, true);

        this.historyIndex--;
        this.#waitForChangesProcessed().then(() =>
        {
            this.#isReplaying = false;
            this.form.updateCommandStates();
        });
    }

    redo()
    {
        if (!this.canRedo()) return;

        this.historyIndex++;
        const batch = this.history[this.historyIndex];
        this.#isReplaying = true;

        this.#changeProcessedPromise = new Promise(resolve =>
        {
            this.#changeProcessedResolver = resolve;
        });

        this.#restoreData(batch, false);

        this.#waitForChangesProcessed().then(() =>
        {
            this.#isReplaying = false;
            this.form.updateCommandStates();
        });
    }

    withoutTracking(callback, processChanges)
    {
        const isTrackingHistory = this.isTrackingHistory;
        this.isTrackingHistory = false;
        try
        {
            callback();
        }
        finally
        {
            if (processChanges)
                this.processPendingChanges(this.isTrackingHistory);

            this.isTrackingHistory = isTrackingHistory;
        }
    }

    async #waitForChangesProcessed()
    {
        if (this.#changeProcessedPromise)
            return this.#changeProcessedPromise;

        return Promise.resolve(); // No replay in progress, resolve immediately
    }

    processPendingChanges()
    {
        this.#processPendingChanges(this.isTrackingHistory);
    }

    #onChange = (evt) =>
    {
        if (this.#isProcessing)
            return;

        evt.preventDefault?.(); // Prevent framework handling data change

        const change = evt.detail,
            dataKey = change?.dataKey,
            keyParts = dataKey?.split('.'),
            isTrackingHistory = this.isTrackingHistory,
            templateItem = $bindary.getTemplateItem(this.form);

        if (this.#shouldIgnoreChange(keyParts) || !templateItem)
        {
            this.form.scheduleSave(); // we still need to save this change (e.g. conditional rule updates)
            return; // Skip processing
        }

        this.pendingChanges.push(evt.detail);
        clearTimeout(this.#dataRestoreTimerId);
        clearTimeout(this.#processChangesTimerId);
        this.#processChangesTimerId = setTimeout(() => this.#processPendingChanges(isTrackingHistory), 0);
    }

    #shouldIgnoreChange(keyParts)
    {
        for (const ignored of this.#ignoreProps)
            if (keyParts.includes(ignored))
                return true;

        return false;
    }

    #processPendingChanges(isTrackingHistory)
    {
        const changes = this.pendingChanges.slice();
        this.pendingChanges.length = 0;

        if (changes.length === 0) return;

        if (!this.#isReplaying && isTrackingHistory)
        {
            this.history = this.history.slice(0, this.historyIndex + 1);

            if (this.historyIndex < 0)
            {
                this.history.push([]);
                this.history.push(changes);
                this.historyIndex = 1;
            }
            else
            {
                this.history.push(changes);

                if (this.maxHistoryLength && this.history.length > this.maxHistoryLength)
                    this.history.shift();

                this.historyIndex = this.history.length - 1;
            }
        }

        if (!this.#isProcessing && (this.shouldProcessChanges || this.#isReplaying))
        {
            this.#isProcessing = true;
            this.form.ensureValidFieldSet();
            this.form.setParentReferences(this.form.fieldSets);
            this.#processChanges(changes);
            this.#isProcessing = false;
            this.form.scheduleSave();
        }

        this.#invokeResolver();
        this.shouldProcessChanges = false;
    }

    #restoreData(changes, undo)
    {
        const changesToProcess = undo ? [...changes].reverse() : changes;

        changesToProcess.forEach(({ dataKey, data, targetProxy, value, oldValue }) =>
        {
            const keys = dataKey.split('.'),
                key = keys[keys.length - 1];

            if (Array.isArray(targetProxy))
            {
                if (data.removeIndex !== undefined)
                {
                    if (undo)
                    {
                        targetProxy.splice(data.removeIndex, 0, oldValue);
                    }
                    else
                    {
                        targetProxy.splice(data.removeIndex, data.removeCount ?? 1);
                    }

                }
                else if (undo)
                {
                    if (data?.hadValue)
                        targetProxy[key] = oldValue;
                    else
                        targetProxy.splice(Number(key), 1);
                }
                else // Redo
                {
                    if (data && data.removeCount)
                        targetProxy.splice(Number(key), 1);
                    else
                        targetProxy[key] = value;
                }

            }
            else // Object property add/remove
            {
                if (undo)
                {
                    if (data?.hadValue)
                        targetProxy[key] = oldValue;
                    else
                        delete targetProxy[key];
                }
                else // Redo
                {
                    if (data && data.removeCount)
                        delete targetProxy[key];
                    else
                        targetProxy[key] = value;
                }
            }
        });

        clearTimeout(this.#dataRestoreTimerId);
        this.#dataRestoreTimerId = setTimeout(() => this.#invokeResolver(), 0); // If this timer is not cleared in the onChange event, then there was no change while restoring data, make sure we call the resolver
    }

    #invokeResolver()
    {
        if (this.#changeProcessedResolver)
        {
            this.#changeProcessedResolver();
            this.#changeProcessedResolver = null;
        }
        else
            this.form.updateCommandStates();
    }

    #processChanges(changes)
    {
        const processedFieldIds = new Set(),
            deletedIds = new Set(),
            renderedIds = new Set();

        const selectedFieldId = this.form.selectedFieldId,
            selectedFieldSetId = this.form.selectedFieldSetId;

        this.#captureActiveState();
        this.#processSectionChanges(changes, deletedIds, renderedIds);
        this.#processFieldSetChanges(changes, deletedIds, renderedIds);
        this.#processFieldChanges(changes, deletedIds, renderedIds, processedFieldIds);
        this.#processFieldOptionChanges(changes, processedFieldIds);

        if (this.#isReplaying) // undo/redo, re-render config panel when selected field/fieldset is unchanged because setting value(s) could have changed
        {
            if (selectedFieldId &&  this.form.selectedFieldId === selectedFieldId)
            {
                this.form.deselectField(selectedFieldId);
                this.form.deselectFieldSet(selectedFieldSetId);

                let field = this.form.getField(selectedFieldId);

                if (field)
                    this.form.selectField(field);
            }
            else if (selectedFieldSetId && this.form.selectedFieldSetId === selectedFieldSetId)
            {
                this.form.deselectFieldSet(selectedFieldSetId);
                let fieldSet = this.form.getField(selectedFieldSetId);

                if (fieldSet)
                    this.form.selectFieldSet(fieldSet);
            }
        }
        else
            this.#restoreActiveState();
    }

    #captureActiveState()
    {
        const doc = this.form.ownerDocument || document,
            el = this.activeElement || doc.activeElement,
            panelBar = this.form.configPanelManager.panelBar;

        this.expandedPanelIds = panelBar.panels.filter(p => p.expanded).map(p => p.id);

        if (el && el.id)
        {
            this.#activeElementId = el.id;

            if (['INPUT', 'TEXTAREA'].includes(el.tagName) && typeof el.selectionStart === 'number')
                this.#cursorPosition = { start: el.selectionStart, end: el.selectionEnd };
            else
                this.#cursorPosition = null;
        }
        else
        {
            this.#activeElementId = this.#cursorPosition = null;
        }
    }

    #restoreActiveState()
    {
        const panelBar = this.form.configPanelManager.panelBar;

        if (Array.isArray(this.expandedPanelIds))
        {
            for (const panelId of this.expandedPanelIds)
            {
                const panel = panelBar.getPanelById(panelId);
                if (panel && !panel.disabled)
                    panelBar.expandPanel(panelId, true);
            }
        }

        if (!this.#activeElementId) return;

        const el = $lib('#' + this.#activeElementId);

        if (!el) return;

        el.focus({ preventScroll: true });
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });

        if (this.#cursorPosition)
            el.setSelectionRange(this.#cursorPosition.start, this.#cursorPosition.end);

        this.expandedPanelIds = this.#activeElementId = this.#cursorPosition = null;
    }

    #processSectionChanges(changes, deletedIds, renderedIds)
    {
        this.#processTargetChanges('Section', changes, deletedIds, renderedIds, null, {
            destroy: target => this.form.destroySection(target),
            render: target => this.form.renderSection(target),
            update: target => this.form.updateSection(target)
        });
    }

    #processFieldSetChanges(changes, deletedIds, renderedIds)
    {
        this.#processTargetChanges('FieldSet', changes, deletedIds, renderedIds, null, {
            destroy: target => this.form.destroyFieldSet(target),
            render: target => this.form.renderFieldSet(target),
            update: target => this.form.updateFieldSet(target)
        });
    }

    #processFieldChanges(changes, deletedIds, renderedIds, processedFieldIds)
    {
        this.#processTargetChanges('Field', changes, deletedIds, renderedIds, processedFieldIds, {
            destroy: target => this.form.destroyField(target),
            render: target => this.form.renderField(target),
            update: target => this.form.updateField(target)
        });
    }

    #processTargetChanges(type, changes, deletedIds, renderedIds, processedFieldIds, callbacks)
    {
        const byTarget = this.#groupChangesById(type, changes);

        for (const { target, wasRemoved, wasAdded, changes: groupedChanges } of byTarget.values())
        {
            const id = target.id;

            // Skip entirely if an ancestor was removed and not re‑added
            if (this.#hasAncestorId(target, deletedIds) && !this.#hasAncestorId(target, renderedIds))
                continue;

            // Removed and never re-added
            if (wasRemoved)
            {
                callbacks.destroy(target);
                deletedIds.add(id);
                renderedIds.delete(id);

                if (processedFieldIds)
                    processedFieldIds.add(id);

                continue;
            }

            let removed = false,
                rendered = false,
                updated = false;

            for (const change of groupedChanges)
            {
                const ancestorRendered = this.#hasAncestorId(target, renderedIds);

                if (change.data?.removeIndex !== undefined && !this.#isInModel(type, target)) // In case of a remove, check if target is still in live model, if so it was a reorder, skip destroy
                {
                    callbacks.destroy(target);
                    deletedIds.add(id);
                    renderedIds.delete(id);
                    removed = true;
                    rendered = false;

                    if (processedFieldIds)
                        processedFieldIds.add(id);
                }
                // Any other change (addition or property)
                else
                {
                    if (removed)
                    {
                        callbacks.render(target);
                        rendered = true;
                        removed = false;
                    }
                    else if (!ancestorRendered && !rendered) // When ancestor rendered this branch, skip render calls
                    {
                        if (wasAdded)
                        {
                            callbacks.render(target);
                            rendered = true;
                        }
                        else 
                        {
                            const changeLevel = this.#getChangeLevel(type, change, target);

                            if (changeLevel === this.#changeLevelOption.MINOR && !updated)
                            {
                                callbacks.update(target);
                                updated = true;
                            }
                            else if (changeLevel === this.#changeLevelOption.MAJOR)
                            {
                                callbacks.render(target);
                                rendered = true;
                            }
                        }

                        if (processedFieldIds)
                            processedFieldIds.add(id);
                    }
                }
            }

            if (rendered)
                renderedIds.add(id);
        }
    }

    #processFieldOptionChanges(changes, processedFieldIds)
    {
        const parentFieldMap = new Map();

        for (const { target, targetProxy, value, oldValue, data } of changes)
        {
            let actualTarget = null;

            if (Array.isArray(targetProxy))
            {
                if (data?.removeIndex !== undefined && oldValue?.type === 'FieldOption')
                {
                    actualTarget = oldValue;
                }
                else if (value?.type === 'FieldOption')
                {
                    actualTarget = value;
                }
            }
            else if (target?.type === 'FieldOption')
            {
                actualTarget = target;
            }

            if (!actualTarget)
                continue;

            let parentField = actualTarget.parent;

            if (!parentField && Array.isArray(targetProxy))
            {
                parentField = this.form.getFields().find(f => f.options === targetProxy);
            }

            if (parentField && !processedFieldIds.has(parentField.id))
            {
                parentFieldMap.set(parentField.id, parentField);
            }
        }

        for (const field of parentFieldMap.values())
        {
            this.form.updateFieldOptions(field);
            processedFieldIds.add(field.id);
            this.form.configPanelManager.renderOptionsPanel(field);
        }
    }

    #groupChangesById(type, changes)
    {
        const map = new Map(),
            matchesType = (candidateType, expectedType) => expectedType === 'Field' ? this.form.isField(candidateType) : candidateType === expectedType;

        for (const change of changes)
        {
            const { target, targetProxy, value, oldValue, data } = change;
            let actualTarget = null;

            if (Array.isArray(targetProxy)) // Array mutations
            {
                if (data?.removeIndex !== undefined && matchesType(oldValue?.type, type)) // Removal from array
                {
                    actualTarget = oldValue;
                }
                else if (matchesType(value?.type, type)) // New value added to array
                {
                    actualTarget = value;

                    // Check if the oldValue got overwritten and is no longer in the model
                    if (oldValue && !this.#isInModel(type, oldValue))
                    {
                        map.set(oldValue.id, {
                            target: oldValue,
                            wasRemoved: true,
                            wasAdded: false,
                            changes: [change]
                        });
                    }

                }
            }
            else if (matchesType(target?.type, type)) // Property mutations
            {
                actualTarget = target;
            }
            else if (type === 'Field' && matchesType(target?.parent?.type, type)) // Property mutations on componentSettings
            {
                actualTarget = target.parent;
            }

            if (!actualTarget)
                continue;

            const id = actualTarget.id;

            if (!map.has(id))
            {
                map.set(id, {
                    target: actualTarget,
                    wasRemoved: !this.#isInModel(type, actualTarget),
                    wasAdded: false,
                    changes: []
                });
            }

            const entry = map.get(id),
                isArrayTarget = Array.isArray(target);

            entry.changes.push(change);

            if (!entry.wasRemoved && isArrayTarget && value !== undefined && oldValue === undefined) // Addition to array
                entry.wasAdded = true;
        }

        return map;
    }

    #isInModel(type, target)
    {
        if (this.form.isField(type))
        {
            if (!target.parent) return false;
            return target.parent.fields?.some(f => f.id === target.id);
        }
        else if (type === 'FieldSet')
        {
            const sets = target.parent ? target.parent.fieldSets : this.form.fieldSets;
            return sets?.some(fs => fs.id === target.id);
        }
        else if (type === 'Section')
        {
            return this.form.fieldSets?.some(s => s.id === target.id);
        }

        return false;
    }

    #hasAncestorId(target, idSet)
    {
        let current = target.parent;
        while (current)
        {
            if (idSet.has(current.id)) return true;
            current = current.parent;
        }
        return false;
    }

    #getChangeLevel(type, change, target)
    {
        if (this.form.displayMode !== this.form.constructor.DisplayModeOption.BUILD)
            return this.#changeLevelOption.MAJOR;

        const keyParts = change.dataKey.split('.'),
            length = keyParts.length,
            key = keyParts.pop(),
            props = this.#minorProps[type],
            inputType = (type == 'Field') ? target.inputType : null,
            customConfig = (type == 'Field') ? this.form.constructor.getCustomType(target.customType) : null;

        if (customConfig) // Check for custom field first
        {
            if (customConfig.omitProps && customConfig.omitProps.has(key))
            {
                return this.#changeLevelOption.NONE;
            }

            if (customConfig.minorProps && customConfig.minorProps.has(key))
            {
                return this.#changeLevelOption.MINOR;
            }
        }

        if (keyParts[length - 2] == 'validationSettings')
        {
            return this.#changeLevelOption.MINOR;
        }

        if (keyParts[length - 2] == 'componentSettings') // component settings work the other way around, no action by default
        {
            if (this.#omitPropsPerInputType[inputType]?.has(key))
                return this.#changeLevelOption.NONE;
            else if (this.#minorPropsPerInputType[inputType]?.has(key) || props?.has(key))
                return this.#changeLevelOption.MINOR;
            else
                return this.#changeLevelOption.MAJOR;
        }

        if (!props)
            return this.#changeLevelOption.MAJOR;

        if (props.has(key) || (type === 'Field' && this.#minorPropsPerInputType[inputType]?.has(key)))
            return this.#changeLevelOption.MINOR;

        return this.#changeLevelOption.MAJOR;
    }

}

export default componyx.UI.form_modules.DataObserver;



