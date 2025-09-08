"use client";

import { useEffect, useRef } from "react"
import styled from "styled-components"
import * as THREE from "three"
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js"

interface Props {
  className?: string;
}

export const Background = ({ className }: Props) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Якщо вже є renderer, нічого не робимо (dev-mode double effect)
    if (rendererRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(4, 2, 8);
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.PlaneGeometry(6, 4, 150, 100);
    const simplex = new SimplexNoise();

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00ffc3,
    });

    const waves = new THREE.Points(geometry, pointsMaterial);
    waves.rotation.x = -Math.PI / 2;
    scene.add(waves);

    const pos = geometry.getAttribute("position");

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    let animationId: number;

    const animate = (time: number) => {
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = 0.5 * simplex.noise3d(x / 2, y / 2, time / 6000);
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

      
      geometry.dispose();
      pointsMaterial.dispose();

      
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
      rendererRef.current = null;
    };
  }, []);

  return <StyledBackground ref={mountRef} className={className} />;
};

const StyledBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
`;
