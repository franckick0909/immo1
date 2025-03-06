"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  email: string;
  name?: string;
  image?: string;
  // Ajoutez d'autres propriétés utilisateur si nécessaire
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const updateUser = async (userData: Partial<User>) => {
    try {
      // Mettre à jour localement d'abord pour une UI réactive
      setUser((currentUser) =>
        currentUser ? { ...currentUser, ...userData } : null
      );

      // Pas besoin d'appeler l'API ici car les mises à jour sont gérées par les actions serveur
      // Les actions serveur (comme updateName, updateEmail, etc.) s'occupent déjà de la persistance
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      // Vous pouvez choisir de ne pas propager l'erreur si vous préférez une gestion silencieuse
      // throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(
      "useUser doit être utilisé à l'intérieur d'un UserProvider"
    );
  }
  return context;
}
