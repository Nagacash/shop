import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getOrderForCheckoutSuccess } from "@/lib/actions/orders";
import OrderSuccess from "@/components/OrderSuccess";

type SearchParams = Promise<{ session_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <>
        <PageHero
          page="checkout"
          size="compact"
          eyebrow="Checkout"
          title="Invalid session"
          subtitle="We could not verify your checkout session."
        />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/cart"
            className="naga-btn naga-btn-dark inline-block"
          >
            Return to Bag
          </Link>
        </main>
      </>
    );
  }

  const order = await getOrderForCheckoutSuccess(session_id);

  if (!order) {
    return (
      <>
        <PageHero
          page="checkout"
          size="compact"
          eyebrow="Checkout"
          title="Order unavailable"
          subtitle="We couldn't verify access to this order. If you just paid, check your email for confirmation."
        />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="naga-btn naga-btn-dark inline-block"
          >
            Back to Home
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHero
        page="checkout"
        eyebrow="Order confirmed"
        title="You're in"
        subtitle="Golden drip secured. Welcome to the Naga family."
      />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <OrderSuccess order={order} />
      </main>
    </>
  );
}
