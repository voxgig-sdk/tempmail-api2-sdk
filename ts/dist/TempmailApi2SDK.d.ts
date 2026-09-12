import { DomainEntity } from './entity/DomainEntity';
import { EmailEntity } from './entity/EmailEntity';
import { InboxEntity } from './entity/InboxEntity';
export type * from './TempmailApi2Types';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { TempmailApi2EntityBase } from './TempmailApi2EntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
declare class TempmailApi2SDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    _rawRequest(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Domain(entopts?: Record<string, any>): DomainEntity;
    Email(entopts?: Record<string, any>): EmailEntity;
    Inbox(entopts?: Record<string, any>): InboxEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): TempmailApi2SDK;
    tester(testopts?: any, sdkopts?: any): TempmailApi2SDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof TempmailApi2SDK;
export { stdutil, config, BaseFeature, TempmailApi2EntityBase, TempmailApi2SDK, SDK, };
