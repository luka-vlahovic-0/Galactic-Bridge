"use client";

import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto flex flex-col items-center gap-2 px-4 pb-6 pt-10 text-center">
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/luka-vlahovic-0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/35 transition-colors hover:text-lime-300"
          aria-label="GitHub"
        >
          <Github size={16} />
        </a>
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/35 transition-colors hover:text-lime-300"
          aria-label="LinkedIn"
        >
          <Linkedin size={16} />
        </a>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
        Galactic Bridge · sector 7G · no real funds harmed
      </p>
    </footer>
  );
}
