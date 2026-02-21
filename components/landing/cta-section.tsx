import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="bg-card px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
          Your workflow deserves better than trial and error
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Join professionals who stopped scrolling through AI tool lists and
          started building with the right stack from day one.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="gap-2 text-base" asChild>
            <Link href="/auth/sign-up">
              Find My AI Stack
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Free to use. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
