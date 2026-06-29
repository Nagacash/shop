import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Card, CollapsibleSection, ProductGallery, SizePicker, AddToBagButton } from "@/components";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { Heart, Star } from "lucide-react";
import ColorSwatches from "@/components/ColorSwatches";
import {
  getCachedProduct,
  getCachedProductReviews,
  getCachedRecommendedProducts,
  type Review,
  type RecommendedProduct,
} from "@/lib/queries/products";
import { normalizeImageUrl, FALLBACK_PRODUCT_IMAGE, isFlatLayProductImage, isSetProduct } from "@/lib/utils/images";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils/currency";

type GalleryVariant = { color: string; images: string[] };

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getCachedProduct(id);
  if (!data) {
    return buildPageMetadata({
      title: "Product Not Found",
      description: "This Naga Apparel product could not be found.",
      path: `/products/${id}`,
      noIndex: true,
    });
  }

  const image =
    normalizeImageUrl(
      data.images.find((img) => img.isPrimary)?.url ?? data.images[0]?.url,
    ) ?? FALLBACK_PRODUCT_IMAGE;

  return buildPageMetadata({
    title: data.product.name,
    description: data.product.description,
    path: `/products/${id}`,
    image,
  });
}

function NotFoundBlock() {
  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-light-300 bg-light-100 p-8 text-center">
      <h1 className="text-heading-3 text-dark-900">Product not found</h1>
      <p className="mt-2 text-body text-dark-700">The product you’re looking for doesn’t exist or may have been removed.</p>
      <div className="mt-6">
        <Link
          href="/products"
          className="inline-block rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
        >
          Browse Products
        </Link>
      </div>
    </section>
  );
}

