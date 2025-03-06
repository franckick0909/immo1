export type ThemeColor =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "gray";

export interface ThemeConfig {
  colors: Record<ThemeColor, string>;
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: "blue",
    secondary: "purple",
    accent: "emerald",
    success: "green",
    warning: "amber",
    error: "red",
    info: "sky",
    gray: "gray",
  },
  fontSizes: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  },
  borderRadius: {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded",
    lg: "rounded-lg",
    full: "rounded-full",
  },
  shadows: {
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
    xl: "shadow-xl",
  },
};

// Fonction utilitaire pour générer des classes Tailwind basées sur le thème
export function getColorClass(
  color: ThemeColor,
  variant: "bg" | "text" | "border" | "ring",
  intensity: number = 500
): string {
  const themeColor = defaultTheme.colors[color];
  return `${variant}-${themeColor}-${intensity}`;
}

// Fonction utilitaire pour générer des classes de hover
export function getHoverColorClass(
  color: ThemeColor,
  variant: "bg" | "text" | "border" | "ring",
  intensity: number = 500
): string {
  const themeColor = defaultTheme.colors[color];
  return `hover:${variant}-${themeColor}-${intensity}`;
}

// Fonction utilitaire pour générer des classes de focus
export function getFocusColorClass(
  color: ThemeColor,
  variant: "bg" | "text" | "border" | "ring",
  intensity: number = 500
): string {
  const themeColor = defaultTheme.colors[color];
  return `focus:${variant}-${themeColor}-${intensity}`;
}
