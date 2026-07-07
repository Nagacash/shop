import Link from "next/link";
import { Card } from "@/components";
import PageHero from "@/components/PageHero";
import ProductCardGrid from "@/components/ProductCardGrid";
import { getCachedCollections } from "@/lib/queries/collections";
import { getCollectionCoverUrl } from "@/lib/brand/assets";
import { BRAND_SUBTAGLINE_ALT, CTA } from "@/lib/brand/manifesto";
import { MARKETING_IMAGES, SECTION_CLIPS } from "@/lib/brand/marketing-images";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: "Collections",
  description: `${BRAND_SUBTAGLINE_ALT} Explore curated Naga Apparel lines — tees, crews, hoodies, and syndicate sets.`,
  path: "/collections",
  image: MARKETING_IMAGES.sweaterFlat,
});

export default async function CollectionsPage() {
  const collections = await getCachedCollections();
  const heroImage =
    getCollectionCoverUrl("naga-black") ?? getCollectionCoverUrl("naga-original");

  return (
    <>
      <PageHero
        clipId={SECTION_CLIPS.collections}
        page="collections"
        imageSrc={heroImage}
        eyebrow="Curated lines"
        title="Wear Your Wisdom"
        subtitle={`${BRAND_SUBTAGLINE_ALT} Every line carries the cobra.`}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <nav className="py-4 text-caption text-dark-700">
          <Link href="/" className="hover:underline">Home</Link> /{" "}
          <span className="text-dark-900">Collections</span>
        </nav>

        {collections.length === 0 ? (
          <div className="rounded-lg border border-light-300 p-8 text-center">
            <p className="text-body text-dark-700">No collections yet.</p>
          </div>
        ) : (
          <ProductCardGrid>
            {collections.filter((col) => col.productCount > 0).map((collection) => (
              <Card
                key={collection.id}
                title={collection.name}
                meta={`${collection.productCount} products`}
                imageSrc={collection.imageUrl}
                href={`/collections/${collection.slug}`}
              />
            ))}
          </ProductCardGrid>
        )}

        <p className="mt-8 text-caption text-dark-700">
          <Link href="/products" className="underline hover:text-dark-900">
            {CTA.shopTheDrop}
          </Link>
        </p>
      </main>
    </>
  );
}
