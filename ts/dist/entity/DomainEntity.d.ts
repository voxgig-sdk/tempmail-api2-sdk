import { TempmailApi2EntityBase } from '../TempmailApi2EntityBase';
import type { TempmailApi2SDK } from '../TempmailApi2SDK';
import type { Control } from '../types';
import type { Domain, DomainListMatch } from '../TempmailApi2Types';
declare class DomainEntity extends TempmailApi2EntityBase<Domain> {
    constructor(client: TempmailApi2SDK, entopts: any);
    make(this: DomainEntity): DomainEntity;
    list(this: any, reqmatch?: DomainListMatch, ctrl?: Control): Promise<DomainEntity[]>;
}
export { DomainEntity };
