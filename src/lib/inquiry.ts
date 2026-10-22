import { z } from "zod";

export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please share your name.")
    .max(100, "Name is too long."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20, "Phone number is too long.")
    .regex(/^[+()\d\s-]+$/, "Please enter a valid phone number."),
  email: z
    .union([z.string().trim().email("Please enter a valid email."), z.literal("")])
    .optional()
    .transform((value) => value || null),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(2500, "Message is too long."),
  interest: z.string().trim().max(120).optional(),
  source: z.enum(["contact", "product", "service", "portfolio"]).optional(),
  productId: z.string().trim().max(64).optional().nullable(),
  serviceId: z.string().trim().max(64).optional().nullable(),
  website: z.string().optional(),
  startedAt: z.number().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
