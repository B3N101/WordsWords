// app/policy/layout.tsx

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Policy | Your Company Name',
  description: 'Read our privacy policy, terms of service, and cookie policy.',
}

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
