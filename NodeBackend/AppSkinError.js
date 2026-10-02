/**
 * This class has no specific description yet.
 */
export class AppSkinError
{
    constructor(ex, logId)
    {
        /**
         * Gets or sets the Error Message.
         * @type {Boolean}
         */
        Object.defineProperty(this, 'isError',
        {
            get()
            {
                return true;
            },
            enumerable: true
        });

        /**
         * Gets or sets the Error Message.
         * @type {String}
         */
        this.message = ex.message;

        /**
         * Gets or sets the stack trace.
         * @type {String}
         */
        this.stackTrace = ex.stack;

        /**
         * Gets or sets the timestamp.
         * @type {Date}
         */
        this.timestamp = new Date();

        /**
         * Gets or sets the logged identifier of the error.
         * @type {Number}
         */
        this.id = (logId !== undefined) ? logId : null;
    }

    /**
     * Serializes the error to a JSON string.
     * @returns {String}
     */
    toJSON()
    {
        return JSON.stringify({
            isError: this.isError,
            message: this.message,
            stackTrace: this.stackTrace,
            timestamp: this.timestamp,
            id: this.id
        });
    }
}
