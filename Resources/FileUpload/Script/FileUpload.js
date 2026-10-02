/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";
(function (window)
{
    /**
   * FileUpload class.
   * @class
   * @memberof componyx.UI
   * @augments componyx.UI.base.Component
   * @mixes componyx.UI.base.methods
   * @param {String} id The id of the component.
   * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
   * @property {componyx.UI.base.AjaxMethod} ajax.upload - AJAX method used to upload data to the server.
   * @returns {componyx.UI.FileUpload} An instance of the component.
   */
    componyx.UI.FileUpload = function FileUpload(id, properties)
    {
        // define private properties
        var _instance = this,
            _input, _selectButton, _uploadButton, _dropzone, _list, _progressBar, _accept,
            _xhr = [], _files = [], _uploadedFiles = [],
            _uploading = false, _complete = false,
            _suffix = ["B", "KB", "MB", "GB", "TB"], _cancelButtons,
            _classOption =
            {
                SELECTBUTTON: 'button select',
                UPLOADBUTTON: 'button upload',
                CANCELBUTTON: 'button cancel',
                DROPZONE: 'drop-zone',
                LIST: 'list',
                NAME: 'name',
                PROGRESSBAR: 'progress',
                STATE: 'state',
                SUCCESS: 'success',
                ERROR: 'error',
                ABORT: 'error'
            },
            _themeOption = $base.static.ThemeOption;

        /**
         * Gets or sets the css class of the select button.
         * @type {String}
         */
        this.cssClassSelectButton = '';

        /**
         * Gets or sets the css class of the upload button.
         * @type {String}
         */
        this.cssClassUploadButton = '';

        /**
         * Gets or sets the css class of the cancel buttons.
         * @type {String}
         */
        this.cssClassCancelButton = '';

        /**
         * Gets or sets the css class of the drop-zone.
         * @type {String}
         */
        this.cssClassDropzone = '';

        /**
         * Gets or sets the css class of the list.
         * @type {String}
         */
        this.cssClassList = '';

        /**
         * Gets or sets the css class of the name container in the list.
         * @type {String}
         */
        this.cssClassName = '';

        /**
         * Gets or sets the css class of the progress bar.
         * @type {String}
         */
        this.cssClassProgressBar = '';

        /**
         * Gets or sets the css class of the list-item state container.
         * @type {String}
         */
        this.cssClassState = '';

        /**
         * Gets or sets the css class applied to the state container when the upload was successful.
         * @type {String}
         */
        this.cssClassSuccess = '';

        /**
         * Gets or sets the css class applied to the state container when the upload failed.
         * @type {String}
         */
        this.cssClassError = '';

        /**
         * Gets or sets the css class applied to the state container when the upload was aborted.
         * @type {String}
         */
        this.cssClassAbort = '';

        /**
         * Gets or sets the comma-separated list of allowed file extensions (.png, .jpg, .jpeg) or MIME types (image/png or image/*).
         * @type {String}
         */
        this.accept = '';

        /**
         * Gets or sets the max allowed file size in KB.
         * @type {Number|null}
         */
        this.maxFileSize = null;

        /**
         * Gets or sets the max allowed file count.
         * @type {Number|null}
         */
        this.maxFiles = null;

        /**
         * Gets or sets a value indicating if duplicate files (matched by name, size, and last modified date) are prevented from being added again.
         * @type {Boolean}
         */
        this.preventDuplicates = false;

        /**
         * Gets or sets a value indicating if drag & drop of files is enabled.
         * @type {Boolean}
         */
        this.dragAndDrop = true;

        /**
         * Gets or sets the label displayed in the drop-zone.
         * @type {String}
         */
        this.dropLabel = 'Drag & Drop files here';

        /**
         * Gets or sets the label displayed when the upload was successful.
         * @type {String}
         */
        this.successLabel = '';

        /**
         * Gets or sets the label displayed when the upload failed.
         * @type {String}
         */
        this.errorLabel = 'failed';

        /**
         * Gets or sets the label displayed when the upload was aborted.
         * @type {String}
         */
        this.abortLabel = 'aborted';

        /**
         * Gets or sets the label of the file select button.
         * @type {String}
         */
        this.selectButtonLabel = "Select files";

        /**
         * Gets or sets the id of the component from which the settings are cloned for the select button.
         * @type {String}
         */
        this.selectButtonId = '';

        /**
         * Gets or sets the label of the upload button.
         * @type {String}
         */
        this.uploadButtonLabel = "Upload";

        /**
         * Gets or sets the id of the component from which the settings are cloned for the upload button.
         * @type {String}
         */
        this.uploadButtonId = '';

        /**
         * Gets or sets the label of the cancel button.
         * @type {String}
         */
        this.cancelButtonLabel = '';

        /**
         * Gets or sets the id of the component from which the settings are cloned for the cancel button.
         * @type {String}
         */
        this.cancelButtonId = '';

        /**
         * Gets or sets the header label of the rejected files dialog.
         * @type {String}
         */
        this.rejectedDialogHeader = 'Rejected Files';

        /**
         * Gets or sets the id of the component from which the settings are cloned for the rejected files dialog.
         * @type {String}
         */
        this.rejectedDialogId = '';


        /**
         * A readonly snapshot of the current files in the queue.
         * @type {File[]}
         * @readonly
         */
        Object.defineProperty(this, "files",
            {
                get: function () { return _files.slice(0); }
            });

        /**
         * Indicates whether an upload is currently in progress.
         * @type {boolean}
         * @readonly
         */
        Object.defineProperty(this, "uploading",
            {
                get: function () { return _uploading; }
            });


        /**
        * @typedef {Object} AcceptEventArgs
        * @memberof componyx.UI.FileUpload
        * @property {File} file                                        - The file to accept.
        * @property {Boolean} [cancel=false]                           - A value indicating if the default action of accepting the file should be canceled (reject).
        */

        /**
        * @typedef {Object} CancelEventArgs
        * @memberof componyx.UI.FileUpload
        * @property {String} id                                        - The id of the list item.
        * @property {File} file                                        - The file that was canceled.
        * @property {Number} fileIndex                                 - The index of the file in the file list.
        */

        /**
        * @typedef {Object} PreUploadFileEventArgs
        * @memberof componyx.UI.FileUpload
        * @property {Number} fileIndex                                 - The index of the file being uploaded.
        * @property {FormData} formData                                - The form data object used for the upload request.
        */

        /**
        * @typedef {Object} UploadProgressEventArgs
        * @memberof componyx.UI.FileUpload
        * @property {Number} fileIndex                                 - The index of the file being uploaded.
        * @property {componyx.library.XhrWrappedResult} xhr        - The wrapped XHR request for this upload.
        * @property {Number} percentage                                - The upload transfer progress as a percentage (0-100).
        */

        /**
        * @typedef {Object} PostUploadFileEventArgs
        * @memberof componyx.UI.FileUpload
        * @property {Number} fileIndex                                 - The index of the file that was uploaded.
        * @property {componyx.library.XhrWrappedResult} xhr        - The wrapped XHR request for this upload.
        * @property {Object} file                                      - The uploaded file info; either the server response object or an object with the file name.
        */

        /**
        * @class
        * @augments componyx.UI.base.Events
        * @memberof componyx.UI.FileUpload
        * @property {componyx.UI.base.Event} onChange          - Fires when the file input selection has changed.
        * @property {componyx.UI.base.Event} onDragOver        - Fires repeatedly while the (mouse) pointer drags over the drop-zone. The event arguments are the native DragEvent.
        * @property {componyx.UI.base.Event} onDragLeave       - Fires when the (mouse) pointer drags out of the drop-zone. The event arguments are the native DragEvent.
        * @property {componyx.UI.base.Event} onDrop            - Fires when files are dropped onto the drop-zone. The event arguments are the native DragEvent.
        * @property {componyx.UI.base.Event} onAccept          - Fires when files are selected through drag & drop or the file input. @see {@link componyx.UI.FileUpload.AcceptEventArgs}
        * @property {componyx.UI.base.Event} onCancel          - Fires when a file is canceled before being uploaded. @see {@link componyx.UI.FileUpload.CancelEventArgs}
        * @property {componyx.UI.base.Event} onPreUploadFile   - Fires before a file upload starts. @see {@link componyx.UI.FileUpload.PreUploadFileEventArgs}
        * @property {componyx.UI.base.Event} onUploadProgress  - Fires during the upload transfer, providing progress updates. @see {@link componyx.UI.FileUpload.UploadProgressEventArgs}
        * @property {componyx.UI.base.Event} onPostUploadFile  - Fires after a file upload completes and the server has responded. @see {@link componyx.UI.FileUpload.PostUploadFileEventArgs}
        * @property {componyx.UI.base.Event} onUploadComplete  - Fires when all files have been uploaded.
        * @see {@link componyx.UI.base.Events}
        */
        function FileUploadEvents(events)
        {
            Object.assign(this, events);

            this.onChange = $base.static.createEvent('onChange');
            this.onDragOver = $base.static.createEvent('onDragOver');
            this.onDragLeave = $base.static.createEvent('onDragLeave');
            this.onDrop = $base.static.createEvent('onDrop');
            this.onAccept = $base.static.createEvent('onAccept');
            this.onCancel = $base.static.createEvent('onCancel');
            this.onPreUploadFile = $base.static.createEvent('onPreUploadFile');
            this.onUploadProgress = $base.static.createEvent('onUploadProgress');
            this.onPostUploadFile = $base.static.createEvent('onPostUploadFile');
            this.onUploadComplete = $base.static.createEvent('onUploadComplete');
        };

        /**
         * FileUpload events
         * @type {componyx.UI.FileUpload.FileUploadEvents}
         */
        this.events = new FileUploadEvents(this.events);

        // inherit base and box members
        $base.Component.apply(this, [id, properties]);

        this.ajax.addMethod('upload');

        /**
        * Uploads the selected file(s).
        */
        this.upload = function ()
        {
            upload();
        }

        /**
        * Gets the list of successfully uploaded files.
        * Each entry is either the server response object, or if no JSON data response, an object with the file name.
         * @returns {Object[]} An array of objects holding the uploaded file information.
         */
        this.getValue = function ()
        {
            return _uploadedFiles;
        }

        /**
        * Clears the upload progression info.
        */
        this.clear = function ()
        {
            if (_instance.renderState != 2)
                return;

            $lib.each(_cancelButtons, function (button)
            {
                button.destroy();
            });

            _list.innerHTML = '';
            _list.style.display = 'none';
            _progressBar.style.visibility = 'hidden';
            _progressBar.firstChild.style.width = '0%';
            _input.value = '';
            _complete = false;
        }

        /**
        * Cancels the upload.
        * @param {File} [file] The file to cancel. All files are canceled if omitted.
        */
        this.cancel = function (file)
        {
            $lib.each(_cancelButtons, function (button)
            {
                if (!file || button.__file === file)
                    button.commandClick();
            });
        }

        /**
        * Renders the component.
        */
        this.render = function ()
        {
            if (_instance.renderState != $base.static.RenderState.RENDERING)
            {
                // call base render and return
                $base.methods.render.call(_instance, preRender, 'file-upload');
                return;
            }

            _complete = false;
            draw();
        }

        /** 
         * Destroys the component.
         * @see {@link componyx.UI.base.methods#destroy}
         */
        this.destroy = function (...args)
        {
            dispose();
            $base.methods.destroy.call(this, ...args);
        }

        function preRender()
        {
            // initialize script and css
            return ['FileUpload', ['Button', 'Dialog']];
        }

        function draw()
        {
            var content = document.createElement('span'),
                uploadContainer = document.createElement('div');

            content.innerHTML = _instance.selectButtonLabel;

            _dropzone = document.createElement('div');
            _dropzone.className = _instance.cssClassDropzone || _classOption.DROPZONE;

            if (_instance.dragAndDrop)
                _dropzone.setAttribute('data-drop-text', _instance.dropLabel)
            else
                $lib.addClass(_dropzone, 'disabled');

            _input = createFileInput();

            _list = document.createElement('div');
            _list.className = _instance.cssClassList || _classOption.LIST;
            _list.style.display = 'none';

            _selectButton = createButton(_instance.selectButtonId, _dropzone, _instance.cssClassSelectButton || _classOption.SELECTBUTTON);
            _selectButton.setContentTemplate([content, _input]);
            _selectButton.render();

            _uploadButton = createButton(_instance.uploadButtonId, uploadContainer, _instance.cssClassUploadButton || _classOption.UPLOADBUTTON, _instance.uploadButtonLabel);
            _uploadButton.disabled = true;
            _uploadButton.command = upload;
            _uploadButton.render();

            _progressBar = createProgressBar(uploadContainer, true);

            _instance.element.appendChild(_dropzone);
            _instance.element.appendChild(_list);
            _instance.element.appendChild(uploadContainer);

            if (_instance.accept)
                _accept = _instance.accept.replace(/ /g, "").split(',')

            bindEvents();
            _instance.renderChildren();
        }

        function bindEvents()
        {
            if (_instance.dragAndDrop)
            {
                $lib.on(_dropzone, 'ondrop', drop);
                $lib.on(_dropzone, 'ondragover', dragOver);
                $lib.on(_dropzone, 'ondragleave', dragLeave);
            }

            $lib.on(_input, 'onchange', change);
        }

        function createFileInput()
        {
            var input = document.createElement('input');

            input.type = 'file';
            input.multiple = (_instance.maxFiles == 1) ? false : true;
            input.accept = _instance.accept;
            return input;
        }

        function createButton(cloneId, container, cssClass, text, postRenderCallback)
        {
            var id = _instance.id + '_' + $lib.guid(),
                button = $UI.createComponent(componyx.UI.Button, { id: id, containerElement: container });

            button.clone($UI.store[cloneId], _instance);
            button.cssClass = cssClass;
            button.showing = true;
            button.text = text;

            if (postRenderCallback != false)
                button.events.onPostRender.priorityAdd(function () { _instance.isReady.apply(_instance); }, null);

            return button;
        }

        function change()
        {
            if (!_input.value)
                return;

            filesSelected(_input.files);
            _instance.events.onChange.fire(_instance);
        }

        function dragOver(e)
        {
            e.preventDefault();

            if (_instance.uploading)
                return;

            $lib.addClass(_dropzone, 'active');
            _instance.events.onDragOver.fire(_instance, e);
        }

        function drop(e)
        {
            if (!e.dataTransfer.files)
                return;

            e.preventDefault();
            $lib.removeClass(_dropzone, 'active'); // the drag is over, also while uploading

            if (_instance.uploading)
                return;

            filesSelected(e.dataTransfer.files);
            _instance.events.onDrop.fire(_instance, e);
        }

        function dragLeave(e)
        {
            if (_dropzone.contains(e.relatedTarget))
                return; // moved onto a child element of the drop-zone, still inside

            if (_instance.uploading)
                return;

            $lib.removeClass(_dropzone, 'active');
            _instance.events.onDragLeave.fire(_instance, e);
        }

        function filesSelected(files)
        {
            let result = accept(files);
            _files = _files.concat(result.accept);

            if (result.reject.length)
                showRejected(result.reject);

            toggleUploadButton();
            toggleList();
            _progressBar.style.visibility = 'hidden';

            if (_files.length == 0)
                return;

            _input.value = '';
            drawItemList();
        }

        function accept(files)
        {
            let accept = [], reject = [], size;
            let seen = _files.slice();

            $lib.each(files, function (file)
            {
                if ((!$lib.isEmpty(_instance.maxFiles) && seen.length >= _instance.maxFiles)
                    || _instance.preventDuplicates && seen.some(item => filesMatch(item, file)))
                {
                    reject.push(file);
                    return;
                }

                size = (file.size / 1024) // KB

                if ((!_instance.maxFileSize || size <= _instance.maxFileSize) && acceptType(file))
                {
                    const args = { cancel: false, file: file };
                    _instance.events.onAccept.fire(_instance, args);

                    if (!args.cancel)
                    {
                        accept.push(file);
                        seen.push(file);
                    }
                    else
                        reject.push(file);
                }
                else
                    reject.push(file);
            });

            return { accept, reject };
        }

        function filesMatch(a, b)
        {
            return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
        }

        function filesMatch(a, b)
        {
            return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
        }

        function acceptType(file)
        {
            if (!_accept)
                return true;

            var accept = false,
                type = file.type.split('/'),
                ext = file.name.substr(file.name.lastIndexOf('.'));

            $lib.indexOf(_accept, function (item)
            {
                if (($lib.startsWith(item, '.')))
                    accept = item?.toLowerCase() == ext?.toLowerCase();
                else
                {
                    item = item.split('/');
                    accept = (item[0]?.toLowerCase() == type[0]?.toLowerCase() && (item[1] == '*' || item[1]?.toLowerCase() == type[1]?.toLowerCase()));
                }

                return accept;
            });

            return accept;
        }

        function showRejected(files)
        {
            const id = `${_instance.id}_rejected`,
                dialog = $UI.createComponent(componyx.UI.Dialog, { id: id, containerElement: _instance.element }),
                content = [];

            dialog.clone($UI.store[_instance.rejectedDialogId], _instance);

            files.forEach((file) =>
            {
                content.push($lib.element({ content: `${file.name} (${printSize(file.size)})` }));
            });

            dialog.alert(null, _instance.rejectedDialogHeader, content);
        }

        function toggleUploadButton()
        {
            if (_files.length > 0)
                _uploadButton.enable();
            else
                _uploadButton.disable();
        }

        function toggleList()
        {
            if (_files.length > 0)
                _list.style.display = '';
            else
                _list.style.display = 'none';
        }

        function drawItemList()
        {
            var ul = document.createElement('ul'), li, div, i, cancel;

            _list.innerHTML = '';
            _list.appendChild(ul);
            _cancelButtons = [];
            _complete = false;

            $lib.each(_files, function (file, index)
            {
                li = ul.appendChild(document.createElement('li'));
                li.id = _instance.id + '_' + $lib.guid();

                div = li.appendChild(document.createElement('div'));
                div.className = _instance.cssClassName || _classOption.NAME;

                var span = div.appendChild(document.createElement('span'));
                span.textContent = file.name;
                span = div.appendChild(document.createElement('span'));
                span.textContent = printSize(file.size);

                createProgressBar(li);

                div = li.appendChild(document.createElement('div'));
                div.className = _instance.cssClassState || _classOption.STATE;

                div = li.appendChild(document.createElement('div'));
                i = document.createElement('i');
                i.className = 'ico-cross';

                cancel = createButton(_instance.cancelButtonId, div, _instance.cssClassCancelButton || _classOption.CANCELBUTTON, _instance.cancelButtonLabel, false);
                cancel.hasIcon = true;
                cancel.transparent = true;
                cancel.cssClassIcon = 'icon ico-cross';
                cancel.command = cancelFile.bind(this, cancel);
                cancel.__file = file;
                cancel.__itemId = li.id;
                cancel.show();
                _cancelButtons.push(cancel);
            });
        }

        function createProgressBar(container, total)
        {
            var div = container.appendChild(document.createElement('div'));
            div.className = _instance.cssClassProgressBar || _classOption.PROGRESSBAR;
            div.style.visibility = 'hidden';
            div.appendChild(document.createElement('b'));

            if (total)
                $lib.addClass(div, 'total');

            return div;
        }

        function printSize(bytes)
        {
            var count = 0;

            if (bytes <= 0)
                return bytes + _suffix[0];

            while ($lib.roundNumber(bytes, 2) >= 1000 && count < _suffix.length)
            {
                bytes /= 1024;
                count++;
            }

            return $lib.roundNumber(bytes, 2) + _suffix[count];
        }

        function cancelFile(button)
        {
            var id = button.__itemId,
                file = button.__file,
                index = (_files.length > 0) ? getFileIndex(file) : -1;

            if (_xhr[index])
            {
                _xhr[index].abort(); // fires complete eventually
            }
            else
            {
                $lib.remove($lib('#' + id));

                if (_files.length > 0)
                {
                    _files.splice(index, 1);
                }

                if (!_complete || _list.firstElementChild?.childNodes?.length == 0)
                {
                    toggleUploadButton();
                    toggleList();
                }
            }

            if (!complete)
                _instance.events.onCancel.fire(_instance, { id: id, file: file, fileIndex: index });
        }

        function upload()
        {
            var formData;

            _uploading = true;
            _uploadButton.disable();
            _selectButton.disable();

            $lib.each(_files, function (file, index)
            {
                if (!file)
                    return; // cancelled

                formData = new FormData();
                formData.append(_instance.name || file.name, file);

                _instance.events.onPreUploadFile.fire(_instance, { fileIndex: index, formData: formData });
                _xhr.push(_instance.ajaxCall('upload', formData,
                    {
                        onStart: function (args) { start(args, index); },
                        onUploadProgress: function (args) { progress(args, index); },
                        onSuccess: function (args) { success(args, index); },
                        onUploadError: function (args) { error(args, index); },
                        onError: function (args) { error(args, index); },
                        onAbort: function (args) { abort(args, index); }
                    }, [index]));
            });
        }

        function getFileIndex(file)
        {
            return $lib.indexOf(_files, function (item) { return (file == item); })
        }

        function getItem(index)
        {
            return $lib(null, _list, 'li')[index];
        }

        function getProgressBar(li)
        {
            return $lib('progress', li, 'div', true).firstChild;
        }

        function getStatusLabel(li)
        {
            return $lib('state', li, 'div', true);
        }

        function start(args, index)
        {
            var li = getItem(index);
            getProgressBar(li).parentNode.style.visibility = '';
        }

        function progress(args, index)
        {
            var e = args.event,
                percentage = (e.lengthComputable) ? Math.floor((e.loaded / e.total) * 100) : 0,
                progress = getProgressBar(getItem(index));

            progress.style.width = percentage + '%';
            _xhr[index].__progress = percentage / 100;
            setTotalProgress();

            _instance.events.onUploadProgress.fire(_instance, { fileIndex: index, xhr: _xhr[index], percentage: percentage })
        }

        function setTotalProgress(percentage)
        {
            var total = 0;

            $lib.each(_xhr, function (item)
            {
                if (item.__progress)
                    total += item.__progress;
            });

            _progressBar.style.visibility = '';
            _progressBar.firstChild.style.width = (total / _xhr.length) * 100 + '%';
        }

        function success(args, index)
        {
            let li = getItem(index),
                uploadedInfo = (args.data && typeof args.data === 'object') ? args.data : { name: _files[index].name };

            getProgressBar(li).style.width = '100%';
            $lib.addClass(li, _input.cssClassSuccess || _classOption.SUCCESS);
            getStatusLabel(li).innerHTML = _instance.successLabel;
            _uploadedFiles.push(uploadedInfo);

            _instance.events.onPostUploadFile.fire(_instance, { fileIndex: index, xhr: _xhr[index], file: uploadedInfo });
            complete(index);
        }

        function error(args, index)
        {
            var li = getItem(index);
            $lib.addClass(li, _input.cssClassError || _classOption.ERROR);
            getStatusLabel(li).innerHTML = _instance.errorLabel;
            complete(index);
        }

        function abort(args, index)
        {
            var li = getItem(index);

            $lib.addClass(li, _input.cssClassAbort || _classOption.ABORT);
            getStatusLabel(li).innerHTML = _instance.abortLabel;
            complete(index);
        }

        function complete(index)
        {
            _xhr[index].__ready = true;
            _xhr[index].__progress = 1;
            setTotalProgress();

            if ($lib.indexOf(_xhr, function (xhr) { return (!xhr.__ready); }) == -1)
            {
                _instance.events.onUploadComplete.fire(_instance);
                _uploading = false;
                _files = [];
                _xhr = [];
                _complete = true;
                _selectButton.enable();
                _uploadButton.disable();
            }
        }

        function dispose()
        {
            _uploadedFiles = [];
            _files = [];
            _xhr = [];
        }
    }

    /**
    * @see {@link componyx.UI.base.methods}
    */
    componyx.UI.FileUpload.prototype = Object.create($base.methods);
    componyx.UI.FileUpload.prototype.constructor = componyx.UI.FileUpload;
})(window);