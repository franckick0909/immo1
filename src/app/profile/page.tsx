import SettingsButton from "@/components/profile/SettingsButton";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-6 w-full">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue d&apos;ensemble de votre application
          </p>
        </div>
      </div>
      <div className="w-full mx-auto">
        {/* En-tête du profil */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Bannière */}
          <div className="h-32 bg-white" />

          {/* Informations principales */}
          <div className="relative px-6 pb-6">
            {/* Photo de profil */}
            <div className="absolute -top-32 left-6">
              <div className="relative h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={`Photo de profil de ${user.name}`}
                    fill
                    className="object-cover"
                    sizes="128px"
                    priority
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <span className="text-4xl font-medium text-gray-600">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations de l'utilisateur */}
            <div className="mt-16 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h1>

                <SettingsButton />
              </div>

              <div className="mt-1 text-gray-500">{user.email}</div>
              <div className="mt-4 flex items-center flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
                <div>•</div>
                <div>
                  Membre depuis{" "}
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section des statistiques ou autres informations */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">Activité</h3>
            <p className="mt-2 text-gray-600">
              Statistiques et activités à venir
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">
              Contributions
            </h3>
            <p className="mt-2 text-gray-600">Contributions à venir</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">Badges</h3>
            <p className="mt-2 text-gray-600">Badges à venir</p>
          </div>
        </div>
      </div>
    </div>
  );
}
