/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

componyx.base_modules = componyx.base_modules || {};
componyx.base_modules.NavigationManager = class NavigationManager
{
    #keydownHandler;

    /**
     * Sets focus to the correct items through keyboard navigation.
     *
     * @param {HTMLElement} container - Root DOM element that receives keyboard events.
     * @param {Object} options - Configuration options for navigation behavior.
     * @param {Array<Object>} options.itemList - Root list of items used to build the navigation path structure.
     * @param {boolean} options.horizontalRoot - Indicates whether the root level is laid out horizontally.
     * @param {boolean} options.tabNavigation - Indicates whether items can also be navigated with the tab key.
     * @param {(item:Object)=>HTMLElement} options.getButton - Callback that should return the button element that receives focus.
     * @param {(item:Object)=>boolean} options.isExpandable - Callback that should return true if the item can be expanded.
     * @param {(item:Object)=>boolean} options.isFocusable - Callback that should return true if the item can receive focus.
     * @param {(item:Object)=>HTMLElement} [options.getExpander] - Callback that should return the invoker element that expanded the menu.
     * @param {(item:Object)=>boolean} [options.getCollapseTarget] - Callback that should return the target item to collapse. Falls back to collapsing the parent item when not provided.
     * @param {(item:Object)=>boolean} [options.isExpanded] - Callback that should return true if the item is already expanded.
     * @param {(item:Object)=>void} [options.onExpand] - Callback that should expand the given item.
     * @param {(item:Object)=>void} [options.onCollapse] - Callback that should collapse the given item.
     * @param {()=>void} [options.onCollapse] - Callback that should collapse all items.
     */
    constructor(container, options = {})
    {
        this.container = container;
        this.horizontalRoot = options.horizontalRoot || false;
        this.tabNavigation = options.tabNavigation;
        this.getButton = options.getButton;
        this.isExpandable = options.isExpandable;
        this.isFocusable = options.isFocusable;
        this.getExpander = options.getExpander;
        this.getCollapseTarget = options.getCollapseTarget;
        this.isExpanded = options.isExpanded;
        this.onExpand = options.onExpand;
        this.onCollapse = options.onCollapse;
        this.onCollapseAll = options.onCollapseAll;

        this.moveRootToLeft = false;
        this.expanding = {};
        this.collapsing = {};
        this.focusedPath = $lib.path(options.itemList, 'itemList', null, true).create();
        this.focusedButton = null;
        this.#keydownHandler = this.#keydown.bind(this);
        this.attach();
    }

    /**
     * Attaches keyboard handling and sets initial focus.
     */
    attach()
    {
        this.container.addEventListener('keydown', this.#keydownHandler);
    }

    /**
     * Removes all listeners and clears focus state.
     */
    destroy()
    {
        this.container.removeEventListener('keydown', this.#keydownHandler);
        this.moveRootToLeft = false;
        this.focusedButton = null;
        this.focusedPath = null;
        this.expanding = {};
        this.collapsing = {};
    }

    /**
     * Checks if the item is currently expanding due to keyboard interaction.
     * @param {any} itemId
     * @returns {boolean} True if the item is expanding, false otherwise.
     */
    isExpanding(itemId)
    {
        return Boolean(this.expanding[itemId]);
    }

    /**
     * Checks if the item is currently collapsing due to keyboard interaction.
     * @param {any} itemId
     * @returns {boolean} True if the item is collapsing, false otherwise.
     */
    isCollapsing(itemId)
    {
        return Boolean(this.collapsing[itemId]);
    }

    /**
     * Sets focus on the item, unless the event originated from within its button element.
     * @param {Object} item
     * @param {MouseEvent} event
     * @returns {boolean} A value indicating if the set focus succeeded.
     */
    setFocusFromEvent(item, event)
    {
        const button = this.getButton(item);

        if (button?.contains(event.target))
            return;

        return this.setFocus(item.id);
    }

    /**
     * Sets focus on the specified item.
     * @param {string} itemId The identifier of the item.
     * @returns {boolean} A value indicating if the set focus succeeded.
     */
    setFocus(itemId)
    {
        const itemPath = this.focusedPath?.path(i => i.id === itemId, true);
        return this.#setFocus(itemPath);
    }

    /**
     * Must be called after an expand animation completes.
     * Moves focus to the first focusable child of the expanded item.
     *
     * @param {String} itemId The id of the Expanded item.
     */
    expandComplete(itemId)
    {
        if (!this.isExpanding(itemId))
            return;

        this.expanding[itemId] = false;

        const expandedPath = this.focusedPath?.path(i => i.id === itemId, true);

        if (!expandedPath)
            return;

        const childPath = expandedPath.create().firstChild();
        if (childPath)
            this.#focusFirst(childPath);
    }

    /**
     * Must be called after a collapse animation completes.
     * Moves focus back to the collapsed parent item.
     *
     * @param {String} itemId The id of the collapsed item.
     */
    collapseComplete(itemId)
    {
        if (!this.isCollapsing(itemId))
            return;

        if (!this.collapsing[itemId])
            return;

        this.collapsing[itemId] = false;

        const collapsedPath = this.focusedPath?.path(i => i.id === itemId, true);
        let focused = false;

        if (collapsedPath && this.isFocusable(collapsedPath.item))
        {
            let path = collapsedPath;

            if (this.moveRootToLeft)
                path = this.#resolvePreviousFocusable(path);

            focused = this.#setFocus(path);
            this.moveRootToLeft = false;
        }

        if (!focused)
        {
            const invoker = this.getExpander?.();
            if (invoker)
                invoker.focus();
        }
    }

    /**
     * Sets focus on the active item represented by the given path.
     *
     * @param {componyx.library.Path} path Path pointing to the item to focus.
     * @returns {boolean} A value indicating if the set focus succeeded.
     */
    #setFocus(path)
    {
        if (!path?.item)
            return false;

        this.focusedPath = path;
        const button = this.getButton(path.item);

        if (!button)
            return false;

        if (this.focusedButton?.isConnected)
            this.focusedButton.tabIndex = -1;

        this.focusedButton = button;
        button.tabIndex = 0;
        button.focus({ preventScroll: true });

        return (button.ownerDocument.activeElement === button);
    }

    /**
     * Focuses the first focusable item within the given path scope.
     *
     * @param {componyx.library.Path} path Path whose items are searched.
     */
    #focusFirst(path)
    {
        const target = this.#resolveFirstFocusable(path);
        if (target)
            this.#setFocus(target);
    }

    /**
     * Returns the first focusable item in the given path scope.
     *
     * @param {componyx.library.Path} path Path whose items are searched.
     * @returns {componyx.library.Path|null}
     */
    #resolveFirstFocusable(path)
    {
        let current = path.create().first(),
            startItem = current.item;

        while (!this.isFocusable(current.item))
        {
            if (!current.hasNext())
                return null;

            current.next();

            if (current.item === startItem)
                return null;
        }

        return current;
    }

    /**
     * Returns the last focusable item in the given path scope.
     *
     * @param {componyx.library.Path} path Path whose items are searched.
     * @returns {componyx.library.Path|null}
     */
    #resolveLastFocusable(path)
    {
        let current = path.create().last(),
            startItem = current.item;

        while (!this.isFocusable(current.item))
        {
            if (!current.hasPrevious())
                return null;

            current.previous();

            if (current.item === startItem)
                return null;
        }

        return current;
    }

    /**
     * Returns the next focusable item relative to the given path.
     *
     * @param {componyx.library.Path} path Current focus path.
     * @returns {componyx.library.Path|null}
     */
    #resolveNextFocusable(path)
    {
        const current = path.create(),
            startItem = path.item;

        if (!current.hasNext())
            return this.#resolveFirstFocusable(current);

        current.next();

        while (!this.isFocusable(current.item))
        {
            if (!current.hasNext())
            {
                return this.#resolveFirstFocusable(current.first());
            }
            current.next();

            if (current.item === startItem)
            {
                return null;
            }
        }

        return current;
    }

    /**
     * Returns the previous focusable item relative to the given path.
     *
     * @param {componyx.library.Path} path Current focus path.
     * @returns {componyx.library.Path|null}
     */
    #resolvePreviousFocusable(path)
    {
        const current = path.create(),
            startItem = path.item;

        if (!current.hasPrevious())
            return this.#resolveLastFocusable(current);

        current.previous();

        while (!this.isFocusable(current.item))
        {
            if (!current.hasPrevious())
            {
                return this.#resolveLastFocusable(current.last());
            }
            current.previous();

            if (current.item === startItem)
            {
                return null;
            }
        }

        return current;
    }

    /**
     * Handles keyboard navigation and focus movement.
     *
     * @param {KeyboardEvent} event
     */
    #keydown(event)
    {
        if (event.target.closest('input, textarea, select, [contenteditable]'))
            return;

        if (!this.focusedPath)
            return;

        const key = event.key,
            path = this.focusedPath,
            isRootLevel = !path.hasParent(),
            onHorizontalRoot = isRootLevel && this.horizontalRoot,
            tab = key === 'Tab' && this.tabNavigation;

        let handled = true,
            targetPath = null;

        if ((key === 'ArrowRight' && (!isRootLevel || !this.horizontalRoot)) // enter child level in vertical layouts
            || (key === 'ArrowDown' && onHorizontalRoot))   // enter child level from horizontal root
        {
            if (this.isExpanded?.(path.item))
            {
                const childPath = path.create().firstChild();
                targetPath = this.#resolveFirstFocusable(childPath);
            }
            else if (this.onExpand)
            {
                const canExpand = this.isExpandable?.(path.item);

                if (canExpand)
                {
                    this.expanding[path.item.id] = true;
                    this.onExpand(path.item);
                }
                else if (key === 'ArrowRight' && this.horizontalRoot)
                {
                    // Navigate to the top-most root item first
                    let rootPath = path;
                    while (rootPath.hasParent())
                    {
                        rootPath = rootPath.parent();
                    }
                    this.onCollapseAll?.();
                    targetPath = this.#resolveNextFocusable(rootPath); // get next focusable sibling on root level
                }
            }
        }
        else if (key === 'Escape' || (key === 'ArrowLeft' && !isRootLevel))
        {
            if (this.onCollapse)
            {
                let item = null;

                if (this.getCollapseTarget)
                    item = this.getCollapseTarget(path.item);
                else if (path.hasParent())
                    item = path.parent().item;

                if (item)
                {
                    this.collapsing[item.id] = true;
                    this.onCollapse(item);

                    if (key === 'ArrowLeft' && this.horizontalRoot && item.id !== 'root') // collapsing first level, check if we need to navigate on horizontal root
                    {
                        let itemPath = path.path(i => i.id === item.id, true);

                        if (itemPath?.item && !itemPath.hasParent())
                            this.moveRootToLeft = true;
                    }
                }
            }
        }
        else if ((key === 'ArrowLeft' && onHorizontalRoot) || (key === 'ArrowUp' && !onHorizontalRoot))
        {
            targetPath = this.#resolvePreviousFocusable(path);
        }
        else if (((key === 'ArrowRight' || tab) && onHorizontalRoot) || ((key === 'ArrowDown' || tab) && !onHorizontalRoot))
        {
            targetPath = this.#resolveNextFocusable(path);
        }
        else if (key === 'Home')
        {
            targetPath = this.#resolveFirstFocusable(path);
        }
        else if (key === 'End')
        {
            targetPath = this.#resolveLastFocusable(path);
        }
        else if (key.length === 1 && !/\s/.test(key))
        {
            const items = path.hasParent() ? path.parent().create().children : path.items,
                startIndex = items.findIndex(item => item.id === path.item.id),
                length = items.length,
                lowerKey = key.toLowerCase();

            for (let index = startIndex + 1; index < startIndex + length + 1; index++)
            {
                let item = items[index % length];
                if (this.isFocusable(item) && item.text?.[0]?.toLowerCase() === lowerKey)
                {
                    targetPath = path.path(i => i.id === item.id, true);
                    break;
                }
            }
        }
        else
        {
            handled = false;
        }

        if (targetPath)
            this.#setFocus(targetPath);

        if (handled)
        {
            event.preventDefault();
            event.stopPropagation();
        }
    }
};

export default componyx.base_modules.NavigationManager;
