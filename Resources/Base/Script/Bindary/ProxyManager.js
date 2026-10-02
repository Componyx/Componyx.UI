/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

await (async function ()
{
    await import(`${$UI.getScriptResourcePath('Base.Bindary.Core')}`);
    const core = componyx.bindary_modules.core;

    /**
    * @namespace proxyManager
    * @protected
    */
    const proxyManager = componyx.bindary_modules.proxyManager =
    {
        /**
        * WeakMap mapping the original value to a Map of dataKey->proxy.
        * @type {WeakMap<Object, Map<string, Object>>}
        * @protected
        */
        proxyMap: new WeakMap(),

        /**    
        * WeakMap mapping proxy objects to a Set of dataKey paths.
        * @type {WeakMap<Object, Set<string>>}
        * @protected
        */
        proxyDataKeys: new WeakMap(),

        /**    
        * Symbol to store the original target value on a proxy.
        * @type {Symbol}
        * @protected
        */
        targetSymbol: Symbol('target'),

        /**    
        * Determines if the given object is a proxy managed by proxyManager.
        * @param {Object} proxy - The object to test.
        * @returns {boolean} True if the object is a proxy, false otherwise.
        */
        isProxy(proxy)
        {
            return !!(proxy && proxy[proxyManager.targetSymbol]);
        },

        /** 
         * Gets the original target object behind a proxy.
         * @param {Object} proxy - The proxy object.
         * @returns {Object|null} The underlying target object, or null if none.
         */
        getTarget(proxy)
        {
            return proxy ? proxy[proxyManager.targetSymbol] : null;
        },

        /**
        * @protected
        * Handles invoking data change events for a target and its additional dataKey paths.
        *
        * @param {Object} target - The parent object on which data changed.
        * @param {Object} value - The new value (may be a proxy). When item is deleted, this value is undefined.
        * @param {Object} oldValue - The old value (may be a proxy).
        * @param {string} dataKey - The primary data key for the change.
        * @param {Object} data - Additional data (e.g. keys info).
        * @param {Object} settings - Settings for the change event.
        * @param {string[]} additionalDataKeys - Extra dataKey paths to trigger change events for based on the target, which may be added to if the value is a proxy with associated dataKeys.
        */
        handleDataChange(target, value, oldValue, dataKey, data, settings, additionalDataKeys = [])
        {
            let checkValue = (value === undefined && data && data.removeCount) ? oldValue : value;

            if (checkValue && proxyManager.isProxy(checkValue))  // check if there are additional dataKeys associated with the proxy.
            {
                let dataKeysSet = proxyManager.proxyDataKeys.get(checkValue) || new Set(),
                    dataKeys = Array.from(dataKeysSet);

                additionalDataKeys.push(...dataKeys.filter(k => k !== dataKey && !additionalDataKeys.includes(k))); // filter out the current dataKey and any extraDataKeys to avoid duplicates
            }

            proxyManager.setDataChange(dataKey, data, target, value, oldValue, additionalDataKeys, settings);
        },

        /**
        * @protected
         * Fires a data change event for the given binding path.
         *
         * @param {string} dataKey - The primary data key.
         * @param {Object} data - Additional change data.
         * @param {Object} target - The parent object where the change occurred.
         * @param {Object} value - The new value that was set or undefined if the object key was removed.
         * @param {Object} oldValue - The old value.
         * @param {string[]} additionalDataKeys - Additional dataKey paths to update.
         * @param {Object} [settings={}] - Settings for the data change (e.g., event).
         */
        setDataChange(dataKey, data, target, value, oldValue, additionalDataKeys, settings = {})
        {
            if (!dataKey)
                return;

            let viewTree = settings.viewTree,
                event = (typeof settings.createEvent === 'function') ? settings.createEvent() : settings.event,
                containerKey = dataKey.split('.').slice(0, -1).join('.'),
                targetProxy = proxyManager.proxyMap.get(target)?.get(containerKey);

            if (viewTree)
            {
                $lib.each(settings.treeState, (state, index) =>
                {
                    viewTree[index].restoreContext(state);
                });
            }

            if (event)
            {
                let element = settings.element || document,
                    detail = event.detail;

                if (detail)
                {
                    Object.assign(detail, {
                        dataKey,
                        additionalDataKeys,
                        target,
                        targetProxy,
                        eventPayload: settings.eventPayload,
                        data,
                        value,
                        oldValue
                    });
                }

                let canceled = !element.dispatchEvent(event);
                if (canceled)
                {
                    core.observed = true; // event is deliberately canceled, so set observed to true, otherwise it will still trigger a data change in the dataBind event handler
                    return true;
                }

                if (detail.viewTree)
                    viewTree = detail.viewTree;
            }

            if (data && $lib.isArray(target)) // for an array the data will hold the info about the key/index
            {
                let k = dataKey.split('.');
                k.pop();
                dataKey = k.join('.');
            }

            core.observed = true;
            $bindary.dataChange(dataKey, null, data, false);

            if (additionalDataKeys.length > 0)
            {
                additionalDataKeys.forEach(dataKey => $bindary.dataChange(dataKey, null, data, false));
            }

            if (core.autoUpdateView && $bindary.autoUpdateView)
            {
                $bindary.updateViewDelayed(false, null, viewTree);
            }
        },

        /**
        * @protected
        * Composes a data key string by appending a property name to an existing data key.
        * @param {string} dataKey - The base data key.
        * @param {string} name - The property name to append.
        * @param {boolean} isArray - True if the parent is an array.
        * @returns {string|undefined} The composed data key, or undefined for invalid array names.
        */
        getKey(dataKey, name, isArray)
        {
            if (isArray && window.isNaN(name))
                return;

            return $lib.format('{0}{1}{2}', dataKey || '', dataKey ? '.' : '', name || '');
        },

        /**
        * @protected
        * Creates a proxy for the given value (if valid) based on the provided dataKey.
        * If reuseProxy is enabled (default) and a proxy already exists for this value, it reuses it and adds the new dataKey path.
        * @param {Object} value - The value to proxy.
        * @param {string} dataKey - The binding path for the value.
        * @param {Object} settings - Settings to apply to the proxy.
        * @returns {Object} The proxy object representing the value.
        */
        createProxy(value, dataKey, settings)
        {
            if (!proxyManager.isValidProxyObject(value))
                return value;

            if (value[proxyManager.targetSymbol])
                value = value[proxyManager.targetSymbol];

            let entry = proxyManager.proxyMap.get(value),
                storageKey = (settings?.reuseProxy === false) ? ('!' + dataKey) : dataKey; // use unique key to store non-reusable proxy in case a proxy already exists for the data-key

            if (!entry)
            {
                entry = new Map();
                proxyManager.proxyMap.set(value, entry);
            }
            else if (entry.size > 0 && settings?.reuseProxy !== false)
            {
                let proxy = entry.values().next().value,
                    paths = proxyManager.proxyDataKeys.get(proxy);

                if (!paths)
                {
                    paths = new Set();
                    proxyManager.proxyDataKeys.set(proxy, paths);
                }
                paths.add(dataKey);

                return proxy;

            }
            else if (entry.has(storageKey))
            {
                return entry.get(storageKey);
            }

            let handler = Object.create(proxyManager.proxyHandler),
                proxy = (handler.proxy = new Proxy(value, handler));

            handler.settings = settings;
            handler.dataKey = dataKey;
            proxy[proxyManager.targetSymbol] = value;

            entry.set(storageKey, proxy);
            proxyManager.proxyDataKeys.set(proxy, new Set([dataKey]));
            return proxy;
        },

        /**
        * @protected
        * Checks whether the provided object is valid for proxying (i.e., a plain object or array).
        * @param {Object} obj - The object to check.
        * @returns {boolean} True if the object is valid for proxying, false otherwise.
        */
        isValidProxyObject(obj)
        {
            return obj != null && ($lib.isPlainObject(obj) || $lib.isArray(obj));
        },

        /**
        * @protected
        * The proxy handler that defines traps for get, set, defineProperty, and deleteProperty.
        * @type {Object}
        */
        proxyHandler: {
            /**        
            * @protected
            * The proxy instance managed by this handler.
            * @type {Object}
            */
            proxy: null,

            /**        
            * @protected
            * The current dataKey for this proxy context.
            * @type {string}
            */
            dataKey: null,

            /**        
            * @protected
            * The settings passed to this proxy.
            * @type {Object}
            */
            settings: null,

            /**        
            * Trap for property access.
            * @param {Object} target - The original target object.
            * @param {string|symbol} key - The property key being accessed.
            * @returns {*} The value of the property, potentially proxied.
            * @protected
            */
            get(target, key)
            {
                if (typeof key === 'symbol')
                    return target[key];

                if (key === 'prototype')
                    return Object.getPrototypeOf(target);

                if (key in target)
                {
                    let dataKey = proxyManager.getKey(this.dataKey, key),
                        obj = target[key],
                        f = 'function';

                    if (proxyManager.isValidProxyObject(obj))
                    {
                        const proxy = proxyManager.createProxy(obj, dataKey, this.settings),
                            parentPaths = proxyManager.proxyDataKeys.get(this.proxy);

                        if (parentPaths && parentPaths.size > 1)
                        {
                            const childPaths = proxyManager.proxyDataKeys.get(proxy);
                            if (childPaths)
                            {
                                // Circular reference check: if any childPath is a prefix of any parentPath, the object we just accessed is already an ancestor in the chain → skip propagation.
                                // e.g. childPath='form.fieldSets.0', parentPath='form.fieldSets.0.fields.0', 'form.fieldSets.0.fields.0'.startsWith('form.fieldSets.0.') → true → circular
                                const isCircular = Array.from(childPaths).some(childPath =>
                                    Array.from(parentPaths).some(parentPath =>
                                        parentPath.startsWith(childPath + '.')
                                    )
                                );

                                if (!isCircular)
                                {
                                    // Safely propagate alternate parent paths down to this child proxy. Only runs when the parent has more than one known path (i.e. an alias exists).
                                    parentPaths.forEach(parentPath =>
                                    {
                                        if (parentPath !== this.dataKey)
                                        {
                                            const altPath = proxyManager.getKey(parentPath, key);
                                            if (altPath) childPaths.add(altPath);
                                        }
                                    });
                                }
                            }
                        }

                        if (Reflect.set(target, key, proxy))
                        {
                            return proxy;  // Successfully set
                        }
                        else
                        {
                            return obj;  // Read-only, return original
                        }
                    }
                    else if (!$lib.isArray(target) && typeof obj == f && typeof target != f && !(obj.prototype && obj.prototype.constructor === obj))
                    {
                        return obj.bind(target);
                    }
                    else
                    {
                        return obj;
                    }
                }
                return undefined;
            },

            /**
            * Trap for property assignment.
            * @param {Object} target - The original target object.
            * @param {string|symbol} key - The property key being set.
            * @param {*} value - The new value.
            * @returns {boolean} True if the property was set successfully.
            * @protected
            */
            set(target, key, value)
            {
                let isArray = $lib.isArray(target),
                    dataKey = (typeof key !== 'symbol') ? proxyManager.getKey(this.dataKey, key, isArray) : undefined,
                    oldValue = target[key],
                    hadValue = Object.prototype.hasOwnProperty.call(target, key),
                    change = target[key] !== value,
                    trackChange = ((!core.busy || $bindary.observeDuringRender) && core.observing),
                    settings = this.settings;

                if (typeof key === 'symbol')
                {
                    return Reflect.set(target, key, value);
                }

                // Evict the stale dataKey from the old value's path set before overwriting
                if (hadValue && change && dataKey && proxyManager.isProxy(oldValue))
                {
                    let paths = proxyManager.proxyDataKeys.get(oldValue);
                    if (paths)
                    {
                        paths.delete(dataKey);
                        if (paths.size === 0)
                            proxyManager.proxyDataKeys.delete(oldValue);
                    }
                }

                value = proxyManager.createProxy(value, dataKey, settings);
                const success = Reflect.set(target, key, value);

                if (success && dataKey && trackChange && change)
                {
                    let allDataKeys = Array.from(proxyManager.proxyDataKeys.get(this.proxy) || [this.dataKey]),
                        targetExtraDataKeys = allDataKeys
                            .filter(dk => dk !== this.dataKey)
                            .map(dk => proxyManager.getKey(dk, key, isArray))
                            .filter(Boolean);

                    proxyManager.handleDataChange(
                        target,
                        value,
                        oldValue,
                        dataKey,
                        isArray ? { keys: [key], hadValue } : { hadValue },
                        settings,
                        targetExtraDataKeys
                    );
                }

                return success;
            },

            /**
            * Trap for defining a property.
            * @param {Object} target - The original target object.
            * @param {string|symbol} key - The property key.
            * @param {PropertyDescriptor} descriptor - The property descriptor.
            * @returns {boolean} True if the property was defined successfully.
            * @protected
            */
            defineProperty(target, key, descriptor)
            {
                if (descriptor && descriptor.value !== undefined)
                {
                    this.set(target, key, descriptor.value);
                }
                return Reflect.defineProperty(target, key, descriptor);
            },

            /**
            * Trap for deleting a property.
            * @param {Object} target - The original target object.
            * @param {string|symbol} key - The property key to delete.
            * @returns {boolean} True if the property was deleted successfully.
            * @protected
            */
            deleteProperty(target, key)
            {
                let settings = this.settings;

                if (key in target)
                {
                    let value = target[key],
                        isArray = $lib.isArray(target),
                        data = isArray ? { removeIndex: parseInt(key), removeCount: 1 } : { removeCount: 1 },
                        dataKey = (typeof key !== 'symbol') ? proxyManager.getKey(this.dataKey, key, isArray) : undefined,
                        trackChange = ((!core.busy || $bindary.observeDuringRender) && core.observing);

                    const success = Reflect.deleteProperty(target, key);

                    if (typeof key === 'symbol')
                        return success;

                    // Evict the stale dataKey from the removed value's path set
                    if (success && dataKey && proxyManager.isProxy(value))
                    {
                        let paths = proxyManager.proxyDataKeys.get(value);
                        if (paths)
                        {
                            paths.delete(dataKey);
                            if (paths.size === 0)
                                proxyManager.proxyDataKeys.delete(value);
                        }
                    }

                    if (success && dataKey && trackChange)
                    {
                        let allDataKeys = Array.from(proxyManager.proxyDataKeys.get(this.proxy) || [this.dataKey]),
                            targetExtraDataKeys = allDataKeys
                                .filter(dk => dk !== this.dataKey)
                                .map(dk => proxyManager.getKey(dk, key, isArray))
                                .filter(Boolean);

                        proxyManager.handleDataChange(target, undefined, value, dataKey, data, settings, targetExtraDataKeys);
                    }

                    return success;
                }
                return true;
            }
        }
    }
})();

export default componyx.bindary_modules.proxyManager;
