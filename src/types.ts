import { ReactNode } from "react";

export interface Essay {
  id: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
}

export interface BookImprint {
  id: string;
  volume: string;
  title: string;
  year: string;
  subtitle: string;
  shortIntro: ReactNode;
  chapters: string[];
  excerptHeader: string;
  excerptText: ReactNode;
}