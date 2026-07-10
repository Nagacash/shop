"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

const TRACK_SRC = "/new/Naga%20Out%20the%20Jungle.mp3";
const TRACK_LABEL = "Naga Out the Jungle";

export default function AmbientTrackPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setPlaying(true);
      setAutoplayBlocked(false);
    } catch {
      setAutoplayBlocked(true);
      setPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      stop();
      return;
    }
    void tryPlay();
  }, [playing, stop, tryPlay]);

  useEffect(() => {
    void tryPlay();
  }, [tryPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={TRACK_SRC} loop preload="auto" aria-hidden="true" />

      <div
        className="pointer-events-none fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6"
        aria-live="polite"
      >
        <div className="pointer-events-auto naga-ambient-player">
          <div className="naga-ambient-player-inner">
            <span className="naga-ambient-glow" aria-hidden="true" />

            <div className="relative flex items-center gap-3">
              <button
                type="button"
                onClick={toggle}
                className="naga-ambient-btn focus-ring focus-visible:outline-none"
                aria-label={
                  playing
                    ? `Stop ${TRACK_LABEL}`
                    : autoplayBlocked
                      ? `Play ${TRACK_LABEL}`
                      : `Play ${TRACK_LABEL}`
                }
                aria-pressed={playing}
              >
                {playing ? (
                  <Pause className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Play className="h-4 w-4 translate-x-0.5" strokeWidth={2} aria-hidden="true" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Volume2
                    className="h-3 w-3 shrink-0 text-[--color-naga-gold]"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <p className="naga-display truncate text-[11px] font-medium uppercase tracking-[0.14em] text-light-100">
                    {TRACK_LABEL}
                  </p>
                </div>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-light-100/55">
                  {autoplayBlocked && !playing
                    ? "Tap to play"
                    : playing
                      ? "Now playing"
                      : "Paused"}
                </p>
              </div>

              <div
                className={`naga-ambient-waveform ${playing ? "is-playing" : ""}`}
                aria-hidden="true"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="naga-ambient-bar" style={{ animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
