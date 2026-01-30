module.exports = {
    content: ["./index.html", "./script.js"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                neon: {
                    blue: '#00d4ff',
                    purple: '#a855f7',
                    pink: '#ec4899',
                    green: '#22c55e',
                }
            }
        }
    },
    plugins: [],
}