async function ReviewsSection({ productId }: { productId: string }) {
  const reviews: Review[] = await getCachedProductReviews(productId);
  const count = reviews.length;
  const avg =
    count > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / count) : 0;

  return (
    <CollapsibleSection
      title={`Reviews (${count})`}
      rightMeta={
        <span className="flex items-center gap-1 text-dark-900">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={`h-4 w-4 ${i <= Math.round(avg) ? "fill-[--color-dark-900]" : ""}`} />
          ))}
        </span>
      }
    >
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.slice(0, 10).map((r) => (
            <li key={r.id} className="rounded-lg border border-light-300 p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-body-medium text-dark-900">{r.author}</p>
                <span className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-4 w-4 ${i <= r.rating ? "fill-[--color-dark-900]" : ""}`} />
                  ))}
                </span>
              </div>
              {r.title && <p className="text-body-medium text-dark-900">{r.title}</p>}
              {r.content && <p className="mt-1 line-clamp-[8] text-body text-dark-700">{r.content}</p>}
              <p className="mt-2 text-caption text-dark-700">{new Date(r.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </CollapsibleSection>
  );
}

async function AlsoLikeSection({ productId }: { productId: string }) {
  const recs: RecommendedProduct[] = await getCachedRecommendedProducts(productId);
  if (!recs.length) return null;
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-heading-3 text-dark-900">You Might Also Like</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recs.map((p) => (
          <Card
            key={p.id}
            title={p.title}
            imageSrc={p.imageUrl}
            price={p.price ?? undefined}
            href={`/products/${p.id}`}
          />
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCachedProduct(id);

  if (!data) {
    return (
      <>
        <PageHero page="product" size="slim" title="Product not found" />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NotFoundBlock />
        </main>
      </>
    );
  }

  const { product, variants, images } = data;

  const galleryVariants: GalleryVariant[] = variants.map((v) => {
    const imgs = images
      .filter((img) => img.variantId === v.id)
      .map((img) => normalizeImageUrl(img.url)!);

    const fallback = images
      .filter((img) => img.variantId === null)
      .sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      })
      .map((img) => normalizeImageUrl(img.url)!);

    return {
      color: v.color?.name || "Default",
      images: imgs.length ? imgs : fallback,
    };
  }).filter((gv) => gv.images.length > 0);

  const defaultVariant =
    variants.find((v) => v.id === product.defaultVariantId) || variants[0];

  const soldOut =
    variants.length > 0 && variants.every((v) => (v.inStock ?? 0) <= 0);

  const basePrice = defaultVariant ? Number(defaultVariant.price) : null;
  const salePrice = defaultVariant?.salePrice ? Number(defaultVariant.salePrice) : null;

  const displayPrice = salePrice !== null && !Number.isNaN(salePrice) ? salePrice : basePrice;
  const compareAt = salePrice !== null && !Number.isNaN(salePrice) ? basePrice : null;

  const discount =
    compareAt && displayPrice && compareAt > displayPrice
      ? Math.round(((compareAt - displayPrice) / compareAt) * 100)
      : null;

  const subtitle = [product.category?.name, product.gender?.label].filter(Boolean).join(" · ") || undefined;
  const isSet = isSetProduct(product.category?.slug);
  const primaryImage = galleryVariants[0]?.images[0];
  const isFlatLay = isFlatLayProductImage(primaryImage);
  const schemaImage = primaryImage ?? FALLBACK_PRODUCT_IMAGE;
  const schemaPrice = displayPrice ?? 0;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.id}` },
          ]),
          productJsonLd({
            name: product.name,
            description: product.description,
            path: `/products/${product.id}`,
            image: schemaImage,
            price: schemaPrice,
            inStock: !soldOut,
            sku: defaultVariant?.sku,
          }),
        ]}
      />
      {!isFlatLay && (
        <PageHero
          page="product"
          size="slim"
          eyebrow="Naga piece"
          title={product.name}
          subtitle={subtitle}
        />
      )}

      {isFlatLay && (
        <section className="border-b border-light-300 bg-dark-900 text-light-100">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <nav className="text-caption text-light-400">
              <Link href="/" className="hover:text-light-100">Home</Link>
              {" / "}
              <Link href="/products" className="hover:text-light-100">Products</Link>
              {" / "}
              <Link href="/products?category=sets" className="hover:text-light-100">Sets</Link>
              {" / "}
              <span className="text-light-100">{product.name}</span>
            </nav>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-caption uppercase tracking-[0.22em] text-light-300">
                  Complete set
                </p>
                <h1 className="mt-1 text-heading-3 sm:text-heading-2 text-balance">{product.name}</h1>
                {subtitle && <p className="mt-2 text-body text-light-400">{subtitle}</p>}
              </div>
              {displayPrice !== null && (
                <p className="text-lead tabular-nums text-light-100">{formatPrice(displayPrice)}</p>
              )}
              {soldOut && (
                <span className="rounded-full border border-light-100/20 bg-light-100/10 px-3 py-1 text-caption uppercase tracking-[0.16em] text-light-400">
                  Sold out
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {!isFlatLay && (
        <nav className="py-4 text-caption text-dark-700">
          <Link href="/" className="hover:underline">Home</Link> / <Link href="/products" className="hover:underline">Products</Link> /{" "}
          <span className="text-dark-900">{product.name}</span>
        </nav>
      )}

      <section className={`grid grid-cols-1 gap-10 ${isFlatLay ? "py-8 lg:grid-cols-[1.15fr_420px]" : "lg:grid-cols-[1fr_480px]"}`}>
        {galleryVariants.length > 0 && (
          <ProductGallery productId={product.id} variants={galleryVariants} className="lg:sticky lg:top-6" />
        )}

        <div className="flex flex-col gap-6">
          {!isFlatLay && (
            <div className="flex items-center gap-3">
              <p className="text-lead text-dark-900">{formatPrice(displayPrice)}</p>
              {compareAt && (
                <>
                  <span className="text-body text-dark-700 line-through">{formatPrice(compareAt)}</span>
                  {discount !== null && (
                    <span className="rounded-full border border-light-300 px-2 py-1 text-caption text-[--color-green]">
                      {discount}% off
                    </span>
                  )}
                </>
              )}
            </div>
          )}

          {isFlatLay && displayPrice !== null && (
            <p className="text-lead text-dark-900 lg:hidden">{formatPrice(displayPrice)}</p>
          )}

          {isSet && (
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-light-300 bg-light-100 p-3 sm:grid-cols-3">
              {[
                { label: "Tee", detail: "Naga Original print" },
                { label: "Shorts", detail: "Hustle Hard + patch" },
                {
                  label: "Color",
                  detail: defaultVariant?.color?.name ?? "Black",
                },
              ].map((chip) => (
                <div key={chip.label} className="rounded-lg bg-light-200/80 px-3 py-2">
                  <p className="text-caption uppercase tracking-[0.12em] text-dark-700">{chip.label}</p>
                  <p className="mt-0.5 text-body-medium text-dark-900">{chip.detail}</p>
                </div>
              ))}
            </div>
          )}

          <ColorSwatches productId={product.id} variants={galleryVariants} />
          <SizePicker />

          <div className="flex flex-col gap-3">
            {soldOut && (
              <p className="rounded-full border border-light-300 bg-light-200 px-4 py-2 text-center text-body-medium text-dark-700">
                Sold out for now — check back soon.
              </p>
            )}
            {defaultVariant && (
              <AddToBagButton
                variantId={defaultVariant.id}
                productName={product.name}
                soldOut={soldOut}
              />
            )}
            <button className="flex items-center justify-center gap-2 rounded-full border border-light-300 px-6 py-4 text-body-medium text-dark-900 transition hover:border-dark-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]">
              <Heart className="h-5 w-5" />
              Favorite
            </button>
          </div>

          <CollapsibleSection title="Product Details" defaultOpen>
            <p>{product.description}</p>
            {product.category?.slug === "sets" && (
              <p className="mt-3 text-body text-dark-700">
                Set includes matching tee and shorts — sold together as one complete look.
              </p>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Shipping & Returns">
            <p>Free standard shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}. 30-day returns on unworn items with tags attached.</p>
          </CollapsibleSection>

          <Suspense
            fallback={
              <CollapsibleSection title="Reviews">
                <p className="text-body text-dark-700">Loading reviews…</p>
              </CollapsibleSection>
            }
          >
            <ReviewsSection productId={product.id} />
          </Suspense>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="mt-16">
            <h2 className="mb-6 text-heading-3 text-dark-900">You Might Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-light-200" />
              ))}
            </div>
          </section>
        }
      >
        <AlsoLikeSection productId={product.id} />
      </Suspense>
      </main>
    </>
  );
}
