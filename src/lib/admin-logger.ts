type LogAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "STATUS_CHANGE"
  | "ROLE_CHANGE";

type LogEntity = "USER" | "PROPERTY" | "SETTINGS";

type UserData = {
  id?: string;
  name?: string | null;
  email?: string;
  role?: "ADMIN" | "USER";
  status?: "ACTIVE" | "INACTIVE";
};

type PropertyData = {
  id?: string;
  title?: string;
  price?: number;
  status?: string;
};

type SettingsData = {
  id?: string;
  key?: string;
  value?: string | number | boolean;
};

export type EntityData = UserData | PropertyData | SettingsData;

interface LogDetails {
  previous?: EntityData;
  new?: EntityData;
  message?: string;
}

export async function createAdminLog(
  action: LogAction,
  entity: LogEntity,
  entityId: string,
  details: LogDetails
) {
  try {
    const response = await fetch("/api/admin/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        entity,
        entityId,
        details,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create admin log");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating admin log:", error);
    throw error;
  }
}

export function formatLogDetails(details: LogDetails): string {
  if (details.message) return details.message;

  const changes: string[] = [];

  if (details.previous && details.new) {
    (Object.keys(details.new) as Array<keyof EntityData>).forEach((key) => {
      const previousValue = details.previous?.[key];
      const newValue = details.new?.[key];

      if (previousValue !== newValue) {
        changes.push(
          `${String(key)}: ${previousValue ?? "non défini"} → ${
            newValue ?? "non défini"
          }`
        );
      }
    });
  }

  return changes.length > 0 ? changes.join(", ") : "Aucun changement détecté";
}
