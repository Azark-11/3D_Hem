import { z } from "zod";

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  priceOre: z.number().int().positive(),
  image: z.string(),
  quantity: z.number().int().min(1).max(99),
});

export const CartSchema = z.array(CartItemSchema);

export type CartItem = z.infer<typeof CartItemSchema>;

export const CheckoutRequestSchema = z.object({
  items: CartSchema.min(1, "Cart is empty"),
});

export const ProductFormSchema = z.object({
  name: z.string().min(1, "Name required").max(200),
  nameEn: z.string().max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug: only lowercase letters, numbers, hyphens"),
  description: z.string().min(1, "Description required"),
  descriptionEn: z.string().optional(),
  priceOre: z.number().int().positive("Price must be positive"),
  category: z.enum(["figurer", "lampor", "funktionellt", "ovrigt"]),
  stock: z.number().int().min(0),
  material: z.string().min(1),
  dimensionsMm: z.string().min(1),
  weightGrams: z.number().int().positive().optional().nullable(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  images: z.array(z.string()).min(1, "At least one image required"),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const WebhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.string(), z.unknown()),
  }),
});
