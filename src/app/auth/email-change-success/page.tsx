import Link from "next/link";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function EmailChangeSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <IoCheckmarkCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Changement d&apos;email confirmé !
          </h1>
          <p className="text-gray-600 mb-6">
            Votre adresse email a été modifiée avec succès. Vous pouvez
            maintenant vous connecter avec votre nouvelle adresse email.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
