import Link from "next/link"
import Image from "next/image"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/logo.png" alt="FlowStack" width={40} height={40} />
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            FlowStack
          </span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        {children}
      </main>
    </div>
  )
}
