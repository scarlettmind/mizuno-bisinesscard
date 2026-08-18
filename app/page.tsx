"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const profile = {
  name: "Mizuno Yuta",
  title: "Manager, Business Development",
  company: "airweave",
  email: "yuta.mizuno@airweave.com",
  website: "https://www.airweave.com/",
  linkedin: "https://www.linkedin.com/",
};

const interests = ["Hospitality", "Sports", "Education", "Partnership"];

export default function Home() {
  const introVideo = useRef<HTMLVideoElement>(null);
  const backgroundVideo = useRef<HTMLVideoElement>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [exchange, setExchange] = useState(false);
  const [connectedName, setConnectedName] = useState("");

  useEffect(() => {
    const tryPlay = () => {
      void introVideo.current?.play().catch(() => undefined);
      void backgroundVideo.current?.play().catch(() => undefined);
    };
    tryPlay();
    const fallback = window.setTimeout(beginTransition, 2550);
    window.addEventListener("pointerdown", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true });
    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
    };
  // The fallback deliberately runs once on initial load.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beginTransition = () => {
    if (transitioning) return;
    setTransitioning(true);
    if (backgroundVideo.current) {
      backgroundVideo.current.currentTime = 0;
      void backgroundVideo.current.play();
    }
    window.setTimeout(() => setIntroDone(true), 650);
  };

  const checkIntro = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.duration - video.currentTime < 0.42) beginTransition();
  };

  const saveContact = () => {
    const card = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name}\nORG:${profile.company}\nTITLE:${profile.title}\nEMAIL:${profile.email}\nURL:${profile.website}\nEND:VCARD`;
    const url = URL.createObjectURL(new Blob([card], { type: "text/vcard" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "Mizuno-Yuta.vcf";
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
    window.setTimeout(() => wave.classList.remove("play"), 850);
  };

  const connect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setConnectedName(String(data.get("name") || "YOU").trim().toUpperCase());
  };

  return (
    <main className={`identity ${transitioning ? "is-transitioning" : ""} ${introDone ? "is-ready" : ""}`}>
      <video ref={backgroundVideo} className="video background-video" src="/airweave-loop.mp4?v=2" autoPlay muted playsInline loop preload="auto" aria-hidden="true" />
      {!introDone && <video ref={introVideo} className="video intro-video" src="/airweave-intro.mp4?v=2" autoPlay muted playsInline preload="auto" onTimeUpdate={checkIntro} onEnded={beginTransition} aria-hidden="true" />}
      <div className="video-shade" />

      <div className="intro-wordmark" aria-hidden="true">airweave</div>
      <header><div className="wordmark">airweave</div></header>

      <section className="identity-content">
        <div className="person">
          <h1><span>Mizuno</span> Yuta.</h1>
          <p><span>Manager,</span> Business Development</p>
        </div>
        <div className="actions">
          <button onPointerDown={fluidPress} onClick={saveContact}><span>SAVE CONTACT</span><b>↓</b><i className="tap-wave" /></button>
          <button onPointerDown={fluidPress} onClick={() => setExchange(true)}><span>EXCHANGE CONTACT</span><b>↗</b><i className="tap-wave" /></button>
        </div>
      </section>

      <div className={`modal ${exchange ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Exchange contact">
        <button className="modal-close" onClick={() => { setExchange(false); setConnectedName(""); }} aria-label="Close">×</button>
        {!connectedName ? (
          <div className="form-wrap">
            <p className="eyebrow">LET&apos;S STAY CONNECTED</p>
            <h2>Exchange<br /><em>contact.</em></h2>
            <form onSubmit={connect}>
              <label>Your name<input name="name" required autoComplete="name" placeholder="James" /></label>
              <label>Company<input name="company" required autoComplete="organization" placeholder="Company name" /></label>
              <label>Email / LinkedIn<input name="contact" required placeholder="you@company.com" /></label>
              <fieldset><legend>What are you interested in?</legend><div>{interests.map(item => <label key={item}><input type="radio" name="interest" value={item} defaultChecked={item === "Hospitality"} /><span>{item}</span></label>)}</div></fieldset>
              <button type="submit">CONNECT <span>→</span></button>
            </form>
          </div>
        ) : (
          <div className="success">
            <p>CONNECTED WITH YUTA <b>✓</b></p>
            <div className="made"><span>YUTA</span><i /><span>{connectedName}</span></div>
            <h2>CONNECTION<br /><em>MADE.</em></h2>
            <button onClick={saveContact}>SAVE YUTA TO CONTACTS <span>↓</span></button>
            <div className="success-links"><a href={profile.linkedin}>LINKEDIN ↗</a><a href={profile.website}>AIRWEAVE ↗</a></div>
          </div>
        )}
      </div>
    </main>
  );
}
