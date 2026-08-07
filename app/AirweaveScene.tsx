"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { active: boolean; arMode: boolean; onReveal: () => void };

function cardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1600; canvas.height = 930;
  const c = canvas.getContext("2d")!;
  const gradient = c.createLinearGradient(0, 0, 1600, 930);
  gradient.addColorStop(0, "#f7fbfd"); gradient.addColorStop(1, "#a9c1cd");
  c.fillStyle = gradient; c.fillRect(0, 0, 1600, 930);
  c.strokeStyle = "rgba(255,255,255,.8)"; c.lineWidth = 3; c.strokeRect(3, 3, 1594, 924);
  c.fillStyle = "#11202a"; c.font = "600 66px Arial"; c.fillText("◉  airweave", 100, 140);
  c.font = "500 116px Arial"; c.fillText("JESSICA CHE", 100, 620);
  c.fillStyle = "#4e626e"; c.font = "28px Arial"; c.fillText("BUSINESS DEVELOPMENT", 105, 684);
  c.font = "22px Arial"; c.fillText("AIRFIBER®  ·  TOKYO / JP", 105, 805);
  c.textAlign = "right"; c.fillText("DIGITAL IDENTITY 001", 1490, 140);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8;
  return texture;
}

export default function AirweaveScene({ active, arMode, onReveal }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const callback = useRef(onReveal); callback.current = onReveal;

  useEffect(() => {
    if (!active || !host.current) return;
    const el = host.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, el.clientWidth / el.clientHeight, .1, 100);
    camera.position.set(0, .2, 8.3);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12; el.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xddeeff, 0x081017, 2.5));
    const key = new THREE.DirectionalLight(0xffffff, 5); key.position.set(-3, 4, 5); scene.add(key);
    const rim = new THREE.PointLight(0x55b9f2, 45, 18); rim.position.set(4, -2, 2); scene.add(rim);

    const root = new THREE.Group(); scene.add(root);
    const fiberGroup = new THREE.Group(); root.add(fiberGroup);
    const fiberMaterial = new THREE.MeshPhysicalMaterial({ color: 0xe8f7ff, emissive: 0x397693, emissiveIntensity: .26, roughness: .3, transmission: .1, transparent: true, opacity: .78 });
    for (let i = 0; i < 64; i++) {
      const points: THREE.Vector3[] = [];
      const row = Math.floor(i / 8), col = i % 8;
      for (let j = 0; j < 7; j++) points.push(new THREE.Vector3((j - 3) * .72, (row - 3.5) * .13 + Math.sin(j * 1.7 + i) * .12, (col - 3.5) * .13 + Math.cos(j * 1.3 + i) * .1));
      const curve = new THREE.CatmullRomCurve3(points);
      fiberGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 24, .018, 5, false), fiberMaterial));
    }
    fiberGroup.rotation.x = -.25;

    const layers = new THREE.Group(); root.add(layers); layers.visible = false;
    const layerMat = new THREE.MeshPhysicalMaterial({ color: 0xe5f2f7, roughness: .42, transmission: .32, transparent: true, opacity: .82 });
    [-.62, 0, .62].forEach((y, i) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(5.15, .34, 2.95, 8, 2, 6), layerMat.clone());
      mesh.position.y = y; mesh.userData.targetY = y; mesh.userData.index = i; layers.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: 0xaddcf2, transparent: true, opacity: .36 })); mesh.add(edges);
    });

    const card = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.02, .065, 1, 1, 1), [
      new THREE.MeshStandardMaterial({color:0x90aab7}),new THREE.MeshStandardMaterial({color:0x90aab7}),new THREE.MeshStandardMaterial({color:0x90aab7}),new THREE.MeshStandardMaterial({color:0x90aab7}),new THREE.MeshStandardMaterial({map:cardTexture(),roughness:.22,metalness:.05}),new THREE.MeshStandardMaterial({color:0xc8d8df})
    ]);
    root.add(card); card.visible = false; card.scale.setScalar(.7); card.position.z = -.6;

    const dustGeo = new THREE.BufferGeometry();
    const dust = new Float32Array(600 * 3); for (let i=0;i<dust.length;i++) dust[i]=(Math.random()-.5)*9;
    dustGeo.setAttribute("position",new THREE.BufferAttribute(dust,3));
    const particles = new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xbfe8ff,size:.018,transparent:true,opacity:.55})); scene.add(particles);

    let pointerX=0,pointerY=0,down=false,lastX=0,lastY=0,phase=0,revealed=false,raf=0;
    const start = performance.now();
    const move=(e:PointerEvent)=>{ if(down){pointerX += (e.clientX-lastX)*.006;pointerY += (e.clientY-lastY)*.006;lastX=e.clientX;lastY=e.clientY;} };
    const press=(e:PointerEvent)=>{down=true;lastX=e.clientX;lastY=e.clientY}; const release=()=>down=false;
    const orient=(e:DeviceOrientationEvent)=>{if(e.gamma!=null&&!down)pointerX=THREE.MathUtils.clamp(e.gamma/90,-.28,.28);if(e.beta!=null&&!down)pointerY=THREE.MathUtils.clamp((e.beta-45)/120,-.18,.18)};
    renderer.domElement.addEventListener("pointerdown",press); addEventListener("pointermove",move); addEventListener("pointerup",release); addEventListener("deviceorientation",orient);
    const resize=()=>{camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)}; addEventListener("resize",resize);

    const animate=(now:number)=>{
      const t=(now-start)/1000; phase += .008; particles.rotation.y=phase*.12; root.rotation.y += (pointerX-root.rotation.y)*.045;root.rotation.x += (-pointerY-root.rotation.x)*.045;
      if(t<1.7){fiberGroup.scale.setScalar(THREE.MathUtils.smoothstep(t,0,1.7));fiberGroup.rotation.y=t*.32;}
      else if(t<3.25){layers.visible=true;fiberGroup.scale.multiplyScalar(.965);layers.children.forEach((m,i)=>{const mesh=m as THREE.Mesh;mesh.position.y=THREE.MathUtils.lerp(mesh.position.y,(i-1)*.62,.045);mesh.rotation.y=Math.sin(t+i)*.025});}
      else {fiberGroup.visible=false;layers.visible=false;card.visible=true;card.scale.lerp(new THREE.Vector3(1,1,1),.055);card.position.z=THREE.MathUtils.lerp(card.position.z,.25,.055);if(!revealed){revealed=true;callback.current();}}
      card.rotation.z=Math.sin(t*.45)*.012; root.position.y=Math.sin(t*.7)*.08;
      renderer.render(scene,camera); raf=requestAnimationFrame(animate);
    }; raf=requestAnimationFrame(animate);
    return()=>{cancelAnimationFrame(raf);removeEventListener("resize",resize);removeEventListener("pointermove",move);removeEventListener("pointerup",release);removeEventListener("deviceorientation",orient);renderer.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose())}});el.removeChild(renderer.domElement)};
  }, [active]);

  return <div ref={host} className={`webgl-stage ${arMode ? "ar-active" : ""}`} aria-label="Interactive 3D Airfiber mattress transforming into Jessica Che's identity card" />;
}
