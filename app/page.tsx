"use client";

import { useEffect, useRef, useState } from "react";

const profile = {
  name: "Yuta Mizuno",
  title: "Head of Business Development, Public Relations & President’s Office",
  company: "airweave inc.",
  email: "yuta_mizuno@airweave.jp",
  website: "https://airweave.jp/",
};

export default function Home() {
  const introVideo = useRef<HTMLVideoElement>(null);
  const backgroundVideo = useRef<HTMLVideoElement>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  const resumePlayback = async () => {
    const videos = [introVideo.current, backgroundVideo.current].filter(Boolean) as HTMLVideoElement[];
    videos.forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
    });
    const activeVideo = introVideo.current ?? backgroundVideo.current;
    const results = activeVideo ? await Promise.allSettled([activeVideo.play()]) : [];
    setNeedsTap(results.every((result) => result.status === "rejected"));
  };

  useEffect(() => {
    void resumePlayback();
    const fallback = window.setTimeout(beginTransition, 2550);
    const playbackCheck = window.setTimeout(() => {
      if (introVideo.current?.paused && backgroundVideo.current?.paused) setNeedsTap(true);
    }, 900);
    return () => {
      window.clearTimeout(fallback);
      window.clearTimeout(playbackCheck);
    };
  // The fallback deliberately runs once on initial load.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beginTransition = () => {
    if (transitioning) return;
    setTransitioning(true);
    if (backgroundVideo.current) {
      backgroundVideo.current.currentTime = 0;
      void backgroundVideo.current.play().catch(() => setNeedsTap(true));
    }
    window.setTimeout(() => setIntroDone(true), 650);
  };

  const checkIntro = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.duration - video.currentTime < 0.42) beginTransition();
  };

  const saveContact = async () => {
    let photoLine = "";
    try {
      const response = await fetch("/mizuno-yuta.jpg");
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = "";
      for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      const folded = btoa(binary).match(/.{1,74}/g)?.join("\n ") ?? "";
      photoLine = `\nPHOTO;ENCODING=b;TYPE=JPEG:${folded}`;
    } catch { /* Contact still saves if the portrait cannot be loaded. */ }
    const card = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name}\nN:Mizuno;Yuta;;;\nORG:${profile.company}\nTITLE:${profile.title}\nEMAIL:${profile.email}\nURL:${profile.website}${photoLine}\nEND:VCARD`;
    const url = URL.createObjectURL(new Blob([card], { type: "text/vcard" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "Yuta-Mizuno.vcf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const fluidPress = (event: React.PointerEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const wave = button.querySelector<HTMLElement>(".tap-wave");
    if (!wave) return;
    const rect = button.getBoundingClientRect();
    wave.style.setProperty("--tap-x", `${event.clientX - rect.left}px`);
    wave.style.setProperty("--tap-y", `${event.clientY - rect.top}px`);
    wave.classList.remove("play");
    window.requestAnimationFrame(() => wave.classList.add("play"));
    window.setTimeout(() => wave.classList.remove("play"), 650);
  };

  return (
    <main className={`identity ${transitioning ? "is-transitioning" : ""} ${introDone ? "is-ready" : ""}`}>
      <video ref={backgroundVideo} className="video background-video" muted playsInline loop preload="metadata" disablePictureInPicture aria-hidden="true">
        <source media="(max-width: 700px) and (orientation: portrait)" src="/airweave-loop-mobile.mp4?v=17" type="video/mp4" />
        <source src="/airweave-loop.mp4?v=17" type="video/mp4" />
      </video>
      {!introDone && <video ref={introVideo} className="video intro-video" autoPlay muted playsInline preload="auto" disablePictureInPicture onCanPlay={() => void resumePlayback()} onTimeUpdate={checkIntro} onEnded={beginTransition} aria-hidden="true">
        <source media="(max-width: 700px) and (orientation: portrait)" src="/airweave-intro-mobile.mp4?v=17" type="video/mp4" />
        <source src="/airweave-intro.mp4?v=17" type="video/mp4" />
      </video>}
      <div className="video-shade" />

      {needsTap && <button className="play-gate" onClick={() => void resumePlayback()}><i /> TAP TO PLAY</button>}

      <img className="intro-wordmark" src="/airweave-official-logo.png" alt="" aria-hidden="true" />
      <header><img className="wordmark" src="/airweave-official-logo.png" alt="airweave" /></header>

      <section className="identity-content">
        <div className="person">
          <h1>Yuta <span>Mizuno</span></h1>
          <p className="role">Head of Business Development, Public Relations &amp; President’s Office</p>
          <p className="company">airweave inc.</p>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.website}>airweave.jp</a>
          </div>
        </div>
        <div className="actions">
          <button onPointerDown={fluidPress} onClick={saveContact}><span>SAVE CONTACT</span><svg className="action-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v15m0 0-5-5m5 5 5-5" /></svg><i className="tap-wave" /></button>
        </div>
      </section>
    </main>
  );
}
