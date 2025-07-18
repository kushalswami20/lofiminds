import type { Config } from "tailwindcss";
import { Mood, Track } from "./components/types/mood";

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
export const moodPlaylists: Record<Mood, Track[]> = {
    happy: [
        {
            title: 'Sunshine Smile',
            artist: 'Joy Beats',
            duration: '3:45',
            image: '/albumcover/happy1.jpg',
            audio: '/audio/happy1.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Bright Morning',
            artist: 'FeelGood',
            duration: '4:01',
            image: '/albumcover/happy2.jpg',
            audio: '/audio/happy2.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Dance of Joy',
            artist: 'Groove Up',
            duration: '3:20',
            image: '/albumcover/happy3.jpg',
            audio: '/audio/happy3.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Cherry Vibes',
            artist: 'Breeze Flow',
            duration: '4:10',
            image: '/albumcover/happy4.jpg',
            audio: '/audio/happy4.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Golden Hour',
            artist: 'SunSet Loops',
            duration: '3:50',
            image: '/albumcover/happy5.jpg',
            audio: '/audio/happy5.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
    ],

    sad: [
        {
            title: 'Rainy Window',
            artist: 'Blue Thoughts',
            duration: '4:00',
            image: '/albumcover/sad1.jpg',
            audio: '/audio/sad1.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Faded Dreams',
            artist: 'Quiet Soul',
            duration: '4:15',
            image: '/albumcover/sad2.jpg',
            audio: '/audio/sad2.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Midnight Tears',
            artist: 'Silent Strings',
            duration: '3:40',
            image: '/albumcover/sad3.jpg',
            audio: '/audio/sad3.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Grey Horizon',
            artist: 'Lonely Sky',
            duration: '4:10',
            image: '/albumcover/sad4.jpg',
            audio: '/audio/sad4.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Empty Halls',
            artist: 'Melodown',
            duration: '3:55',
            image: '/albumcover/sad5.jpg',
            audio: '/audio/sad5.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
    ],

    angry: [
        {
            title: 'Heatwave',
            artist: 'Rage Pulse',
            duration: '3:20',
            image: '/albumcover/angry1.jpg',
            audio: '/audio/angry1.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Storm Breaker',
            artist: 'Electric Raw',
            duration: '4:00',
            image: '/albumcover/angry2.jpg',
            audio: '/audio/angry2.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Crash Mode',
            artist: 'DistortX',
            duration: '3:50',
            image: '/albumcover/angry3.jpg',
            audio: '/audio/angry3.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Red Alert',
            artist: 'Pulsecore',
            duration: '3:55',
            image: '/albumcover/angry4.jpg',
            audio: '/audio/angry4.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Fire Drill',
            artist: 'Ignite',
            duration: '3:30',
            image: '/albumcover/angry5.jpg',
            audio: '/audio/angry5.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
    ],

    anxious: [
        {
            title: 'Calm Down',
            artist: 'EaseMind',
            duration: '4:00',
            image: '/albumcover/anxious1.jpg',
            audio: '/audio/anxious1.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Float Away',
            artist: 'Soothing Sounds',
            duration: '3:45',
            image: '/albumcover/anxious2.jpg',
            audio: '/audio/anxious2.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Soft Ground',
            artist: 'MellowMind',
            duration: '3:50',
            image: '/albumcover/anxious3.jpg',
            audio: '/audio/anxious3.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Deep Breath',
            artist: 'Relax Lab',
            duration: '4:05',
            image: '/albumcover/anxious4.jpg',
            audio: '/audio/anxious4.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Gentle Flow',
            artist: 'Calm Collective',
            duration: '3:40',
            image: '/albumcover/anxious5.jpg',
            audio: '/audio/anxious5.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
    ],

    tired: [
        {
            title: 'Drift',
            artist: 'DreamHopper',
            duration: '4:30',
            image: '/albumcover/tired1.jpg',
            audio: '/audio/tired1.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Cozy Blanket',
            artist: 'NapTide',
            duration: '4:00',
            image: '/albumcover/tired2.jpg',
            audio: '/audio/tired2.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Silent Moon',
            artist: 'Night Lights',
            duration: '4:10',
            image: '/albumcover/tired3.jpg',
            audio: '/audio/tired3.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Slow Fade',
            artist: 'Faint Echo',
            duration: '4:05',
            image: '/albumcover/tired4.jpg',
            audio: '/audio/tired4.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Down Tempo',
            artist: 'LowLight',
            duration: '3:50',
            image: '/albumcover/tired5.jpg',
            audio: '/audio/tired5.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
    ],

    calm: [
        {
            title: 'Serenity',
            artist: 'Ocean Echoes',
            duration: '4:05',
            image: '/albumcover/calm1.jpg',
            audio: '/audio/calm1.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Whispering Trees',
            artist: 'Nature Flow',
            duration: '4:00',
            image: '/albumcover/calm2.jpg',
            audio: '/audio/calm2.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Soft Clouds',
            artist: 'Sky Notes',
            duration: '3:55',
            image: '/albumcover/calm3.jpg',
            audio: '/audio/calm3.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Evening Light',
            artist: 'Smooth Coast',
            duration: '4:10',
            image: '/albumcover/calm4.jpg',
            audio: '/audio/calm4.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Peaceful Heart',
            artist: 'Inner Soul',
            duration: '3:45',
            image: '/albumcover/calm5.jpg',
            audio: '/audio/calm5.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
    ],

    neutral: [
        {
            title: 'Study Session',
            artist: 'Focus Flow',
            duration: '4:20',
            image: '/albumcover/neutral1.jpg',
            audio: '/audio/neutral1.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Afternoon Breeze',
            artist: 'Chill Collective',
            duration: '3:55',
            image: '/albumcover/neutral2.jpg',
            audio: '/audio/neutral2.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'City Lights',
            artist: 'Urban Sounds',
            duration: '4:40',
            image: '/albumcover/neutral3.jpg',
            audio: '/audio/neutral3.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Open Book',
            artist: 'Study Beats',
            duration: '3:50',
            image: '/albumcover/neutral4.jpg',
            audio: '/audio/neutral4.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
        {
            title: 'Cafe Calm',
            artist: 'Java Notes',
            duration: '4:05',
            image: '/albumcover/neutral5.jpg',
            audio: '/audio/neutral5.mp3',
            bpm: undefined,
            mood: undefined,
            genre: undefined
        },
    ],
};
