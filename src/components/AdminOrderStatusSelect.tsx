"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/admin-orders";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

type Props = {
  orderId: string;
  status: string;
};

export default function AdminOrderStatusSelect({ orderId, status }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(event) => {
        const next = event.target.value as (typeof STATUSES)[number];
        startTransition(async () => {
          await updateOrderStatus(orderId, next);
          router.refresh();
        });
      }}
      className="focus-ring rounded-md border border-light-300 bg-light-100 px-3 py-2 text-caption capitalize text-dark-900 focus-visible:outline-none disabled:opacity-60"
      aria-label="Update order status"
    >
      {STATUSES.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}
