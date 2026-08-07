"use client";

import { useEffect, useRef, useState } from "react";
import AirweaveScene from "./AirweaveScene";

const profile={name:"JESSICA CHE",title:"BUSINESS DEVELOPMENT",company:"AIRWEAVE",email:"jessica.che@airweave.com",linkedin:"https://www.linkedin.com/",website:"https://www.airweave.com/"};
export default function Home(){
 const [started,setStarted]=useState(false),[revealed,setRevealed]=useState(false),[arMode,setArMode]=useState(false),[arError,setArError]=useState(""); const video=useRef<HTMLVideoElement>(null); const stream=useRef<MediaStream|null>(null);
 useEffect(()=>()=>stream.current?.getTracks().forEach(t=>t.stop()),[]);
 const start=async()=>{const O=DeviceOrientationEvent as typeof DeviceOrientationEvent&{requestPermission?:()=>Promise<string>};if(O.requestPermission)try{await O.requestPermission()}catch{}setStarted(true)};
 const toggleAR=async()=>{if(arMode){stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;setArMode(false);return}try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});stream.current=s;setArMode(true);setArError("");setTimeout(()=>{if(video.current){video.current.srcObject=s;video.current.play()}},0)}catch{setArError("Camera access is needed for AR view.")}};
 const save=()=>{const v=`BEGIN:VCARD\nVERSION:3.0\nFN:${profile.name}\nORG:${profile.company}\nTITLE:${profile.title}\nEMAIL:${profile.email}\nURL:${profile.website}\nEND:VCARD`;const u=URL.createObjectURL(new Blob([v],{type:"text/vcard"}));const a=document.createElement("a");a.href=u;a.download="Jessica-Che.vcf";a.click();URL.revokeObjectURL(u)};
 return <main className={`experience ${started?"started":""} ${arMode?"ar-mode":""}`}>
  <video ref={video} className="ar-camera" playsInline muted aria-hidden="true"/><div className="ambient ambient-one"/><div className="ambient ambient-two"/>
  <header className="topbar"><div className="wordmark"><i/>airweave</div><div className="edition">WEBGL IDENTITY · 001</div></header>
  {!started?<section className="intro"><p className="eyebrow">MATERIAL · STRUCTURE · PERSON</p><h1>A new kind of<br/>introduction.</h1><button className="enter" onClick={start}><span>ENTER 3D EXPERIENCE</span><b>→</b></button><p className="hint">WebGL · Move your phone</p></section>:
  <section className={`stage ${revealed?"is-revealed":""}`}><AirweaveScene active={started} arMode={arMode} onReveal={()=>setRevealed(true)}/><div className="sequence-copy"><span>0{revealed?3:1}</span><p>{revealed?"IDENTITY, REVEALED":"AIRFIBER, FORMING"}</p></div>
   <div className="actions"><button onClick={save} className="primary-action"><span>SAVE CONTACT</span><b>＋</b></button><button onClick={toggleAR} className={arMode?"ar-on":""}><span>{arMode?"EXIT AR":"VIEW IN AR"}</span><b>◎</b></button><a href={profile.linkedin} target="_blank" rel="noreferrer"><span>LINKEDIN</span><b>↗</b></a><a href={`mailto:${profile.email}`}><span>EMAIL</span><b>↗</b></a></div>
   {arError&&<p className="ar-error">{arError}</p>}<p className="move-hint">DRAG OR MOVE TO EXPLORE · REAL-TIME WEBGL</p></section>}
  <footer><span>TOKYO · JAPAN</span><span>AIRFIBER® / 3D</span></footer>
 </main>
}
