import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "./db";

// Déclaration des types étendus
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email as string },
          });

          if (!user) throw new Error("Utilisateur non trouvé");

          const passwordsMatch = await bcrypt.compare(
            credentials?.password as string,
            user.password
          );

          if (!passwordsMatch) throw new Error("Mot de passe incorrect");

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Si c'est la première connexion, on récupère l'utilisateur complet
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            role: true,
          },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
        }
      }

      if (trigger === "update" && session) {
        token.role = session.user.role;
      }

      return token;
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        });

        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            role: dbUser.role,
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.image,
          };
        }
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  debug: false, // Désactivation du mode debug pour éviter les avertissements
});
