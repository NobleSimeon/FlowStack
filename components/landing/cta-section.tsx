import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl rounded-2xl border border-primary/20 bg-card p-8 text-center shadow-sm sm:p-12">
          <Image
            src="/images/logo.png"
            alt="FlowStack"
            width={48}
            height={48}
            className="mx-auto mb-6"
          />
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground text-balance md:text-3xl">
            Your workflow deserves better than trial and error
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground text-pretty">
            Join professionals who stopped scrolling through endless AI tool
            lists and started building with the right stack from day one.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button className="h-10 w-full gap-2 rounded-full px-6 text-[13px] sm:w-auto" asChild>
              <Link href="/auth/sign-up">
                Find My AI Stack
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <span className="text-[12px] text-muted-foreground">
              Free forever. No credit card.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
