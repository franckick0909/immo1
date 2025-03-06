"use client";

import { AdminBreadcrumb } from "@/app/admin/components/AdminBreadcrumb";
import { Sidebar } from "@/components/ui/Sidebar";
import navigation from "@/config/navigation.json";
import { getIcon, IconName } from "@/lib/getIcon";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const sidebarItems = navigation.profile.items.map((item) => ({
    ...item,
    icon: getIcon(item.icon as IconName),
  }));

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-screen-2xl w-full">
      <AdminBreadcrumb />
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={navigation.profile.title}
        subtitle={navigation.profile.subtitle}
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
