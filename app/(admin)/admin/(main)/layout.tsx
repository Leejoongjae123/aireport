import AdminHeader from "@/app/(admin)/components/admin-header";
import AdminSidebar from "@/app/(admin)/components/admin-sidebar";

export default function AdminMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <AdminSidebar />
      <main className="pt-[78px] pl-[220px]">{children}</main>
    </div>
  );
}
