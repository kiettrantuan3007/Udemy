const { model } = require("mongoose");

class expressError extends Error {
    constructor(message, staticCode) {
        super();
        this.message = message;
        this.staticCode = staticCode;
    }
}

module.exports = expressError;