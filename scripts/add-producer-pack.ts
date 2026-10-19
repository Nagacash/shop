import { db } from "@/lib/db";
import {
  brands,
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
import {
  PRODUCER_PACK_DESCRIPTION,
  PRODUCER_PACK_NAME,
  PRODUCER_PACK_PRICE,
  PRODUCER_PACK_SKU,
} from "@/lib/digital/pack";
import { eq } from "drizzle-orm";

async function main() {
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, PRODUCER_PACK_NAME))
    .limit(1);

  if (existing.length) {
    await db
      .update(products)
      .set({
        isDigital: true,
        isPublished: true,
        description: PRODUCER_PACK_DESCRIPTION,
      })
      .where(eq(products.id, existing[0].id));

    await db
      .update(productVariants)
      .set({ price: PRODUCER_PACK_PRICE, inStock: 999 })
      .where(eq(productVariants.productId, existing[0].id));

    await db
      .update(productImages)
      .set({ url: "/uploads/naga/naga-producer-pack-volume1.jpg", isPrimary: true })
      .where(eq(productImages.productId, existing[0].id));

    console.log(`[add-producer-pack] Updated ${existing[0].id}`);
    console.log(`[add-producer-pack] http://localhost:3000/products/${existing[0].id}`);
    return;
  }

  const nagaBrand = (await db.select().from(brands).where(eq(brands.slug, "naga-apparel")).limit(1))[0];
  const gender = (await db.select().from(genders).where(eq(genders.slug, "unisex")).limit(1))[0];
  const color =
    (await db.select().from(colors).where(eq(colors.slug, "black")).limit(1))[0] ??
    (await db.select().from(colors).limit(1))[0];
  const size =
    (await db.select().from(sizes).where(eq(sizes.slug, "one-size")).limit(1))[0] ??
    (await db.select().from(sizes).limit(1))[0];

  if (!color || !size) throw new Error("Missing color or size — run db:seed first");

  const product = insertProductSchema.parse({
    name: PRODUCER_PACK_NAME,
    description: PRODUCER_PACK_DESCRIPTION,
    categoryId: null,
    genderId: gender?.id ?? null,
    brandId: nagaBrand?.id ?? null,
    isPublished: false,
    isDigital: true,
  });

  const [insertedProduct] = await db
    .insert(products)
    .values(product as InsertProduct)
    .returning();

  const variant = insertVariantSchema.parse({
    productId: insertedProduct.id,
    sku: PRODUCER_PACK_SKU,
    price: PRODUCER_PACK_PRICE,
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
    .set({ defaultVariantId: createdVariant.id, isPublished: true })
    .where(eq(products.id, insertedProduct.id));

  const img: InsertProductImage = insertProductImageSchema.parse({
    productId: insertedProduct.id,
    url: "/uploads/naga/naga-producer-pack-volume1.jpg",
    sortOrder: 0,
    isPrimary: true,
  });
  await db.insert(productImages).values(img);

  console.log(`[add-producer-pack] Created "${PRODUCER_PACK_NAME}"`);
  console.log(`[add-producer-pack] Product ID: ${insertedProduct.id}`);
  console.log(`[add-producer-pack] http://localhost:3000/products/${insertedProduct.id}`);
}

main().catch((error) => {
  console.error("[add-producer-pack:error]", error);
  process.exitCode = 1;
});
