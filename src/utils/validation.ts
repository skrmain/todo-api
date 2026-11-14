import z from 'zod';

export function validateInput<T>(schema: z.ZodType<T>, data: any): T {
    return schema.parse(data);
}
