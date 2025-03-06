"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const NameSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

export async function updateName(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { type: "error" as const, text: "Non autorisé" };
    }

    const validatedData = NameSchema.parse({
      name: formData.get("name"),
    });

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: { name: validatedData.name },
      select: { name: true, email: true, image: true },
    });

    revalidatePath("/profile");
    return {
      type: "success" as const,
      text: "Nom mis à jour avec succès",
      user: updatedUser,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { type: "error" as const, text: error.errors[0].message };
    }
    return { type: "error" as const, text: "Une erreur est survenue" };
  }
}
