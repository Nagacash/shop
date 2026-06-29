import Link from "next/link";
import PageHero from "@/components/PageHero";
import { createOrder, getOrderByStripeSession } from "@/lib/actions/orders";
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
            className="inline-block rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100"
          >
            Return to Bag
          </Link>
        </main>
      </>
    );
  }

  let order = await getOrderByStripeSession(session_id);

  if (!order) {
    try {
      order = await createOrder(session_id);
    } catch {
      order = null;
    }
  }

  if (!order) {
    return (
      <>
        <PageHero
          page="checkout"
          size="compact"
          eyebrow="Almost there"
          title="Processing your order"
          subtitle="Payment received — this page updates when your order is confirmed."
        />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-block rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100"
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
