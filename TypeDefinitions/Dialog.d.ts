declare namespace componyx 
{
    namespace UI
    {
        interface Dialog extends componyx.UI.base.methods { }
        /**
         * <p>Dialog class.</p>
         */
        class Dialog extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new Dialog instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<Dialog> | HTMLElement);
            /**
             * <p>Dialog events</p>
             */
            events: componyx.UI.Dialog.DialogEvents;
            /**
             * <p>Sets the header template</p>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setHeaderTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the footer template</p>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setFooterTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Sets the content template</p>
             * @param content - <p>HTML string or element node as content. Pass null or empty string to remove the existing template.</p>
             */
            setContentTemplate(content: HTMLElement | HTMLElement[] | DocumentFragment | string): void;
            /**
             * <p>Gets the underlaying box component.</p>
             */
            getBox(): componyx.UI.Box;
            /**
             * <p>Shows the component.</p>
             */
            show(): void;
            /**
             * <p>Shows the dialog in confirmation mode.</p>
             * @param callBack - <p>A callback function to invoke after confirmation.</p>
             * @param [header] - <p>HTML string or element node as content.</p>
             * @param [content] - <p>HTML string or element node as content.</p>
             * @param [footer] - <p>HTML string or element node as content.</p>
             * @param [confirmText] - <p>The text of the confirmation button.</p>
             * @param [denyText] - <p>The text of the deny button.</p>
             */
            confirm(callBack: (...params: any[]) => any, header?: HTMLElement | HTMLElement[] | DocumentFragment | string, content?: HTMLElement | HTMLElement[] | DocumentFragment | string, footer?: HTMLElement | HTMLElement[] | DocumentFragment | string, confirmText?: string, denyText?: string): void;
            /**
             * <p>Shows the dialog in alert mode.</p>
             * @param callBack - <p>A callback function to invoke after confirmation.</p>
             * @param [header] - <p>HTML string or element node as content.</p>
             * @param [content] - <p>HTML string or element node as content.</p>
             * @param [footer] - <p>HTML string or element node as content.</p>
             * @param [confirmText] - <p>The text of the confirmation button.</p>
             */
            alert(callBack: (...params: any[]) => any, header?: HTMLElement | HTMLElement[] | DocumentFragment | string, content?: HTMLElement | HTMLElement[] | DocumentFragment | string, footer?: HTMLElement | HTMLElement[] | DocumentFragment | string, confirmText?: string): void;
            /**
             * <p>Hides the component</p>
             */
            hide(): void;
            /**
             * <p>Renders the component</p>
             */
            render(): void;
            /**
             * <p>Destroys the component.</p>
             */
            destroy(): void;
            /**
             * <p>Gets or sets the css class of the box, which is used for the dialog layout.</p>
            */
            cssClassBox: string;
            /**
             * <p>Gets or sets the css class of the content header.</p>
            */
            cssClassContentHeader: string;
            /**
             * <p>Gets or sets the css class of the content footer.</p>
            */
            cssClassContentFooter: string;
            /**
             * <p>Gets or sets the css class of the content holder.</p>
            */
            cssClassContentHolder: string;
            /**
             * <p>Gets or sets the css class of the button holder for both the header and footer of the dialog.</p>
            */
            cssClassButtonHolder: string;
            /**
             * <p>Gets or sets a value indicating whether the dialog will be automatically closed on a button event.</p>
            */
            autoClose: boolean;
            /**
             * <p>Gets or sets a value indicating whether the dialog confirm action is executed when the enter-key is pressed within a field inside the box element.</p>
            */
            confirmOnEnterKey: boolean;
            /**
             * <p>Gets or sets the button settings.</p>
            */
            buttons: {
                close: boolean;
                confirm: boolean;
                deny: boolean;
                cancel: boolean;
                confirmText: string;
                denyText: string;
                cancelText: string;
                closeButtonId: string | null;
                confirmButtonId: string | null;
                denyButtonId: string | null;
                cancelButtonId: string | null;
            };
        }
        namespace Dialog
        {
            /**
             * @property onConfirm - <p>Event which fires when the dialog is confirmed.</p>
             * @property onDeny - <p>Event which fires when the dialog is denied.</p>
             * @property onCancel - <p>Event which fires when the dialog is cancelled.</p>
             * @property onClose - <p>Event which fires when the dialog is closed.</p>
             * @property onShowComplete - <p>Event which fires when the show animation has completed. Also called when animation type is 'none'.</p>
             * @property onHideComplete - <p>Event which fires when the hide animation has completed. Also called when animation type is 'none'.</p>
             */
            class DialogEvents extends componyx.UI.base.Events<componyx.UI.Dialog>
            {
                constructor();
                /**
                 * <p>Event which fires when the dialog is confirmed.</p>
                */
                onConfirm: componyx.UI.base.Event<componyx.UI.Dialog, undefined>;
                /**
                 * <p>Event which fires when the dialog is denied.</p>
                */
                onDeny: componyx.UI.base.Event<componyx.UI.Dialog, undefined>;
                /**
                 * <p>Event which fires when the dialog is cancelled.</p>
                */
                onCancel: componyx.UI.base.Event<componyx.UI.Dialog, undefined>;
                /**
                 * <p>Event which fires when the dialog is closed.</p>
                */
                onClose: componyx.UI.base.Event<componyx.UI.Dialog, undefined>;
                /**
                 * <p>Event which fires when the show animation has completed. Also called when animation type is 'none'.</p>
                */
                onShowComplete: componyx.UI.base.Event<componyx.UI.Dialog, undefined>;
                /**
                 * <p>Event which fires when the hide animation has completed. Also called when animation type is 'none'.</p>
                */
                onHideComplete: componyx.UI.base.Event<componyx.UI.Dialog, undefined>;
            }
        }
    }
}