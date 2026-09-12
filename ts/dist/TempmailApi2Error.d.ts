import { Context } from './Context';
declare class TempmailApi2Error extends Error {
    isTempmailApi2Error: boolean;
    sdk: string;
    code: string;
    ctx: Context;
    status: number;
    get notFound(): boolean;
    constructor(code: string, msg: string, ctx: Context);
}
export { TempmailApi2Error };
