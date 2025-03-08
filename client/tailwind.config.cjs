module.exports = {
  content: ["./src/**/*.{html,js,astro}"], // Ensure Tailwind scans your files
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "primary-light": "var(--color-primary-light)",
        dark: "var(--color-dark)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        background: "var(--color-background)",
        white: "var(--color-white)",
        border: "var(--color-border)",
        partner: "var(--color-partner)",
        success: "var(--color-success)",
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        xxl: "var(--spacing-xxl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'], // Use your font from styles.css
      },
    },
  },
  plugins: [],
};
