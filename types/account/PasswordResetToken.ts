export interface PasswordResetToken {
  email: string;
  confirmationToken?: string;
  tokenValidUntil?: Date;
}
