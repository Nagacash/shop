import Link from "next/link";
import { X } from "lucide-react";
import type { ActiveFilterBadge } from "@/lib/utils/query";

type Props = {
  badges: ActiveFilterBadge[];
};

export default function ActiveFilterBadges({ badges }: Props) {
  if (badges.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {badges.map((badge) => (
        <Link
          key={badge.id}
          href={badge.href}
          scroll={false}
          className="focus-ring inline-flex min-h-9 items-center gap-1.5 rounded-full border border-light-300 bg-light-100 px-3 py-1 text-caption text-dark-900 transition-colors hover:border-[--color-naga-gold] hover:text-dark-900 focus-visible:outline-none"
          aria-label={`Remove filter: ${badge.label}`}
        >
          {badge.label}
          <X className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
