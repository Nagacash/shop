import { getCurrentCart } from "@/lib/actions/cart";
import CartSummary from "@/components/CartSummary";
import PageHero from "@/components/PageHero";
import { SECTION_CLIPS } from "@/lib/brand/marketing-images";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "My Bag",
  description: "Your Naga Apparel shopping bag.",
  path: "/cart",
  noIndex: true,
});

export default async function CartPage() {
  const cart = await getCurrentCart();
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <PageHero
        clipId={SECTION_CLIPS.cart}
        page="cart"
        size="compact"
        eyebrow="Your bag"
        title="My Bag"
        subtitle={
          itemCount
            ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready to move.`
            : "Empty for now — go grab a drop."
        }
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <CartSummary cart={cart} />
      </main>
    </>
  );
}
