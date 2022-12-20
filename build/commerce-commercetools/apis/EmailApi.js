import * as nodemailer from 'nodemailer';
export class EmailApi {
    constructor(credentials) {
        this.client_host = credentials.client_host;
        this.sender = credentials.sender;
        this.transport = nodemailer.createTransport({
            host: credentials.host,
            port: +credentials.port,
            secure: credentials.port == 465,
            auth: {
                user: credentials.user,
                pass: credentials.password,
            },
        });
    }
    async initTest() {
        const testAccount = await nodemailer.createTestAccount();
        this.transport = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
    getUrl(token, relPath, host) {
        const path = `${relPath}?token=${token}`;
        const url = `${host}/${path}`;
        return url;
    }
    async sendEmail(data) {
        const from = this.sender;
        const { to, text, html, subject } = data;
        return await this.transport.sendMail({ from, to, subject, text, html });
    }
    async sendVerificationEmail(account, host) {
        if (!account.confirmationToken)
            return;
        const url = this.getUrl(account.confirmationToken, 'verify', host);
        const html = `
                  <h1>Thanks for your registration!</h1>
                  <p style="margin-top: 10px;color:gray;">Please activate your account by clicking the below link</p>
                  <a href="${url}">${url}</a>
                `;
        try {
            await this.sendEmail({
                to: account.email,
                subject: 'Account Verification',
                html,
            });
        }
        catch (error) { }
    }
    async sendPasswordResetEmail(token, email, host) {
        if (!token)
            return;
        const url = this.getUrl(token, 'reset-password', host);
        const html = `
                  <h1>You requested a password reset!</h1>
                  <p style="margin-top: 10px;color:gray;">Please click the link below to proceed.</p>
                  <a href="${url}">${url}</a>
                `;
        await this.sendEmail({
            to: email,
            subject: 'Password Reset',
            html,
        });
    }
    async sendPaymentConfirmationEmail(email) {
        const html = `
                  <h1>Thanks for your order!</h1>
                  <p style="margin-top: 10px;color:gray;">Your payment has been confirmed.</p>
                `;
        try {
            await this.sendEmail({
                to: email,
                subject: 'Payment confirmed',
                html,
            });
        }
        catch (error) { }
    }
}
//# sourceMappingURL=EmailApi.js.map