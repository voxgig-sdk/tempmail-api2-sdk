"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempmailApi2Error = void 0;
class TempmailApi2Error extends Error {
    isTempmailApi2Error = true;
    sdk = 'TempmailApi2';
    code;
    ctx;
    status = -1;
    // `err.notFound` rather than a magic number at every call site.
    get notFound() { return 404 === this.status; }
    constructor(code, msg, ctx) {
        super(msg);
        this.code = code;
        this.ctx = ctx;
    }
}
exports.TempmailApi2Error = TempmailApi2Error;
//# sourceMappingURL=TempmailApi2Error.js.map