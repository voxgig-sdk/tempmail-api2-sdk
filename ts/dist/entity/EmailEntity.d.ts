import { TempmailApi2EntityBase } from '../TempmailApi2EntityBase';
import type { TempmailApi2SDK } from '../TempmailApi2SDK';
import type { Control } from '../types';
import type { Email, EmailLoadMatch, EmailRemoveMatch } from '../TempmailApi2Types';
declare class EmailEntity extends TempmailApi2EntityBase<Email> {
    constructor(client: TempmailApi2SDK, entopts: any);
    make(this: EmailEntity): EmailEntity;
    load(this: any, reqmatch?: EmailLoadMatch, ctrl?: Control): Promise<EmailEntity>;
    remove(this: any, reqmatch?: EmailRemoveMatch, ctrl?: Control): Promise<EmailEntity>;
}
export { EmailEntity };
