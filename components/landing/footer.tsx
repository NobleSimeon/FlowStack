import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border/60 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="FlowStack" width={24} height={24} className="rounded-md" />
            <span className="font-serif text-sm font-bold text-foreground">
              FlowStack
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
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
          {new Date().getFullYear()} FlowStack
        </p>
      </div>
    </footer>
  )
}
