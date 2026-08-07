"use client";

import { useEffect, useRef, useState } from "react";

const profile = {
  name: "JESSICA CHE",
  title: "BUSINESS DEVELOPMENT",
  company: "AIRWEAVE",
  email: "jessica.che@airweave.com",
  linkedin: "https://www.linkedin.com/",
  website: "https://www.airweave.com/",
};

function FiberField({ revealed }: { revealed: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let raf = 0;
    const fibers = Array.from({ length: 72 }, (_, i) => ({
      x: Math.random(), y: Math.random(), phase: Math.random() * 8,
      speed: .0015 + Math.random() * .002, length: 20 + Math.random() * 62,
      angle: (i % 2 ? -.55 : .55) + (Math.random() - .5) * .5,
    }));
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const progress = Math.min(1, frame / 130);
      fibers.forEach((f, i) => {
        const drift = Math.sin(frame * f.speed * 7 + f.phase) * 18;
        const targetX = innerWidth / 2 + ((i % 12) - 5.5) * Math.min(innerWidth * .044, 22);
        const targetY = innerHeight / 2 + (Math.floor(i / 12) - 2.5) * 12;
        const x = (f.x * innerWidth) * (1 - progress) + targetX * progress + drift;
        const y = (f.y * innerHeight) * (1 - progress) + targetY * progress;
        const alpha = revealed ? .10 : .18 + Math.sin(frame * .02 + f.phase) * .08;
        const grad = ctx.createLinearGradient(x, y, x + f.length, y + f.length * f.angle);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(.45, `rgba(225,241,255,${alpha})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.strokeStyle = grad; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(x, y);
        ctx.bezierCurveTo(x + f.length * .25, y + 9, x + f.length * .65, y + f.length * f.angle - 9, x + f.length, y + f.length * f.angle);
        ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };
    resize(); addEventListener("resize", resize); draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, [revealed]);
  return <canvas ref={canvasRef} className="fiber-field" aria-hidden="true" />;
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);
  const [tilt, setTilt] = useState({ x: -4, y: 8 });
  const drag = useRef({ active: false, x: 0, y: 0 });

  useEffect(() => {
    if (!started) return;
    const t = window.setTimeout(() => setRevealed(true), 1900);
    return () => window.clearTimeout(t);
  }, [started]);

  useEffect(() => {
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      setTilt({ x: Math.max(-12, Math.min(12, (e.beta - 40) / 5)), y: Math.max(-14, Math.min(14, e.gamma / 3)) });
    };
    addEventListener("deviceorientation", onOrientation);
    return () => removeEventListener("deviceorientation", onOrientation);
  }, []);

  const start = async () => {
    const DeviceMotion = DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
    if (DeviceMotion.requestPermission) { try { await DeviceMotion.requestPermission(); } catch {} }
    setStarted(true);
  };

  const saveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name}\nORG:${profile.company}\nTITLE:${profile.title}\nEMAIL:${profile.email}\nURL:${profile.website}\nEND:VCARD`;
    const url = URL.createObjectURL(new Blob([vcard], { type: "text/vcard" }));
    const a = document.createElement("a"); a.href = url; a.download = "Jessica-Che.vcf"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className={started ? "experience started" : "experience"}>
      <FiberField revealed={revealed} />
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar"><div className="wordmark"><i />airweave</div><div className="edition">DIGITAL IDENTITY · 001</div></header>

      {!started && <section className="intro">
        <p className="eyebrow">MATERIAL · STRUCTURE · PERSON</p>
        <h1>A new kind of<br />introduction.</h1>
        <button className="enter" onClick={start}><span>ENTER EXPERIENCE</span><b>→</b></button>
        <p className="hint">Sound on · Move your phone</p>
      </section>}

      {started && <section className={`stage ${revealed ? "is-revealed" : ""}`}>
        <div className="sequence-copy"><span>01</span><p>{revealed ? "IDENTITY, REVEALED" : "AIRFIBER, FORMING"}</p></div>
        <div className="card-scene"
          onPointerDown={(e) => { drag.current = { active: true, x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={(e) => { if (!drag.current.active) return; setTilt(t => ({ x: Math.max(-16, Math.min(16, t.x - (e.clientY - drag.current.y) * .12)), y: Math.max(-20, Math.min(20, t.y + (e.clientX - drag.current.x) * .12)) })); drag.current.x=e.clientX; drag.current.y=e.clientY; }}
          onPointerUp={() => drag.current.active = false}
          style={{ "--rx": `${tilt.x}deg`, "--ry": `${tilt.y}deg` } as React.CSSProperties}>
          <div className="fiber-block">{Array.from({length: 22}).map((_,i)=><i key={i} />)}</div>
          <article className="identity-card">
            <div className="card-grain" />
            <div className="card-brand"><i />airweave</div>
            <div className="card-main"><p className="card-name">{profile.name}</p><p>{profile.title}</p></div>
            <div className="material-mark"><span>AIRFIBER®</span><i /></div>
            <div className="card-index">01 / JP</div>
          </article>
        </div>
        <div className="actions">
          <button onClick={saveContact} className="primary-action"><span>SAVE CONTACT</span><b>＋</b></button>
          <a href={profile.linkedin} target="_blank" rel="noreferrer"><span>LINKEDIN</span><ArrowIcon /></a>
          <a href={`mailto:${profile.email}`}><span>EMAIL</span><ArrowIcon /></a>
          <a href={profile.website} target="_blank" rel="noreferrer"><span>AIRWEAVE</span><ArrowIcon /></a>
        </div>
        <p className="move-hint">DRAG OR MOVE TO EXPLORE</p>
      </section>}
      <footer><span>TOKYO · JAPAN</span><span>THE QUALITY SLEEP</span></footer>
    </main>
  );
}
