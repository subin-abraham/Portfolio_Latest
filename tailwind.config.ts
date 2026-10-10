
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#1B2A49', // Dark navy
					foreground: '#F7F9FA'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: '#2979FF', // Electric blue
					foreground: '#F7F9FA',
					hover: '#1E88E5'
				},
				navy: '#1B2A49',
				'electric-blue': '#2979FF',
				'off-white': '#F7F9FA',
				'light-gray': '#ECEFF1',
				'text-gray': '#BDC3C7',
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			fontFamily: {
				'heading': ['Poppins', 'sans-serif'],
				'body': ['DM Sans', 'sans-serif'],
				'display': ['Anton', 'Impact', 'sans-serif'],
			},
			transitionDuration: {
				'1200': '1200ms',
			},
			animation: {
				'fade-in': 'fadeIn 0.6s ease-out',
				'slide-up': 'slideUp 0.6s ease-out',
				'bounce-in': 'bounceIn 0.8s ease-out',
				'fill-left': 'fillLeft 0.3s ease-out',
				'progress-fill': 'progressFill 1.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'hero-rise': 'heroRise 0.9s ease-out both',
				'hero-float': 'heroFloat 4.5s ease-in-out infinite',
				'hero-draw': 'heroDraw 1.4s ease-out both',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				bounceIn: {
					'0%': { opacity: '0', transform: 'scale(0.3)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				fillLeft: {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				progressFill: {
					'0%': { width: '0%' },
					'100%': { width: 'var(--progress-width)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				heroRise: {
					'0%': { opacity: '0', transform: 'translateY(24px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				heroFloat: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-12px)' }
				},
				heroDraw: {
					'0%': { opacity: '0', strokeDashoffset: '240' },
					'100%': { opacity: '0.9', strokeDashoffset: '0' }
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
