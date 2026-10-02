/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

await (async function ()
{
    await import(`${$UI.getScriptResourcePath('Base.Bindary.Core')}`);
    const core = componyx.bindary_modules.core;

    /**
    * Represents a renderer that is responsible for rendering and managing DOM elements for items.
     * 
     * @class
     * @property {componyx.bindary.TemplateItem} item - The item being rendered.
     * @property {boolean} update - A value indicating if its an update or render.
     * @property {boolean} inRepeat - A value indicating if the item is part of a repeat section.
     * @property {Function} next - The function to fetch the next item in the render cycle.
     * @property {HTMLElement} element - The DOM element for the item.
     * @property {Object|null} treeState - The tree state for the item.
     * @property {Object} context - The context for the item renderer.
     * @property {string|null} key - The key associated with the item.
     * @property {Object|null} dataChange - Data change information for the item.
    */
    componyx.bindary_modules.Renderer = class
    {
        /**
          * Creates an instance of Renderer.
          * 
          * @param {Object} item - The item to be rendered.
          * @param {HTMLElement} element - The DOM element associated with the item.
          * @param {Function} update - The function responsible for updating the item renderer.
          * @param {Function} next - The function to fetch the next item in the rendering process.
          */
        constructor(item, element, update, next)
        {
            this.item = item;
            this.update = update;
            this.inRepeat = item.inRepeat;
            this.next = next;
            this.element = element;
            this.treeState = null;
            this.context = null;
            this.key = null;
            this.dataChange = null;
        }


        render(context, key)
        {
            let me = this, item = me.item;

            me.treeState = null;

            if (item.repeatDataKey)
            {

                me.context = context || me.context;
                me.key = (!$lib.isEmpty(key)) ? key : me.key;
                me.renderRepeatItem(me.context, me.key);

            }
            else
            {
                me.renderItem();
            }
        }

        renderRepeatItem(context, key)
        {
            let me = this, item = me.item;

            if ($lib.isArray(item.repeatValue))
            {
                item.index = parseInt(key);
            }

            item.key = key;
            item.defineContext(context);
            item.setContextValue();
            item.element = item.repeatElements[key] || item.repeatPlaceHolder;

            if (item.repeatItemIdDataKey)
                item.repeatItemIdValue = item.getDataValue(item.repeatItemIdDataKey, item.context);

            me.renderElement(me.createRepeatElement);
        }

        renderItem()
        {
            let me = this, item = me.item;

            item.setContextValue();
            item.element = me.element;
            me.renderElement(me.createElement);
        }

        renderElement(create)
        {

            let me = this, item = me.item, element = item.element;

            if (me.mustRender(item, element))
            {

                create.bind(this)();

                if (item.include)
                    me.includeItem();
                else if (item.includeFile)
                    me.includeFile();
                else if (item.component)
                    me.load();
                else
                    me.postRender();
            } else
            {
                me.next(); // fetch next
            }
        }


        mustRender()
        {
            let me = this, item = me.item, element = item.element;

            if (!item.isActiveRepeatItem(item) || (item.hasValue != null && me.isEmpty(item)) || (core.call(item.preRender, [item, me.render]) === false))
            {
                // element should not be visible and children should not be part of the DOM tree
                core.setItemPlaceHolder(item, element);
                return false;
            }

            return true;
        }

        isEmpty(item)
        {
            let value = (item.hasValue[0].length == 0) ? (item.dataKey) ? item.value : item.context : item.getDataValue(item.hasValue, item.context);
            return $lib.isEmpty(value);
        }

        includeItem()
        {
            let me = this, item = me.item, include;

            if (item.component && core.components[item.component])
                item.context = core.components[item.component](item); // context is defined before include, therefore a possible includable data-key can be defined in the component's context

            include = item.getIncludeItem();

            if (!item.children.length && (!include && core.hasLoadingIncludes()))
            { // include item not found and busy including files, add to global waiters list

                me.waiting = true;
                core.waiters.push(me);
                return;
            }

            me.waiting = false;
            me.load(include);
        }

        includeFile()
        {
            let me = this, item = me.item,
                includeURL = $bindary.includeRootURL + (($lib.startsWith(item.includeFile, '/')) ? item.includeFile.substr(1) : item.getDataValue(item.includeFile, item.context)),
                include = core.cache.include[includeURL];

            if (include)
            {
                if (include.loading)
                {

                    include.waiters.push(me);
                    return;
                }

                me.load(include);

            }
            else
            {
                me.createFileInclude(includeURL);

                core.xhr.push($lib.load({
                    url: includeURL,
                    onSuccess: function (args)
                    {
                        let include = core.cache.include[args.settings.url];
                        include.dataLoaded(args);
                    }
                }, item.element));
            }
        }

        createFileInclude(includeURL)
        {
            let me = this,
                include = {};

            core.cache.include[includeURL] = include;

            include.loading = true;
            include.waiters = [];
            include.waiters.push(me);
            include.dataLoaded = function (args)
            {
                let include = core.cache.include[args.settings.url];
                include.loading = false;
                include.html = args.html;
                include.css = args.css;
                include.script = args.script;

                core.renderPass++; // resuming after an async gap: nothing cached from before this point can be trusted

                $lib.each(include.waiters, function (itemRenderer)
                { // file includes

                    itemRenderer.item.restoreContext(itemRenderer.treeState);
                    itemRenderer.load.bind(itemRenderer)(include);
                });

                $lib.each(core.waiters, function (itemRenderer)
                { // item includes

                    itemRenderer.item.restoreContext(itemRenderer.treeState);
                    itemRenderer.includeItem.bind(itemRenderer)();
                });

                delete include.waiters;
                core.clearWaiters();

                if (core.postRenderFlag) // post-render was called while loading data
                    core.postRender();
            }
        }

        load(include)
        {
            let me = this, item = me.item, element = item.element;

            if (include)
            {
                if (!element.childNodes.length)
                {
                    item.loaded = false;

                    if (include.html)
                    { // file-include

                        let html = (item.children.length) ? include.cachedHtml : include.html; // the item has already been added to the view-tree before, so it's not unique and inside a repeater. Since we dont build the view-tree again, we must use the same html with set bindary identifiers.
                        $lib.addHTML(html, item.element);
                    }
                    else
                    { // item-include
                        element.appendChild(include.sourceElement.cloneNode(true));
                    }
                }

                if (!item.children.length)
                {
                    if (include.html)
                    { // file-include

                        $bindary.createViewTree(element, item); // append view tree
                        $lib.each(item.children, (i) => { i.included = true; });
                        include.cachedHtml = element.innerHTML;

                    }
                    else
                    { // item-include

                        let clone = include.clone(item);
                        clone.included = true;
                        item.children.push(clone);
                    }
                }
            }
            else
            {
                item.loaded = false;
            }

            if (item.loaded)
                me.postRender();
            else
            {
                item.loaded = true;

                if (item.component)
                {
                    if (!include || include.html) // context already set for item-include
                        item.context = core.components[item.component](item);

                    if (item.context?.load)
                        item.context.load(item); // invoke load method on component if exists
                }

                core.call(item.load, [item]); // invoke custom load method if exists

                if (item.observeDataKeyPath)
                {

                    let keyPath = (item.contextDataKeyPath) ? item.livePath[item.contextDataKeyPath] + core.dksc + item.observeDataKeyPath : item.observeDataKeyPath; // configure root key-path for component using current full context path
                    item.context[item.observeDataKeyPath] = $bindary.observe(item.context[item.observeDataKeyPath], keyPath, { viewTree: [item], reuseProxy: false }); // own proxy per component instance, so viewTree isn't silently dropped by reuse and component data will trigger view-tree update only for corresponding tree-item
                }

                me.postRender();
            }
        }

        componentDataChange(event)
        {

            let payload = event.detail.eventPayload;

            item.restoreContext(payload.treeState);
            event.detail.viewTree = [item];
        }

        createRepeatElement()
        {

            let me = this,
                item = me.item,
                placeHolder = item.repeatPlaceHolder,
                reps = item.repeatElements;

            let element = reps[item.key];


            if (!element || element._bindaryPlaceholder || item.dataChange?.recreate ||
                ($lib.isEmpty(item.dataChange?.recreate) && $bindary.defaultRecreateRule))
            {
                element = item.sourceElement.cloneNode(true);
                element.removeAttribute('id');
                element.setAttribute(core.attr.id, item.id); // keep id as bindary attribute
                element.style.display = item.display;
                placeHolder.parentNode.insertBefore(element, placeHolder);
                reps[item.key] = element;
            }

            item.element = element;
            me.inRepeat = true;
            return me.createElement();
        }

        createElement()
        {
            let me = this, item = me.item, context = item.context,
                element = item.element,
                setValue = function (name, value)
                {
                    if (value === null || value === undefined)
                    {
                        if (element.hasAttribute(name))
                            element.removeAttribute(name);
                    }
                    else
                    {
                        if (typeof value === 'object')
                            value = JSON.stringify(value);

                        if (element.getAttribute(name) !== value)
                            element.setAttribute(name, value);
                    }
                };

            me.treeState = item.captureTreeState();
            element.style.display = item.display; // element could be invisible if it was not rendered before

            // set attributes
            $lib.each(item.attributes, function (value, name)
            {
                if (item.attributeExpressions && item.attributeExpressions[name])
                {
                    let exprFn = item.attributeExpressions[name],
                        resolvedValue = exprFn(item.expressionTokenResolver.bind(item));

                    setValue(name, resolvedValue);
                }
                else
                {
                    let dataValue = (value.match(core.singleWord)) ? item.getDataValue(item.createDataKey(value, false), context) : undefined;
                    setValue(name, (dataValue == undefined) ? value : dataValue);
                }
            });

            $lib.each(item.events, function (method, event)
            {
                if ($lib.has(element, event, core.customEventHandler))
                    $lib.off(element, event, core.customEventHandler);

                $lib.on(element, event, core.customEventHandler, [method, item, me.treeState, null, false, core.getMethodContext(method, item)]);
            });

            me.clearInputEvents();
            me.setElementValue();
            me.bindInputEvents();

            return element;
        }

        setElementValue()
        {
            let me = this, item = me.item,
                el = item.element,
                info = item.elementInfo,
                value = item.value,
                type = item.dataType;

            if (el === core.dataBindTrigger && core.dataBindLive) // skip updating the element while the user is actively typing to avoid overwriting input
                return;

            if ((!item.dataKey && !item.expression) || info.isSelect) // select type is handled in item postrender
                return;

            if (item.viewFormatter)
                value = core.call(item.viewFormatter, [item, el, value]);

            value = me.formatValue(value);

            if (info.isRadio || info.isCheck)
            {
                if (Array.isArray(value)) // check if this checkbox/radio value exists in the array
                {
                    const elValue = ($lib.isEmpty(el.value) || el.value === 'on') ? el.name : el.value;
                    el.checked = value.includes(elValue);
                }
                else if (typeof value == 'boolean')
                    el.checked = ($lib.isEmpty(el.value) || type != 'boolean') ? value : (core.toBoolean(el.value) == value); // checkbox with value="false" is checked when value == false (e.g. checkbox with label 'enabled' and data property 'disabled')
                else
                    el.checked = value == el.value;

                el._bindaryLastState = `${el.checked}:${el.value}`; 

                return;
            }

            if (Array.isArray(value)) // convert array
                value = value.map(v => { return me.formatValue(v); }).join(',');

            value = ($lib.isEmpty(value, false)) ? '' : value.toString();

            const isHTML = item.isHTML || el.contentEditable === 'true';
            value = isHTML
                ? ($bindary.trustHTML || item.trusted) ? value : ($bindary.sanitizer ? $bindary.sanitizer(value) : core.sanitizer.sanitize(value))
                : value;

            core.setElementValue(item, value, isHTML);
            el._bindaryLastState = isHTML ? el.innerHTML : el.value;
        }

        formatValue(value)
        {
            let me = this,
                item = me.item,
                info = item.elementInfo,
                type = item.dataType,
                el = item.element,
                isoDate = null;

            if (typeof value == 'string' && (/^\d{4}-\d{2}-\d{2}/.test(value))) // iso string date
            {
                isoDate = new Date(value);
                if ($lib.isDate(isoDate) && !isNaN(isoDate.getTime()))
                    value = isoDate;
            }

            if ($lib.isDate(value))
            {
                let format,
                    date = isoDate || value;

                if (isNaN(date.getTime()))
                    return '';

                if (info.isInput && el.type == 'date')
                    format = 'YYYY-MM-DD'; // use default date format yyyy-mm-dd
                else if (type == 'date')
                    format = $bindary.dateFormat.replace(core.timeRegEx, ''); // remove time portion from date-format

                return core.formatDate(date, format);
            }
            else if (typeof value == 'number' && type?.startsWith('number'))
            {
                const match = type.match(/^number(?:\((\d+)\))?$/),
                    precision = match?.[1] != null ? parseInt(match[1]) : $bindary.decimalPrecision;

                return $lib.formatNumber(value, false, true, precision, null, $bindary.decimalSeparator);
            }

            return value;
        }

        clearInputEvents()
        {
            let me = this, item = me.item,
                element = item.element;

            if ($lib.has(element, 'blur', core.eventHandler))
                $lib.off(element, 'blur', core.eventHandler);

            if ($lib.has(element, 'change', core.eventHandler))
                $lib.off(element, 'change', core.eventHandler);

            if ($lib.has(element, 'input', me.deferDataBind))
                $lib.off(element, 'input', me.deferDataBind);
        }

        bindInputEvents()
        {
            let me = this, item = me.item,
                element = item.element;

            if (!item.inputBind)
                return;

            let tree = me.treeState;

            // Attach listeners in next event cycle to avoid infinite event call loop when the update came from dataBind(). 
            // The library event handler uses forEach, which will always retrieve a new value because of the remove/add action
            $lib.defer(function (element, tree)
            {
                let me = this, item = me.item;

                if (element.isContentEditable)
                    $lib.on(element, 'blur', core.eventHandler, [me.dataBind.bind(me, false), item, tree, [], true, null], me, true);
                else
                    $lib.on(element, 'change', core.eventHandler, [me.dataBind.bind(me, false), item, tree, [], true, null], me, true);

                if ((($bindary.liveBind && item.liveBind !== false) || item.liveBind) && element.type != 'hidden')
                    $lib.on(element, 'input', me.deferDataBind, [tree], me, true);

            }.bind(me, element, tree));
        }

        deferDataBind(tree, e)
        {
            const me = this,
                element = me.item.element,
                itemDelay = Number(me.item.liveBind),
                delay = (!isNaN(itemDelay) && itemDelay >= 0) ? itemDelay : ($bindary.liveBindDelay || 0),
                updateFn = function (tree)
                {
                    core.eventHandler(this.dataBind.bind(this, true), this.item, tree, [], true, null);
                }.bind(me, tree);

            if (core.liveBindTimers.has(element))
                clearTimeout(core.liveBindTimers.get(element));

            const timerId = setTimeout(updateFn, delay);
            core.liveBindTimers.set(element, timerId);
        }

        dataBind(live)
        {
            let me = this, item = me.item,
                info = item.elementInfo,
                el = item.element,
                value = core.getElementValue(item),
                state = info.isCheck || info.isRadio ? `${el.checked}:${value}` : value;

            if (state === el._bindaryLastState)
                return;

            if (core.fireEvent('preDataBind', [item, el, function () { item.dataBind(live); }]) !== false)
                item.dataBind(live);
        }

        postRender()
        {
            let me = this, item = me.item;

            if (item.children && item.children.length)
                $bindary.renderView(me.update, item.children);

            if (item.elementInfo && item.elementInfo.isSelect && item.dataKey)
                me.setSelectValue(); // set select value when all options are rendered

            if (me.inRepeat)
                core.rendered.push(item); // set rendered state after all repeat-elements are rendered
            else
                item.isRendered = true;

            if (item.component && item.context?.postRender)
                item.context.postRender(item); // invoke postRender method on component if exists

            if (core.call(item.postRender, [item]) === false)
                item.element.style.display = 'none';

            item.key = item.index = item.value = null; // clear
            me.next(); // fetch next
        }

        setSelectValue()
        {

            let me = this, item = me.item;
            let dataKey = item.dataKey;
            $lib('#' + item.id).value = item.getDataValue(dataKey, item.context);
        }
    }
})();

export default componyx.bindary_modules.Renderer;