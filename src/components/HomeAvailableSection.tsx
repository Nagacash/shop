import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Card from "@/components/Card";
import InViewMotion from "@/components/motion/InViewMotion";
import ProductCardGrid from "@/components/ProductCardGrid";
import { BLACK_TEE_NAME, CTA, HOME_AVAILABLE_PRIORITY } from "@/lib/brand/manifesto";
import { getCachedAvailableProducts } from "@/lib/queries/products";
import { FALLBACK_PRODUCT_IMAGE, isFlatLayProductImage } from "@/lib/utils/images";

export default async function HomeAvailableSection() {
  const products = await getCachedAvailableProducts(3, HOME_AVAILABLE_PRIORITY);
  if (products.length === 0) return null;

  return (
    <section
      className="scroll-layer border-t border-dark-900/8 bg-[--hero-light-base] text-dark-900"
      aria-labelledby="home-available-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <InViewMotion reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p data-motion-reveal className="naga-eyebrow w-fit">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              Available now
            </p>
            <h2
              id="home-available-heading"
              data-motion-reveal
              className="naga-display mt-4 text-balance text-heading-3 font-bold tracking-tighter text-dark-900 sm:text-heading-2"
            >
              Shop what&apos;s in stock
            </h2>
            <p data-motion-reveal className="mt-3 text-body text-dark-700">
              Start with {BLACK_TEE_NAME} — tees, hoodies, and crews ready to ship.
            </p>
          </div>
          <Link
            href="/products"
            data-motion-reveal
            className="naga-btn-text focus-ring focus-visible:outline-none"
          >
            {CTA.shopAll}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </InViewMotion>

        <ProductCardGrid animate>
          {products.map((product) => (
            <Card
              key={product.id}
              title={product.name}
              subtitle={product.subtitle ?? undefined}
              imageSrc={product.imageUrl ?? FALLBACK_PRODUCT_IMAGE}
              price={product.minPrice ?? undefined}
              href={`/products/${product.id}`}
              badge={
                isFlatLayProductImage(product.imageUrl)
                  ? { label: "In stock", tone: "green" }
                  : undefined
              }
            />
          ))}
        </ProductCardGrid>
      </div>
    </section>
  );
}
