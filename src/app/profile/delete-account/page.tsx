import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DeleteAccountForm } from "./DeleteAccountForm";

export default async function DeleteAccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Supprimer mon compte</h1>
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          ⚠️ Attention
        </h2>
        <p className="text-red-600">
          La suppression de votre compte est irréversible. Toutes vos données
          seront définitivement effacées.
        </p>
      </div>
      <DeleteAccountForm />
    </div>
  );
}
