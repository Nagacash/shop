import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Card from "@/components/Card";
import SectionChapterLabel from "@/components/SectionChapterLabel";
import InViewMotion from "@/components/motion/InViewMotion";
import ProductCardGrid from "@/components/ProductCardGrid";
import { BLACK_TEE_NAME, CTA, HOME_AVAILABLE_PRIORITY } from "@/lib/brand/manifesto";
import { getCachedAvailableProducts } from "@/lib/queries/products";
import { FALLBACK_PRODUCT_IMAGE, isFlatLayProductImage } from "@/lib/utils/images";

export default async function HomeAvailableSection() {
  const products = await getCachedAvailableProducts(3, HOME_AVAILABLE_PRIORITY);
  if (products.length === 0) return null;

  const [spotlight, ...supporting] = products;

  return (
    <section
      className="naga-drop-stage scroll-layer border-t border-dark-900/8 bg-[--hero-light-base] text-dark-900"
      aria-labelledby="home-available-heading"
      data-cursor-section
      data-cursor-index="01"
      data-cursor-label="The drop"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <InViewMotion reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <SectionChapterLabel index="01" title="The drop" className="mb-5" />
            <p data-motion-reveal className="naga-eyebrow w-fit">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              Available now
            </p>
            <h2
              id="home-available-heading"
              data-motion-reveal
              className="naga-display mt-4 text-balance text-heading-3 font-bold tracking-tighter text-dark-900 sm:text-heading-2"
            >
              In stock. Move with intention.
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

        <div className="naga-drop-spotlight">
          <div className="naga-drop-spotlight-card">
            <Card
              title={spotlight.name}
              subtitle={spotlight.subtitle ?? undefined}
              imageSrc={spotlight.imageUrl ?? FALLBACK_PRODUCT_IMAGE}
              price={spotlight.minPrice ?? undefined}
              href={`/products/${spotlight.id}`}
              badge={
                isFlatLayProductImage(spotlight.imageUrl)
                  ? { label: "Spotlight", tone: "green" }
                  : undefined
              }
            />
          </div>

          {supporting.length > 0 && (
            <div className="naga-drop-filmstrip">
              <p className="naga-drop-filmstrip-label">Also in the drop</p>
              <ProductCardGrid animate className="naga-drop-filmstrip-grid">
                {supporting.map((product) => (
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
          )}
        </div>
      </div>
    </section>
  );
}
