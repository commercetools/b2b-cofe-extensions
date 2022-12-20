import * as nodemailer from 'nodemailer';
import { Account } from '@Types/account/Account';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
export declare class EmailApi {
    transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    sender: string;
    client_host: string;
    constructor(credentials: {
        host: string;
        port: number;
        encryption: string;
        user: string;
        password: string;
        sender: string;
        client_host: string;
    });
    initTest(): Promise<void>;
    getUrl(token: string, relPath: string, host: string): string;
    sendEmail(data: {
        to: string;
        subject?: string;
        text?: string;
        html?: string;
    }): Promise<SMTPTransport.SentMessageInfo>;
    sendVerificationEmail(account: Account, host: string): Promise<void>;
    sendPasswordResetEmail(token: string, email: string, host: string): Promise<void>;
    sendPaymentConfirmationEmail(email: string): Promise<void>;
}
