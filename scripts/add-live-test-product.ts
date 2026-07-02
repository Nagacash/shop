import { db } from "@/lib/db";
import {
  brands,
  categories,
  colors,
  genders,
  insertProductImageSchema,
  insertProductSchema,
  insertVariantSchema,
  productImages,
  productVariants,
  products,
  sizes,
  type InsertProduct,
  type InsertProductImage,
  type InsertVariant,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const PRODUCT_NAME = "LIVE TEST — Digital Checkout (€0.50)";

async function main() {
  await db
    .update(products)
    .set({ isDigital: true })
    .where(eq(products.name, "LIVE TEST — Checkout Test (€0.50)"));

  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, PRODUCT_NAME))
    .limit(1);

  if (existing.length) {
    await db
      .update(products)
      .set({ isDigital: true, isPublished: true })
      .where(eq(products.id, existing[0].id));

    console.log(`[add-live-test-product] Updated existing digital test product: ${existing[0].id}`);
    console.log(`[add-live-test-product] Live: https://www.nagaclub.de/products/${existing[0].id}`);
    return;
  }

  const category =
    (await db.select().from(categories).where(eq(categories.slug, "tees")).limit(1))[0] ??
    (await db.select().from(categories).limit(1))[0];
  if (!category) throw new Error("No category found — run db:seed first");

  const nagaBrand = (await db.select().from(brands).where(eq(brands.slug, "naga-apparel")).limit(1))[0];
  const gender = (await db.select().from(genders).where(eq(genders.slug, "unisex")).limit(1))[0];
  const color =
    (await db.select().from(colors).where(eq(colors.slug, "black")).limit(1))[0] ??
    (await db.select().from(colors).limit(1))[0];
  const size =
    (await db.select().from(sizes).where(eq(sizes.slug, "m")).limit(1))[0] ??
    (await db.select().from(sizes).limit(1))[0];

  if (!color || !size) throw new Error("Missing color or size — run db:seed first");

  const product = insertProductSchema.parse({
    name: PRODUCT_NAME,
    description:
      "Internal live checkout test — digital delivery, no shipping. Stripe live minimum charge is €0.50. Remove after testing.",
    categoryId: category.id,
    genderId: gender?.id ?? null,
    brandId: nagaBrand?.id ?? null,
    isPublished: true,
    isDigital: true,
  });

  const [insertedProduct] = await db
    .insert(products)
    .values(product as InsertProduct)
    .returning();

  const variant = insertVariantSchema.parse({
    productId: insertedProduct.id,
    sku: `NAGA-LIVE-TEST-${insertedProduct.id.slice(0, 8).toUpperCase()}`,
    price: "0.50",
    colorId: color.id,
    sizeId: size.id,
    inStock: 999,
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
  });

  const [createdVariant] = await db
    .insert(productVariants)
    .values(variant as InsertVariant)
    .returning();

  await db
    .update(products)
    .set({ defaultVariantId: createdVariant.id })
    .where(eq(products.id, insertedProduct.id));

  const img: InsertProductImage = insertProductImageSchema.parse({
    productId: insertedProduct.id,
    url: "/uploads/naga/placeholder.svg",
    sortOrder: 0,
    isPrimary: true,
  });
  await db.insert(productImages).values(img);

  console.log(`[add-live-test-product] Created "${PRODUCT_NAME}"`);
  console.log(`[add-live-test-product] Product ID: ${insertedProduct.id}`);
  console.log(`[add-live-test-product] Local:  http://localhost:3000/products/${insertedProduct.id}`);
  console.log(`[add-live-test-product] Live:   https://www.nagaclub.de/products/${insertedProduct.id}`);
  console.log("[add-live-test-product] Digital — no shipping. Live total ≈ €0.50 + tax only.");
}

main().catch((e) => {
  console.error("[add-live-test-product:error]", e);
  process.exitCode = 1;
});
