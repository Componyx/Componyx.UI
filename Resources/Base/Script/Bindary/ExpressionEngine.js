/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */
"use strict";

await (async function ()
{
    await import(`${$UI.getScriptResourcePath('Base.Bindary.Core')}`);
    const core = componyx.bindary_modules.core;

    componyx.bindary_modules = componyx.bindary_modules || {};
    componyx.bindary_modules.ExpressionEngine = class ExpressionEngine
    {
        constructor()
        {
            this.resolveRegex = /^[\$A-Za-z_][\w.@\[\]]*(\(\))?/;
            this.allowedCharsRegex = /^[|&+\-*/().,\s<>=!?:@_\$[\]{}_A-Za-z0-9'".]+$/;
            this.allowedMathFunctions = ['abs', 'ceil', 'floor', 'round', 'max', 'min', 'trunc', 'sqrt', 'pow', 'log', 'exp', 'random'];
            this.allowedStringFunctions = ['toLowerCase', 'toUpperCase', 'trim', 'replace', 'includes', 'indexOf', 'startsWith', 'endsWith', 'slice', 'substring'];
        }

        /**
         * Compiles an expression string containing `{{ }}` placeholders into a function.
         * Supports:
         * - Multiple `{{ ... }}` placeholders within the string.
         * - Expressions inside `{{ }}`, including basic operators, custom resolver tokens, and a whitelist of Math and String methods.
         * - Literal text outside placeholders is preserved as string literals.
         * 
         * Supported Math methods: 'abs', 'ceil', 'floor', 'round', 'max', 'min', 'trunc', 'sqrt', 'pow', 'log', 'exp', 'random'
         * Supported String methods: 'toLowerCase', 'toUpperCase', 'trim', 'replace', 'includes', 'indexOf', 'startsWith', 'endsWith', 'slice', 'substring'
         * @private
         * @param {string} expr - The expression string to compile.
         * @param {function(string, number): any} tokenHandler - Invoked at compile time for each custom token found.
         * Receives the token string as first argument and the start index of the token in the source string as second argument.
         * @returns {function(function(string): any): any} A function that takes a resolver callback to provide token values at runtime.
         * @example
         * const exprFn = evaluate("Hello {{ String.toUpperCase(name) + '!' }} Your high score is {{ Math.max(a, b) + ' points' }}.");
         * const result = exprFn(token => {
         *   const values = { name: "Joe", a: 5, b: 10 };
         *   return values[token];
         * });
         * console.log(result); // "Hello JOE! Your high score is 10 points."
         */
        evaluate(expr, tokenHandler)
        {
            const allowedCharsRegex = this.allowedCharsRegex,
                allowedMathFunctions = this.allowedMathFunctions,
                allowedStringFunctions = this.allowedStringFunctions;

            // --------------------------------------------------------------
            // Extract balanced parentheses content, used for Math/Strings
            // --------------------------------------------------------------
            const extractParentheses = (text, startIndex) =>
            {
                if (text[startIndex] !== '(') return null;

                let depth = 1;
                let index = startIndex + 1;

                while (index < text.length && depth > 0)
                {
                    if (text[index] === '(') depth++;
                    else if (text[index] === ')') depth--;
                    index++;
                }

                if (depth !== 0) return null;
                return { content: text.slice(startIndex + 1, index - 1), endIndex: index - 1 };
            };

            // --------------------------------------------------------------
            // Inner expression processor:
            // Tokenizes Math/Strings/DataKeys/Text recursively.
            // --------------------------------------------------------------
            const processExpression = (text, exprStartIndex) =>
            {
                text = text.trim();
                if (!text) return null;

                // Full whitelist check
                if (!allowedCharsRegex.test(text))
                    return null;

                let index = 0;
                let out = '';

                while (index < text.length)
                {
                    let ch = text[index];

                    // ----------------------------------------
                    // Whitespace - skip it
                    // ----------------------------------------
                    if (/\s/.test(ch))
                    {
                        index++;
                        continue;
                    }

                    // ----------------------------------------
                    // Numeric literals
                    // ----------------------------------------
                    if (/\d/.test(ch))
                    {
                        out += ch;
                        index++;
                        continue;
                    }

                    // ----------------------------------------
                    //  Quoted string literal
                    // ----------------------------------------
                    if (ch === '"' || ch === "'")
                    {
                        const quote = ch;
                        let start = index++;

                        while (index < text.length)
                        {
                            if (text[index] === '\\')
                            {
                                index += 2;
                                continue;
                            }
                            if (text[index] === quote)
                                break;
                            index++;
                        }

                        if (index >= text.length) return null;

                        out += text.slice(start, ++index);
                        continue;
                    }

                    // ----------------------------------------
                    // Math or String function call
                    // ----------------------------------------
                    let fnMatch = text.slice(index).match(/^(Math|String)\.([A-Za-z_]\w*)/);
                    if (fnMatch)
                    {
                        const type = fnMatch[1],
                            fnName = fnMatch[2],
                            allowedFns = type === 'Math' ? allowedMathFunctions : allowedStringFunctions;

                        if (!allowedFns.includes(fnName)) return null;

                        out += (type === 'Math') ? `${type}.${fnName}` : `String.prototype.${fnName}.call`;
                        index += fnMatch[0].length;

                        if (text[index] !== '(') return null;

                        const paren = extractParentheses(text, index);
                        if (!paren) return null;

                        const inner = processExpression(paren.content, exprStartIndex + index + 1);
                        if (inner === null) return null;

                        if (type === 'Math')
                            out += `(${inner})`;
                        else
                            out += `( ${inner} )`;

                        index = paren.endIndex + 1;
                        continue;
                    }

                    // ----------------------------------------
                    // Booleans
                    // ----------------------------------------
                    const afterTrue = text[index + 4];

                    if (text.startsWith("true", index) && (afterTrue === undefined || !/[\w]/.test(afterTrue)))
                    {
                        out += "true";
                        index += 4;
                        continue;
                    }

                    const afterFalse = text[index + 5];

                    if (text.startsWith("false", index) && (afterFalse === undefined || !/[\w]/.test(afterFalse)))
                    {
                        out += "false";
                        index += 5;
                        continue;
                    }

                    // ----------------------------------------
                    // null
                    // ----------------------------------------
                    if (text.startsWith("null", index) && !/\w/.test(text[index + 4] ?? ''))
                    {
                        out += "null";
                        index += 4;
                        continue;
                    }

                    // ----------------------------------------
                    // Empty Object
                    // ----------------------------------------
                    if (ch === '{')
                    {
                        if (text[index + 1] === '}')
                        {
                            out += '{}';
                            index += 2;
                            continue;
                        }
                        return null;
                    }

                    // ----------------------------------------
                    // Empty Array
                    // ----------------------------------------
                    if (ch === '[')
                    {
                        if (text[index + 1] === ']')
                        {
                            out += '[]';
                            index += 2;
                            continue;
                        }
                        return null;
                    }

                    // ----------------------------------------
                    //  Custom Resolver match
                    // ----------------------------------------
                    let resolverMatch = text.slice(index).match(this.resolveRegex);
                    if (resolverMatch)
                    {
                        const token = resolverMatch[0];

                        if (tokenHandler)
                            tokenHandler(token, exprStartIndex + index);

                        out += `resolver(${JSON.stringify(token)})`;
                        index += token.length;
                        continue;
                    }

                    // ----------------------------------------
                    // Operators
                    // ----------------------------------------
                    if ("&|+-*/%()<>!=?:@,.".includes(ch))
                    {
                        out += ch;
                        index++;
                        continue;
                    }


                    return null;
                }

                return out;
            };

            // --------------------------------------------------------------
            // MAIN PROCESS splits literal text and {{ expressions }}
            // --------------------------------------------------------------
            function process(text, index = 0, inPlaceholder = false)
            {
                let output = "";
                let inString = null;
                let escape = false;

                while (index < text.length)
                {
                    let ch = text[index];

                    // Handle escapes
                    if (ch === '\\' && !escape)
                    {
                        escape = true;
                        output += JSON.stringify(ch) + " + ";  // output the backslash as a literal
                        index++;
                        continue;
                    }

                    if (escape)
                    {
                        escape = false;
                        output += JSON.stringify(ch) + " + ";  // output escaped char as literal, but skip string boundary detection
                        index++;
                        continue;
                    }

                    // Detect string boundaries
                    if (!escape && (ch === '"' || ch === "'"))
                    {
                        if (inString === null) inString = ch;
                        else if (inString === ch) inString = null;
                    }

                    if (inPlaceholder)
                    {
                        if (inString === null && ch === '}' && text[index + 1] === '}') // Find end of placeholder
                        {
                            return { value: output, index: index + 2 }; // Return processed content and new index after }}
                        }
                        // Otherwise accumulate inside placeholder
                        output += ch;
                        index++;
                    }
                    else if (ch === '{' && text[index + 1] === '{')  // Outside placeholder: detect {{ to enter placeholder mode
                    {
                        // Recursive call to process inside placeholder
                        const innerResult = process(text, index + 2, true);
                        const exprStartIndex = index + 2;
                        if (!innerResult) return null; // invalid

                        const exprContent = innerResult.value;
                        index = innerResult.index;

                        const processed = processExpression(exprContent, exprStartIndex);
                        if (processed === null) return null;

                        output += "(" + processed + ")" + " + ";
                        continue;
                    }
                    else
                    {
                        output += JSON.stringify(ch) + " + ";  // Default: literal text outside placeholders
                        index++;
                    }
                }

                // If we are inside a placeholder but no closing }}, invalid expression
                if (inPlaceholder) return null;

                // Return accumulated string and index (end of text)
                return { value: output, index: index };
            }

            if (!expr)
                return null;

            const result = process(expr, 0, false);
            if (!result) return null;

            let output = result.value.replace(/\s*\+\s*$/, ""); // Trim trailing " + "
            return Function('resolver', `"use strict"; return (${output})`); // Run JS-safe parsed code and accept resolver fn
        }
    }
})();

export default componyx.bindary_modules.expressionEngine;


