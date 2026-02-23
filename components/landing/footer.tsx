import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border/60 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/images/logo.png" alt="FlowStack" width={32} height={32} />
              <span className="font-serif text-sm font-bold text-foreground">
                FlowStack
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="#how-it-works" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
                How It Works
              </Link>
              <Link href="#trending" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
                Trending
              </Link>
              <Link href="#roles" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
                By Role
              </Link>
            </nav>
          </div>
          <p className="text-[12px] text-muted-foreground">
            {new Date().getFullYear()} FlowStack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
