declare namespace componyx 
{
    namespace UI
    {
        interface FileUpload extends componyx.UI.base.methods { }

        /**
         * <p>FileUpload class.</p>
         */
        class FileUpload extends componyx.UI.base.Component implements componyx.UI.base.methods
        {
            /**
             * Creates a new FileUpload instance.
             * @param id - <p>The id of the component.</p>
             * @param properties - <p>The properties used to initialize the component or the container element.</p>
             */
            constructor(id: string, properties: Partial<FileUpload> | HTMLElement);
            ajax: componyx.UI.base.Component['ajax'] & {
                /**
                 * <p>AJAX method used to upload data to the server.</p>
                 */
                upload: componyx.UI.base.AjaxMethod;
            };
            cssClassSelectButton: string;
            cssClassUploadButton: string;
            cssClassCancelButton: string;
            cssClassDropzone: string;
            cssClassList: string;
            cssClassName: string;
            cssClassProgressBar: string;
            cssClassState: string;
            cssClassSuccess: string;
            cssClassError: string;
            cssClassAbort: string;
            accept: string;
            maxFileSize: number | null;
            maxFiles: number | null;
            /**
             * <p>Gets or sets a value indicating if duplicate files (matched by name, size, and last modified date) are prevented from being added again.</p>
             */
            preventDuplicates: boolean;
            dragAndDrop: boolean;
            dropLabel: string;
            successLabel: string;
            errorLabel: string;
            abortLabel: string;
            selectButtonLabel: string;
            selectButtonId: string;
            uploadButtonLabel: string;
            uploadButtonId: string;
            cancelButtonLabel: string;
            cancelButtonId: string;
            rejectedDialogHeader: string;
            rejectedDialogId: string;
            /**
             * * <p>A readonly snapshot of the current files in the queue.</p>
             */
            readonly files: File[];
            /**
             * * <p>Indicates whether an upload is currently in progress.</p>
             */
            readonly uploading: boolean;
            /**
             * <p>FileUpload events</p>
             */
            events: componyx.UI.FileUpload.FileUploadEvents;
            /**
             * <p>Uploads the selected file(s).</p>
             */
            upload(): void;
            /**
             * <p>Gets the list of successfully uploaded files.
             * Each entry is either the server response object, or if no JSON data response, an object with the file name.</p>
             * @returns <p>An array of objects holding the uploaded file information.</p>
             */
            getValue(): object[];
            /**
             * <p>Clears the upload progression info.</p>
             */
            clear(): void;
            /**
             * <p>Cancels the upload.</p>
             * @param [file] - <p>The file to cancel. All files are canceled if omitted.</p>
             */
            cancel(file?: File): void;
            /**
             * <p>Renders the component.</p>
             */
            render(): void;
            /**
             * <p>Destroys the component.</p>
             */
            destroy(): void;
        }
        namespace FileUpload
        {
            /**
             * @property onChange - <p>Fires when the file input selection has changed.</p>
             * @property onDragOver - <p>Fires repeatedly while the (mouse) pointer drags over the drop-zone.</p>
             * @property onDragLeave - <p>Fires when the (mouse) pointer drags out of the drop-zone.</p>
             * @property onDrop - <p>Fires when files are dropped onto the drop-zone.</p>
             * @property onAccept - <p>Fires when files are selected through drag & drop or the file input.</p>
             * @property onCancel - <p>Fires when a file is canceled before being uploaded.</p>
             * @property onPreUploadFile - <p>Fires before a file upload starts.</p>
             * @property onUploadProgress - <p>Fires during the upload transfer, providing progress updates.</p>
             * @property onPostUploadFile - <p>Fires after a file upload completes and the server has responded.</p>
             * @property onUploadComplete - <p>Fires when all files have been uploaded.</p>
             */
            class FileUploadEvents extends componyx.UI.base.Events<componyx.UI.FileUpload>
            {
                constructor();
                /**
                 * <p>Fires when the file input selection has changed.</p>
                */
                onChange: componyx.UI.base.Event<componyx.UI.FileUpload, undefined>;
                /**
                 * <p>Fires repeatedly while the (mouse) pointer drags over the drop-zone. The event arguments are the native DragEvent.</p>
                */
                onDragOver: componyx.UI.base.Event<componyx.UI.FileUpload, DragEvent>;
                /**
                 * <p>Fires when the (mouse) pointer drags out of the drop-zone. The event arguments are the native DragEvent.</p>
                */
                onDragLeave: componyx.UI.base.Event<componyx.UI.FileUpload, DragEvent>;
                /**
                 * <p>Fires when files are dropped onto the drop-zone. The event arguments are the native DragEvent.</p>
                */
                onDrop: componyx.UI.base.Event<componyx.UI.FileUpload, DragEvent>;
                /**
                 * <p>Fires when files are selected through drag & drop or the file input.</p>
                */
                onAccept: componyx.UI.base.Event<componyx.UI.FileUpload, componyx.UI.FileUpload.AcceptEventArgs>;
                /**
                 * <p>Fires when a file is canceled before being uploaded.</p>
                */
                onCancel: componyx.UI.base.Event<componyx.UI.FileUpload, componyx.UI.FileUpload.CancelEventArgs>;
                /**
                 * <p>Fires before a file upload starts.</p>
                */
                onPreUploadFile: componyx.UI.base.Event<componyx.UI.FileUpload, componyx.UI.FileUpload.PreUploadFileEventArgs>;
                /**
                 * <p>Fires during the upload transfer, providing progress updates.</p>
                */
                onUploadProgress: componyx.UI.base.Event<componyx.UI.FileUpload, componyx.UI.FileUpload.UploadProgressEventArgs>;
                /**
                 * <p>Fires after a file upload completes and the server has responded.</p>
                */
                onPostUploadFile: componyx.UI.base.Event<componyx.UI.FileUpload, componyx.UI.FileUpload.PostUploadFileEventArgs>;
                /**
                 * <p>Fires when all files have been uploaded.</p>
                */
                onUploadComplete: componyx.UI.base.Event<componyx.UI.FileUpload, undefined>;
            }
            /**
             * <p>FileUpload accept event arguments.</p>
             */
            type AcceptEventArgs = {
                /** <p>The file to accept.</p> */
                file: File;
                /** <p>Set to true to cancel the default action of accepting the file (reject).</p> */
                cancel: boolean;
            };
            /**
             * <p>FileUpload cancel event arguments.</p>
             */
            type CancelEventArgs = {
                /** <p>The id of the list item.</p> */
                id: string;
                /** <p>The file that was canceled.</p> */
                file: File;
                /** <p>The index of the file in the file list.</p> */
                fileIndex: number;
            };
            /**
             * <p>FileUpload pre-upload event arguments.</p>
             */
            type PreUploadFileEventArgs = {
                /** <p>The index of the file being uploaded.</p> */
                fileIndex: number;
                /** <p>The form data object used for the upload request.</p> */
                formData: FormData;
            };
            /**
             * <p>FileUpload upload progress event arguments.</p>
             */
            type UploadProgressEventArgs = {
                /** <p>The index of the file being uploaded.</p> */
                fileIndex: number;
                /** <p>The wrapped XHR request for this upload.</p> */
                xhr: componyx.library.XhrWrappedResult;
                /** <p>The upload transfer progress as a percentage (0-100).</p> */
                percentage: number;
            };
            /**
             * <p>FileUpload post-upload event arguments.</p>
             */
            type PostUploadFileEventArgs = {
                /** <p>The index of the file that was uploaded.</p> */
                fileIndex: number;
                /** <p>The wrapped XHR request for this upload.</p> */
                xhr: componyx.library.XhrWrappedResult;
                /** <p>The uploaded file info; either the server response object or an object with the file name.</p> */
                file: any;
            };
        }
    }
}