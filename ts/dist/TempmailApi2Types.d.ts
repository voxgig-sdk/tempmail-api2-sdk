export interface Domain {
    domains?: any[];
}
export interface DomainListMatch {
    domains?: any[];
}
export interface Email {
    attachments?: any[];
    body?: string;
    date?: string;
    from?: string;
    html?: string;
    id?: string;
    subject?: string;
    to?: string;
}
export interface EmailLoadMatch {
    email_id: string;
    token: string;
}
export interface EmailRemoveMatch {
    email_id: string;
    token: string;
}
export interface Inbox {
    domain?: string;
    email?: string;
    emails?: any[];
    id?: string;
    token?: string;
    username: string;
}
export interface InboxLoadMatch {
    id: string;
}
export interface InboxCreateData {
    domain?: string;
    email?: string;
    emails?: any[];
    id?: string;
    token?: string;
    username: string;
    $action?: string;
    [action: string]: any;
}
export interface InboxRemoveMatch {
    id: string;
}
