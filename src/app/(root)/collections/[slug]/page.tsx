import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card } from "@/components";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { getCachedCollectionProducts } from "@/lib/queries/collections";
import { getCollectionCoverUrl } from "@/lib/brand/assets";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/utils/images";
import { formatPriceRange } from "@/lib/utils/currency";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCachedCollectionProducts(slug);
  if (!data) {
    return buildPageMetadata({
      title: "Collection Not Found",
      path: `/collections/${slug}`,
      noIndex: true,
    });
  }

  const cover = getCollectionCoverUrl(slug);
  return buildPageMetadata({
    title: `${data.collection.name} Collection`,
    description: `Shop the ${data.collection.name} collection at Naga Apparel — ${data.products.length} product${data.products.length === 1 ? "" : "s"} with real photography.`,
    path: `/collections/${slug}`,
    image: cover,
  });
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCachedCollectionProducts(slug);

  if (!data) {
    notFound();
  }

  const { collection, products } = data;
  const coverUrl = getCollectionCoverUrl(slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
          { name: collection.name, path: `/collections/${slug}` },
        ])}
      />
      <PageHero
        imageSrc={coverUrl}
        imageFit={slug === "black-gold-edition" ? "contain" : "cover"}
        eyebrow="Collection"
        title={collection.name}
        subtitle={`${products.length} product${products.length === 1 ? "" : "s"} in this line.`}
        size="compact"
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <nav className="py-4 text-caption text-dark-700">
          <Link href="/" className="hover:underline">Home</Link> /{" "}
          <Link href="/collections" className="hover:underline">Collections</Link> /{" "}
          <span className="text-dark-900">{collection.name}</span>
        </nav>

        {products.length === 0 ? (
          <div className="rounded-lg border border-light-300 p-8 text-center">
            <p className="text-body text-dark-700">No products in this collection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 product-grid">
            {products.map((product) => {
              const price =
                product.minPrice !== null &&
                product.maxPrice !== null &&
                product.minPrice !== product.maxPrice
                  ? formatPriceRange(product.minPrice, product.maxPrice)
                  : product.minPrice !== null
                    ? product.minPrice
                    : undefined;

              return (
                <Card
                  key={product.id}
                  title={product.name}
                  subtitle={product.subtitle ?? undefined}
                  imageSrc={product.imageUrl ?? FALLBACK_PRODUCT_IMAGE}
                  price={price}
                  href={`/products/${product.id}`}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
