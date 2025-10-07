import AdminHeader from "@/app/(admin)/components/admin-header";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="pt-[78px]">{children}</main>
    </div>
  );
}
