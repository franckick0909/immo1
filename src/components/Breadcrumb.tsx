"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronRight, FiHome } from "react-icons/fi";

export function Breadcrumb() {
  const pathname = usePathname();

  // Créer les segments du chemin
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: segment,
    }));

  return (
    <nav className="bg-white border-b mt-2 fixed top-16 left-0 right-0 z-40 max-w-screen-2xl mx-auto px-4">
      <div className="w-full mx-auto px-4">
        <div className="flex items-center h-12 text-sm">
          <ol className="flex items-center space-x-2">


            <li>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <FiHome className="h-4 w-4" />
                <span className="sr-only">Accueil</span>
              </Link>
            </li>
            {segments.map((segment, index) => {
              // Construire le chemin complet pour ce segment
              const path = `/${segments
                .slice(0, index + 1)
                .map((s) => s.path)
                .join("/")}`;

              return (
                <li key={path} className="flex items-center">
                  <FiChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                  <Link
                    href={path}
                    className={`hover:text-indigo-600 ${
                      index === segments.length - 1
                        ? "text-gray-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {segment.name}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}
