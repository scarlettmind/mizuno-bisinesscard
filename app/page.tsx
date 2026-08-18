"use client";

import { FormEvent, useEffect, useState } from "react";

const profile = {
  name: "Yuta Mizuno",
  title: "Manager, Business Development",
  company: "airweave",
  email: "yuta.mizuno@airweave.com",
  website: "https://www.airweave.com/",
  linkedin: "https://www.linkedin.com/",
};

const interests = {
  Hospitality: { index: "01", title: "Hospitality × Sleep", copy: "Transforming rest into a defining part of the guest experience — from luxury hotels to destination wellness." },
  Sports: { index: "02", title: "Performance × Recovery", copy: "Better recovery is better performance. Exploring sleep solutions for athletes, teams and global sporting moments." },
  Education: { index: "03", title: "Education × Wellbeing", copy: "Helping the next generation understand the relationship between sleep, learning and lifelong wellbeing." },
  Partnership: { index: "04", title: "Ideas × Partnership", copy: "Bringing together people, places and ideas to create a new standard of rest around the world." },
} as const;

type Interest = keyof typeof interests;

export default function Home() {
  const [intro, setIntro] = useState(true);
  const [selected, setSelected] = useState<Interest>("Hospitality");
  const [exchange, setExchange] = useState(false);
  const [connectedName, setConnectedName] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), 2850);
    return () => window.clearTimeout(timer);
  }, []);

  const saveContact = () => {
    const card = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name}\nORG:${profile.company}\nTITLE:${profile.title}\nEMAIL:${profile.email}\nURL:${profile.website}\nEND:VCARD`;
    const url = URL.createObjectURL(new Blob([card], { type: "text/vcard" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "Yuta-Mizuno.vcf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const connect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setConnectedName(String(data.get("name") || "YOU").trim().toUpperCase());
  };

  return (
    <main>
      <div className={`opening ${intro ? "is-playing" : "is-finished"}`} aria-hidden={!intro}>
        <button className="skip" onClick={() => setIntro(false)}>SKIP</button>
        <div className="seed" />
        <div className="m-mark"><i /><i /><i /><i /></div>
        <div className="opening-name"><strong>YUTA MIZUNO</strong><span>Business Development / airweave</span></div>
      </div>

      <nav className="nav"><a className="brand" href="#top">airweave</a><span>DIGITAL IDENTITY <b>01</b></span></nav>

      <section className="hero" id="top">
        <div className="fiber-orbit" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <p className="kicker">TOKYO · JAPAN</p>
        <h1>YUTA<br /><em>MIZUNO</em></h1>
        <div className="role"><span>MANAGER</span><span>BUSINESS DEVELOPMENT</span></div>
        <p className="statement">Let’s build something<br />together.</p>
        <div className="hero-actions">
          <button onClick={saveContact}>SAVE CONTACT <b>↓</b></button>
          <button className="light" onClick={() => setExchange(true)}>EXCHANGE CONTACT <b>↗</b></button>
        </div>
        <a className="scroll" href="#together">SCROLL TO DISCOVER <span>↓</span></a>
      </section>

      <section className="together" id="together">
        <div className="section-head"><p>01 / FIND COMMON GROUND</p><h2>WHAT BRINGS US<br /><em>TOGETHER?</em></h2></div>
        <div className="interest-grid">
          {(Object.keys(interests) as Interest[]).map((item) => (
            <button key={item} className={selected === item ? "active" : ""} onClick={() => setSelected(item)}>
              <small>{interests[item].index}</small><span>{item}</span><b>↗</b>
            </button>
          ))}
        </div>
        <article className="story" key={selected}>
          <div className="story-mark"><img src="/airweave-logo.png" alt="" /></div>
          <div><small>SELECTED FIELD · {interests[selected].index}</small><h3>{interests[selected].title}</h3><p>{interests[selected].copy}</p><a href={profile.website} target="_blank" rel="noreferrer">EXPLORE WITH YUTA <span>↗</span></a></div>
        </article>
      </section>

      <section className="connect">
        <p>02 / MAKE THE CONNECTION</p>
        <h2>LET’S STAY<br /><em>CONNECTED.</em></h2>
        <button onClick={() => setExchange(true)}>EXCHANGE CONTACT <span>↗</span></button>
        <div className="connection-preview"><span>YUTA</span><i /><span>YOU</span></div>
      </section>

      <footer><a className="brand" href="#top">airweave</a><div><a href={`mailto:${profile.email}`}>EMAIL ↗</a><a href={profile.linkedin}>LINKEDIN ↗</a></div><span>© 2026 AIRWEAVE</span></footer>

      <div className={`modal ${exchange ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Exchange contact">
        <button className="modal-close" onClick={() => { setExchange(false); setConnectedName(""); }} aria-label="Close">×</button>
        {!connectedName ? <div className="form-wrap"><p className="kicker">LET’S STAY CONNECTED</p><h2>Exchange<br /><em>contact.</em></h2><form onSubmit={connect}>
          <label>Your name<input name="name" required autoComplete="name" placeholder="James" /></label>
          <label>Company<input name="company" required autoComplete="organization" placeholder="Company name" /></label>
          <label>Email / LinkedIn<input name="contact" required placeholder="you@company.com" /></label>
          <fieldset><legend>What are you interested in?</legend><div>{(Object.keys(interests) as Interest[]).map(item => <label key={item}><input type="radio" name="interest" value={item} defaultChecked={item === selected} /><span>{item}</span></label>)}</div></fieldset>
          <button type="submit">CONNECT <span>→</span></button>
        </form></div> : <div className="success"><p>CONNECTED WITH YUTA <b>✓</b></p><div className="made"><span>YUTA</span><i /><span>{connectedName}</span></div><h2>CONNECTION<br /><em>MADE.</em></h2><button onClick={saveContact}>SAVE YUTA TO CONTACTS <span>↓</span></button><div className="success-links"><a href={profile.linkedin}>LINKEDIN ↗</a><a href={profile.website}>AIRWEAVE ↗</a></div></div>}
      </div>
    </main>
  );
}
