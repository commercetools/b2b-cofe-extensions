var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    initTest() {
        return __awaiter(this, void 0, void 0, function* () {
            const testAccount = yield nodemailer.createTestAccount();
            this.transport = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        });
    }
    getUrl(token, relPath, host) {
        const path = `${relPath}?token=${token}`;
        const url = `${host}/${path}`;
        return url;
    }
    sendEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const from = this.sender;
            const { to, text, html, subject } = data;
            return yield this.transport.sendMail({ from, to, subject, text, html });
        });
    }
    sendVerificationEmail(account, host) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!account.confirmationToken)
                return;
            const url = this.getUrl(account.confirmationToken, 'verify', host);
            const html = `
                  <h1>Thanks for your registration!</h1>
                  <p style="margin-top: 10px;color:gray;">Please activate your account by clicking the below link</p>
                  <a href="${url}">${url}</a>
                `;
            try {
                yield this.sendEmail({
                    to: account.email,
                    subject: 'Account Verification',
                    html,
                });
            }
            catch (error) { }
        });
    }
    sendPasswordResetEmail(token, email, host) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                return;
            const url = this.getUrl(token, 'reset-password', host);
            const html = `
                  <h1>You requested a password reset!</h1>
                  <p style="margin-top: 10px;color:gray;">Please click the link below to proceed.</p>
                  <a href="${url}">${url}</a>
                `;
            yield this.sendEmail({
                to: email,
                subject: 'Password Reset',
                html,
            });
        });
    }
    sendPaymentConfirmationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = `
                  <h1>Thanks for your order!</h1>
                  <p style="margin-top: 10px;color:gray;">Your payment has been confirmed.</p>
                `;
            try {
                yield this.sendEmail({
                    to: email,
                    subject: 'Payment confirmed',
                    html,
                });
            }
            catch (error) { }
        });
    }
}
//# sourceMappingURL=EmailApi.js.map