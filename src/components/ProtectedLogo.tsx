"use client";

import type { CSSProperties } from "react";
import { SITE_LOGO_ALT, SITE_LOGO_URL } from "@/lib/brand/site-logo";

type ProtectedLogoProps = {
  className: string;
  alt?: string;
  src?: string;
};

function blockCopy(event: { preventDefault: () => void }) {
  event.preventDefault();
}

/** Brand mark rendered as a CSS background — harder to save than a plain <img>. */
export default function ProtectedLogo({
  className,
  alt = SITE_LOGO_ALT,
  src = SITE_LOGO_URL,
}: ProtectedLogoProps) {
  const style: CSSProperties = {
    backgroundImage: `url("${src}")`,
  };

  return (
    <span
      className={`protected-logo inline-block shrink-0 bg-contain bg-center bg-no-repeat ${className}`}
      style={style}
      role="img"
      aria-label={alt}
      onContextMenu={blockCopy}
      onDragStart={blockCopy}
      onMouseDown={(event) => {
        if (event.button === 2) event.preventDefault();
      }}
    />
  );
}
