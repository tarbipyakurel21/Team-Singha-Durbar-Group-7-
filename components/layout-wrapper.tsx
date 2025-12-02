"use client";

import { Sidebar } from '@/components/sidebar';
import { useState } from 'react';
import {
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn,
} from "@clerk/nextjs";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <SignedIn>
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-16 border-b bg-card flex items-center justify-end px-6 gap-4">
              <UserButton afterSignOutUrl="/sign-in" />
            </header>
      <main className="flex-1 overflow-y-auto bg-muted/20">
        {children}
      </main>
    </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}