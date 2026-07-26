import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { SidebarWidgetProvider } from "@/lib/context/SidebarWidgetContext";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarWidgetProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
          <main className="flex-1 min-w-0 fade-in">{children}</main>
          <Sidebar />
        </div>
        <Footer />
      </div>
    </SidebarWidgetProvider>
  );
}
