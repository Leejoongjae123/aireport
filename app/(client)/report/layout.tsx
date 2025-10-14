"use client";

import { Suspense } from "react";
import { TopNavigation } from "./components/top-navigation";
import { ReportSidebar } from "./components/report-sidebar";
import { useSidebarStore } from "./components/store/sidebar-store";
import { Toaster } from "sonner";

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggle = useSidebarStore(
    (state: { toggle: () => void }) => state.toggle
  );

  return (
    <div className="bg-[#FAFAFD] mt-[131px]">
      <Toaster position="top-center" richColors />
      <Suspense fallback={<div className="h-[60px]" />}>
        <TopNavigation onMenuClick={toggle} />
      </Suspense>
      <div className="relative w-full max-w-[1200px] mx-auto">
        <ReportSidebar />
        {children}
      </div>
    </div>
  );
}
