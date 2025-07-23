// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@pinia/nuxt"],
    runtimeConfig: {
        public: {
            backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL,
        },
    },
    colorMode: {
        preference: "light", // Optional: Set default to light
    },
    tailwindcss: {
        exposeConfig: true,
        viewer: true,
    },
    css: ["@/assets/css/main.css"],
});