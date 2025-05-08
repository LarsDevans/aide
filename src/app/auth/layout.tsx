import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section
      className="flex justify-center items-center w-full h-full min-h-screen"
    >
      {children}
    </section>
  )
}
