"use client";

import { AdminBreadcrumb } from "@/app/admin/components/AdminBreadcrumb";
import { Sidebar } from "@/components/ui/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import navigation from "@/config/navigation.json";
import { getIcon, IconName } from "@/lib/getIcon";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const sidebarItems = navigation.admin.items.map((item) => ({
    ...item,
    icon: getIcon(item.icon as IconName),
  }));

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-screen-2xl w-full">
      <AdminBreadcrumb isOpen={isOpen} setIsOpen={setIsOpen} />
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={navigation.admin.title}
        subtitle={navigation.admin.subtitle}
        items={sidebarItems}
        className="top-32 h-[calc(100vh-7rem)]"
      />
      <main
        className={`pt-28 transition-all duration-300 ${
          isOpen ? "lg:pl-80" : "pl-16"
        }`}
      >
        <div className="w-full mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
