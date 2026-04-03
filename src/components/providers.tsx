"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // UseEffect only runs on the client, so we know we are safely mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by returning a fragment or null 
  // until the client-side code has taken over
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem 
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}