import { z } from "zod";

export const cartVariantIdSchema = z.string().uuid();

export const cartQuantitySchema = z.number().int().min(1).max(99);
