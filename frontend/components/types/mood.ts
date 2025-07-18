import { ReactNode } from "react";

export type Mood =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'anxious'
  | 'tired'
  | 'calm'
  | 'neutral';

export type Track = {
  bpm: any;
  mood: any;
  genre: ReactNode;
  title: string;
  artist: string;
  duration: string;
  image: string;
  audio: string;
};

