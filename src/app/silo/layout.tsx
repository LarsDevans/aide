import AuthGuard from '@/components/auth/AuthGuard';
import { ReactNode } from 'react';

export default function SiloLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <section
        className="flex justify-center items-center w-full h-full min-h-screen"
      >
        {children}
      </section>
    </AuthGuard>
  )
}
