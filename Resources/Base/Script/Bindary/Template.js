/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

await (async function ()
{
    await import(`${$UI.getScriptResourcePath('Base.Bindary.Core')}`);
    await import(`${$UI.getScriptResourcePath('Base.Bindary.DataUpdater')}`);
    const core = componyx.bindary_modules.core;
    const dataUpdater = componyx.bindary_modules.dataUpdater;

    /**
    * The base template class.
    * @class
    * @memberof componyx.bindary
    */
    class TemplateBase
    {
        resolveLivePath(path)
        {
            let orgPath = path,
                me = this;

            if (!path) return path;

            if (me.livePath[path]) return me.livePath[path];

            let parent = me.parent,
                parentRepItem = me.getParentRepeater(),
                useItemContext = ((me.contextDataKey && path != me.contextDataKeyPath) || (me.repeatDataKeyPath && path != me.repeatDataKeyPath)),
                contextItem = useItemContext ? me : parent,
                livePath, contextPath;

            if (path.endsWith(core.dksc + core.valueKey) || path.endsWith(core.dksc + core.key))
            {
                path = path.replace(new RegExp('\\' + core.dksc.split('').join('\\') + '(\\$value|\\$key)$'), '');
            }

            // Adds the collection key to the live path
            if (parentRepItem)
            {
                path = path.replace(parentRepItem.repeatDataKeyPath, parentRepItem.repeatDataKeyPath + core.dksc + parentRepItem.key);
            }

            if (contextItem)
            {
                contextPath = contextItem.contextDataKeyPath;
                livePath = contextItem.livePath ? contextItem.livePath[contextPath] : null;

                if (livePath && livePath != contextPath && !path.startsWith(livePath) && path.startsWith(contextPath))
                {
                    path = path.replace(contextPath, livePath); // Fast convert when parent's cached path is available
                }
            }

            if (path.indexOf(core.ipc) > -1)
            { // Path contains pointer
                let parts = path.split(core.dksc),
                    pointerPaths = [];

                $lib.each(parts, (p, index) =>
                {
                    if (p.indexOf(core.ipc) == 0)
                    {
                        let key = me.indexKey[p.substr(core.ipc.length)];

                        if (typeof key != 'number')
                        {
                            pointerPaths.push(key.join(core.dksc).substr(core.dksc.length + '$'.length)); // Add data-key to pointer path
                            key = me.getDataValue(key, contextItem); // Dynamic index/key pointer
                        }

                        parts[index] = key;
                    }
                });

                me.pointerPaths = pointerPaths;
                path = parts.join(core.dksc);
            }

            return (this.livePath[orgPath] = path); // Cache calculated path
        }

        getParentRepeater()
        {
            let item = this;

            if (!item.inRepeat) return null;

            while ((item = item.parent))
            {
                if (item.repeatDataKeyPath && !$lib.isEmpty(item.key))
                {
                    return item;
                }
            }

            return null;
        }

        getDataChange()
        {
            let me = this,
                c = core.dataChanges,
                m = core.modelDataChanges,
                rules = c['#' + me.updateId] || ((m.size > 0) ? m.get(me.context) || m.get(me.repeatValue) : null);

            if (!rules)
            {
                if (me.repeatDataKey)
                {
                    rules = c[me.livePath[me.repeatDataKeyPath]];

                    if (!me.rewriteArray(rules))
                    {
                        rules = me.getChangedIndexes(rules);
                    }
                }

                if (!rules && me.hasParentChange())
                {
                    rules = [];
                }
            }

            if (!rules)
            {
                let paths = me.resolveLivePaths();

                if (!$lib.isEmpty(me.pointerPaths))
                {
                    paths = paths.concat(me.pointerPaths); // Also check pointer data-keys
                }

                $lib.each(paths, (path) =>
                {
                    rules = c[path] || null; // Exact match check

                    if (!rules && path)
                    {
                        $lib.each(c, (r, key) =>
                        {
                            if (core.dataKeyMatch(path, key))
                            { // Partial match check
                                rules = [];
                            }

                            return (rules == null);
                        });
                    }

                    return (rules == null);
                });
            }

            me.dataChange = rules || null;
        }

        rewriteArray(rules)
        {
            let rewrite = false;
            $lib.each(rules, (r) =>
            {
                rewrite = $lib.isEmpty(r); // Empty object as rules means rewrite
                return !rewrite;
            });

            return rewrite;
        }

        hasParentChange()
        {
            let me = this, parent = me.parent;

            if (!parent || !parent.dataChange) return false;

            let updateId = parent.updateId;

            if (updateId && core.dataChanges['#' + updateId])
            { // Always update child items when change by update-id
                me.updateId = updateId;
                return me.updateIdFromParent = true;
            }

            if (me.repeatDataKey || parent.repeatDataKey)
            { // Repeater can only be updated by parent through the updateId (is rerender)
                return false;
            }

            // Check if item context belongs to the parent-item context
            return (me.paths.findIndex((p) =>
            {
                let found = false;
                $lib.each(parent.paths, (pp) =>
                {
                    return !(found = p.startsWith(pp));
                });

                return found;
            }) > -1);
        }

        createDataKeyPath(key, parentKey)
        {
            let me = this;

            if (key == null)
                return key;

            let k = key.join(core.dksc), merge = true, parent;

            if (key[0] === '$')
            {
                k = k.substr('$'.length + core.dksc.length);
                merge = false;
            }

            if (core.isKey(key[0], core.parentKey))
            {
                while (core.isKey(key[0], core.parentKey)) // routine for multiple $parent navigators in data-key
                {
                    parent = me.parent;
                    key = key.slice(1); // remove $parent from key
                }

                parentKey = parent.contextDataKeyPath;
            }

            if (merge && parentKey)
                return parentKey + core.dksc + k;
            else
                return k;
        }

        createDataKey(dataKey, isRoot)
        {
            let me = this;

            if (!dataKey || dataKey == 'null')
                return dataKey;

            dataKey = dataKey.replace(/\[+([\w.$]+)\]+/g, function (match, capture)
            {
                let number = parseInt(capture, 10);

                if (isNaN(number))
                    me.indexKey.push(core.addDataContainer(capture.split(core.dksc), false)); // dynamic index/key pointer
                else
                    me.indexKey.push(number); // static index pointer

                return core.dksc + core.ipc + (me.indexKey.length - 1);
            });

            if ($lib.startsWith(dataKey, core.dksc + core.ipc))
                dataKey = dataKey.substr(core.dksc.length);

            return core.addDataContainer(dataKey.split(core.dksc), isRoot);
        }

        getDataValue(dataKey, dc)
        {
            let me = this;

            if (!dataKey)
                return null;

            if (core.isKey(dataKey[0], core.valueKey))
                return (dc || '').toString();

            let index = 0, current, curItem, arrIndex, root = dc;

            if (dataKey[0] === '$') // set context to root
            {
                dc = $bindary;
                dataKey = dataKey.slice(1); // remove $ from key

                if ($lib.indexOf(core.dataLabel, dataKey[0]) == -1)
                    dc = window;
            }
            else if (core.isKey(dataKey[0], core.parentKey)) // set context to parent
            {
                curItem = me.parent;
                current = curItem.context;

                while (core.isKey(dataKey[0], core.parentKey)) // routine for multiple $parent navigators in data-key
                {
                    while (dc === current && curItem) // context must be different
                    {
                        curItem = curItem.parent;
                        current = (curItem) ? curItem.context : null;
                    }

                    dataKey = dataKey.slice(1); // remove $parent from key
                    dc = current;
                }
            }

            core.escapeDataKey(dataKey);

            if (core.isKey(dataKey, core.key))
                return me.key;

            while (dc && index < dataKey.length)
            {
                if (dataKey[index].indexOf(core.ipc) == 0) // position index within array
                {
                    arrIndex = me.indexKey[dataKey[index].substr(core.ipc.length)];

                    if (typeof arrIndex != 'number')
                        arrIndex = me.getDataValue(arrIndex, root); // dynamic index/key pointer

                    dc = dc[arrIndex];
                    index++;
                }
                else
                    dc = dc[dataKey[index++]];
            }

            return dc;
        }
    }

    /**
    * TemplateItem class.
    * @class
    * @property {componyx.bindary.TemplateItem} root The root item or itself if this is the root of the item tree.
    * @property {componyx.bindary.TemplateItem} parent The parent item.
    * @property {TemplateItem[]} children The child items of the current item.
    * @property {String} id The unique identifier of the item.
    * @property {HTMLElement} placeHolder A place holder element for an item that is not rendered.
    * @property {HTMLElement} repeatPlaceHolder A place holder element for a repeating item.
    * @property {Boolean} trusted A value indicating if the HTML value is trusted.
    * @property {Boolean} includable A value indicating if the item is an includable item.
    * @property {Boolean} includableRoot A value indicating if the item is the root of the includable.
    * @property {Boolean} included A value indicating if an includable is included.
    * @property {String} includeFile The include file data-key or path.
    * @property {String} include The include data-key or identifier.
    * @property {Boolean} isComponent A value indicating if the item is a component.
    * @property {Boolean} loaded A value indicating if the included data or component is loaded.
    * @property {HTMLElement} element The rendered element.
    * @property {HTMLElement} sourceElement The original collected element. This element can differ from the rendered element when it is included or within a repeater.
    * @property {String} display The original display style of the element.
    * @property {elementInfo} elementInfo Information about the element.
    * @property {Object} context The object context.
    * @property {Object} repeatValue The repeat value context.
    * @property {Object} repeatItemIdValue The value of the repeat item id.
    * @property {Object} itemId The item is rendered if the item id matches the value of the repeat item id.
    * @property {Number} index The current index within the array repeater.
    * @property {String} key The current key within the object repeater.
    * @property {Object} value The data value.
    * @property {Boolean} isRendered A value indicating if the element is rendered.
    * @property {Object[]} dataChange Holds the active data change rules for the item.
    * @property {String[]|Number[]} indexKey The index key holds the dynamic (data-key) or static index pointer.
    * @property {HTMLElement[]} repeatElements The collection of elements within the repeater.
    * @property {String} dataType The type of the data value.
    * @property {String} inputBind The data bind value.
    * @property {Boolean|Number} liveBind A value indicating if live binding is enabled (true) or disabled (false) or the debounce delay in milliseconds.
    * @property {String} updateId The update identifier.
    * @property {Boolean} updateIdFromParent A value indicating that the updateId was copied from the parent item in the update loop.
    * @property {Boolean} isHTML A value indicating if the data value is HTML.
    * @property {String} if The value of the `if` attribute, representing either a method name or an expression string used to evaluate the conditional statement.
    * @property {function} ifExpr The expression function that evaluates the conditional statement.
    * @property {String} elseIf The value of the `elseif` attribute, representing either a method name or an expression string used to evaluate the conditional statement.
    * @property {function} elseIfExpr The expression function that evaluates the conditional statement.
    * @property {Boolean} else A flag indicating that this element should be rendered when none of the preceding conditional (if/elseif) statements evaluate to true.
    * @property {Boolean} conditionMet A value indicating the state of the conditional statement.
    * @property {String} dataFormatter The function invoked when the value is set on the data object.
    * @property {String} viewFormatter The function invoked when the value is set on the element.
    * @property {String} preRender The function invoked before the element is rendered.
    * @property {String} postRender The function invoked after the element is rendered.
    * @property {String} load The function invoked when an includable is included.
    * @property {String} filter The function invoked to filter a collection.
    * @property {Object} events The element events.
    * @property {string[]} repeatDataKey - Hierarchical data key as an array of parts (e.g. ['myObj', 'value']).
    * @property {string[]} repeatItemIdDataKey - Hierarchical data key array for the repeat item ID.
    * @property {string[]} contextDataKey - Hierarchical data key array for the context value.
    * @property {string[]} hasValue - Hierarchical data key array for value existence checks.
    * @property {string[]} dataKey - Hierarchical data key array for the main data value.
    * @property {string} expressionValue - The raw expression value if the data-key contains expressions denoted with brackets {{}}
    * @property {function} expression - The expression function if the data-key contains expressions.
    * @property {Object} attributes The data bound attributes.
    * @property {function[]} attributeExpressions Expression functions for the attributes if the attribute values contain expressions.
    * @property {string} repeatDataKeyPath - Full path for the repeat value. (e.g. 'appData.container.myArr').
    * @property {string} contextDataKeyPath - Path for the context value.
    * @property {string} hasValueDataKeyPath - Full path for value existence check.
    * @property {string} dataKeyPath - Full path for the data value (value/html/bind) if its a single data-key.
    * @property {string} dataKeyPaths - Full paths for all value data keys when using a value expression.
    * @property {string[]} attributeDataKeyPaths - Full paths for all attribute data keys.
    * @property {string[]} conditionalDataKeyPaths - Full paths for all the data keys used in conditional expressions.
    * @property {Object[]} treeState Internal. Snapshot of this item's context and its ancestors', used to restore tree state later.
    * @property {Number} treeStatePass Internal. Tracks which render pass last captured treeState, to avoid stale ancestor data.
    * @memberof componyx.bindary
    */
    class TemplateItem extends TemplateBase
    {
        /**
         * Creates an instance of TemplateItem.
         * 
         * @param {HTMLElement} el - The DOM element associated with the template item.
         * @param {Object} events - The events related to the template item.
         * @param {Object} attributes - The attributes for the template item.
         * @param {componyx.bindary.TemplateItem} parent - The parent TemplateItem if this item is a child.
         * @param {boolean} appendToRoot - Determines whether to append to the root.
         */
        constructor(el, events, attributes, parent, appendToRoot)
        {
            super();
            let me = this;

            me.root = (parent) ? (parent.root) : me;

            if (el)
            {
                me.id = el.id = el.id || core.getId(); // keep original id or generate id
                el.setAttribute(core.attr.id, me.id);
            }

            me.parent = parent;
            me.children = [];
            me.repeatPlaceHolder = null;
            me.trusted = null;
            me.includable = null;
            me.includableRoot = false;
            me.included = false;
            me.includeFile = null;
            me.include = null;
            me.isComponent = false;
            me.loaded = false;
            me.element = null;
            me.sourceElement = null;
            me.display = null;
            me.elementInfo = null;
            me.context = null;
            me.repeatValue = null;
            me.repeatItemIdValue = null;
            me.itemId = null;
            me.index = null;
            me.key = null;
            me.value = null;
            me.isRendered = false;
            me.dataChange = null;
            me.indexKey = [];
            me.repeatElements = {};
            me.dataType = null;
            me.inputBind = null;
            me.liveBind = null;
            me.updateId = null;
            me.updateIdFromParent = null;
            me.isHTML = false;
            me.if = null;
            me.ifExpr = null;
            me.elseIf = null;
            me.elseIfExpr = null;
            me.else = null;
            me.conditionMet = null;
            me.dataFormatter = null;
            me.viewFormatter = null;
            me.preRender = null;
            me.postRender = null;
            me.load = null;
            me.filter = null;
            me.events = null;
            me.hasValue = null;
            me.dataKey = null;
            me.expressionValue = null;
            me.expression = null;
            me.attributes = null;
            me.attributeExpressions = null;
            me.repeatDataKey = null;
            me.repeatItemIdDataKey = null;
            me.contextDataKey = null;
            me.hasValueDataKeyPath = null;
            me.repeatDataKeyPath = null;
            me.contextDataKeyPath = null;
            me.dataKeyPath = null;
            me.dataKeyPaths = null;
            me.attributeDataKeyPaths = null;
            me.conditionalDataKeyPaths = null;
            me.treeState = null;
            me.treeStatePass = null;

            if (parent)
                parent.children.push(me);
            else if (appendToRoot !== false)
                core.viewTree.push(me); // root item

            core.templateList.push(me);

            if (el)
                me.parseTemplateElement(el, events, attributes, parent);
        }

        parseTemplateElement(el, events, colAttributes, parent)
        {
            // data-order: repeat, context, value
            let me = this,
                { keep, live } = core.getTemplateFlags(el, ['keep', 'live']),
                liveBind = live,
                keepAttr = keep === null ? $bindary.keepAttributes : keep,
                contextKeyPath = (parent) ? parent.contextDataKeyPath : null,
                hasParentContext = (contextKeyPath != null),
                hasParentInclude = (parent) ? parent.includable : false,
                include = el.getAttribute(core.attr.include),
                isRoot = !(el.hasAttribute(core.attr.repeat) || el.hasAttribute(core.attr.context) || hasParentContext || hasParentInclude),
                text = el.getAttribute(core.attr.value),
                html = el.getAttribute(core.attr.html),
                inputBind = el.hasAttribute(core.attr.bind),
                dataKey = el.getAttribute(core.attr.bind) || text || html || '',
                attributes = el.getAttribute(core.attr.attributes),
                hasValue = el.getAttribute(core.attr.hasValue),
                updateValue = (key, value) =>
                {
                    if (keepAttr || me[key] == undefined || !$lib.isEmpty(value))
                        me[key] = (value != 'null') ? value : null; // string value 'null' means clear previously stored value
                };

            if (keepAttr) // with keepAttributes enabled values are always set (removing the attribute will clear the stored value)
            {
                me.hasValue = null;
                me.isHTML = false;
            }

            // these are always re-evaluated
            me.expression = null;
            me.ifExpr = null;
            me.elseIfExpr = null;
            me.dataKeyPaths = [];
            me.conditionalDataKeyPaths = [];

            if (html && $lib.startsWith(html, 'trust:'))
            {
                html = html.substr(6);
                me.trusted = true;
            }

            me.includable = hasParentInclude;

            if (el.hasAttribute(core.attr.includable))
            {
                me.includableRoot = (el.getAttribute(core.attr.includable) != 'null');
                me.includable = (el.getAttribute(core.attr.includable) == 'null') ? hasParentInclude : true; // includable cannot be cleared if parent has includable specified
            }

            me.isComponent = (parent) ? parent.isComponent : false;
            updateValue('component', el.getAttribute(core.attr.component));
            me.isComponent = (me.component) ? true : me.isComponent;

            me.parseInclude(include, hasParentContext);

            if (me.isComponent)
                isRoot = false;

            const hasContentExpr = core.hasContentExpression(el);

            if (!inputBind && (hasContentExpr || dataKey.indexOf('{{') != -1))
            {
                me.expressionValue = (hasContentExpr) ? el.textContent : dataKey;
                dataKey = null;

                if (hasContentExpr)
                    el.textContent = '';
            }
            else
                dataKey = (!$lib.isEmpty(dataKey)) ? me.createDataKey(dataKey, isRoot) : null;


            me.isRendered = false;
            me.display = el.style.display;
            me.sourceElement = me.tempElement = el; // tempElement is for backwards compatibility
            me.elementInfo = me.getElementInfo(el);

            updateValue('dataType', (el.getAttribute(core.attr.type) || '').toLowerCase());
            updateValue('dataKey', dataKey);
            updateValue('inputBind', inputBind);
            updateValue('liveBind', liveBind);
            updateValue('updateId', el.getAttribute(core.attr.updateId));
            updateValue('itemId', el.getAttribute(core.attr.itemId));
            updateValue('attributes', (attributes && attributes != 'null') ? window.JSON.parse('{' + core.createJSON(attributes) + '}') : attributes);

            if (colAttributes)
            {
                me.attributes = me.attributes || {};
                $lib.each(colAttributes, (value, key) => { me.attributes[key] = value; });
            }
            else
                this.collectAttributes(el);

            if (!me.dataKey)
                me.expression = null;

            if (hasValue && hasValue == 'null')
                me.hasValue = null;
            else if (el.hasAttribute(core.attr.hasValue))
                me.hasValue = ($lib.isEmpty(hasValue)) ? hasValue.split(core.dksc) : me.createDataKey(hasValue, isRoot);

            if (dataKey)
                me.isHTML = !$lib.isEmpty(html);

            isRoot = !(hasParentContext || me.includable || me.isComponent); // defines whether repeat/context is root

            if (el.hasAttribute(core.attr.repeat))
            {
                updateValue('repeatDataKey', me.createDataKey(el.getAttribute(core.attr.repeat), isRoot));
                updateValue('repeatItemIdDataKey', me.createDataKey(el.getAttribute(core.attr.repeatItemId), false));

                if (!me.includable)
                {
                    updateValue('repeatDataKeyPath', me.createDataKeyPath(me.repeatDataKey, contextKeyPath));
                    contextKeyPath = me.repeatDataKeyPath || contextKeyPath;
                }
            }

            if (el.hasAttribute(core.attr.context))
            {
                updateValue('contextDataKey', me.createDataKey(el.getAttribute(core.attr.context), !el.hasAttribute(core.attr.repeat) && isRoot));

                if (!me.includable)
                {

                    updateValue('contextDataKeyPath', me.createDataKeyPath(me.contextDataKey, contextKeyPath));
                    contextKeyPath = me.contextDataKeyPath || contextKeyPath;
                }
            }

            if (el.hasAttribute(core.attr.observe))
            {

                updateValue('observeDataKeyPath', el.getAttribute(core.attr.observe));
            }

            if (!me.includable)
            {
                if (me.dataKey)
                    me.dataKeyPath = me.createDataKeyPath(me.dataKey, contextKeyPath);

                if (me.hasValue && me.hasValue[0].length > 0)
                    me.hasValueDataKeyPath = me.createDataKeyPath(me.hasValue, contextKeyPath);
            }

            // store current context key-path
            me.contextDataKeyPath = contextKeyPath;

            // controller methods
            updateValue('dataFormatter', el.getAttribute(core.attr.dataFormatter));
            updateValue('viewFormatter', el.getAttribute(core.attr.viewFormatter));
            updateValue('preRender', el.getAttribute(core.attr.preRender));
            updateValue('if', el.getAttribute(core.attr.if));
            updateValue('elseIf', el.getAttribute(core.attr.elseIf));
            me.else = (el.hasAttribute(core.attr.else) && el.getAttribute(core.attr.else) != 'null');
            updateValue('postRender', el.getAttribute(core.attr.postRender));
            updateValue('load', el.getAttribute(core.attr.load));
            updateValue('filter', el.getAttribute(core.attr.filter));

            me.evaluateExpressions();

            // events
            me.events = $lib.clone(me.events || {}, events, true, true);

            for (let event in me.events)
            {
                if (events[event] == 'null')
                {
                    $lib.off(el, event, core.customEventHandler);
                    delete me.events[event];
                }
            }
        }

        evaluateExpressions()
        {
            const me = this,
                contextKeyPath = me.contextDataKeyPath,
                seen = {},
                tokenHandler = function (seen, arr, token)
                {
                    if (token.endsWith('()')) // controller method
                        return;

                    let dataKey = me.createDataKeyPath(me.createDataKey(token), contextKeyPath);

                    if (!seen[dataKey])
                        arr.push(dataKey);

                    seen[dataKey] = true;
                };

            me.dataKeyPaths = [];
            me.conditionalDataKeyPaths = [];

            if (me.if && me.if.indexOf('{{') != -1)
                me.ifExpr = core.expressionEngine.evaluate(me.if, tokenHandler.bind(this, seen, me.conditionalDataKeyPaths));

            if (me.elseIf && me.elseIf.indexOf('{{') != -1)
                me.elseIfExpr = core.expressionEngine.evaluate(me.elseIf, tokenHandler.bind(this, seen, me.conditionalDataKeyPaths));

            if (me.expressionValue)
                me.expression = core.expressionEngine.evaluate(me.expressionValue, tokenHandler.bind(this, {}, me.dataKeyPaths));

            me.createAttributeExpressions();
        }

        parseInclude(include, hasParentContext)
        {
            if ($lib.isEmpty(include))
                return;

            let me = this,
                isRoot = !(hasParentContext || me.includable || me.isComponent);

            me.includeFile = ($lib.startsWith(include, 'file:')) ? include.substr(5) : null;

            if (me.includeFile)
                me.includeFile = ($lib.startsWith(me.includeFile, '/')) ? me.includeFile : me.createDataKey(me.includeFile, isRoot);

            if (include == 'null' || me.includeFile)
                me.include = null;
            else
                me.include = ($lib.startsWith(include, '#')) ? include : me.createDataKey(include, isRoot);
        }

        getElementInfo(el)
        {
            let info = {};

            info.name = el.nodeName.toLowerCase();
            info.isInput = (info.name == 'input');
            info.isTextArea = (info.name == 'textarea');
            info.isSelect = (info.name == 'select');
            info.isCheck = (info.isInput && el.type == 'checkbox');
            info.isRadio = (info.isInput && el.type == 'radio');
            return info;
        }

        createAttributeExpressions()
        {
            const me = this,
                contextDataKeyPath = me.contextDataKeyPath,
                seen = {},
                addKey = (value) =>
                {
                    if (value.endsWith('()')) // controller method
                        return;

                    let dataKey = me.createDataKeyPath(me.createDataKey(value), contextDataKeyPath);

                    if (!seen[dataKey])
                        me.attributeDataKeyPaths.push(dataKey);

                    seen[dataKey] = true;
                };

            me.attributeExpressions = {};
            me.attributeDataKeyPaths = [];

            $lib.each(me.attributes, (value, name) =>
            {
                if (value.match(core.singleWord)) // $key or $value
                {
                    addKey(value);
                }
                else // simple data-key or expression
                {
                    const exprFn = core.expressionEngine.evaluate(value, (token) => { addKey(token); });
                    me.attributeExpressions[name] = exprFn;
                }
            });
        }

        collectAttributes(el)
        {
            let me = this,
                key = 'attributes',
                attrObj = me[key] || {};

            $lib.each(el.attributes, (attr) =>
            {
                if (attr.name.indexOf(core.prefix) != 0 && attr.value.match(core.hasBindingRegEx) != null)
                    attrObj[attr.name] = attr.value;
            });

            if (!$lib.isEmpty(attrObj))
                me[key] = attrObj;
        }

        updateKeyPaths()
        {
            let me = this,
                oldDataKey = me.contextDataKeyPath,
                contextKeyPath = me.parent.contextDataKeyPath;

            if (me.repeatDataKey)
                contextKeyPath = me.repeatDataKeyPath = me.createDataKeyPath(me.repeatDataKey, contextKeyPath);

            if (me.contextDataKey)
                contextKeyPath = me.createDataKeyPath(me.contextDataKey, contextKeyPath);

            if (me.dataKey)
                me.dataKeyPath = me.createDataKeyPath(me.dataKey, contextKeyPath);

            if (me.hasValue)
                me.hasValueDataKeyPath = me.createDataKeyPath(me.hasValue, contextKeyPath);

            me.contextDataKeyPath = contextKeyPath;

            const replaceContext = (value, index, obj) =>
            {
                if (value.startsWith(oldDataKey))
                    obj[index] = contextKeyPath + value.slice(oldDataKey.length);
            }

            $lib.each(me.dataKeyPaths, replaceContext);
            $lib.each(me.attributeDataKeyPaths, replaceContext)
            $lib.each(me.conditionalDataKeyPaths, replaceContext);
        }

        resolveLivePaths(fromCache)
        {
            let me = this;

            if (fromCache !== false && me.paths)
                return me.paths;

            let paths = Array.from(new Set([me.repeatDataKeyPath, me.contextDataKeyPath, me.dataKeyPath, me.hasValueDataKeyPath, me.observeDataKeyPath]
                .concat(me.dataKeyPaths || [])
                .concat(me.attributeDataKeyPaths || [])
                .concat(me.conditionalDataKeyPaths || [])))
                .filter((el) => { return el != null; });

            $lib.each(paths, (path, index) =>
            {
                paths[index] = (path) ? me.resolveLivePath(path) : null;
            });

            return (me.paths = paths);
        }

        getChangedIndexes(orgRules)
        {

            let me = this,
                found,
                path = me.resolveLivePath(me.repeatDataKeyPath),
                length = path.split(core.dksc).length;

            let rules = dataUpdater.initUpdateRules({}, orgRules),
                r = rules[rules.length - 1];

            r.keys = [];

            $lib.each(core.dataChanges, (item, dataKey) =>
            {

                if ($lib.startsWith(dataKey, path))
                {

                    let dk = dataKey.split(core.dksc),
                        key = dk[length]; // collection index or key

                    if (key !== undefined && r.keys.indexOf(key) == -1)
                    {

                        r.keys.push(key);
                        found = true;
                    }
                }
            });

            return (found) ? rules : orgRules;
        }

        initRepeater(element, parentElement, beforeElement, remove)
        {
            let me = this;

            if (!me.repeatElements)
                me.repeatElements = {};

            if (remove)
            {
                me.clearRepeater(element);

                if (!beforeElement?.isConnected)
                    beforeElement = null;
            }

            let placeHolder = me.repeatPlaceHolder,
                exists = placeHolder?.isConnected;

            if (!exists)
            {
                me.repeatPlaceHolder = core.createPlaceHolder(me, parentElement, beforeElement);
                me.repeatPlaceHolder.removeAttribute('id');

                if (element)
                    $lib.remove(element);

            }
            else if (beforeElement?.isConnected)
            {
                beforeElement.parentNode.insertBefore(placeHolder, beforeElement);
            }
        }

        clearRepeater(element)
        {
            let me = this,
                rootKey = me.resolveLivePath(me.repeatDataKeyPath) + core.dksc;

            // cleanup internal clone registry
            $lib.each(core.repItemClones, (clone, key) =>
            {
                if ($lib.startsWith(key, rootKey))
                    delete core.repItemClones[key];
            });

            // remove tracked elements
            $lib.each(me.repeatElements, (el) =>
            {
                $lib.remove(el);
            });

            // remove orphaned DOM elements
            let parent = me.parent?.element || document;
            let duplicates = parent.querySelectorAll(`[${core.attr.id}="${me.id}"]`);

            duplicates.forEach((el) =>
            {
                if (el !== element && el !== me.repeatPlaceHolder)
                {
                    el.remove();
                }
            });

            me.repeatElements = {};
        }

        isActiveRepeatItem()
        {

            let me = this,
                itemId = me.itemId, item = me;

            if ($lib.isEmpty(itemId))
                return true;

            while (item && $lib.isEmpty(item.repeatItemIdValue))
            {

                item = item.parent;
            }

            if (!item || item.repeatItemIdValue === itemId)
                return true;

            return false;
        }

        getIncludeItem()
        {

            let me = this,
                idReference = $lib.startsWith(me.include, '#'),
                id = (idReference) ? me.include.substr(1) : me.getDataValue(me.include, (!me.component && me.parent) ? me.parent.context : me.context);

            return me.getTemplateItemById(id);
        }

        getTemplateItemById(id)
        {
            if ($lib.isEmpty(id))
                return null;

            let index = $lib.indexOf(core.templateList, function (item) { return (item.id == id); });

            if (index > -1)
                return core.templateList[index];
            else
                return null;
        }

        dataBind(live)
        {
            let me = this;

            if (!me)
                return;

            let el = me.element,
                value = core.getElementValue(me),
                info = me.elementInfo,
                keyPath = me.dataKey.slice(0),
                lastKey = me.dataKey[me.dataKey.length - 1],
                isSwitch = info.isRadio || info.isCheck,
                isPlainToggle = isSwitch && ($lib.isEmpty(value) || (info.isCheck && value == 'on')),
                type = me.dataType,
                obj;

            keyPath.pop();
            el._bindaryLastState = (info.isRadio || info.isCheck) ? `${el.checked}:${value}` : value;

            if (me.dataFormatter)
                value = core.call(me.dataFormatter, [me, el, value]);
            else if (isSwitch)
            {
                if (isPlainToggle)
                    value = el.checked;
                else
                {
                    value = me.castValue(value, type);

                    if (!el.checked && type == 'boolean')
                        value = !value; // reverse
                }
            }
            else if (type) // cast if explicit type is defined (e.g. for number/date inputs or select with "true" and "false" values)
                value = me.castValue(value, type);

            core.observed = false; // value changes to true if object is observed

            if (me.repeatValue)
            {
                if (core.isKey(me.dataKey, core.valueKey))
                {
                    if ((obj = me.repeatValue))
                        obj[me.key] = value;
                }
                else
                {
                    if ((obj = me.getDataValue(keyPath, me.repeatValue[me.key])))
                        obj[lastKey] = value;
                }
            }
            else
            {
                if (me.dataKey.length == 1)
                    obj = me.context;
                else
                    obj = me.getDataValue(keyPath, me.context);

                if (Array.isArray(obj[lastKey]) && info.isCheck && type !== 'boolean') // handle checkboxes to array binding
                {
                    const arr = obj[lastKey],
                        val = !$lib.isEmpty(value) && value !== 'on' ? value : el.name;

                    if (el.checked)
                    {
                        if (!arr.includes(val))
                            arr.push(val);
                    }
                    else
                    {
                        const index = arr.indexOf(val);
                        if (index > -1)
                            arr.splice(index, 1);
                    }
                }
                else if (Array.isArray(obj[lastKey]) && typeof value === 'string') // CSV array for normal inputs
                {
                    if (!$lib.isEmpty(value))
                    {
                        const parts = value.split(',')
                            .map(v => v.trim())
                            .filter(v => v.length > 0);

                        obj[lastKey] = (type) ? parts.map(v => me.castValue(v, type)) : parts;
                    }
                    else
                    {
                        obj[lastKey] = [];
                    }
                }
                else if (obj)
                {
                    if (info.isCheck && !isPlainToggle && !el.checked && type !== 'boolean') // a checkbox with string value that is unchecked
                        value = '';

                    obj[lastKey] = value;
                }
            }

            core.dataBindLive = false; // if this data-bind came from oninput event but there is no matching object, set to false

            if (obj)
            {
                core.dataBindLive = live;
                $bindary.dataBindTrigger = el; // keep track of update trigger
            }

            const modelValue = obj
                ? (me.repeatValue && core.isKey(me.dataKey, core.valueKey) ? obj[me.key] : obj[lastKey])
                : value; // fallback to raw value if obj was never resolved

            core.fireEvent('postDataBind', [me, el, obj, modelValue]);

            if (obj && !core.observed)
            {
                $bindary.dataChange(me.resolveLivePath(me.dataKeyPath), null, null, false); // register data-change when object is not observed
                $bindary.updateViewDelayed();
            }
        }

        castValue(value, type)
        {
            if (!type)
                return value;

            if (type == 'boolean')
                return core.toBoolean(value);

            if ($lib.isEmpty(value) && (type == 'date' || type == 'datetime' || type == 'number'))
                return null;

            if (type == 'date')
                return $lib.parseDate(value, $bindary.dateFormat.replace(core.timeRegEx, ''));

            if (type == 'datetime')
                return $lib.parseDate(value, $bindary.dateFormat);

            if (type.startsWith('number'))
                return parseFloat(value.replace($bindary.decimalSeparator, '.'));

            return value;
        }

        clone(parent)
        {
            let cloner = (item, parent) =>
            {
                let target = new componyx.bindary_modules.TemplateItem(null, null, null, null, false);

                $lib.each(item.children, (child) =>
                {
                    target.children.push(cloner(child, target));
                });

                $lib.each(item, (value, key) =>
                {
                    if (core.omit[key] === undefined && typeof (value) !== 'function' && !$lib.isEmpty(value))
                        target[key] = value;
                });

                target.evaluateExpressions();
                target.livePath = {};
                target.parent = parent;
                target.root = item.root;
                return target;
            }

            return cloner(this, parent || this.parent);
        }

        getClone()
        {
            let me = this,
                key = me.resolveLivePath(me.repeatDataKeyPath),
                clone = core.repItemClones[key];

            if (!clone)
                return (core.repItemClones[key] = me.clone());
            else
                return clone;
        }

        defineContext(context)
        {
            let me = this,
                rootIndex;

            me.context = context;

            if (me.contextDataKey)
                me.context = me.getDataValue(me.contextDataKey, context); // define context/scope
            else if (me.dataKey && me.dataKey[0] == '$')
            {

                rootIndex = $lib.indexOf(core.dataLabel, me.dataKey[1]);

                if (rootIndex > -1)
                    me.context = $bindary[core.dataLabel[rootIndex]];
            }
        }

        setContextValue()
        {
            let me = this, context = me.context;

            if ($lib.isEmpty(me.dataKey) && !me.expression)
                return;

            if (me.expression)
            {
                let resolvedValue = me.expression(me.expressionTokenResolver.bind(me));
                me.value = (resolvedValue == null) ? '' : resolvedValue;
            }
            else
                me.value = me.getDataValue(me.dataKey, context);
        }

        expressionTokenResolver(token)
        {
            let me = this;

            if (token.endsWith('()'))
            {
                const methodName = token.slice(0, -2);

                if (me.isComponent)
                {
                    let item = me;

                    while (item && !item.component)
                        item = item.parent;

                    if (item?.context?.[methodName])
                        return item.context[methodName](me);
                }

                // not a component, or the component didn't have this method: fall back to the controller
                return ($bindary.controller) ? $bindary.controller[methodName](me) : '';
            }
            else
                return me.getDataValue(token.split('.'), me.context); // data-key
        }

        captureTreeState()
        {
            let item = this,
                tree = (item.parent?.treeStatePass == core.renderPass) ? item.parent.treeState.slice() : item.parent?.captureTreeState().slice() || []; // clone always, cached or not, so no two items ever share the same treeState array reference

            tree.push({
                key: item.key,
                index: item.index,
                inRepeat: item.inRepeat,
                repeatItemIdValue: item.repeatItemIdValue,
                context: item.context,
                value: item.value,
                element: item.element,
                livePath: $lib.clone({}, item.livePath)
            });

            item.treeState = tree;
            item.treeStatePass = core.renderPass; // valid only for this pass
            return tree;
        }

        restoreContext(treeState)
        {
            let item = this, index = treeState.length, obj;

            item.treeState = treeState;

            while (--index > -1)
            {
                obj = treeState[index];
                item.key = obj.key;
                item.index = obj.index;
                item.inRepeat = obj.inRepeat;
                item.repeatItemIdValue = obj.repeatItemIdValue;
                item.context = obj.context;
                item.value = obj.value;
                item.element = obj.element;
                item.livePath = obj.livePath;
                item = item.parent;
            }
        }

    }

    componyx.bindary_modules.TemplateItem = TemplateItem;
})();

export default {
    TemplateItem: componyx.bindary_modules.TemplateItem
};