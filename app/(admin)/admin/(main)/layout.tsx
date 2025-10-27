import AdminHeader from "@/app/(admin)/components/AdminHeader";
import AdminSidebar from "@/app/(admin)/components/AdminSidebar";

export default function AdminMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background ">
      <AdminHeader />
      <AdminSidebar />
      <main className="pt-[78px] pl-[220px] min-h-screen bg-[#FBFCFD]">
        {children}
      </main>
    </div>
  );
}
