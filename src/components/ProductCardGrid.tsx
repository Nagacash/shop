import type { ReactNode } from "react";
import StaggerGridMotion from "@/components/motion/StaggerGridMotion";

export const PRODUCT_CARD_GRID_CLASS =
  "product-grid grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3";

type ProductCardGridProps = {
  children: ReactNode;
  className?: string;
  /** Stagger entrance on scroll (shop + homepage strips). */
  animate?: boolean;
  refreshKey?: string;
};

export default function ProductCardGrid({
  children,
  className = "",
  animate = false,
  refreshKey,
}: ProductCardGridProps) {
  const classes = [PRODUCT_CARD_GRID_CLASS, className].filter(Boolean).join(" ");

  if (animate) {
    return (
      <StaggerGridMotion refreshKey={refreshKey} className={classes}>
        {children}
      </StaggerGridMotion>
    );
  }

  return <div className={classes}>{children}</div>;
}
