'use client';

import { SessionProvider } from 'next-auth/react';
import { EXPORT_DETAIL } from 'next/dist/shared/lib/constants';



  export default function Providers({children}: { children: React.ReactNode}) {
  return(
    <SessionProvider> {children } </SessionProvider>
  )
} 