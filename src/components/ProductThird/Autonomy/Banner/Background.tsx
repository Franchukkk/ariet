"use client";

import { useEffect, useRef } from "react"
import styled from "styled-components"
import * as THREE from "three"
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js"

export const Background = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(4, 2, 8);
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(6, 4, 150, 100);
    const pos = geometry.getAttribute("position");

    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dx = (x + 3) / 6;
      const dy = (y + 2) / 4;
      const brightness = 0.2 + 0.8 * (1 - Math.abs(dx - 0.5) - Math.abs(dy - 0.5));
      colors[i * 3] = 0;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = 0.77;
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const simplex = new SimplexNoise();
    const pointsMaterial = new THREE.PointsMaterial({ size: 0.02, vertexColors: true });
    const waves = new THREE.Points(geometry, pointsMaterial);
    waves.rotation.x = -Math.PI / 2;
    scene.add(waves);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    };
    window.addEventListener("resize", onResize);

    let animationId: number;
    const animate = (t: number) => {
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        pos.setZ(i, 0.5 * simplex.noise3d(x / 5, y / 5, t / 8000));
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
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <StyledBackground ref={mountRef} />;
};

const StyledBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.5;

  canvas {
    width: 321%;
    height: 178%;
    position: absolute;
    top: -181px;
    right: -499px;
    transform: rotate(-50deg);

    @media (max-width: 600px) {
      top: 10px;
      width: 600px;
      height: 126%;
      right: 0;
    }
  }
`;
