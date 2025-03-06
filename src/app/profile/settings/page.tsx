import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  FiAlertTriangle,
  FiCamera,
  FiLock,
  FiMail,
  FiUser,

} from "react-icons/fi";
import { DeleteAccountForm } from "../delete-account/DeleteAccountForm";

import { EditEmailForm } from "../edit-email/EditEmailForm";
import { EditImageForm } from "../edit-image/EditImageForm";
import { EditNameForm } from "../edit-name/EditNameForm";
import { EditPasswordForm } from "../edit-password/EditPasswordForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête fixe */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Paramètres du compte
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto py-8">
        <div className="flex flex-wrap gap-2">
          {/* Photo de profil */}
          <div className="flex-1 basis-80 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 ">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <FiCamera className="h-6 w-6 text-gray-500" />
                <h2 className="text-base md:text-lg font-medium text-gray-900">
                  Photo de profil
                </h2>
              </div>
              <EditImageForm user={user} />
            </div>
          </div>

          {/* Nom */}
          <div className="flex-1 basis-80 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <FiUser className="h-6 w-6 text-gray-500" />
                <h2 className="text-base md:text-lg font-medium text-gray-900">
                  Nom d&apos;utilisateur
                </h2>

              </div>
              <EditNameForm user={user} />
            </div>
          </div>

          {/* Email */}
          <div className="flex-1 basis-80 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <FiMail className="h-6 w-6 text-gray-500" />
                <h2 className="text-base md:text-lg font-medium text-gray-900">
                  Adresse email

                </h2>
              </div>
              <EditEmailForm user={user} />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="flex-1 basis-80 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-4">
                <div className="flex items-center space-x-3 mb-2">
                <FiLock className="h-6 w-6 text-gray-500" />
                <h2 className="text-base md:text-lg font-medium text-gray-900">
                  Mot de passe

                </h2>
              </div>
              <EditPasswordForm />
            </div>
          </div>

          {/* Zone de danger - largeur complète */}
          <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-red-200 hover:shadow-md transition-shadow duration-300">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <FiAlertTriangle className="h-6 w-6 text-red-500" />
                <h2 className="text-base md:text-lg font-medium text-red-600">
                  Zone de danger
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Une fois votre compte supprimé, toutes vos données seront
                définitivement effacées. Cette action est irréversible.
              </p>
              <DeleteAccountForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
