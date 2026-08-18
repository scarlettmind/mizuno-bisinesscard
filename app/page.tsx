"use client";

import { FormEvent, useRef, useState } from "react";

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
  const backgroundVideo = useRef<HTMLVideoElement>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [exchange, setExchange] = useState(false);
  const [connectedName, setConnectedName] = useState("");

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

  const connect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setConnectedName(String(data.get("name") || "YOU").trim().toUpperCase());
  };

  return (
    <main className={`identity ${transitioning ? "is-transitioning" : ""} ${introDone ? "is-ready" : ""}`}>
      <video ref={backgroundVideo} className="video background-video" src="/airweave-loop.mp4" muted playsInline loop preload="auto" aria-hidden="true" />
      {!introDone && <video className="video intro-video" src="/airweave-intro.mp4" autoPlay muted playsInline preload="auto" onTimeUpdate={checkIntro} onEnded={beginTransition} aria-hidden="true" />}
      <div className="video-shade" />

      <div className="intro-wordmark" aria-hidden="true">airweave</div>
      <header><div className="wordmark">airweave</div></header>

      <section className="identity-content">
        <div className="person">
          <h1><span>Mizuno</span> Yuta.</h1>
          <p><span>Manager,</span> Business Development</p>
        </div>
        <div className="actions">
          <button onClick={saveContact}>SAVE CONTACT <b>↓</b></button>
          <button onClick={() => setExchange(true)}>EXCHANGE CONTACT <b>↗</b></button>
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
