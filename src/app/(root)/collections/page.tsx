import Link from "next/link";
import { Card } from "@/components";
import PageHero from "@/components/PageHero";
import { getCachedCollections } from "@/lib/queries/collections";

export const revalidate = 120;

export default async function CollectionsPage() {
  const collections = await getCachedCollections();

  return (
    <>
      <PageHero
        page="collections"
        eyebrow="Curated lines"
        title="Collections"
        subtitle="Naga Original tees and the Naga Green set — real pieces, real photos."
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.filter((col) => col.productCount > 0).map((collection) => (
              <Card
                key={collection.id}
                title={collection.name}
                meta={`${collection.productCount} products`}
                imageSrc={collection.imageUrl}
                href={`/collections/${collection.slug}`}
              />
            ))}
          </div>
        )}

        <p className="mt-8 text-caption text-dark-700">
          <Link href="/products" className="underline hover:text-dark-900">
            Browse all products
          </Link>
        </p>
      </main>
    </>
  );
}
