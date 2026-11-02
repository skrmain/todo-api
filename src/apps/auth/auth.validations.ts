import { z } from 'zod';

const EmailSchema = z.string().trim().toLowerCase().email();
const PasswordSchema = z.string().trim().min(5).max(20);

export const RegisterSchema = z.object({
    name: z.string().trim().min(3).max(20),
    email: EmailSchema,
    password: PasswordSchema,
}).strict();

export const LoginSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
}).strict();

export const TokenRefreshSchema = z.object({
    refresh: z.string().trim().min(1),
}).strict();
