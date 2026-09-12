import { TempmailApi2EntityBase } from '../TempmailApi2EntityBase';
import type { TempmailApi2SDK } from '../TempmailApi2SDK';
import type { Control } from '../types';
import type { Inbox, InboxLoadMatch, InboxCreateData, InboxRemoveMatch } from '../TempmailApi2Types';
declare class InboxEntity extends TempmailApi2EntityBase<Inbox> {
    constructor(client: TempmailApi2SDK, entopts: any);
    make(this: InboxEntity): InboxEntity;
    load(this: any, reqmatch?: InboxLoadMatch, ctrl?: Control): Promise<InboxEntity>;
    create(this: any, reqdata?: InboxCreateData, ctrl?: Control): Promise<InboxEntity>;
    remove(this: any, reqmatch?: InboxRemoveMatch, ctrl?: Control): Promise<InboxEntity>;
}
export { InboxEntity };
