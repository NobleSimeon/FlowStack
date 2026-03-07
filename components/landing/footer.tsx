"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-border/60 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
                <Image
                  src="/images/logo.png"
                  alt="FlowStack"
                  width={28}
                  height={28}
                />
              </div>
              <span className="font-serif text-sm font-bold text-foreground">
                FlowStack
              </span>
            </Link>
          </div>

          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
            <p className="text-[12px] text-muted-foreground">
              {new Date().getFullYear()} FlowStack. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="text-[12px] font-bold text-white px-3 py-2 absolute right-2 transition-colors hover:text-foreground bg-primary rounded-full"
              aria-label="Scroll back to top"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
