/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

await (async function ()
{
    await import(`${$UI.getScriptResourcePath('Base.Bindary.Core')}`);
    const core = componyx.bindary_modules.core;

    const dataUpdater = componyx.bindary_modules.dataUpdater =
    {
        initUpdateRules(rules, orgRules)
        {
            rules = (rules) ? ($lib.isArray(rules)) ? rules : [rules] : [{}];

            if (orgRules && !$lib.isEmpty(orgRules[0]))
                rules = orgRules.concat(rules);

            return rules;
        },

        update(dataMsg, mustUpdateView) 
        {
            if (dataMsg)
            {
                if (core.fireEvent('preDataUpdate', [dataMsg]) === false) return;

                let update = dataUpdater.updateData.bind(dataUpdater, dataMsg);

                core.autoUpdateView = false;

                // data update
                if (core.dataLocks['#'])
                {
                    core.dataLocks['#'].push(update); // store in cache to postpone data-update until unlock is called
                }
                else
                {
                    update();
                    core.fireEvent('postDataUpdate');
                }

                core.autoUpdateView = true;

                // detect error and fire possible callbacks
                if (!dataUpdater.advance(dataMsg))
                {
                    if (core.routeCallbackId)
                        core.postRender(); // load route cancelled, but call postRender for possible event listeners

                    return;
                }
            }

            if (mustUpdateView !== false) $bindary.updateView(false);
        },

        advance(dataMsg)
        {
            let advance = true, callbackResult, msg;

            if (!$lib.isArray(dataMsg)) dataMsg = [dataMsg];

            for (let index = 0; index < dataMsg.length; ++index)
            {
                msg = dataMsg[index];

                if (msg.isError)
                {
                    if (core.fireEvent('dataError', [msg]) === false)
                        advance = false;

                    core.clearPendingUpdate();
                }

                if (msg.callbackId && msg.callbackId !== core.routeCallbackId)
                {
                    if (core.callbacks[msg.callbackId])
                    {
                        callbackResult = core.callbacks[msg.callbackId](msg);
                        delete core.callbacks[msg.callbackId];

                        if (callbackResult === false) advance = false;
                    } else advance = false; // callback does not exist anymore
                }
            }

            if (core.dataLocks['#']) advance = false;

            return advance;
        },

        updateData(dataMsg)
        {
            if (!$lib.isArray(dataMsg)) dataMsg = [dataMsg];

            for (let index = 0; index < dataMsg.length; ++index)
            {
                let data = dataMsg[index].data;

                if (data)
                {
                    dataUpdater.prepareContainer(core.dataLabel[0], data);

                    if ($lib.isEmpty(dataMsg[index].routeIndex) || dataMsg[index].routeIndex === $bindary.routeIndex)
                    {
                        dataUpdater.prepareContainer(core.dataLabel[1], data);
                        core.cache.routeData[$bindary.routeIndex] = $bindary.routeData;
                    }

                    if ($lib.isEmpty(dataMsg[index].routePath) || dataMsg[index].routePath === $bindary.routePath)
                    {
                        dataUpdater.prepareContainer(core.dataLabel[2], data);
                        core.cache.viewData[$bindary.routePath] = $bindary.viewData;
                    }
                }
            }
        },

        prepareContainer(name, data)
        {
            let container = data[name];
            if (!container) return;

            let update = dataUpdater.updateContainer.bind(dataUpdater, name, container, data[name + 'Rules']);

            if (core.dataLocks[name])
            {
                core.dataLocks[name].push(update);
            }
            else
            {
                update();
            }
        },

        updateContainer(name, sourceContainer, rulesContainer)
        {
            let target, source, rules, path, curTargetContainer, update,
                targetContainer = $bindary[name];

            for (let key in sourceContainer)
            {
                curTargetContainer = targetContainer;
                source = sourceContainer[key];
                rules = rulesContainer ? rulesContainer[key] : null;
                path = rules ? rules.path : null;

                if (rules)
                {
                    if (!$lib.isEmpty(rules.routePath) && name === core.dataLabel[2])
                    {
                        curTargetContainer = core.cache.viewData[rules.routePath];
                    }
                    else if (!$lib.isEmpty(rules.routeIndex) && name === core.dataLabel[1])
                    {
                        curTargetContainer = core.cache.routeData[rules.routeIndex];
                    }
                }

                target = path ? dataUpdater.getTargetModel(path, curTargetContainer) : { key, obj: curTargetContainer };
                path = name + core.dksc + (path || key);

                update = dataUpdater.updateModel.bind(dataUpdater, target.key, target.obj, source, rules, path);

                if (core.dataLocks[path])
                {
                    core.dataLocks[path].push(update);
                }
                else
                {
                    update();
                }
            }
        },

        updateModel(key, target, source, rules, path)
        {
            let isArray = $lib.isArray(source),
                defaultUpdateRule = $bindary.defaultUpdateRule;

            core.observed = false;

            if (!(source == null && rules && rules.ignoreNullValues))
            {
                if (!rules)
                    rules = { update: defaultUpdateRule };
                else if ($lib.isEmpty(rules.update))
                    rules.update = defaultUpdateRule;

                const equalityCheck = (rules && typeof rules.equalityCheck === 'boolean') ? rules.equalityCheck : $bindary.equalityCheck;

                if (equalityCheck && dataUpdater.deepEqual(target[key], source))
                    return;

                if ($lib.isEmpty(target[key]) || rules.update === false || !(isArray || $lib.isPlainObject(source)))
                {
                    target[key] = source;
                }
                else if (isArray)
                {
                    dataUpdater.updateArray(target[key], source, rules);
                }
                else
                {
                    $lib.clone(target[key], source, true, true, true, null, null, null, rules.omitKeys);
                }

                if (!core.observed)
                    dataUpdater.dataChange(path, rules, isArray);
            }
        },

        deepEqual(a, b, seen = new WeakMap())
        {
            if (a === b) return true;

            if (a instanceof Date && b instanceof Date)
                return a.getTime() === b.getTime();

            if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null)
                return false;

            if (seen.has(a))
            {
                if (seen.get(a).has(b))
                {
                    return true; // already compared these objects
                }
            }
            else
            {
                seen.set(a, new WeakSet());
            }
            seen.get(a).add(b);

            let keysA = Object.keys(a);
            let keysB = Object.keys(b);

            if (keysA.length !== keysB.length) return false;

            for (let key of keysA)
            {
                if (!keysB.includes(key)) return false;
                if (!dataUpdater.deepEqual(a[key], b[key], seen)) return false;
            }

            return true;
        },

        getTargetModel(path, target)
        {
            let pathKey, index;

            while (path)
            {
                index = path.indexOf(core.dksc);
                pathKey = index > -1 ? path.substr(0, index) : path;

                if (index > -1)
                {
                    target = target[pathKey] = target[pathKey] || {};
                    path = index > -1 ? path.substr(index + core.dksc.length) : null;
                } else
                {
                    path = null;
                }
            }

            return { key: pathKey, obj: target };
        },

        dataChange(path, rules, isArray) 
        {
            if (!core.dataChanges[path]) core.dataChanges[path] = [];
            if (rules && isArray) core.dataChanges[path].push(rules);
        },

        updateArray(target, source, rules)
        {
            // the rules are required for updating repeat-elements within the view
            // removeIndex, addIndex and addCount must be updated in the rules because an array can be updated multiple times (same target, different source array)

            if (!rules)
                rules = {};

            if ($lib.isEmpty(rules.removeIndex) && rules.removeCount > 0)
                rules.removeIndex = target.length - rules.removeCount; // set correct index when removeCount is specified

            if (rules.removeCount > 0)
                target.splice(rules.removeIndex, rules.removeCount);

            if ($lib.isEmpty(rules.addCount))
                rules.addCount = 0;

            if (rules.updateKey)
            {
                let updateKey = rules.updateKey,
                    add = [];

                rules.keys = [];

                if (rules.removeByKeyValues)
                {
                    $lib.each(rules.removeByKeyValues, function (value)
                    {
                        let index = $lib.indexOf(target, function (i) { return (i[updateKey] == value); })

                        if (index > -1)
                        {
                            rules.keys.push(index.toString());
                            target.splice(index, 1);
                        }
                    });
                }

                $lib.each(source, function (srcItem)
                {
                    let index = $lib.indexOf(target, function (i) { return (i[updateKey] === srcItem[updateKey]); })

                    if (index > -1)
                    {
                        rules.keys.push(index.toString());
                        target[index] = srcItem;
                    }
                    else
                        add.push(srcItem);
                });

                if (add.length)
                    dataUpdater.extendTargetArray(target, add, rules);
            }
            else
                dataUpdater.extendTargetArray(target, source, rules);
        },

        extendTargetArray(target, source, rules)
        {
            rules.addCount = source.length;

            if (rules.addCount > 0 && $lib.isEmpty(rules.addIndex))
                target.push.apply(target, source);
            else if (rules.addCount > 0)
                target.splice.apply(target, [rules.addIndex, 0].concat(source));

            if ($lib.isEmpty(rules.addIndex) && rules.addCount > 0)
                rules.addIndex = target.length - rules.addCount;
        }
    }
})();

export default componyx.bindary_modules.dataUpdater;

