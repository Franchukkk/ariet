"use client";

import { useEffect, useRef } from "react"
import styled from "styled-components"
import * as THREE from "three"
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise"

export const Background = () => {
  const mountRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const mount = mountRef.current;
  if (!mount) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#121212");

  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(4, 2, 8);
  camera.lookAt(scene.position);

  const geometry = new THREE.PlaneGeometry(6, 4, 150, 100);
  const pos = geometry.getAttribute("position");
  const simplex = new SimplexNoise();

  const pointsMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0x00ffc3 });
  const waves = new THREE.Points(geometry, pointsMaterial);
  waves.rotation.x = -Math.PI / 2;
  scene.add(waves);

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  let animationId: number;
  const animate = (t: number) => {
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = 0.5 * simplex.noise3d(x / 2, y / 2, t / 6000);
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animationId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    mount.removeChild(renderer.domElement);
  };
}, []);


  return (
    <StyledBackground ref={mountRef} className="overflow-hidden bg-animation" />
  );
};

const StyledBackground = styled.div`
  position: absolute;
  top: -50px;
  right: 0px;
  bottom: 0;
  width: 300px;
  height: 300px;
  transform: rotate(62deg) scale(1.8);
  opacity: 1;
  z-index: -1;
  background: #121212;

  canvas {
    width: 271% !important;
    height: 178% !important;
    position: absolute;
    top: -181px;
    right: -499px;
    bottom: -146px;
    @media (max-width: 1000px) {
      top: -100px;
    }
  }
`;
