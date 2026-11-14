/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./components/**/*.html",
    "./src/**/*.{js,html}",
    "./assets/js/**/*.js",
    // include any Flaticon CSS or markup files if you generate icons via JS
    "./assets/icons/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        amberpurple: {
          deep: "#31124B",
          rich: "#5E2B8A",
          soft: "#D7C2EB",
          ivory: "#F8F4F8",
          pure: "#FFFFFF"
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        body: ['"Manrope"', "sans-serif"],
        // Flaticon icon font family – replace "Flaticon" if your kit uses
        // a different name such as "uicons-regular-rounded", "fi", etc.
        icon: ['"Flaticon"', "sans-serif"]
      },
      boxShadow: {
        velvet: "0 24px 80px rgba(49, 18, 75, 0.16)",
        glow: "0 18px 50px rgba(94, 43, 138, 0.18)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(215, 194, 235, 0.9), rgba(248, 244, 248, 0.92) 38%, rgba(255, 255, 255, 1) 72%)",
        "silk-gradient":
          "linear-gradient(135deg, rgba(49, 18, 75, 1) 0%, rgba(94, 43, 138, 0.96) 50%, rgba(215, 194, 235, 0.9) 100%)"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        // --- icon animations -------------------------------------------
        "icon-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-0.25rem)" }
        },
        "icon-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "icon-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.15)" }
        },
        "icon-wobble": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-8deg)" },
          "75%": { transform: "rotate(8deg)" }
        },
        "icon-flip": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" }
        }
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        rise: "rise 0.7s ease forwards",
        // --- icon animation classes ------------------------------------
        "icon-bounce": "icon-bounce 1.4s ease-in-out infinite",
        "icon-spin": "icon-spin 2s linear infinite",
        "icon-pulse": "icon-pulse 1.8s ease-in-out infinite",
        "icon-wobble": "icon-wobble 0.8s ease-in-out infinite",
        "icon-flip": "icon-flip 0.6s ease-in-out forwards"
      }
    }
  },
  plugins: []
};