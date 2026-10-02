declare namespace componyx 
{
    namespace library 
    {
        /**
         * @property enable - <p>Enables the functionality.</p>
         * @property disable - <p>Disables the functionality.</p>
         */
        type Toggle = {
            enable: (...params: any[]) => any;
            disable: (...params: any[]) => any;
        };
        /**
         * @property width - <p>The width value.</p>
         * @property height - <p>The height value.</p>
         */
        type Dimensions = {
            width: number;
            height: number;
        };
        /**
         * @property borderTop - <p>The width of the top border.</p>
         * @property borderRight - <p>The width of the right border.</p>
         * @property borderBottom - <p>The width of the bottom border.</p>
         * @property borderLeft - <p>The width of the left border.</p>
         */
        type BorderSizes = {
            borderTop: number;
            borderRight: number;
            borderBottom: number;
            borderLeft: number;
        };
        /**
         * @property paddingTop - <p>The width of the top padding.</p>
         * @property paddingRight - <p>The width of the right padding.</p>
         * @property paddingBottom - <p>The width of the bottom padding.</p>
         * @property paddingLeft - <p>The width of the left padding.</p>
         */
        type PaddingSizes = {
            paddingTop: number;
            paddingRight: number;
            paddingBottom: number;
            paddingLeft: number;
        };
        /**
         * @property width - <p>Total padding and border width.</p>
         * @property height - <p>Total padding and border height.</p>
         * @property borderTop - <p>The width of the top border.</p>
         * @property borderRight - <p>The width of the right border.</p>
         * @property borderBottom - <p>The width of the bottom border.</p>
         * @property borderLeft - <p>The width of the left border.</p>
         * @property paddingTop - <p>The width of the top padding.</p>
         * @property paddingRight - <p>The width of the right padding.</p>
         * @property paddingBottom - <p>The width of the bottom padding.</p>
         * @property paddingLeft - <p>The width of the left padding.</p>
         */
        type BorderPaddingSizes = {
            width: number;
            height: number;
            borderTop: number;
            borderRight: number;
            borderBottom: number;
            borderLeft: number;
            paddingTop: number;
            paddingRight: number;
            paddingBottom: number;
            paddingLeft: number;
        };
        /**
         * @property top - <p>The width of the top margin.</p>
         * @property right - <p>The width of the right margin.</p>
         * @property bottom - <p>The width of the bottom margin.</p>
         * @property left - <p>The width of the left margin.</p>
         * @property width - <p>The width of the left and right margin.</p>
         * @property height - <p>The width of the top and bottom margin.</p>
         */
        type MarginSizes = {
            top: number;
            right: number;
            bottom: number;
            left: number;
            width: number;
            height: number;
        };
        /**
         * @property top - <p>The top position.</p>
         * @property right - <p>The right position.</p>
         * @property bottom - <p>The bottom position.</p>
         * @property left - <p>The left position.</p>
         */
        type Position = {
            top: number;
            right: number;
            bottom: number;
            left: number;
        };
        /**
         * @property scrollTop - <p>The scroll top value.</p>
         * @property scrollLeft - <p>The scroll left value.</p>
         */
        type ScrollPos = {
            scrollTop: number;
            scrollLeft: number;
        };
        /**
         * @property dragHandle - <p>The handle which activates dragging.</p>
         * @property dragGhost - <p>Visible element when dragging.</p>
         * @property boundaryZone - <p>Defines the drag boundaries.</p>
         * @property dropZones - <p>A static array of drop zone elements or a function that returns a list of drop zone elements where the draggable element is allowed to be dropped.</p>
         * @property dropAcceptMode - <p>Defines how much overlap is required to accept the dropping.</p>
         * <ul>
         * <li>0: full</li>
         * <li>1: half</li>
         * <li>2: touch</li>
         * </ul>
         * @property ghostOnly - <p>Defines that only the ghost element must be visible when dragging.</p>
         * @property autoGhostSize - <p>A value indicating if the element size should be applied to the ghost element.</p>
         * @property allowDropOutZone - <p>A value indicating if the draggable element can be dropped outside of a drop zone.</p>
         * @property moveOriginal - <p>A value indicating if the original element is moved when a drag ghost is used and the drag operation ends.</p>
         * @property dragX - <p>A value indicating if horizontal dragging is allowed.</p>
         * @property dragY - <p>A value indicating if vertical dragging is allowed.</p>
         * @property scrollX - <p>A value indicating if the drag element activates horizontal scrolling on the boundary zone when the drag element hits the left or right of the boundary zone.</p>
         * @property scrollY - <p>A value indicating if the drag element activates vertical scrolling on the boundary zone when the drag element hits the top or bottom of the boundary zone.</p>
         * @property minDragX - <p>Minimum change in pixels before the horizontal dragging starts.</p>
         * @property minDragY - <p>Minimum change in pixels before the vertcial dragging starts.</p>
         * @property tickX - <p>Horizontal tick size.</p>
         * @property tickY - <p>Vertical tick size.</p>
         * @property boundaryOvershootLeft - <p>Defines how many extra pixels the boundary zone may be exceeded (or limited) on the left side.</p>
         * @property boundaryOvershootRight - <p>Defines how many extra pixels the boundary zone may be exceeded (or limited) on the right side.</p>
         * @property boundaryOvershootTop - <p>Defines how many extra pixels the boundary zone may be exceeded (or limited) on the top side.</p>
         * @property boundaryOvershootBottom - <p>Defines how many extra pixels the boundary zone may be exceeded (or limited) on the bottom side.</p>
         * @property ignoreBoundaryBorders - <p>Defines a value indicating if the borders of the boundary zone are ignored in the boundary calculations.</p>
         * @property ignoreMargins - <p>Defines a value indicating if drag element margins are ignored in the boundary calculations.</p>
         * @property dragClass - <p>CSS class applied to the element when dragging.</p>
         * @property droppableClass - <p>CSS class applied to the element and dropzone when the element is droppable.</p>
         * @property dropClass - <p>CSS class applied to the element and dropzone when the element is dropped.</p>
         * @property cancelDrag - <p>A value indicating if the the drag operation is canceled before it starts. If needed, set this value in the onDragStart event.</p>
         * @property onDragStart - <p>Event callback method.</p>
         * @property onDrag - <p>Event callback method.</p>
         * @property onDragEnd - <p>Event callback method.</p>
         * @property onDroppableEnter - <p>Event callback method.</p>
         * @property onDroppable - <p>Event callback method.</p>
         * @property onDroppableLeave - <p>Event callback method.</p>
         * @property onDrop - <p>Event callback method.</p>
         */
        type DraggableSettings = {
            dragHandle: HTMLElement;
            dragGhost: HTMLElement;
            boundaryZone: HTMLElement;
            dropZones: HTMLElement[] | ((...params: any[]) => any);
            dropAcceptMode: number | string;
            ghostOnly: boolean;
            autoGhostSize: boolean;
            allowDropOutZone: boolean;
            moveOriginal: boolean;
            dragX: boolean;
            dragY: boolean;
            scrollX: boolean;
            scrollY: boolean;
            minDragX: number;
            minDragY: number;
            tickX: number;
            tickY: number;
            boundaryOvershootLeft: number;
            boundaryOvershootRight: number;
            boundaryOvershootTop: number;
            boundaryOvershootBottom: number;
            ignoreBoundaryBorders: boolean;
            ignoreMargins: boolean;
            dragClass: string;
            droppableClass: string;
            dropClass: string;
            cancelDrag: boolean;
            onDragStart: (...params: any[]) => any;
            onDrag: (...params: any[]) => any;
            onDragEnd: (...params: any[]) => any;
            onDroppableEnter: (...params: any[]) => any;
            onDroppable: (...params: any[]) => any;
            onDroppableLeave: (...params: any[]) => any;
            onDrop: (...params: any[]) => any;
        };
        /**
         * @property element - <p>The specified HTMLElement.</p>
         * @property settings - <p>The specified settings.</p>
         * @property disabled - <p>A value indicating if the draggable functionality is disabled.</p>
         * @property enable - <p>Enables the specified element to be draggable.</p>
         * @property disable - <p>Disables the specified element to be draggable.</p>
         * @property startDrag - <p>Starts the dragging.</p>
         * @property endDrag - <p>Ends the dragging.</p>
         */
        type DraggableController = {
            element: HTMLElement;
            settings: any;
            disabled: boolean;
            enable: (...params: any[]) => any;
            disable: (...params: any[]) => any;
            startDrag: (...params: any[]) => any;
            endDrag: (...params: any[]) => any;
        };
        /**
         * @property resizeHandles - <p>Resize handle object (key, value).</p>
         * <ul>
         * <li>key: resize direction s, e or se.</li>
         * <li>value: HTMLElement.</li>
         * </ul>
         * @property resizeGhost - <p>Visible element when resizing.</p>
         * @property boundaryZone - <p>Defines the resize boundaries.</p>
         * @property defaultHandles - <p>Defines if default resize handles are applied.</p>
         * @property ghostOnly - <p>Defines that only the ghost element must be visible when resizing.</p>
         * @property minResizeX - <p>Minimum change in pixels before the horizontal resizing starts.</p>
         * @property minResizeY - <p>Minimum change in pixels before the vertcial resizing starts.</p>
         * @property tickX - <p>Horizontal tick size.</p>
         * @property tickY - <p>Vertical tick size.</p>
         * @property resizeClass - <p>CSS class applied to the element when resizing.</p>
         * @property onResizeStart - <p>Event callback method.</p>
         * @property onResize - <p>Event callback method.</p>
         * @property onResizeEnd - <p>Event callback method.</p>
         */
        type ResizableSettings = {
            resizeHandles: any;
            resizeGhost: HTMLElement;
            boundaryZone: HTMLElement;
            defaultHandles: boolean;
            ghostOnly: boolean;
            minResizeX: number;
            minResizeY: number;
            tickX: number;
            tickY: number;
            resizeClass: string;
            onResizeStart: (...params: any[]) => any;
            onResize: (...params: any[]) => any;
            onResizeEnd: (...params: any[]) => any;
        };
        /**
         * @property element - <p>The specified HTMLElement.</p>
         * @property settings - <p>The specified</p>
         * @property disabled - <p>A value indicating if the resizable functionality is disabled.</p>
         * @property enable - <p>Enables the specified element to be resizable.</p>
         * @property disable - <p>Disables the specified element to be resizable.</p>
         */
        type ResizableController = {
            element: HTMLElement;
            settings: any;
            disabled: boolean;
            enable: (...params: any[]) => any;
            disable: (...params: any[]) => any;
        };
        /**
         * @property dragZone - <p>Defines the zone from where a drag select can be started.</p>
         * @property selectZone - <p>Defines the zone with selectable elements.</p>
         * @property include - <p>Elements to include (by default all child elements of the selectZone are included).</p>
         * @property exclude - <p>Elements to exclude. Setting is ignored if elements are explicitly specified with the include setting.</p>
         * @property includeTags - <p>Space separated list of tags to include. Setting is ignored if elements are explicitly specified with the include setting.</p>
         * @property excludeTags - <p>Space separated list of tags to exclude. Setting is ignored if elements are explicitly specified with the include setting.</p>
         * @property liveUpdate - <p>When set to true the onSelect event is fired while dragging otherwise the event is fired when the drag selection ends.</p>
         * @property clearOnOutsideClick - <p>Indicates if the selection should be cleared on a click outside the dragZone.</p>
         * @property toggleDragSelect - <p>Deselects the selected element(s) on a drag select.</p>
         * @property toggleClickSelect - <p>Deselects the selected element(s) on a click select.</p>
         * @property appendDragSelect - <p>Appends the current selection on a drag select.</p>
         * @property appendClickSelect - <p>Appends the current selection on a click select.</p>
         * @property shiftSelect - <p>Defines if shift key selection is enabled.</p>
         * @property ctrlSelect - <p>Defines if ctrl key selection is enabled.</p>
         * @property scrollOffsetX - <p>Defines the horizontal scroll offset within the dragZone.</p>
         * @property scrollOffsetY - <p>Defines the vertical scroll offset within the dragZone.</p>
         * @property selectMode - <ul>
         * <li>0: drag_click</li>
         * <li>1: drag</li>
         * <li>2: click</li>
         * </ul>
         * @property dragSelectionClass - <p>CSS class of the drag selection.</p>
         * @property selectedClass - <p>CSS class applied to the element when selected.</p>
         * @property onDragStart - <p>Event callback method.</p>
         * @property onDrag - <p>Event callback method.</p>
         * @property onDragEnd - <p>Event callback method.</p>
         * @property onSelect - <p>Event callback method.</p>
         */
        type SelectableSettings = {
            dragZone: HTMLElement;
            selectZone: HTMLElement;
            include: HTMLElement[];
            exclude: HTMLElement[];
            includeTags: string;
            excludeTags: string;
            liveUpdate: boolean;
            clearOnOutsideClick: boolean;
            toggleDragSelect: boolean;
            toggleClickSelect: boolean;
            appendDragSelect: boolean;
            appendClickSelect: boolean;
            shiftSelect: boolean;
            ctrlSelect: boolean;
            scrollOffsetX: number;
            scrollOffsetY: number;
            selectMode: number | string;
            dragSelectionClass: string;
            selectedClass: string;
            onDragStart: (...params: any[]) => any;
            onDrag: (...params: any[]) => any;
            onDragEnd: (...params: any[]) => any;
            onSelect: (...params: any[]) => any;
        };
        /**
         * @property element - <p>The specified HTMLElement.</p>
         * @property settings - <p>The specified settings.</p>
         * @property disabled - <p>A value indicating if the selectable functionality is disabled.</p>
         * @property enable - <p>Enables the selectability for all elements in the list of selectable elements.</p>
         * @property disable - <p>Disables the selectability for all elements in the list of selectable elements.</p>
         * @property update - <p>Updates the list of selectable elements and removes event bindings for previous selectable elements.</p>
         * @property deselect - <p>Deselects all selected element(s) from the list of selectable elements. Optional argument: A Boolean value indicating if the select event should fire.</p>
         * @property select - <p>Selects all element(s) from the list of selectable elements. Optional argument: A Boolean value indicating if the select event should fire.</p>
         * @property getSelectable - <p>Returns an array of all selectable elements in the following format: at index [0]: element, at index [1]:bounding client rectangle.</p>
         * @property getSelection - <p>Returns an array of all selected elements.</p>
         */
        type SelectableController = {
            element: HTMLElement;
            settings: any;
            disabled: boolean;
            enable: (...params: any[]) => any;
            disable: (...params: any[]) => any;
            update: (...params: any[]) => any;
            deselect: (...params: any[]) => any;
            select: (...params: any[]) => any;
            getSelectable: (...params: any[]) => any;
            getSelection: (...params: any[]) => any;
        };
        /**
         * @property top - <p>Defines if the top of the element is visible.</p>
         * @property right - <p>Defines if the right of the element is visible.</p>
         * @property bottom - <p>Defines if the bottom of the element is visible.</p>
         * @property left - <p>Defines if the left of the element is visible.</p>
         * @property visible - <p>Defines if the element is partially visible.</p>
         * @property full - <p>Defines if the element is fully visible.</p>
         */
        type Viewport = {
            top: boolean;
            right: boolean;
            bottom: boolean;
            left: boolean;
            visible: boolean;
            full: boolean;
        };
        /**
         * @property xhr - <p>The xhr object.</p>
         * @property settings - <p>The initial settings object.</p>
         * @property abort - <p>A method to abort the running xhr request. Different to xhr.abort() in that it will also abort a repeating call specified with settings.repeatInterval.</p>
         */
        type XhrWrappedResult = {
            xhr: XMLHttpRequest;
            settings: any;
            abort: componyx.library.XhrAbortFunction;
        };
        /**
         * <p>A function to abort the active xhr request.</p>
         * @param stopRepeat - <p>Stops the repeating xhr call cycle when a repeatInterval was specified in the xhr settings.</p>
         */
        type XhrAbortFunction = (stopRepeat: boolean) => void;
        /**
         * <p>Callback for xhr events.</p>
         * @param args - <p>An object used as argument for XHR callbacks.</p>
         * @param args.xhr - <p>The xhr object.</p>
         * @param args.settings - <p>The settings of the xhr.</p>
         * @param args.data - <p>The response data.</p>
         * @param args.timeout - <p>A value indicating if the request timed out.</p>
         * @param args.event - <p>A progress event (onProgress and onUploadProgress).</p>
         */
        type XhrCallback = (args: {
            xhr: XMLHttpRequest;
            settings: componyx.library.xhrSettings;
            data: any;
            timeout: boolean;
            event: ProgressEvent;
        }) => void;
        /**
         * <p>Callback for iteration.</p>
         * @param item - <p>The current item in the iteration.</p>
         * @param index - <p>The current array index or object key.</p>
         * @param object - <p>The object that is being iterated.</p>
         * @param args - <p>The initial arguments that were provided with the 'each' method call.</p>
         * @param next - <p>A callback function to retrieve the next item from the iteration.</p>
         */
        type EachCallback = (item: any, index: number | string, object: any | object[], args: any, next: (...params: any[]) => any) => void;
        /**
                 * <p>An object for binding and handling events.</p>
                 * @template THandler - The signature of the event handlers. Defaults to an untyped handler.
                 */
        interface Event<THandler extends (...params: any[]) => any = (...params: any[]) => any>
        {
            /**
             * <p>Adds a fire once event handler for the event.</p>
             * @param handler - <p>Callback method to invoke when the event fires. Event can be cancelled by returning false.</p>
             * @returns <p>The unique id of the event-handler.</p>
             */
            once(handler: THandler, args?: null): string;
            /**
             * <p>Adds a fire once event handler for the event. With custom handler arguments the handler signature is not typed, since the custom arguments change the parameters the handler receives.</p>
             * @param handler - <p>Callback method to invoke when the event fires. Event can be cancelled by returning false.</p>
             * @param args - <p>Arguments to pass to the specified event handler when the event fires.</p>
             * @returns <p>The unique id of the event-handler.</p>
             */
            once(handler: (...params: any[]) => any, args: object): string;
            /**
             * <p>Adds an event handler for the event.</p>
             * @param handler - <p>Callback method to invoke when the event fires. Event can be cancelled by returning false.</p>
             * @param [args] - <p>Pass null (or omit) when no custom arguments are used.</p>
             * @param [fireOnce] - <p>A value indicating if the handler will fire only once which means that the handler is removed from the event directly after execution.</p>
             * @returns <p>The unique id of the event-handler.</p>
             */
            add(handler: THandler, args?: null, fireOnce?: boolean): string;
            /**
             * <p>Adds an event handler for the event. With custom handler arguments the handler signature is not typed, since the custom arguments change the parameters the handler receives.</p>
             * @param handler - <p>Callback method to invoke when the event fires. Event can be cancelled by returning false.</p>
             * @param args - <p>Arguments to pass to the specified event handler when the event fires.</p>
             * @param [fireOnce] - <p>A value indicating if the handler will fire only once which means that the handler is removed from the event directly after execution.</p>
             * @returns <p>The unique id of the event-handler.</p>
             */
            add(handler: (...params: any[]) => any, args: object, fireOnce?: boolean): string;
            /**
             * <p>Checks if the event handler is attached.</p>
             * @param handler - <p>The event handler to check.</p>
             * @returns <p>A value indicating if the handler is already present on the event.</p>
             */
            has(handler: (...params: any[]) => any): boolean;
            /**
             * <p>Removes an event handler for the event.</p>
             * @param handler - <p>The event handler to remove.</p>
             */
            remove(handler: (...params: any[]) => any): void;
            /**
             * <p>Removes all event handlers for the event.</p>
             */
            removeAll(): void;
            /**
             * <p>Disables the event until the current call stack is finished by using a setTimeout() call.</p>
             * @param [priorityHandler = false] - <p>Indicates whether to disable the priority handler instead of the main handler. Should generally remain false when called by client code.</p>
             */
            disable(priorityHandler?: boolean): void;
            /**
             * <p>Re-enables disabled events directly.</p>
             * @param [priorityHandler = false] - <p>Indicates whether to enable the disabled priority handler instead of the main handler. Should generally remain false when called by client code.</p>
             */
            enable(priorityHandler?: boolean): void;
            /**
             * <p>Adds an event handler with priority. This method should not be invoked by client code directly but only from inside component code. Priority handlers should only be used within a framework where the internal handler should be called before anything else.</p>
             * @param handler - <p>Callback method to invoke when the event fires.</p>
             * @param [args] - <p>Pass null (or omit) when no custom arguments are used.</p>
             * @param [fireOnce] - <p>A value indicating if the handler will fire only once which means that the handler is removed from the event directly after execution.</p>
             * @returns <p>The unique id of the event-handler.</p>
             */
            priorityAdd(handler: THandler, args?: null, fireOnce?: boolean): string;
            /**
             * <p>Adds an event handler with priority, with custom handler arguments. This method should not be invoked by client code directly but only from inside component code.</p>
             * @param handler - <p>Callback method to invoke when the event fires.</p>
             * @param args - <p>Arguments to pass to the specified event handler when the event fires.</p>
             * @param [fireOnce] - <p>A value indicating if the handler will fire only once which means that the handler is removed from the event directly after execution.</p>
             * @returns <p>The unique id of the event-handler.</p>
             */
            priorityAdd(handler: (...params: any[]) => any, args: object, fireOnce?: boolean): string;
            /**
             * <p>Removes all event handlers for the event. This method should not be invoked by client code directly but only from inside component code.</p>
             * @param [eventPriority] - <p>The priority of the events to remove, null/0 for both normal and priority events, 1 for normal events only, 2 for priority events only.</p>
             */
            priorityRemove(eventPriority?: number): void;
            /**
             * <p>Fires the event. This method should not be invoked by client code directly but only from inside component code.</p>
             * @param context - <p>The context (this) for which the method is invoked.</p>
             * @param [args] - <p>A single argument or a list of arguments to pass to the event handlers.</p>
             * @returns <p>The handler result, or a Promise when a handler returned a Promise.</p>
             */
            fire(context: any, args?: any): any;
            /**
             * <p>Checks if a handler is bound.</p>
             * @returns <p>A value indicating if a handler is bound to the event.</p>
             */
            isBound(): boolean;
            /**
             * <p>Gets all bound event handlers.</p>
             * @returns <p>A list of bound handlers.</p>
             */
            handlers(): any;
            /**
             * <p>Gets all bound priority event handlers.</p>
             * @returns <p>A list of bound handlers.</p>
             */
            priorityHandlers(): any;
        }
        /**
         * <p>Path class for navigating recursive data arrays.</p>
         * @property items - <p>The array containing all the items.</p>
         * @property recursionKey - <p>The object key that points to the child items.</p>
         * @property item - <p>The current item.</p>
         * @property children - <p>The child items of the current item.</p>
         * @property tree - <p>The tree path of the current item.</p>
         * @property index - <p>The index of the current item.</p>
         * @property startTree - <p>The start tree of the path.</p>
         * @param items - <p>An array of items.</p>
         * @param recursionKey - <p>The object key which points to the child items array. Separate object keys with a dot &quot;.&quot; to denote a deeper level.</p>
         * @param tree - <p>The tree path of the current item.</p>
         * @param item - <p>Current item.</p>
         */
        interface Path
        {
            /**
             * <p>Creates a new Path object instance with the current tree position.</p>
             * @returns <p>The new Path instance.</p>
             */
            create(): Path;
            /**
             * <p>Navigates to the starting item.</p>
             * @returns <p>The current Path instance.</p>
             */
            start(): Path;
            /**
             * <p>Navigates to the root item.</p>
             * @returns <p>The current Path instance.</p>
             */
            root(): Path;
            /**
             * <p>Checks if the current item has a parent item.</p>
             * @returns <p>A value indicating if the current item has a parent item.</p>
             */
            hasParent(): boolean;
            /**
             * <p>Navigates to the parent item.</p>
             * @returns <p>The current Path instance.</p>
             */
            parent(): Path;
            /**
             * <p>Navigates to the first item on the current level.</p>
             * @returns <p>The current Path instance.</p>
             */
            first(): Path;
            /**
             * <p>Navigates to the last item on the current level.</p>
             * @returns <p>The current Path instance.</p>
             */
            last(): Path;
            /**
             * <p>Navigates to the previous item on the current level.</p>
             * @returns <p>The current Path instance.</p>
             */
            previous(): Path;
            /**
             * <p>Navigates to the next item on the current level.</p>
             * @returns <p>The current Path instance.</p>
             */
            next(): Path;
            /**
             * <p>Navigates to the item with the specified index on the current level.</p>
             * @returns <p>The current Path instance.</p>
             */
            sibling(): Path;
            /**
             * <p>Navigates to the child item with the specified index.</p>
             * @returns <p>The current Path instance.</p>
             */
            child(): Path;
            /**
             * <p>Navigates to the first child item.</p>
             * @returns <p>The current Path instance.</p>
             */
            firstChild(): Path;
            /**
             * <p>Navigates to the last child item.</p>
             * @returns <p>The current Path instance.</p>
             */
            lastChild(): Path;
            /**
             * <p>Returns the length of the items array at the current level.</p>
             * @returns <p>The length of the items array.</p>
             */
            length(): number;
            /**
             * <p>Iterates through the items in the array and evaluates each object against the specified comparer function.
             * The iteration is called recursively when the recursionKey is found on an object.</p>
             * @returns <p>A new instance of the Path object.</p>
             */
            path(): Path;
            /**
             * <p>The array containing all the items.</p>
            */
            items: any[];
            /**
             * <p>The object key that points to the child items.</p>
            */
            recursionKey: string;
            /**
             * <p>The current item.</p>
            */
            item: any;
            /**
             * <p>The child items of the current item.</p>
            */
            children: any[];
            /**
             * <p>The tree path of the current item.</p>
            */
            tree: any[];
            /**
             * <p>The index of the current item.</p>
            */
            index: number;
            /**
             * <p>The start tree of the path.</p>
            */
            startTree: any[];
        }
        /**
         * <p>Animation class.</p>
         * @property id - <p>The unique id of the animation.</p>
         * @property e - <p>The elements involved in the animation.</p>
         * @property p - <p>The element properties that will be animated.</p>
         * @property s - <p>The settings of the animation.</p>
         * @property startTime - <p>The start time of the animation.</p>
         * @property elapsedTime - <p>The elapsed time of the animation.</p>
         * @property isReverse - <p>A value indicating if the animation is being played backwards.</p>
         * @property state - <p>The current animation state: STARTED: 0, PLAYING: 1, PAUSED: 2, COMPLETED: 3, STOPPED: 4</p>
         */
        interface Animation
        {
            /**
             * <p>Starts the animation.</p>
             */
            start(): void;
            /**
             * <p>Plays/continues the animation if it is not yet playing.</p>
             */
            play(): void;
            /**
             * <p>Pauses the animation.</p>
             */
            pause(): void;
            /**
             * <p>Completes the animation by skipping to the final frame.</p>
             */
            complete(): void;
            /**
             * <p>Stops the animation.</p>
             */
            stop(): void;
            /**
             * <p>Plays the animation backwards.</p>
             */
            reverse(): void;
            /**
             * <p>Kills the animation.</p>
             */
            kill(): void;
            /**
             * <p>Updates a frame in the animation.</p>
             */
            update(): void;
            /**
             * <p>The unique id of the animation.</p>
            */
            id: string;
            /**
             * <p>The elements involved in the animation.</p>
            */
            e: HTMLElement[];
            /**
             * <p>The element properties that will be animated.</p>
            */
            p: any;
            /**
             * <p>The settings of the animation.</p>
            */
            s: any;
            /**
             * <p>The start time of the animation.</p>
            */
            startTime: number;
            /**
             * <p>The elapsed time of the animation.</p>
            */
            elapsedTime: any[];
            /**
             * <p>A value indicating if the animation is being played backwards.</p>
            */
            isReverse: boolean;
            /**
             * <p>The current animation state: STARTED: 0, PLAYING: 1, PAUSED: 2, COMPLETED: 3, STOPPED: 4</p>
            */
            state: number;
        }
        /**
         * <p>Global Animation settings.</p>
         * @property duration - <p>The duration of the animation.</p>
         * @property interval - <p>The interval of the update function.</p>
         * @property easing - <p>The animation easing setting.</p>
         * @property easeBackOvershoot - <p>Defines the easeBackOvershoot value for the easeBack method.</p>
         * @property onFrame - <p>A callback method which is called for every frame update.</p>
         * @property onStop - <p>A callback method which is called when the animation is stopped</p>
         * @property onComplete - <p>A callback method which is called when the animation is completed.</p>
         */
        type animationSettings = {
            duration: number;
            interval: number;
            easing: string;
            easeBackOvershoot: number;
            onFrame: (...params: any[]) => any;
            onStop: (...params: any[]) => any;
            onComplete: (...params: any[]) => any;
        };

        /**
         * Handle returned by {@link componyx.library.cssAnimation} to control an in-progress CSS animation/transition.
         */
        type cssAnimationController = {
            /** Function to abort the animation by removing the animation class. */
            abort: () => void;
            /** Function to complete the animation by removing the animation class and firing the onComplete handler. */
            complete: () => void;
        };
        /**
         * <p>Global HTTP(S) request events for the following methods: xhr(), addCssSource() and addScriptSource().</p>
         * @property onStart - <p>Event which fires before an HTTP request.</p>
         * @property onComplete - <p>Event which fires after an HTTP request.</p>
         * @property onSuccess - <p>Event which fires when an HTTP request was successful (status 200).</p>
         * @property onError - <p>Event which fires when an HTTP request returned an error.</p>
         * @property onAbort - <p>Event which fires when an HTTP request is aborted.</p>
         */
        type httpRequestHandlers = {
            onStart: componyx.library.Event;
            onComplete: componyx.library.Event;
            onSuccess: componyx.library.Event;
            onError: componyx.library.Event;
            onAbort: componyx.library.Event;
        };
        /**
         * <p>Global XMLHttpRequest (AJAX) settings which apply to all xhr requests, unless overridden on the xhr method call.</p>
         * @property xhr - <p>Object instance to use for the xhr request.</p>
         * @property url - <p>Defines the uniform resource locator.</p>
         * @property data - <p>Defines the data to send with the request as URL parameters or JSON String/Object.</p>
         * @property responseType - <p>Defines the type of the response.</p>
         * @property method - <p>Defines the HTTP request method (GET or POST). The setting requestMethod is supported for backwards compatibility.</p>
         * @property contentType - <p>Defines the HTTP request content type. The setting requestContentType is supported for backwards compatibility.</p>
         * @property headers - <p>Defines the HTTP request headers (key value pair). The setting requestHeaders is supported for backwards compatibility.</p>
         * @property jsonResponseDataWrapper - <p>Defines the JSON response data wrapper. e.g. ASP.NET uses d as default data wrapper.</p>
         * @property jsonDeserializer - <p>Defines the custom JSON deserializer method.</p>
         * @property jsonParseWrappedDataString - <p>Defines if the data within the JSON response data wrapper should be parsed again if it is of type String.</p>
         * @property async - <p>Defines if the request is synchronous or asynchronous (default).</p>
         * @property timeout - <p>Defines the timeout in milliseconds before the request is aborted.</p>
         * @property repeatInterval - <p>Defines the interval in milliseconds between repeating xhr requests.</p>
         * @property onStart - <p>Defines the callback function to call before the request.</p>
         * @property onComplete - <p>Defines the callback function to call after the request.</p>
         * @property onSuccess - <p>Defines the callback function to call when the request was successful.</p>
         * @property onError - <p>the callback function to call when the HTTP request failed. (HTTP status &gt;= 200 and &lt; 300).</p>
         * @property onAbort - <p>Defines the callback function to call when the request was aborted.</p>
         * @property onProgress - <p>Defines the callback function to call when there is a change in the download progress.</p>
         * @property onUploadProgress - <p>Defines the callback function to call when there is a change in the upload progress.</p>
         * @property onUploadError - <p>Defines the callback function to call when the upload failed.</p>
         */
        type xhrSettings = {
            xhr: XMLHttpRequest;
            url: string;
            data: string | any | FormData;
            responseType: string;
            method: string;
            contentType: string;
            headers: any;
            jsonResponseDataWrapper: string;
            jsonDeserializer: (...params: any[]) => any;
            jsonParseWrappedDataString: boolean;
            async: boolean;
            timeout: number;
            repeatInterval: number;
            onStart: componyx.library.XhrCallback;
            onComplete: componyx.library.XhrCallback;
            onSuccess: componyx.library.XhrCallback;
            onError: componyx.library.XhrCallback;
            onAbort: componyx.library.XhrCallback;
            onProgress: componyx.library.XhrCallback;
            onUploadProgress: componyx.library.XhrCallback;
            onUploadError: componyx.library.XhrCallback;
        };
        /**
         * <p>Global WebSocket settings which apply to all WebSocket connections, unless overridden on the ws method call.</p>
         * @property url - <p>Defines the uniform resource locator.</p>
         * @property binaryType - <p>A value indicating the type of binary data being transmitted by the connection. This should be either &quot;blob&quot; if DOM Blob objects are being used or &quot;arraybuffer&quot; if ArrayBuffer objects are being used.</p>
         * @property data - <p>Defines the initial data to send when the WebSocket connection is opened or retrieved from the pool.</p>
         * @property pooling - <p>Defines if only a single WebSocket connection can be opened per client and URL (true by default).</p>
         * @property onOpen - <p>Defines the callback function to call when the WebSocket connection is opened.</p>
         * @property onClose - <p>Defines the callback function to call when the WebSocket connection is closed.</p>
         * @property onMessage - <p>Defines the callback function to call when a message is received.</p>
         * @property onError - <p>Defines the callback function when a WebSocket error occurs.</p>
         */
        type wsSettings = {
            url: string;
            binaryType: string;
            data: string | JSON;
            pooling: boolean;
            onOpen: (...params: any[]) => any;
            onClose: (...params: any[]) => any;
            onMessage: (...params: any[]) => any;
            onError: (...params: any[]) => any;
        };
        /**
         * <p>JSON</p>
         */
        namespace JSON
        {
            /**
             * <p>Serializer casing options.</p>
             */
            enum CasingOption
            {
                NONE = 0,
                CAMELCASE = 1,
                PASCALCASE = 2
            }
            /**
             * <p>Serializer optimizer options.</p>
             */
            enum OptimizerOption
            {
                NONE = 0,
                EXCLUDENULL = 1,
                EXCLUDEFALSE = 2,
                EXCLUDEZERO = 4,
                EXCLUDEEMPTY = 8,
                OPTIMIZED = 16
            }
            /**
             * <p>Serializes an object to a JSON string.</p>
             * @param obj - <p>Object to serialize.</p>
             * @param casing - <p>Casing option.</p>
             * @param optimizer - <p>Optimizer option(s).</p>
             * @param properties - <p>List of property keys to include/exclude.</p>
             * @param exclude - <p>Defines whether keys in the properties parameter should be included(default) or excluded.</p>
             * @param replacer - <p>Replacer method to control property serialization.</p>
             */
            function serialize(obj: any, casing?: CasingOption, optimizer?: OptimizerOption, properties?: any, exclude?: boolean, replacer?: (...params: any[]) => any): string;
            /**
             * <p>Deserializes a JSON string to an object.</p>
             * @param json - <p>JSON string to deserialize.</p>
             * @param casing - <p>Casing option.</p>
             * @param optimizer - <p>Optimizer option(s).</p>
             * @param properties - <p>List of property keys to include/exclude.</p>
             * @param exclude - <p>Defines whether keys in the properties parameter should be included(default) or excluded.</p>
             * @param replacer - <p>Replacer method to control property serialization.</p>
             */
            function deserialize(json: string, casing?: CasingOption, optimizer?: OptimizerOption, properties?: any, exclude?: boolean, replacer?: (...params: any[]) => any): any;
        }
    }

    /**
     * <p>Search the DOM with the specified selector.
     * Only the selector argument is required for an id search.</p>
     * @property document - <p>The active document object.</p>
     * @property touch - <p>A value indicating if we are dealing with a touch device.</p>
     * @property event - <p>This variable will hold the last active HTML event object.</p>
     * @property webSockets - <p>This variable will hold the active WebSocket connections.</p>
     */
    interface LibrarySelector
    {
        /**
         * Search the DOM with the specified selector.
         * @param selector - 
         *   <ul>
         *     <li>null: no filter apart from baseElement and tagName.</li>
         *     <li>'#id': get single element by id.</li>
         *     <li>'class1 class2': get elements by class name(s).</li>
         *     <li>['class1 class2', callback]: get elements by class name(s) and use callback function to filter result.</li>
         *     <li>callback function: The callback function accepts two arguments and returns true to include or false to exclude the element from the result array.
         *         argument 1: The current element in the iteration.
         *         argument 2: A function reference to stop the iteration when called (optional).
         *     </li>
         *   </ul>
         * @param baseElement - Element from where to start searching or null to start at the document.
         * @param tagName - Name of tags to search or null to search all tags.
         * @param scalar - A value indicating to return a single result which makes the iteration stop after a match (function or class selector only).
         * @param upwards - A value indicating to iterate upwards through the DOM starting at the base element (does not work with class selectors).
         * @returns HTMLElement or HTMLElement[]
         */
        // If selector is id (#id), always returns HTMLElement or null (assuming possible not found)
        (selector: `#${string}`, baseElement?: HTMLElement | null, tagName?: string | null, scalar?: true, upwards?: boolean): HTMLElement | null;
        (selector: `#${string}`, baseElement: HTMLElement | null | undefined, tagName: string | null | undefined, scalar: false, upwards?: boolean): HTMLElement | null;

        // If selector is a string (class selectors or others) and scalar is true, return single element or null
        (selector: string, baseElement: HTMLElement | null | undefined, tagName: string | null | undefined, scalar: true, upwards?: boolean): HTMLElement | null;
        // If selector is a string and scalar is false or omitted, return array
        (selector: string, baseElement?: HTMLElement | null, tagName?: string | null, scalar?: false, upwards?: boolean): HTMLElement[];

        // If selector is a callback function and scalar is true, return single element or null
        (selector: (el: HTMLElement, stop?: () => void) => boolean, baseElement: HTMLElement | null | undefined, tagName: string | null | undefined, scalar: true, upwards?: boolean): HTMLElement | null;
        // If selector is callback function and scalar is false or omitted, return array
        (selector: (el: HTMLElement, stop?: () => void) => boolean, baseElement?: HTMLElement | null, tagName?: string | null, scalar?: false, upwards?: boolean): HTMLElement[];

        /**
         * <p>Defines the prototype of an object and keeps the correct constructor.</p>
         * @param obj - <p>The object to derive from the base object.</p>
         * @param baseObj - <p>The base object that will become the prototype of the derived object.</p>
         */
        prototype(obj: any, baseObj: any): void;
    }

    /**
     * <p>Library static methods.</p>
     */
    class library
    {
        /**
         * <p>Creates a class instance for binding and handeling events.</p>
         * @param eventName - <p>The name of the event.</p>
         * @returns <p>An object for handeling events.</p>
         */
        static createEvent(eventName: string): componyx.library.Event;
        /**
         * <p>Generates a new unique id.</p>
         * @returns <p>The generated id.</p>
         */
        static guid(): string;
        /**
         * <p>Emulates a namespace by creating an object hierarchy for the specified namespace text.</p>
         * @param namespace - <p>Text with '.' separators as namespace.</p>
         */
        static registerNamespace(namespace: string): void;
        /**
         * <p>Enables the element(s) within a specified zone to be selectable.</p>
         * @param settings - <p>The settings which configure the select behaviour.</p>
         * @returns <p>An Object to control the selectable behaviour.</p>
         */
        static selectable(settings: componyx.library.SelectableSettings): componyx.library.SelectableController;
        /**
         * <p>Enables the specified element to be resizable.</p>
         * @param element - <p>to make resizable.</p>
         * @param settings - <p>The settings which configure the resize behaviour.</p>
         * @returns <p>An Object to control the resizable behaviour.</p>
         */
        static resizable(element: HTMLElement, settings: componyx.library.ResizableSettings): componyx.library.ResizableController;
        /**
         * <p>Enables the specified element to be draggable.</p>
         * @param element - <p>DOM element to make draggable.</p>
         * @param settings - <p>The settings which configure the drag behaviour.</p>
         * @returns <p>An Object to control the draggable behaviour.</p>
         */
        static draggable(element: HTMLElement, settings: componyx.library.DraggableSettings): componyx.library.DraggableController;
        /**
         * <p>Displays the element by fading it from transparent to opaque.
         * When parameters are passed as array, they will be matched on array index.</p>
         * @param element - <p>Element.</p>
         * @param settings - <p>The settings which configure the animation.</p>
         * @returns <p>The Animation object.</p>
         */
        static fadeIn(element: HTMLElement | HTMLElement[], settings: componyx.library.animationSettings): componyx.library.Animation;
        /**
         * <p>Hides the element by fading it from opaque to transparent.
         * When parameters are passed as array, they will be matched on array index.</p>
         * @param element - <p>Element.</p>
         * @param settings - <p>The settings which configure the animation.</p>
         * @returns <p>The Animation object.</p>
         */
        static fadeOut(element: HTMLElement | HTMLElement[], settings: componyx.library.animationSettings): componyx.library.Animation;
        /**
         * <p>Performs a slide transition effect to reveal an element by creating a clipping mask, applying animation classes, and then removing the mask upon completion.</p>
         * @param element - <p>The target element to animate.</p>
         * @param out - <p>If true, performs a slide/reveal OUT effect; otherwise, performs a slide/reveal IN effect.</p>
         * @param effect - <p>The type of effect to use; expected values are &quot;slide&quot; or &quot;reveal&quot;.</p>
         * @param direction - <p>The direction of the animation (e.g., &quot;left&quot;, &quot;right&quot;, &quot;up&quot;, &quot;down&quot;).</p>
         * @param fade - <p>If true, the effect will include a fade transition.</p>
         * @param onComplete - <p>Callback invoked when the transition completes.</p>
         * @returns <p>abort - Function to abort the animation; pass false to abort without firing onComplete.</p>
         */
        static slide(element: HTMLElement, out?: boolean, effect?: string, direction?: string, fade?: boolean, onComplete?: (...params: any[]) => any): (...params: any[]) => any;

        /**
         * Applies a CSS animation/transition to an element by adding the specified classes and triggers the onComplete callback when the animation/transition ends.
         * @param element - The element to animate.
         * @param animationClass - The CSS class used to trigger the animation/transition.
         * @param triggerElements - Array of child elements that are considered valid for triggering the animation/transition start/end events. If omitted only the main element will trigger.
         * @param callbacks - An object to configure the event callbacks.
         * @returns An object to abort/complete the css animation/transition.
         */
        static cssAnimation(element: HTMLElement, animationClass?: string, triggerElements?: HTMLElement[], callbacks?: { onComplete?: () => void; onStart?: () => void; isComplete?: () => boolean; }): componyx.library.cssAnimationController;

        /**
         * <p>Animates the element by transitioning the current css class(es) to the specified class(es).
         * When parameters are passed as array, they will be matched on array index.</p>
         * @param element - <p>Element.</p>
         * @param cssClass - <p>Class name(s) string. Use space separated names to apply multiple classes on a single element.</p>
         * @param classSpecifier - <p>The class specifier defines how classes are assigned to the element(s).
         * By default classes are toggled, use classname: 'toggle/add/remove' for the desired behaviour.</p>
         * @param settings - <p>The settings which configure the animation.</p>
         * @returns <p>The Animation object.</p>
         */
        static animateToClass(element: HTMLElement | HTMLElement[], cssClass: string | String[], classSpecifier: any | object[], settings: componyx.library.animationSettings): componyx.library.Animation;
        /**
         * <p>Animates the element(s) by transitioning the current property values to the specified values.
         * When both elements and properties are passed as array they will be matched on array index, otherwise the element(s) will use the properties object.</p>
         * @param element - <p>Element.</p>
         * @param properties - <p>Properties.
         * A single property can be specified in two ways.
         * property: value
         * property: [value, settings] Animation settings or a numeric value to specify the duration only.</p>
         * @param settings - <p>Animation settings or a numeric value to specify the duration only.</p>
         * @returns <p>The Animation object.</p>
         */
        static animate(element: HTMLElement | HTMLElement[], properties: any | object[], settings: componyx.library.animationSettings | number): componyx.library.Animation;
        /**
         * <p>Moves array elements from one position to another.</p>
         * @param list - <p>The array.</p>
         * @param index - <p>The position index of the element to move.</p>
         * @param targetIndex - <p>The position index where the elements are placed (current index in the array before moving).</p>
         * @param [amount = 1] - <p>The number of elements to be moved.</p>
         * @returns <p>The new index of the moved element(s). The index changes when elements are moved from top to bottom because the array will be re-ordered.</p>
         */
        static move(list: any[], index: number, targetIndex: number, amount?: number): number;
        /**
         * <p>Iterates through the items of the object or array and invokes the handler while passing in the item value, item key/index, the object/array and optional extra arguments.</p>
         * @example
         * // Traditional usage (positional arguments)
        $.each(['item-1', 'item-2'], (item, index, array, args) => { },['arg-1'], 0, false, null, false);
         * @example
         * // Using a settings object (all parameters are optional and can be selectively provided)
        $.each({
          object: ['item-1', 'item-2'],
          handler: (item, index, array, args) => { },
          args: ['arg-1'],
          startIndex: 0,
          manualFetching: false,
          last: null,
          reverse: false
        });
         * @param object - <p>An object or array to iterate or a settings object holding the properties to configure the each call.</p>
         * @param callback - <p>A delegate handler that is invoked for each item.</p>
         * @param args - <p>An array of extra arguments to pass to the handler.</p>
         * @param startIndex - <p>The start position of the iteration when dealing with an Array type.</p>
         * @param manualFetching - <p>A value indicating if manual fetching is required. This allows asynchronous code execution while performing an iteration. The fetcher method to manually move the iterator to the next item is passed to the handler as fifth argument.</p>
         * @param last - <p>A callback method to invoke when manualFetching is enabled and the last item has been iterated.</p>
         * @param reverse - <p>A value indicating if the iteration should move backwards. Reverse iteration is supported for arrays, and for objects only when manualFetching is true.</p>
         */
        static each(object: any | any[], callback: componyx.library.EachCallback, args?: any[], startIndex?: number, manualFetching?: boolean, last?: (...params: any[]) => any, reverse?: boolean): void;
        /**
         * <p>Copies properties from the source object (or function) to the target object.
         * Supports deep cloning, conditionally overwriting properties, circular reference protection and excluding specific values or types.</p>
         * @example
         * // Traditional usage (positional arguments)
        $.clone(target, source, true, 1, true, false, false, [], new Set(), { MyType: MyClass }, {});
         * @example
         * // Using a settings object (all parameters are optional and can be selectively provided)
        $.clone({
          target: target,
          source: source,
          deep: true,
          overwrite: 1,
          extend: true,
          excludeEmpty: false,
          excludeFunctions: false,
          exclude: [],
          omit: new Set(['password']),
          types: { MyType: MyClass },
          typeCheck: "type"
          converter: { date: (val) => new Date(val) },
        });
         * @param target - <p>The target object to which properties will be copied, or a settings object holding all configuration options.</p>
         * @param [source] - <p>The source object whose properties will be cloned to the target.</p>
         * @param [deep = false] - <p>If true, perform a deep copy (recursive cloning).</p>
         * @param [overwrite = false] - <p>Specifies how to overwrite existing properties on the target:</p>
         * <ul>
         * <li><code>0</code> or <code>false</code>: Do not overwrite existing properties.</li>
         * <li><code>1</code> or <code>true</code>: Overwrite existing properties.</li>
         * <li><code>2</code>: Overwrite only if the target property is <code>null</code> or <code>undefined</code>.</li>
         * </ul>
         * @param [extend = true] - <p>If true, new properties from the source will be added to the target object.</p>
         * @param [excludeEmpty = false] - <p>Defines if null, undefined, or empty values should be excluded from the source object:</p>
         * <ul>
         * <li><code>false</code>: Include null, undefined, or empty values.</li>
         * <li><code>true</code>: Exclude null, undefined, or empty values.</li>
         * <li><code>2</code>: Exclude when the target is a plain object type (clones value types only).</li>
         * </ul>
         * @param [excludeFunctions = false] - <p>If true, function properties will not be copied.</p>
         * @param [exclude] - <p>Tracks visited/excluded objects to handle circular references. [0] the object to match, [1] the object to return.</p>
         * @param [omit] - <p>A Set or Object specifying keys to omit from the source object.</p>
         * @param [types] - <p>An object mapping type names to their constructor functions.</p>
         * @param [typeCheck = "constructor"] - <p>How to determine type names: <code>&quot;constructor&quot;</code> (default) or a property name on the source.</p>
         * @param [converter] - <p>An object mapping source keys to custom converter functions.</p>
         * @param [report] - <p>An optional object used to report whether any target values were actually changed during cloning. If provided, its <code>changed</code> property is set to <code>true</code> the moment any property on the target is written.</p>
         * @returns <p>The updated target object after cloning.</p>
         */
        static clone(target: any | any, source?: any, deep?: boolean, overwrite?: number | boolean, extend?: boolean, excludeEmpty?: boolean, excludeFunctions?: boolean, exclude?: any[][], omit?: Set<any> | any, types?: {
            [key: string]: (...params: any[]) => void;
        }, typeCheck?: string, converter?: any, report?: any): any;
        /**
         * <p>Returns the name of the object's constructor.</p>
         * @param obj - <p>The Object to check.</p>
         * @returns <p>The constructor name.</p>
         */
        static getConstructor(obj: any): string;
        /**
         * <p>Gets the type of the object.</p>
         * @param obj - <p>The Object to check.</p>
         * @returns <p>Returns the object type as string.</p>
         */
        static type(obj: any): string;
        /**
         * <p>Gets the object's prototype.</p>
         * @param obj - <p>The Object from which the prototype is returned.</p>
         * @returns <p>Returns the object's prototype.</p>
         */
        static getPrototypeOf(obj: any): any;
        /**
         * <p>Checks if the passed object/array/string is null or empty.</p>
         * @param obj - <p>The Object to check.</p>
         * @param trim - <p>Removes leading and trailing white space characters, new lines and tabs from the specified string (Defaults to true).</p>
         * @returns <p>Returns true if the specified object is null or empty, otherwise false.</p>
         */
        static isEmpty(obj: any, trim?: boolean): boolean;
        /**
         * <p>Checks if the passed object is a plain object.</p>
         * @param obj - <p>The Object to check.</p>
         * @param [strict] - <p>A value indicating if custom class objects should NOT be considered a plain object.</p>
         * @returns <p>Returns true if the specified object is a plain object, otherwise false.</p>
         */
        static isPlainObject(obj: any, strict?: boolean): boolean;
        /**
         * <p>Checks if the passed object is a primative type.</p>
         * @param obj - <p>The Object to check.</p>
         * @returns <p>Returns true if the specified object is a primative type, otherwise false.</p>
         */
        static isPrimitive(obj: any): boolean;
        /**
         * <p>Checks if the passed object is an XML element.</p>
         * @param obj - <p>The Object to check.</p>
         * @returns <p>Returns true if the specified object is an XMLElement, otherwise false.</p>
         */
        static isXMLElement(obj: any): boolean;
        /**
         * <p>Checks if the passed object is an HTML element.</p>
         * @param obj - <p>The Object to check.</p>
         * @returns <p>Returns true if the specified object is an HTMLElement, otherwise false.</p>
         */
        static isElement(obj: any): boolean;
        /**
         * <p>Checks if the specified object is a DOM object.</p>
         * @param obj - <p>The Object to check.</p>
         * @returns <p>Returns true if the specified object is a DOM object, otherwise false.</p>
         */
        static isDOM(obj: any): boolean;
        /**
         * <p>Returns the window object associated with the specified node.</p>
         * @param node - <p>The node for which to return the associated window object.</p>
         * @returns <p>The window object associated with the specified node or null if specified obj is not of type Node.</p>
         */
        static defaultView(node: Node): Window;
        /**
         * <p>Checks if the passed object is an array.</p>
         * @param obj - <p>The Object to check.</p>
         * @returns <p>Returns true if the specified object is an array, otherwise false.</p>
         */
        static isArray(obj: any): boolean;
        /**
         * <p>Checks if the passed object is a date.</p>
         * @param obj - <p>The Object to check.</p>
         * @returns <p>Returns true if the specified object is a Date, otherwise false.</p>
         */
        static isDate(obj: any): boolean;
        /**
         * <p>Adds a handler which fires when the document is ready for manipulation, but before all resources have been loaded.</p>
         * @param handler - <p>A handler.</p>
         * @param args - <p>An array of arguments that should be passed to the handler.</p>
         * @param context - <p>The execution context object on which the handler is applied.</p>
         */
        static ready(handler: (...params: any[]) => any, args: any[], context: any): void;
        /**
         * <p>Attaches a fire once event handler to the specified object event(s).</p>
         * @param obj - <p>HTMLElement or object.</p>
         * @param eventType - <p>One or more event types separated by a space.</p>
         * @param handler - <p>A method containing executable code.</p>
         * @param [args] - <p>An array of arguments that should be passed to the event handler.</p>
         * @param [context] - <p>The execution context object on which the handler is applied, by default the DOM element/object on which the event is fired.</p>
         * @param [unique = false] - <p>A value indicating if event handlers for a specific object and event-type should exist only once.</p>
         * @returns <p>The generated guid of the handler.</p>
         */
        static once(obj: HTMLElement | any, eventType: string, handler: (...params: any[]) => any, args?: object[], context?: any, unique?: boolean): string;
        /**
         * <p>Attaches an event handler to the specified object event(s).</p>
         * @param obj - <p>HTMLElement, object, or settings object.</p>
         * @param eventType - <p>One or more event types separated by a space.</p>
         * @param handler - <p>A method containing executable code.</p>
         * @param [args] - <p>An array of arguments that should be passed to the event handler.</p>
         * @param [context] - <p>The execution context object on which the handler is applied.</p>
         * @param [unique = false] - <p>If true, only one handler per GUID is allowed.</p>
         * @param [fireOnce = false] - <p>If true, handler is removed after first run.</p>
         * @param [options] - <p>Native addEventListener options (capture, passive, once).</p>
         * @returns <p>The generated guid of the handler.</p>
         */
        static on(obj: HTMLElement | any | any, eventType: string, handler: (...params: any[]) => any, args?: object[], context?: any, unique?: boolean, fireOnce?: boolean, options?: any): string;
        /**
         * <p>Checks if the event handler is attached to the object for the specified event type.</p>
         * @param obj - <p>HTMLElement or object.</p>
         * @param eventType - <p>Event type.</p>
         * @param handler - <p>The handler or the handler guid returned from the bind method.</p>
         * @returns <p>True if the handler is bound, otherwise false.</p>
         */
        static has(obj: HTMLElement | any, eventType: string, handler: ((...params: any[]) => any) | string): boolean;
        /**
         * <p>Removes the attached event handler from the object for the specified type.</p>
         * @param obj - <p>HTMLElement or object.</p>
         * @param [eventType] - <p>Event type. Ommit to remove all bounded event handlers.</p>
         * @param [handler] - <p>The handler or the guid of the handler to remove. Ommit to remove all bounded event handlers for the specified event type.</p>
         */
        static off(obj: HTMLElement | any, eventType?: string, handler?: ((...params: any[]) => any) | string): void;
        /**
         * <p>Copies the events from the source to the target object.</p>
         * @param target - <p>HTMLElement or object.</p>
         * @param source - <p>HTMLElement or object.</p>
         * @returns <p>The target HTMLElement or object.</p>
         */
        static copyEvents(target: HTMLElement | any, source: HTMLElement | any): HTMLElement | any;
        /**
         * <p>Fires the HTML event of the specified type on the element</p>
         * @param element - <p>DOM element</p>
         * @param type - <p>HTMLEvent type</p>
         * @param [bubbles = false] - <p>A value indicating whether the event should bubble up through the event chain or not.</p>
         * @param [cancelable = false] - <p>A value indicating whether the event can be cancelled.</p>
         * @param [properties] - <p>Properties with which the event object will be extended.</p>
         */
        static fireEvent(element: HTMLElement, type: string, bubbles?: boolean, cancelable?: boolean, properties?: any): boolean;
        /**
         * <p>Adds the (X)HTML data to the specified element(s) and loads contained script and CSS resources.</p>
         * @param html - <p>The HTML string to add.</p>
         * @param [element] - <p>The Element to which the html will be appended.</p>
         * @param [mapping] - <p>A mapping object where the key refers to the id of the source element and the value refers to the target element or element id.</p>
         * @param [onComplete] - <p>Event callback method which is invoked when the html data is added and the resources are loaded.</p>
         */
        static addHTML(html: string, element?: HTMLElement, mapping?: any, onComplete?: (...params: any[]) => any): void;
        /**
         * <p>Loads (X)HTML data through an XML HTTP request and adds the data to the current document with the addHTML method (view addHTML comments for more info).</p>
         * @param settings - <p>The Settings which configure the xhr request. (view XhrSettings)</p>
         * @param element - <p>The Element to which the html will be appended.</p>
         * @param [mapping] - <p>A mapping object where the key refers to the id of the source element and the value refers to the target element or element id.</p>
         * @returns <p>An object wrapped around the xhr object.</p>
         */
        static load(settings: componyx.library.xhrSettings, element: HTMLElement, mapping?: any): componyx.library.XhrWrappedResult;
        /**
         * <p>Executes an XMLHTTP (AJAX) request.</p>
         * @param settings - <p>The settings which configure the xhr request (view xhrSettings).</p>
         * @returns <p>An object wrapped around the xhr object.</p>
         */
        static xhr(settings: componyx.library.xhrSettings): componyx.library.XhrWrappedResult;
        /**
         * <p>Creates a full-duplex WebSocket TCP connection.</p>
         * @param settings - <p>The settings which configure the WebSocket (view wsSettings).</p>
         * @returns <p>The WebSocket object.</p>
         */
        static ws(settings: componyx.library.wsSettings): WebSocket;
        /**
         * <p>Adds a script tag with the specified source and id to the page</p>
         * @param src - <p>The src of the tag</p>
         * @param id - <p>The id of the tag</p>
         * @param handlers.onStart - <p>The onStart is called when a new tag is added to the page.</p>
         * @param handlers.onComplete - <p>The onComplete is called when an HTTP request has finished.</p>
         * @param handlers.onError - <p>The onError is called when an HTTP request has failed.</p>
         * @param [async] - <p>A value indicating if the script should be loaded with the async option (false by default).</p>
         * @param [defer] - <p>A value indicating if the script should be loaded with the defer option (false by default).</p>
         * @param [before] - <p>The new tag will be placed before this tag if it was not already on the page.</p>
         * @returns <p>The created element.</p>
         */
        static addScriptSource(src: string, id: string, handlers: {
            onStart: any;
            onComplete: any;
            onError: any;
        }, async?: boolean, defer?: boolean, before?: HTMLElement): HTMLElement;
        /**
         * <p>Adds a css link tag with the specified source and id to the page</p>
         * @param src - <p>The src of the tag</p>
         * @param id - <p>The id of the tag</p>
         * @param handlers.onStart - <p>The onStart is called when a new tag is added to the page.</p>
         * @param handlers.onComplete - <p>The onComplete is called when an HTTP request has finished.</p>
         * @param handlers.onError - <p>The onError is called when an HTTP request has failed.</p>
         * @param [before] - <p>The new tag will be placed before this tag if it was not already on the page.</p>
         * @returns <p>The created element.</p>
         */
        static addCssSource(src: string, id: string, handlers: {
            onStart: any;
            onComplete: any;
            onError: any;
        }, before?: HTMLElement): HTMLElement;
        /**
         * <p>Adds an inline script tag with the specified text and id to the page.</p>
         * @param text - <p>Script text</p>
         * @param id - <p>Id of the script tag</p>
         * @param [before] - <p>The new tag will be placed before this tag when specified.</p>
         * @returns <p>The created element.</p>
         */
        static addScriptTag(text: string, id: string, before?: HTMLElement): HTMLElement;
        /**
         * <p>Adds an inline css style tag with the specified text and id to the page.</p>
         * @param text - <p>Css text</p>
         * @param id - <p>Id of the style tag</p>
         * @param [before] - <p>The new tag will be placed before this tag when specified.</p>
         * @returns <p>The created element.</p>
         */
        static addCssTag(text: string, id: string, before?: HTMLElement): HTMLElement;
        /**
         * <p>Inserts, updates or removes a CSS rule in the specified styleSheet.</p>
         * @param styleSheet - <p>The styleSheet in which the rule will be added, updated or removed.</p>
         * @param ruleIndex - <p>The position index for the rule within the styleSheet. Required if the selector parameter is not specified.</p>
         * @param selector - <p>Specify either the selector text for a new CSS rule or a matching text/regex for finding an existing CSS rule.</p>
         * @param style - <p>The CSS style value or null to remove the rule.</p>
         * @param [update] - <p>A value indicating if the style of the matching rule should be set (default) or updated.</p>
         * @returns <p>The position index of the rule within the styleSheet.</p>
         */
        static setCssRule(styleSheet: CSSStyleSheet, ruleIndex: number, selector: string | RegExp, style: string, update?: boolean): number;
        /**
         * <p>Gets CSS rules from the specified styleSheet.</p>
         * @param styleSheet - <p>The styleSheet in which the rule(s) exists.</p>
         * @param selector - <p>The selector text/regex to match rules.</p>
         * @returns <p>The found CSS rule(s).</p>
         */
        static getCssRule(styleSheet: CSSStyleSheet, selector: string): CSSRule[];
        /**
         * <p>Fires an HTTP request to the specified source every x milliseconds to keep the current HTTP session alive</p>
         * @param src - <p>Source location</p>
         * @param delay - <p>Refresh delay in milliseconds, 300000 milliseconds (5 minutes) by default</p>
         * @returns <p>A method to kill the keep alive</p>
         */
        static keepAlive(src: string, delay: number): (...params: any[]) => any;
        /**
         * <p>Creates a new HTMLElement.</p>
         * @example
         * // Traditional usage (positional arguments)
        $.element(container, before, 'div', 'Hello', { id: 'greeting' }, { className: 'text' });
         * @example
         * // Using a settings object (all parameters are optional and can be selectively provided)
        $.element({
          container: container,
          before: before,
          tagName: 'div',
          content: 'Hello',
          attrs: { id: 'greeting' },
          props: { className: 'text' }
        });
         * @param [container] - <p>The container element to append the new element to, or a settings object holding the properties to configure element creation.</p>
         * @param [before] - <p>The element to insert before (if using positional parameters).</p>
         * @param [tag = 'div'] - <p>The tag name for the new element.</p>
         * @param [content] - <p>The content of the new element. String[] is treated as HTML.</p>
         * @param [attrs] - <p>Attributes to set on the element.</p>
         * @param [props] - <p>Properties to set on the element.</p>
         * @returns <p>The created element.</p>
         */
        static element(container?: HTMLElement | any, before?: HTMLElement, tag?: string, content?: Node[] | Node | string | String[], attrs?: any, props?: any): HTMLElement;
        /**
         * <p>Gets the common ancestor for 2 nodes.</p>
         * @param firstNode - <p>The first node.</p>
         * @param secondNode - <p>The second node.</p>
         * @param [parentElement] - <p>Only siblings within the specified parent element are retrieved.</p>
         * @returns <p>The common ancestor element.</p>
         */
        static commonAncestor(firstNode: HTMLElement, secondNode: HTMLElement, parentElement?: HTMLElement): HTMLElement;
        /**
         * <p>Gets the next or previous sibling of the specified node.</p>
         * @param node - <p>The start node.</p>
         * @param [previous] - <p>A value indicating if the previous node is retrieved instead of the next.</p>
         * @param [nodeType] - <p>A node type value to retrieve the first sibling occurence of this node type, by default any node type is retrieved.</p>
         * @param [parentElement] - <p>Only siblings within the specified parent element are retrieved.</p>
         * @param [skipEmpty] - <p>A value indicating if empty siblings must be skipped.</p>
         * @returns <p>The next or previous sibling node or null if there is none.</p>
         */
        static sibling(node: Node, previous?: boolean, nodeType?: number, parentElement?: HTMLElement, skipEmpty?: boolean): Node;
        /**
         * <p>Retrieves the first child node by tagname that is of type ELEMENT_NODE.</p>
         * @param element - <p>The XML or (X)HTML element.</p>
         * @param name - <p>The name of the tag.</p>
         * @returns <p>The first child element which equals the specified name.</p>
         */
        static firstChildByTagName(element: HTMLElement, name: string): HTMLElement;
        /**
         * <p>Retrieves an array of childnodes that are of type ELEMENT_NODE.</p>
         * @param element - <p>The XML or (X)HTML element.</p>
         * @returns <p>Element collection.</p>
         */
        static children(element: HTMLElement): HTMLElement[];
        /**
         * <p>Appends the child nodes from the source element to the target element.</p>
         * @param source - <p>The source element.</p>
         * @param target - <p>The target element.</p>
         * @returns <p>The target element.</p>
         */
        static appendChildren(source: HTMLElement, target: HTMLElement): HTMLElement;
        /**
         * <p>Removes the specified node.</p>
         * @param element - <p>The node to remove.</p>
         * @returns <p>A Node object, representing the removed node, or null if the node does not exist.</p>
         */
        static remove(element: HTMLElement): Node;
        /**
         * <p>Removes all the children of the specified element.</p>
         * @param element - <p>The element for which the children will be removed.</p>
         */
        static removeChildren(element: HTMLElement): void;
        /**
         * <p>Surrounds the content with the specified element.</p>
         * @param element - <p>The element to make parent of the specified content.</p>
         * @param content - <p>The content node(s) to surround with the specified element.</p>
         * @returns <p>The specified element.</p>
         */
        static surround(element: HTMLElement, content: Node | DocumentFragment): HTMLElement;
        /**
         * <p>Replaces itself for it's child nodes.</p>
         * @param element - <p>The element to replace.</p>
         * @returns <p>The replaced element.</p>
         */
        static unsurround(element: HTMLElement): HTMLElement;
        /**
         * <p>Extracts the child nodes from the specified element by appending the nodes to a document fragment or array.</p>
         * @param element - <p>The element containing the child nodes to extract.</p>
         * @param [toArray] - <p>A value indicating if the nodes should be extracted to an array.</p>
         * @returns <p>A document fragment or array containing the extracted child nodes.</p>
         */
        static extract(element: HTMLElement, toArray?: boolean): DocumentFragment | HTMLElement[];
        /**
         * <p>Converts the HTML text to a document fragment.</p>
         * @param text - <p>The HTML text.</p>
         * @returns <p>A document fragment containing the nodes from the HTML string.</p>
         */
        static fragmentFromHTML(text: string): DocumentFragment;
        /**
         * <p>Inserts the node at the current caret (cursor) position (overriding any selection).</p>
         * @param node - <p>The node to insert.</p>
         * @param [select] - <p>A value indicating if the inserted node must be selected.</p>
         * @param [deleteContent] - <p>A value indicating if the content within the range should be removed prior to the insertion of the node.</p>
         * @param [range] - <p>A range in which the node will be inserted. By default the current selection range is used.</p>
         */
        static insertNode(node: Node, select?: boolean, deleteContent?: boolean, range?: Range): void;
        /**
         * <p>Gets the nodes within the current selection range.</p>
         * @param [nodeName] - <p>A single node name or a space separated string with node names to filter the result list.</p>
         * @param [range] - <p>A selection range from which nodes are retrieved. By default the current selection range is used.</p>
         * @returns <p>A list of nodes (which satisfy the optional filter) within the selection range.</p>
         */
        static getNodesInRange(nodeName?: string, range?: Range): Node[];
        /**
         * <p>Encodes a js string</p>
         * @param text - <p>The text to encode</p>
         * @returns <p>An encoded string</p>
         */
        static encodeString(text: string): string;
        /**
         * <p>Encodes an html string</p>
         * @param text - <p>The text to encode</p>
         * @returns <p>An encoded string</p>
         */
        static encodeHTML(text: string): string;
        /**
         * <p>Checks if the element's classname property contains the css class(es).</p>
         * @param element - <p>The element to check.</p>
         * @param cssClass - <p>Name of the css class.</p>
         * @returns <p>Returns true if the element's classname contains the cssClass, otherwise false.</p>
         */
        static hasClass(element: HTMLElement, cssClass: string): boolean;
        /**
         * <p>Toggles between css class(es) by removing the class if it's already defined on the element and otherwise adding it.</p>
         * @param element - <p>The element.</p>
         * @param cssClass - <p>Name of the css class or classes separated by a space.</p>
         */
        static toggleClass(element: HTMLElement, cssClass: string): void;
        /**
         * <p>Adds the specified css class(es) to the element.</p>
         * @param element - <p>The element.</p>
         * @param cssClass - <p>Name of the css class or classes separated by a space.</p>
         */
        static addClass(element: HTMLElement, cssClass: string): void;
        /**
         * <p>Removes the specified css class(es) from the element.</p>
         * @param element - <p>The element.</p>
         * @param cssClass - <p>Name of the css class or classes separated by a space.</p>
         */
        static removeClass(element: HTMLElement, cssClass: string): void;
        /**
         * <p>Retrieves the current inline or computed value of a style property.</p>
         * @param element - <p>The element.</p>
         * @param property - <p>Style property name in camelcase (backgroundColor) or separated by hyphens (background-color).</p>
         * @param computed - <p>Defines if only a computed style value should be retrieved.</p>
         * @returns <p>The element style.</p>
         */
        static styleValue(element: HTMLElement, property: string, computed: boolean): string;
        /**
         * <p>Sets the style text of an element.</p>
         * @param element - <p>The element.</p>
         * @param style - <p>Style text.</p>
         */
        static setStyle(element: HTMLElement, style: string): void;
        /**
         * <p>Updates the CSS style declaration of an HTMLElement or Stylesheet. Empty style properties are removed.</p>
         * @param style - <p>The current style.</p>
         * @param text - <p>The style text with which the current style is updated.</p>
         */
        static updateStyle(style: CSSStyleDeclaration, text: string): void;
        /**
         * <p>Copies the computed style of the source element to the target element.</p>
         * @param source - <p>The source element.</p>
         * @param target - <p>The target element.</p>
         */
        static copyComputedStyle(source: HTMLElement, target: HTMLElement): void;
        /**
         * <p>Gets the stylesheet by source url or id.
         * The stylesheet will be matched on id if the id parameter is passed.</p>
         * @param id - <p>Id of the stylesheet.</p>
         * @param src - <p>Src of the stylesheet.</p>
         * @returns <p>Stylesheet object.</p>
         */
        static getStyleSheet(id: string, src: string): any;
        /**
         * <p>Gets the source element for the current event.</p>
         * @param e - <p>The event.</p>
         * @returns <p>Source element.</p>
         */
        static eventSource(e: any): HTMLElement;
        /**
         * <p>Gets the related element for the current event.</p>
         * @param e - <p>The event</p>
         * @returns <p>Related element.</p>
         */
        static eventRelated(e: any): HTMLElement;
        /**
         * <p>Gets the x coordinate of the (mouse)pointer.</p>
         * @param e - <p>The event.</p>
         * @returns <p>ClientX position.</p>
         */
        static clientX(e: any): number;
        /**
         * <p>Gets the y coordinate of the (mouse)pointer.</p>
         * @param e - <p>The event.</p>
         * @returns <p>ClientY position.</p>
         */
        static clientY(e: any): number;
        /**
         * <p>Gets the absolute page position coordinates of the element.</p>
         * @param element - <p>The element.</p>
         * @param [parent] - <p>An element to get the position coordinates of the element, relative to its parent element.</p>
         * @param [fixed] - <p>A value indicating if fixed position values (ignoring scrollbar positions) should be returned.</p>
         * @returns <p>An object wich describes the position values.</p>
         */
        static getPos(element: HTMLElement, parent?: HTMLElement, fixed?: boolean): componyx.library.Position;
        /**
         * <p>Sets the position coordinates of the specified element so that it matches the specified position on the page (NOT relative to a parent element).</p>
         * @param element - <p>The element.</p>
         * @param pagePos - <p>The horizontal and/or vertical position in pixels specified via the object keys top, right, bottom of left.</p>
         * @param [keepMargin] - <p>Defines if specified element margins must be preserved.</p>
         */
        static setPos(element: HTMLElement, pagePos: any, keepMargin?: boolean): void;
        /**
         * <p>Returns the first relative, absolute or fixed positioned parent element if there is any.</p>
         * @param element - <p>The element.</p>
         * @returns <p>A positioned parent element or null when no positioned parent is found.</p>
         */
        static positionedParent(element: HTMLElement): HTMLElement;
        /**
         * <p>Returns the scrollLeft and scrollTop positions.</p>
         * @returns <p>An object which describes the scroll values.</p>
         */
        static getScrollPosition(): componyx.library.ScrollPos;
        /**
         * <p>Escapes a regular expression string to use with the regexp object.</p>
         * @param text - <p>The text to escape.</p>
         * @returns <p>The escaped text.</p>
         */
        static escapeRegExp(text: string): string;
        /**
         * <p>Removes leading and trailing white space characters, new lines and tabs from the specified string.</p>
         * @param text - <p>Text to trim.</p>
         * @returns <p>the trimmed text.</p>
         */
        static trim(text: string): string;
        /**
         * <p>Checks if the text strats with the specified prefix.</p>
         * @param ignoreCase - <p>Defines if the comparison should be case-insensitive.</p>
         * @returns <p>Returns true if the text staats with the specified prefix, otherwise false.</p>
         */
        static startsWith(text: string, prefix: string, ignoreCase: boolean): boolean;
        /**
         * <p>Checks if the text ends with the specified suffix.</p>
         * @param ignoreCase - <p>Defines if the comparison should be case-insensitive.</p>
         * @returns <p>Returns true if the text ends with the specified suffix, otherwise false.</p>
         */
        static endsWith(text: string, suffix: string, ignoreCase: boolean): boolean;
        /**
         * <p>Searches for a specified value within an array and returns its index (or -1 if not found).</p>
         * @param items - <p>Array to search.</p>
         * @param comparer - <ul>
         * <li>
         * <ol>
         * <li>A value of any type to compare with.</li>
         * </ol>
         * </li>
         * <li>
         * <ol start="2">
         * <li>A function which accepts the item to compare as argument and returns a boolean value indicating if there was a successful match.</li>
         * </ol>
         * </li>
         * </ul>
         * @param ignoreCase - <p>Defines if the comparison should be case-insensitive.</p>
         * @param strictCompare - <p>Defines if the comparison should be strict. Compared values only match when they are of the same type (true by default).</p>
         * @returns <p>Index of the found item or -1 if not found.</p>
         */
        static indexOf(items: any[], comparer: any, ignoreCase: boolean, strictCompare: boolean): number;
        /**
         * <p>Iterates through the items in the array and evaluates each object against the specified comparer function.
         * The iteration is called recursively when the recursionKey is found on an object.</p>
         * @param items - <p>The root array.</p>
         * @param recursionKey - <p>The object key which points to the child items array. Separate object keys with a dot &quot;.&quot; to denote a deeper level.</p>
         * @param comparer - <p>A function which accepts the item to compare as argument and returns a boolean value indicating if there was a successful match.</p>
         * @param scalar - <p>A value indicating to return a single result which makes the iteration stop after a match.</p>
         * @returns <p>An array of Path instances or a single Path instance when the scalar option was provided. The Path object offers methods to navigate in any direction from a specific item within the tree.</p>
         */
        static path(items: any[], recursionKey: string, comparer: (...params: any[]) => any, scalar: boolean): componyx.library.Path[] | componyx.library.Path;
        /**
         * <p>Creates and returns an object for disabling and enabling text selection for the specified element and underlaying elements.</p>
         * @param element - <p>The element.</p>
         * @returns <p>An object to control the text selection behaviour.</p>
         */
        static textSelection(element: HTMLElement): componyx.library.Toggle;
        /**
         * <p>Converts the rgb color to a hexadecimal string.</p>
         * @param red - <p>0-255 numeric value.</p>
         * @param green - <p>0-255 numeric value.</p>
         * @param blue - <p>0-255 numeric value.</p>
         * @returns <p>The hex value.</p>
         */
        static rgbToHex(red: number, green: number, blue: number): string;
        /**
         * <p>Converts a hexadecimal color string to a rgb color.</p>
         * @param hex - <p>hex color string.</p>
         * @returns <p>The R,G,B values.</p>
         */
        static hexToRgb(hex: string): Number[];
        /**
         * <p>Converts the rgb value to hsv.</p>
         * @param r - <p>The red value 0-255.</p>
         * @param g - <p>The green value 0-255.</p>
         * @param b - <p>The blue value 0-255.</p>
         * @returns <p>The hue saturation value.</p>
         */
        static rgbToHsv(r: number, g: number, b: number): Number[];
        /**
         * <p>Converts the hsv value to rgb.</p>
         * @param h - <p>The hue value 0-1.</p>
         * @param s - <p>The saturation value 0-1.</p>
         * @param v - <p>The lightness value 0-1.</p>
         * @returns <p>The rgb value.</p>
         */
        static hsvToRgb(h: number, s: number, v: number): Number[];
        /**
         * <p>Gets the width and height of the window.</p>
         * @returns <p>An object describing the width and height sizes.</p>
         */
        static getWindowSize(): componyx.library.Dimensions;
        /**
         * <p>Gets the width and height of a scrollbar.</p>
         * @returns <p>An object describing the width and height sizes.</p>
         */
        static getScrollBarSize(): componyx.library.Dimensions;
        /**
         * <p>Adds the specified unit or the default 'px' unit to the value if the unit is missing.</p>
         * @param value - <p>Nummeric value.</p>
         * @param unit - <p>Css unit.</p>
         * @returns <p>The value with the specified or default unit.</p>
         */
        static unit(value: string, unit: string): string;
        /**
         * <p>Returns the full size of an element, including the border, padding and optional margin sizes.</p>
         * @param element - <p>The element.</p>
         * @param [includeMargin] - <p>A value indicating if element margin sizes must be included.</p>
         * @returns <p>An object describing the width and height sizes.</p>
         */
        static size(element: HTMLElement, includeMargin?: boolean): componyx.library.Dimensions;
        /**
         * <p>Returns the border sizes of the element in pixels.</p>
         * @param element - <p>The element.</p>
         * @returns <p>An object describing the border sizes of the element.</p>
         */
        static border(element: HTMLElement): componyx.library.BorderSizes;
        /**
         * <p>Returns the padding sizes of the element in pixels.</p>
         * @param element - <p>The element.</p>
         * @returns <p>An object describing the padding sizes of the element.</p>
         */
        static padding(element: HTMLElement): componyx.library.PaddingSizes;
        /**
         * <p>Returns the border size, padding size and combined size (width and height of border and padding) in pixels.</p>
         * @param element - <p>The element.</p>
         * @param [computeSize] - <p>A value indicating if the combined size (width and height of border and padding) is computed. When omitted the size is only computed when the element has the default CSS box-sizing value (content-box).</p>
         * @returns <p>An object describing the border &amp; padding size of the element.</p>
         */
        static borderAndPadding(element: HTMLElement, computeSize?: boolean): componyx.library.BorderPaddingSizes;
        /**
         * <p>Returns the margin sizes of the element in pixels.</p>
         * @param element - <p>The element.</p>
         * @returns <p>An object describing the margin sizes of the element.</p>
         */
        static margin(element: HTMLElement): componyx.library.MarginSizes;
        /**
         * <p>Checks if the node is present in the current document.</p>
         * @param node - <p>The node to check.</p>
         * @returns <p>A value indicating if the node is present in the current document.</p>
         */
        static isInDOM(node: Node): boolean;
        /**
         * <p>Checks if the node is a child of the specified parent element.</p>
         * @param parent - <p>The parent element.</p>
         * @param node - <p>The node for which to check if it is a child of the specified parent.</p>
         * @returns <p>A value indicating if the node is a child of the specified parent element.</p>
         */
        static contains(parent: HTMLElement, node: Node): boolean;
        /**
         * <p>Returns a new string that right-aligns the characters in this instance by padding them on the left with a specified Unicode character, for a specified total length.</p>
         * @param value - <p>The string value on which the operation is applied.</p>
         * @param length - <p>The number of characters in the resulting string, equal to the number of original characters plus any additional padding characters.</p>
         * @param text - <p>The padding character(s).</p>
         * @returns <p>Left padded text.</p>
         */
        static padLeft(value: string, length: number, text?: string): string;
        /**
         * <p>Returns a new string that left-aligns the characters in this instance by padding them on the right with a specified Unicode character, for a specified total length.</p>
         * @param value - <p>The string value on which the operation is applied.</p>
         * @param length - <p>The number of characters in the resulting string, equal to the number of original characters plus any additional padding characters.</p>
         * @param text - <p>The padding character(s).</p>
         * @returns <p>Right padded text.</p>
         */
        static padRight(value: string, length: number, text?: string): string;
        /**
         * <p>Rounds the number with the specified rounding type and precision.</p>
         * @param value - <p>Numeric value.</p>
         * @param precision - <p>Amount of decimal places.</p>
         * @param [rounding] - <p>Type of decimal rounding (round (default), floor or ceil).</p>
         * @returns <p>Rounded numeric value.</p>
         */
        static roundNumber(value: number, precision: number, rounding?: string): number;
        /**
         * <p>Reverses the specified text.</p>
         * @param text - <p>Text to reverse.</p>
         * @returns <p>Reversed text.</p>
         */
        static reverseText(text: string): string;
        /**
         * <p>Replaces each parameter in a specified String with the text equivalent of a corresponding object's value.</p>
         * @param text - <p>Text to which the format will be applied.</p>
         * @param args - <p>A variable amount of parameters or an object with named keys to be replaced in the text string.</p>
         * @returns <p>The formatted text.</p>
         */
        static format(text: string, ...args: any[]): string;
        static format(text: string, args: Record<string, any>): string;
        /**
         * <p>Formats a numeric value for textual display.</p>
         * @param value - <p>Numeric value.</p>
         * @param [leadingZeros] - <p>Defines if leading zeros should be displayed.</p>
         * @param [trailingZeros] - <p>Defines if trailing zeros on the decimal side should be displayed.</p>
         * @param [precision] - <p>Amount of decimal places.</p>
         * @param [rounding] - <p>Type of decimal rounding when rounding is desired (round, floor or ceil).</p>
         * @param [decimalSeparator = .] - <p>The character used as decimal separator.</p>
         * @param [groupSeparator] - <p>The character used as group separator.</p>
         * @param [digitPadLeftValue] - <p>The specified value is used to right-align the digits by padding this value to the left.</p>
         * @returns <p>The formatted number text. The value is returned unchanged when it is empty or not a number.</p>
         */
        static formatNumber(value: number, leadingZeros?: boolean, trailingZeros?: boolean, precision?: number, rounding?: string, decimalSeparator?: string, groupSeparator?: string, digitPadLeftValue?: string): string;
        /**
         * <p>Formats a date value for textual display.</p>
         * @param date - <p>The Date value.</p>
         * @param format - <p>The Date format as in 'MM-dd-yyyy hh:mm:ss'. Casing for Month and minutes is required, other casings are ignored.</p>
         * @returns <p>The formatted date text.</p>
         */
        static formatDate(date: Date, format: string): string;
        /**
         * <p>Parses a string value to a workable date object.</p>
         * @param value - <p>Date value as string.</p>
         * @param format - <p>Date format as in 'mm-dd-yyyy hh:mm:ss'.</p>
         * @returns <p>New Date object.</p>
         */
        static parseDate(value: string, format: string): Date;
        /**
         * <p>Returns true if the specified year is a leap year, otherwise false.</p>
         * @param year - <p>The year.</p>
         * @returns <p>A value indicating if the specified year is a leap year.</p>
         */
        static isLeapYear(year: number): boolean;
        /**
         * <p>Gets the ISO-8601 week number (Mon-Sun, first 4 day week) or the alternative variant (Sun-Sat/Sat-Fri, first week has 1st of January) when the first day is specified as Saturday or Sunday.</p>
         * @param date - <p>Date object.</p>
         * @param [firstDay = 1] - <p>Day of the week 0:Sunday, 1:Monday, 6:Saturday.</p>
         * @returns <p>Week number.</p>
         */
        static getWeekNumber(date: Date, firstDay?: number): number;
        /**
         * <p>Gets the start date of the week by following the ISO-8601 standard.</p>
         * @param week - <p>The week number.</p>
         * @param year - <p>The year.</p>
         * @param firstDay - <p>Day of the week (0-6). 0:Sunday, 6:Saturday.</p>
         * @returns <p>The start date of the week.</p>
         */
        static getDateOfWeek(week: number, year: number, firstDay: number): Date;
        /**
         * <p>Selects a range of characters within the element.</p>
         * @param element - <p>The element.</p>
         * @param start - <p>Start index of selection.</p>
         * @param [length] - <p>Selection length.</p>
         */
        static selectTextRange(element: HTMLElement, start: number, length?: number): void;
        /**
         * <p>Sets the text or value of a DOM element/node.</p>
         * @param element - <p>The element/node.</p>
         * @param text - <p>Text content.</p>
         */
        static setText(element: HTMLElement, text: string): void;
        /**
         * <p>Checks if an element is focusable.</p>
         * @param element - <p>The element.</p>
         * @returns <p>A value indicating if the element is focusable.</p>
         */
        static focusable(element: HTMLElement): boolean;
        /**
         * <p>Checks if an element is visible.</p>
         * @param element - <p>The element to check.</p>
         * @param [container] - <p>If specified the visibility style on the element's parents within the container are checked.</p>
         * @returns <p>A value indicating if the element is visible.</p>
         */
        static visible(element: HTMLElement, container?: HTMLElement): boolean;
        /**
         * <p>Detects and returns the scrollable root element.</p>
         * @returns <p>The scrollable root element.</p>
         */
        static scrollableRoot(): HTMLElement;
        /**
         * <p>Creates a new instance by calling the specified constructor and initializes the new object with the specified properties.</p>
         * @param constructor - <p>An object's constructor function.</p>
         * @param properties - <p>The initialization properties of the new object.</p>
         * @returns <p>The new object instance.</p>
         */
        static instantiate(constructor: (...params: any[]) => any, properties: any): any;
        /**
         * <p>Defers the specified method until the current task stack has finished processing.</p>
         * @param fn - <p>The method to invoke as soon as possible after the current task stack has finished. Use the native bind method to pass in arguments.</p>
         */
        static defer(fn: (...params: any[]) => any): void;
        /**
         * <p>Scrolls to the vertical or horizontal position of the specified element.</p>
         * @param element - <p>The element to scroll to.</p>
         * @param [scrollElement] - <p>A parent scroll element.</p>
         * @param [type] - <p>A value indicating if scrolling should be vertical (0), horizontal (1) or vertical &amp; horizontal (2).</p>
         * @param [animationSettings] - <p>Animation settings for the scroll effect.</p>
         */
        static scrollTo(element: HTMLElement, scrollElement?: HTMLElement, type?: number, animationSettings?: componyx.library.animationSettings): void;
        /**
         * <p>Checks if the specified element is visible within the current viewport (window dimensions with vertical and horizontal scrollbar position).</p>
         * @param element - <p>The element to check for.</p>
         * @returns <p>An object describing the element's visibility within the viewport.</p>
         */
        static inViewport(element: HTMLElement): componyx.library.Viewport;
        /**
         * <p>Logs the message in the js console if available.</p>
         * @param message - <p>The message to log.</p>
         */
        static log(message: string): void;
        /**
         * <p>Gets the active document object, defaulting to the global window document when none is explicitly set.</p>
         * @returns <p>The active document object.</p>
         */
        static getDocument(): Document;
        /**
         * <p>The active document object.</p>
        */
        static document: HTMLElement | null;
        /**
         * <p>A value indicating if we are dealing with a touch device.</p>
        */
        static touch: boolean;
        /**
         * <p>This variable will hold the last active HTML event object.</p>
        */
        static event: Event | null;
        /**
         * <p>This variable will hold the active WebSocket connections.</p>
        */
        static webSockets: WebSocket[];
        /**
         * <p>The default animation settings.</p>
         */
        static animationSettings: componyx.library.animationSettings;
        /**
         * <p>Global handlers that fire for every HTTP request.</p>
         */
        static httpRequestHandlers: componyx.library.httpRequestHandlers;
        /**
         * <p>The default XHR request settings.</p>
         */
        static xhrSettings: componyx.library.xhrSettings;
        /**
         * <p>The default WebSocket settings.</p>
         */
        static wsSettings: componyx.library.wsSettings;
    }
}

declare var $lib: componyx.LibrarySelector & typeof componyx.library;
declare var $: typeof $lib;
/**
 * <p>Shorthand for the componyx root namespace.</p>
 */
declare var CMP: typeof componyx;