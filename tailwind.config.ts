import type { Config } from "tailwindcss";

const config: Config = {
   darkMode: "class", // استخدام "class" كنص مباشر بدلاً من المصفوفة
   content: [
      "./pages/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./app/**/*.{ts,tsx}",
      "./src/**/*.{ts,tsx}",
      "./features/**/*.{ts,tsx}",
   ],
   theme: {
      extend: {
         colors: {
         background: "hsl(var(--background))",
         surface: "hsl(var(--surface))",
         card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--foreground))",
         },
         foreground: "hsl(var(--foreground))",
         secondary: "hsl(var(--secondary))",
         muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--secondary))",
         },
         border: "hsl(var(--border))",
         primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
         },
         destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
         },
         ring: "hsl(var(--ring))",
         },
         borderRadius: {
         lg: "var(--radius)",
         md: "calc(var(--radius) - 2px)",
         sm: "calc(var(--radius) - 4px)",
         },
      },
   },
   plugins: [],
};

export default config;