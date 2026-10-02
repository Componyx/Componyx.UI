/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

(function ()
{
    /**
    * MaskedTextBox class.
    * @class
    * @memberof componyx.UI
    * @augments componyx.UI.base.WebComponent
    * @mixes componyx.UI.base.methods
    * @param {String} id The id of the component.
    * @param {Object|HTMLElement} properties The properties used to initialize the component or the container element.
    * @returns {componyx.UI.MaskedTextBox} An instance of the component.
    */
    class MaskedTextBox extends componyx.UI.base.WebComponent 
    {
        #input = null;
        #inputSlots = [];
        #inputData = [];
        #mask;
        #defaultMask = '____-____';
        #firstFocus = false;
        #lastValue;

        constructor(id, properties)
        {
            super(id, properties);

            /**
             * @ignore
            */
            this.mask = this.#defaultMask;

            /**
             * Gets or sets a value indicating which characters are allowed on the underscore (_) slots.
             * @type {componyx.UI.MaskedTextBox.CharacterAllowOption}
             */
            this.allowedCharacters = MaskedTextBox.AllowedCharactersOption.ALPHANUMERIC;

            /**
             * Gets or sets the regular expression pattern when allowedCharacters is set to CUSTOM. 
             * @type {RegExp}
             */
            this.customPattern = /^[A-Z0-9]+$/;

            /**
             * Gets or sets a value indicating if the mask hint is displayed. If null, it's auto-detected based on the configured mask and character settings.
             * @type {Boolean|Null}
             */
            this.showMaskHint = null;

            /**
             * Gets or sets the hint text displayed when the input gets focus. This text is appended after the mask pattern. (A=letters, 0=digits)  
             * @type {String}
             */
            this.maskHint = ' (A=letters, 0=digits)';

            /**
             * Gets or sets the id of the HTML input to use.
             * @type {String}
             */
            this.inputId = null;

            /**
            * @class
            * @augments componyx.UI.base.Events
            * @memberof componyx.UI.MaskedTextBox
            * @property {componyx.UI.base.Event} onChanged      - Fires when the input value has changed. @see {@link componyx.UI.MaskedTextBox.MaskedTextBoxEventArgs}
            * @see {@link componyx.UI.base.Events}
            */
            function MaskedTextBoxEvents(events)
            {
                Object.assign(this, events);

                this.onChanged = $base.static.createEvent('onChanged');
            };

            /**
             * PanelBar events
             * @type {componyx.UI.PanelBar.PanelBarEvents}
             */
            this.events = new MaskedTextBoxEvents(this.events);

            /**
            * @typedef {Object} MaskedTextBoxEventArgs
            * @memberof componyx.UI.MaskedTextBox
            * @property {componyx.UI.MaskedTextBox} maskedTextBox - The MaskedTextBox instance.
            * @property {Object} eventArgs - The event object containing more detailed information about the event.
            * @property {String} eventArgs.value - The current value.
            * @property {Event} eventArgs.event - The original event object.
            */
        }

        /**
         * Gets the input element.
         * @type {HTMLInputElement}
        */
        get input()
        {
            return this.#input;
        }

        /**
         * Gets the raw input value without mask characters.
         * @type {string}
        */
        get value()
        {
            return this.#inputData.join("");
        }

        /**
         * Gets or sets the text box mask pattern. Use 'A' for letters, '0' for digits, and '_' for any allowed character slot. To include a literal A, 0, or _ in the mask, escape it with a backslash (\).
         * @type {string}
        */
        get mask()
        {
            return this.#mask;
        }

        /**
         * Sets the mask.
         * @param {string} value
         */
        set mask(value)
        {
            if (value === this.#mask)
                return; 

            if ($lib.isEmpty(value))
                this.#mask = this.#defaultMask;
            else
                this.#mask = value;

            if (this.renderState === $base.static.RenderState.RENDERED)
            {
                this.setMaskHint();
                this.#initializeMask();
                this.renderValue();
            }    
        }

        /**
         * Sets the raw input value with or without mask characters.
         * @param {string} value The value to set.
        */
        set value(value)
        {
            let charIndex = 0;

            this.#inputData.fill("");

            if (!this.#inputSlots.length)
                this.#initializeMask();

            if ($lib.isEmpty(value))
                value = '';

            for (let valueIndex = 0; valueIndex < value.length && charIndex < this.#inputSlots.length; valueIndex++)
            {
                const char = value[valueIndex];

                if (this.#isAllowedChar(char, charIndex))
                    this.#inputData[charIndex++] = char;
            }

            if (this.renderState === $base.static.RenderState.RENDERED)
                this.renderValue();
        }

        /**
         * Gets the raw input value without mask characters.
         * @type {string}
        */
        getValue()
        {
            return this.value;
        }

        /**
         * Sets the raw input value with or without mask characters.
         * @param {string} value The value to set.
        */
        setValue(value)
        {
            this.value = value;
        }

        /**
         * Sets the mask hint.
         * @param {string} value The mask value.
        */
        setMaskHint()
        {
            const rawMask = this.mask.replace(/\\./g, ''), // remove escaped characters
                showMaskHint = (this.showMaskHint == null) ? (rawMask.includes('A') || rawMask.includes('0')) : this.showMaskHint;

            this.classList.remove('mask-hint');

            if (showMaskHint)
            {
                this.dataset.hint = this.mask.replace(/\\([\\a-zA-Z0-9_])/g, '$1') + this.maskHint;
                this.classList.add('mask-hint');
            }
        }

        /**
        * Renders the component.
        */
        render()
        {
            if (this.renderState != $base.static.RenderState.RENDERING)
            {
                super.render(this.#preRender, 'masked-textbox');
                return;
            }

            // render logic after loading resources
            this.#draw();
            this.renderChildren();
        }

        /**
        * Destroys the component.
        * @param {Boolean} keepEvents A value indicating if component events should be kept.
        * @param {Boolean} removeElement=true A value indicating if the corresponding HTML Element should be removed.
        * @see {@link componyx.UI.base.methods#destroy}
        * @function
        */
        destroy(keepEvents, removeElement = true)
        {
            this.#dispose();
            super.destroy(keepEvents, removeElement);
        }

        #preRender()
        {
            return [MaskedTextBox.name];
        }

        #draw()
        {
            this.#input = this.createSyncedInput(this.inputId, function (instance)
            {
                instance.value = this.value; // triggers value setter on component
            }, false);

            if (typeof this.customPattern === 'string')
                this.customPattern = new RegExp(this.customPattern);

            this.#input.type = 'text';
            this.element.appendChild(this.#input);
            this.#initializeMask();
            this.setMaskHint();
            this.renderValue();
            this.#bindEvents();
        }

        #initializeMask()
        {
            let visibleIndex = 0,
                checkEscaped = false;

            this.#inputSlots = [];
            this.#inputData = [];

            for (let index = 0; index < this.mask.length; index++)
            {
                const char = this.mask[index],
                    prevChar = this.mask[index - 1];

                if (char == '\\') // Backslashes are used to escape and are removed from the visible mask in the input
                {
                    checkEscaped = true;

                    if (prevChar == '\\') // Literal backslash
                    {
                        checkEscaped = false;
                        visibleIndex++;
                    }

                    continue;
                }   

                if (this.#isInputSlot(char, (checkEscaped) ? prevChar : null))
                {
                    this.#inputSlots.push({
                        maskIndex: visibleIndex,
                        token: char
                    });

                    this.#inputData.push("");
                }

                visibleIndex++;
            }
        }

        renderValue()
        {
            this.#input.__setValue(this.#getVisibleText());
        }

        #getVisibleText()
        {
            let text = [],
                charIndex = 0,
                checkEscaped = false;

            for (let index = 0; index < this.mask.length; index++)
            {
                const char = this.mask[index],
                    prevChar = this.mask[index - 1];

                if (char === '\\') // Handle escaped characters
                {
                    checkEscaped = true;
                    if (prevChar == '\\') // Literal backslash
                    {
                        checkEscaped = false;
                        text.push(char);
                    }
                }
                else if (this.#isInputSlot(char, (checkEscaped) ? prevChar : null))
                {
                    text.push(this.#inputData[charIndex] !== '' ? this.#inputData[charIndex] : '_');
                    charIndex++;
                    checkEscaped = true;
                }
                else
                {
                    text.push(char);
                }
            }

            return text.join('');
        }

        #isInputSlot(char, prevChar)
        {
            return prevChar !== '\\' && (char === '_' || char === 'A' || char === '0');
        }

        #bindEvents()
        {
            $lib.on(this.#input, 'blur', this.#blur, null, this, true);
            $lib.on(this.#input, 'paste', this.#paste, null, this, true);
            $lib.on(this.#input, 'keydown', this.#keyDown, null, this, true);
            $lib.on(this.#input, 'focus click', this.#adjustCaret, null, this, true);
            
        }

        #disposeEvents()
        {
            if (!this.#input)
                return;

            $lib.off(this.#input, 'blur', this.#blur);
            $lib.off(this.#input, 'paste', this.#paste);
            $lib.off(this.#input, 'keydown', this.#keyDown);
            $lib.off(this.#input, 'focus click', this.#adjustCaret);
        }

        #blur(e)
        {
            const currentValue = this.value;

            if (currentValue !== this.#lastValue)
            {
                this.#lastValue = currentValue;
                this.events.onChanged.fire(this, { value: currentValue, event: e });
            }
        }

        #paste(e)
        {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData("text");
            let charIndex = this.#getCharIndexFromCaret(this.#input.selectionStart);

            if (charIndex === null)
                return;

            for (let char of pasteData)
            {
                if (charIndex >= this.#inputSlots.length)
                    break;

                if (this.#isAllowedChar(char, charIndex) && charIndex < this.#inputSlots.length)
                {
                    this.#inputData[charIndex++] = char;
                }
            }
            this.renderValue();

            if (charIndex < this.#inputSlots.length)
                this.#setCaret(this.#getCharPosByIndex(charIndex));
            else
                this.#setCaret((this.#inputSlots.at(-1)?.maskIndex ?? (this.mask.length - 1)) + 1);
        }

        #keyDown(e)
        {
            const caret = this.#input.selectionStart,
                selectionEnd = this.#input.selectionEnd;

            // Ignore non-character keys for now
            if (["ArrowLeft", "ArrowRight", "Home", "End", "Tab", "Shift", "Control", "Alt", "Meta"].includes(e.key) || (e.ctrlKey && e.key.toLowerCase() === "v"))
                return;

            e.preventDefault();

            if (caret !== selectionEnd)
            {
                let startCharIndex = this.#clearSelection();

                if (e.key === "Backspace" || e.key === "Delete")
                {
                    if (startCharIndex !== null)
                        this.#setCaret(this.#getCharPosByIndex(startCharIndex));

                    return;
                }
            }

            if (e.key === "Backspace")
            {
                let charIndex = this.#getPreviousCharIndexFromCaret(caret);
                if (charIndex !== null)
                {
                    this.#clearCharacter(charIndex);
                }
                return;
            }
            else if (e.key === "Delete")
            {
                let charIndex = this.#getCharIndexFromCaret(caret);
                if (charIndex !== null)
                {
                    this.#shiftCharactersLeft(charIndex);
                }
                return;
            }

            if (e.key.length === 1)
            {
                if (caret > this.#inputSlots[this.#inputSlots.length - 1].maskIndex)
                    return;

                const charIndex = this.#getCharIndexFromCaret(caret);

                if (this.#isAllowedChar(e.key, charIndex))
                    this.#insertCharacter(caret, e.key);
            }
        }

        #shiftCharactersLeft(startIndex)
        {
            for (let i = startIndex; i < this.#inputData.length - 1; i++)
            {
                this.#inputData[i] = this.#inputData[i + 1];
            }
            this.#inputData[this.#inputData.length - 1] = ""; // Clear last character
            this.renderValue();
            this.#setCaret(this.#getCharPosByIndex(startIndex));
        }

        #insertCharacter(caret, char)
        {
            const charIndex = this.#getCharIndexFromCaret(caret);
            if (charIndex !== null)
            {
                this.#inputData[charIndex] = char;
                this.renderValue();

                if (charIndex < this.#inputSlots.length - 1)
                    this.#setCaret(this.#getCharPosByIndex(charIndex + 1));
                else
                    this.#setCaret((this.#inputSlots.at(-1)?.maskIndex ?? (this.mask.length - 1)) + 1);
            }
        }

        #clearCharacter(charIndex)
        {
            if (charIndex !== null)
            {
                this.#inputData[charIndex] = '';
                this.renderValue();
                this.#setCaret(this.#getCharPosByIndex(charIndex));
            }
        }

        #isAllowedChar(char, index = null)
        {
            let token = null;

            if (index !== null && this.#inputSlots[index])
                token = this.#inputSlots[index].token;

            if (token === '0')
                return /\d/.test(char);
            else if (token === 'A')
                return /[a-zA-Z]/.test(char);
            else // "_"
            {
                if (this.allowedCharacters === MaskedTextBox.AllowedCharactersOption.DIGITS)
                    return /\d/.test(char);
                else if (this.allowedCharacters === MaskedTextBox.AllowedCharactersOption.LETTERS)
                    return /[a-zA-Z]/.test(char);
                else if (this.allowedCharacters === MaskedTextBox.AllowedCharactersOption.CUSTOM && this.customPattern instanceof RegExp)
                    return this.customPattern.test(char);
                else
                    return /\w/.test(char);
            }
        }

        #getCharIndexFromCaret(caret)
        {
            let index = this.#inputSlots.findIndex(p => p.maskIndex >= caret);
            return index === -1 ? null : index;
        }

        #getPreviousCharIndexFromCaret(caret)
        {
            for (var index = this.#inputSlots.length - 1; index >= 0; index--)
            {
                if (this.#inputSlots[index].maskIndex < caret)
                {
                    return index;
                }
            }
            return null;
        }

        #getCharPosByIndex(index)
        {
            return this.#inputSlots[index].maskIndex;
        }

        #adjustCaret(evt)
        {
            if (evt.type === 'focus')
                this.#firstFocus = true;

            setTimeout(() =>
            {
                const caret = this.#input.selectionStart;
                const lastSlot = this.#inputSlots.at(-1)?.maskIndex ?? 0;

                if (this.#firstFocus)
                {
                    const emptyIndex = this.#inputData.findIndex(char => char === ""),
                        firstFreeSlot = emptyIndex !== -1
                            ? this.#inputSlots[emptyIndex].maskIndex
                            : this.mask.length;

                    this.#setCaret(firstFreeSlot);
                    this.#firstFocus = false;
                    return;
                }

                if (caret >= lastSlot)
                    return;

                if (!this.#inputSlots.some(p => p.maskIndex === caret))
                {
                    const charIndex = this.#getCharIndexFromCaret(caret);

                    if (charIndex !== null)
                        this.#setCaret(this.#getCharPosByIndex(charIndex));
                    else
                        this.#setCaret(lastSlot);
                }
            }, 0);
        }

        #setCaret(pos)
        {
            this.#input.setSelectionRange(pos, pos);
        }

        #clearSelection()
        {
            const caret = this.#input.selectionStart,
                end = this.#input.selectionEnd,
                startCharIndex = this.#getCharIndexFromCaret(caret);

            if (caret > this.#inputSlots[this.#inputSlots.length - 1].maskIndex || end < this.#inputSlots[0].maskIndex)
                return null;

            if (caret !== end)
            {
                this.#inputSlots.forEach((pos, index) =>
                {
                    if (pos.maskIndex >= caret && pos.maskIndex < end)
                    {
                        this.#inputData[index] = "";
                    }
                });

                this.renderValue();
            }

            return startCharIndex;
        }

        #dispose()
        {
            this.#disposeEvents();
        }
    }

    /**
    * AllowedCharactersOption
    * @readonly
    * @enum {number}
    */
    MaskedTextBox.AllowedCharactersOption =
    {
        ALPHANUMERIC: 0,
        DIGITS: 1,
        LETTERS: 2,
        CUSTOM: 3
    };



    // Preserve HTMLElement prototype and extend it with $base.methods
    Object.assign(MaskedTextBox.prototype, Object.fromEntries(Object.entries($base.methods).filter(([key]) => !['render', 'destroy', 'getCssClass'].includes(key))));

    // Restore the constructor reference
    MaskedTextBox.prototype.constructor = MaskedTextBox;
    componyx.UI.MaskedTextBox = MaskedTextBox;

    // Define the custom element
    customElements.define(`${componyx.UI.tagPrefix}${MaskedTextBox.name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`, MaskedTextBox); // cui-masked-text-box
})();