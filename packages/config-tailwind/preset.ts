import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/**
 * Tailwind preset — layout utilities and font stack.
 *
 * Colors, border-radius, and all semantic tokens are defined via
 * CSS variables in apps/web/app/global.css (managed by the shadcn
 * preset b1D0f1JA — style: radix-mira, icons: remixicon).
 *
 * See DESIGN.md at the repo root for usage documentation.
 */
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
    },
  },

  plugins: [
    // ── Layout component classes ──
    // These encode Linear's most common UI patterns so agents use them
    // instead of guessing at utility combinations.
    plugin(function ({ addComponents }) {
      addComponents({
        // Standard 44px page header bar with bottom border
        ".page-header": {
          display: "flex",
          height: "2.75rem",
          flexShrink: "0",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: "1px",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        },

        // Sidebar navigation item with hover/active states
        ".nav-item": {
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderRadius: "0.375rem",
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
          paddingTop: "0.375rem",
          paddingBottom: "0.375rem",
          fontSize: "0.75rem",
          fontWeight: "500",
          color: "var(--muted-foreground)",
          transitionProperty: "color, background-color",
          transitionDuration: "150ms",
          "&:hover": {
            backgroundColor: "var(--accent)",
            color: "var(--accent-foreground)",
          },
          '&[data-active="true"], &.active': {
            backgroundColor: "var(--accent)",
            color: "var(--accent-foreground)",
          },
        },

        // Standard list row (issue-list style)
        ".list-row": {
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "0.375rem",
          paddingBottom: "0.375rem",
          transitionProperty: "background-color",
          transitionDuration: "150ms",
          "&:hover": {
            backgroundColor: "var(--accent)",
          },
        },

        // Uppercase tracking-wider section label
        ".section-heading": {
          fontSize: "11px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--muted-foreground)",
        },
      });
    }),
  ],
} satisfies Config;
