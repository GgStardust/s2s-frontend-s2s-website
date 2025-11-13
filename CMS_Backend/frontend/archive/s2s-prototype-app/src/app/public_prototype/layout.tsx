import "@/styles/globals.css"
import { AppLayout } from "@/components/layouts/AppLayout"

export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout title="Stardust to Sovereignty Prototype" subtitle="Consciousness Technology Demonstration">
      {children}
    </AppLayout>
  )
}
