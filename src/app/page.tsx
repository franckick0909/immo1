import AuthTest from "@/components/auth/AuthTest";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Page d&apos;accueil</h1>
      <AuthTest />
    </div>
  );
}
