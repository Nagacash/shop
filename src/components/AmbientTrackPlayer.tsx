"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, SkipForward, Volume2 } from "lucide-react";
import { AMBIENT_TRACKS } from "@/lib/ambient/catalog";

async function mintStreamUrl(trackId: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(`/api/ambient/token?id=${encodeURIComponent(trackId)}`, {
    method: "GET",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
    signal,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Ambient token failed (${res.status})`);
  }

  const data = (await res.json()) as { src?: string };
  if (!data.src || typeof data.src !== "string") {
    throw new Error("Ambient token missing src");
  }

  return data.src;
}

export default function AmbientTrackPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantPlayRef = useRef(true);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const track = AMBIENT_TRACKS[trackIndex] ?? AMBIENT_TRACKS[0];

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    wantPlayRef.current = true;
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

    wantPlayRef.current = false;
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

  const goToTrack = useCallback((next: number) => {
    setTrackIndex(((next % AMBIENT_TRACKS.length) + AMBIENT_TRACKS.length) % AMBIENT_TRACKS.length);
  }, []);

  const nextTrack = useCallback(() => {
    goToTrack(trackIndex + 1);
  }, [goToTrack, trackIndex]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      wantPlayRef.current = true;
      goToTrack(trackIndex + 1);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [goToTrack, trackIndex]);

  useEffect(() => {
    if (!mounted) return;
    const audio = audioRef.current;
    if (!audio) return;

    const controller = new AbortController();
    let cancelled = false;

    const loadTrack = async () => {
      try {
        const signedSrc = await mintStreamUrl(track.id, controller.signal);
        if (cancelled) return;

        audio.removeAttribute("src");
        audio.src = signedSrc;
        audio.load();

        if (wantPlayRef.current) {
          try {
            await audio.play();
            setPlaying(true);
            setAutoplayBlocked(false);
          } catch {
            setAutoplayBlocked(true);
            setPlaying(false);
          }
        }
      } catch (error) {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        setAutoplayBlocked(true);
        setPlaying(false);
      }
    };

    void loadTrack();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [mounted, track.id]);

  return (
    <>
      <audio
        ref={audioRef}
        preload="none"
        aria-hidden="true"
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(event) => event.preventDefault()}
      />

      <div
        className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 sm:bottom-6 sm:right-6"
        aria-live="polite"
        onContextMenu={(event) => event.preventDefault()}
      >
        <div className="pointer-events-auto naga-ambient-player">
          <div className="naga-ambient-player-inner">
            <span className="naga-ambient-glow" aria-hidden="true" />

            <div className="relative flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={toggle}
                className="naga-ambient-btn focus-ring focus-visible:outline-none"
                aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
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
                  <p className="naga-meta truncate text-light-100">{track.title}</p>
                </div>
                <p className="naga-meta mt-0.5 text-light-100/55">
                  {autoplayBlocked && !playing
                    ? "Tap to play"
                    : playing
                      ? track.artist
                      : "Paused"}
                  <span className="text-light-100/35">
                    {" "}
                    · {trackIndex + 1}/{AMBIENT_TRACKS.length}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={nextTrack}
                className="naga-ambient-btn focus-ring focus-visible:outline-none"
                aria-label={`Next track — ${AMBIENT_TRACKS[(trackIndex + 1) % AMBIENT_TRACKS.length]?.title ?? "next"}`}
              >
                <SkipForward className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </button>

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
