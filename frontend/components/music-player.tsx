"use client"

import { useState, useRef, useEffect } from "react"
import { Mood } from "@/components/types/mood";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  Download,
  Share2,
  Music,
  Headphones,
  Radio,
  Disc3,
} from "lucide-react"

interface MusicPlayerProps {
  mood: Mood;
}

type Track = {
  title: string;
  artist: string;
  duration: string;
  image: string;
  audio: string;
};


export function MusicPlayer({ mood }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState([0]);

  
  const audioRef = useRef<HTMLAudioElement | null>(null);


  const moodPlaylists: Record<Mood, Track[]> =  {
  happy: [
    {
      title: "Sunny Morning Vibes",
      artist: "Chill Beats Collective",
      duration: "3:24",
      image: "/albumcover/hp1.jpg",
      audio: "/audio/happy1.mp3",
      
    },
    {
      title: "Golden Hour Dreams", artist: "Lo-Fi Garden", duration: "4:12", image: "/albumcover/hp2.jpg", audio: "/audio/happy2.mp3",
      
    },
    {
      title: "Uplifted Soul", artist: "Happy Notes", duration: "3:48", image: "/albumcover/hp3.jpg", audio: "/audio/happy3.mp3",
      
    },
    {
      title: "Joyride", artist: "Beat Bliss", duration: "4:05", image: "/albumcover/hp4.jpg", audio: "/audio/happy4.mp3",
      
    },
    {
      title: "Laughing Skies", artist: "Good Vibes Only", duration: "4:10", image: "/albumcover/hp5.jpg", audio: "/audio/happy5.mp3",
      
    },
  ],
  sad: [
    {
      title: "Rainy Day Reflections", artist: "Melancholy Beats", duration: "4:33", image: "/albumcover/sad1.webp", audio: "/audio/sad1.mp3",
     
    },
    {
      title: "Gentle Healing", artist: "Soft Sounds", duration: "5:21", image: "/albumcover/sad2.avif", audio: "/audio/sad2.mp3",
     
    },
    {
      title: "Blue Haze", artist: "Lonely Echo", duration: "3:56", image: "/albumcover/sad3.jpg", audio: "/audio/sad3.mp3",
      
    },
    {
      title: "Quiet Tears", artist: "Night Whispers", duration: "4:22", image: "/albumcover/sad4.jpg", audio: "/audio/sad4.mp3",
      
    },
    {
      title: "Fading Memories", artist: "Emo Tones", duration: "5:00", image: "/albumcover/sad5.jpg", audio: "/audio/sad5.mp3",
      
    },
  ],
  angry: [
    {
      title: "Release & Let Go", artist: "Emotional Balance", duration: "4:55", image: "/albumcover/angry1.jpeg", audio: "/audio/angry1.mp3",
      
    },
    {
      title: "Cooling Down", artist: "Anger Management", duration: "5:12", image: "/albumcover/angry2.avif", audio: "/audio/angry2.mp3",
      
    },
    {
      title: "Fire Within", artist: "Explosive Beats", duration: "4:00", image: "/albumcover/angry3.jpg", audio: "/audio/angry3.mp3",
      
    },
    {
      title: "Storm Rage", artist: "Red Zone", duration: "3:52", image: "/albumcover/angry4.jpg", audio: "/audio/angry4.mp3",
      
    },
    {
      title: "Let It Out", artist: "Pulse Point", duration: "5:30", image: "/albumcover/angry5.jpg", audio: "/audio/angry5.mp3",
      
    },
  ],
  anxious: [
    {
      title: "Calm Waters", artist: "Anxiety Relief", duration: "6:15", image: "/albumcover/anxious1.jpg", audio: "/audio/anxious1.mp3",
      
    },
    {
      title: "Breathing Space", artist: "Peaceful Mind", duration: "4:44", image: "/albumcover/anxious2.webp", audio: "/audio/anxious2.mp3",
      
    },
    {
      title: "Stillness Within", artist: "Zen Room", duration: "5:11", image: "/albumcover/anxious3.jpg", audio: "/audio/anxious3.mp3",
      
    },
    {
      title: "Gentle Drift", artist: "Calm Current", duration: "4:30", image: "/albumcover/anxious4.jpg", audio: "/audio/anxious4.mp3",
      
    },
    {
      title: "Slow Breaths", artist: "Mind Ease", duration: "5:45", image: "/albumcover/anxious5.jpg", audio: "/audio/anxious5.mp3",
      
    },
  ],
  tired: [
    {
      title: "Sleepy Hollow", artist: "Rest & Restore", duration: "7:22", image: "/albumcover/tired1.jpg", audio: "/audio/tired1.mp3",
      
    },
    {
      title: "Midnight Lullaby", artist: "Dream Weavers", duration: "5:55", image: "/albumcover/tired2.jpg", audio: "/audio/tired2.mp3",
      
    },
    {
      title: "Soft Descent", artist: "Nap Notes", duration: "6:03", image: "/albumcover/tired3.jpg", audio: "/audio/tired3.mp3",
      
    },
    {
      title: "Cloud Dreams", artist: "Doze Beats", duration: "4:57", image: "/albumcover/tired4.jpg", audio: "/audio/tired4.mp3",
      
    },
    {
      title: "Nightfall Echo", artist: "Silent Rest", duration: "5:40", image: "/albumcover/tired5.jpg", audio: "/audio/tired5.mp3",
      
    },
  ],
  calm: [
    {
      title: "Peaceful Breeze", artist: "Soothing Waves", duration: "4:20", image: "/albumcover/calm1.avif", audio: "/audio/calm1.mp3",
      
    },
    {
      title: "Gentle Rain", artist: "Calm Horizon", duration: "5:00", image: "/albumcover/calm2.jpg", audio: "/audio/calm2.mp3",
      
    },
    {
      title: "Inner Peace", artist: "Harmony Hub", duration: "5:12", image: "/albumcover/calm3.jpg", audio: "/audio/calm3.mp3",
     
    },
    {
      title: "Tranquil Paths", artist: "Mindful Tides", duration: "4:08", image: "/albumcover/calm4.jpg", audio: "/audio/calm4.mp3",
      
    },
    {
      title: "Still Mornings", artist: "Zen Lounge", duration: "4:47", image: "/albumcover/calm5.jpg", audio: "/audio/calm5.mp3",
      
    },
  ],
  neutral: [
    {
      title: "Balanced Flow", artist: "Lo-Fi Universe", duration: "4:00", image: "/albumcover/neutral1.jpg", audio: "/audio/neutral1.mp3",
     
    },
    {
      title: "Steady Ground", artist: "Tranquil Tones", duration: "4:35", image: "/albumcover/neutral2.avif", audio: "/audio/neutral2.mp3",
      
    },
    {
      title: "Clear Mind", artist: "Equilibrium", duration: "3:55", image: "/albumcover/calm2.jpg", audio: "/audio/neutral3.mp3",
      
    },
    {
      title: "Even Tempo", artist: "Centered Beats", duration: "4:15", image: "/albumcover/calm1.avif", audio: "/audio/neutral4.mp3",
      
    },
    {
      title: "Neutral Pulse", artist: "Middle Mood", duration: "5:00", image: "/albumcover/hp2.jpg", audio: "/audio/neutral5.mp3",
      
    },
  ],
};


  // fallback if mood is undefined somehow
  const currentPlaylist = moodPlaylists[mood] ?? moodPlaylists["neutral"];
  const track = currentPlaylist[currentTrack];

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () =>
    setCurrentTrack((prev) => (prev + 1) % currentPlaylist.length);

  const prevTrack = () =>
    setCurrentTrack((prev) => (prev - 1 + currentPlaylist.length) % currentPlaylist.length);

  // Reset track when mood changes
  useEffect(() => {
    setCurrentTrack(0);
    setIsPlaying(false);
  }, [mood]);

  // Play/pause control
  useEffect(() => {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play();
    }
  }
}, [track, isPlaying]);


  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  return (
   <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-lg">
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-center">Music Therapy</h1>
    <p className="text-center text-gray-300">Curated soundscapes for your emotional well-being</p>
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {["For Your Mood", "Focus", "Sleep", "Nature", "Classical"].map((label, idx) => (
        <Button
          key={idx}
          variant={label === "For Your Mood" ? "default" : "outline"}
          className={`rounded-full px-6 py-2 text-sm font-medium ${
            label === "For Your Mood"
              ? "bg-black text-white"
              : "bg-white text-black border border-white"
          }`}
        >
          {label}
        </Button>
      ))}
    </div>
  </div>

  {/* Playlist Header */}
  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl mb-6 flex justify-between items-center">
    <div>
      <h2 className="text-xl font-semibold">Playlist for Neutral Mood</h2>
      <p className="text-sm text-white/80">A collection of curated tracks</p>
    </div>
    <span className="bg-white text-pink-600 text-xs font-semibold px-3 py-1 rounded-full">Neutral Mood</span>
  </div>

  {/* 3-column Layout */}
  <div className="flex flex-col lg:flex-row gap-6">
    {/* Player Section */}
    <div className="bg-white text-black rounded-xl p-6 flex-1">
      <img
        src={track.image}
        alt={track.title}
        className="w-40 h-40 mx-auto rounded-xl shadow-lg mb-4"
      />
      <h3 className="text-center text-lg font-bold">{track.title}</h3>
      <p className="text-center text-sm text-gray-500">{track.artist}</p>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>0:00</span>
        <Slider value={progress} onValueChange={setProgress} max={100} step={1} className="flex-1 mx-2" />
        <span>{track.duration}</span>
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <Button variant="ghost" size="icon" onClick={prevTrack}><SkipBack /></Button>
        <Button
          size="lg"
          onClick={togglePlay}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button variant="ghost" size="icon" onClick={nextTrack}><SkipForward /></Button>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-2">
        <Volume2 className="w-4 h-4" />
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="w-32"
        />
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button variant="outline" className="flex items-center gap-1"><Heart className="w-4 h-4" /> Like</Button>
        <Button variant="outline" className="flex items-center gap-1"><Download className="w-4 h-4" /> Download</Button>
        <Button variant="outline" className="flex items-center gap-1"><Share2 className="w-4 h-4" /> Share</Button>
      </div>
    </div>

    {/* Playlist Panel */}
    <div className="bg-white text-black rounded-xl p-6 w-full lg:w-80">
      <h4 className="text-xl font-bold mb-4">Current Playlist</h4>
      <ul className="space-y-3">
        {currentPlaylist.map((item, idx) => (
          <li
            key={idx}
            className={`flex justify-between items-center px-4 py-2 rounded-md ${
              idx === currentTrack ? "bg-purple-100 text-purple-800 font-semibold" : "hover:bg-gray-100"
            }`}
            onClick={() => {
              setCurrentTrack(idx);
              setIsPlaying(true);
            }}
          >
            <div>
              <p>{item.title}</p>
              <p className="text-sm text-gray-500">{item.artist}</p>
            </div>
            <span className="text-sm">{item.duration}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Therapy Benefits Panel */}
    <div className="bg-green-100 text-green-900 rounded-xl p-6 w-full lg:w-80">
      <h2 className="text-lg font-bold mb-4">💡 Music Therapy Benefits</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>🎵 Reduces stress and anxiety levels</li>
        <li>🧠 Improves focus and concentration</li>
        <li>😌 Enhances emotional regulation</li>
        <li>💡 Boosts creativity and productivity</li>
        <li>💤 Supports better sleep and relaxation</li>
      </ul>
    </div>
  </div>

  <audio ref={audioRef}>
    <source src={track.audio} type="audio/mpeg" />
  </audio>
</Card>

  );
}
