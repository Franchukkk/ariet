"use client";

import { useEffect, useRef } from "react"
import styled from "styled-components"
import * as THREE from "three"
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js"

export const Background = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    let animationId: number;

    let renderer = new THREE.WebGLRenderer({ antialias: true });

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

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(6, 4, 150, 100);
    const pos = geometry.getAttribute("position");
    const simplex = new SimplexNoise();

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x00ffc3,
    });

    const waves = new THREE.Points(geometry, pointsMaterial);
    waves.rotation.x = -Math.PI / 2;
    scene.add(waves);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

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
  transform: rotate(90deg);
  canvas {
    width: 310% !important;
    height: 299% !important;
    position: absolute;
    top: -544px;
    right: -174px;
    bottom: -146px;
    @media (max-width: 600px) {
      top: -187px;
      width: 667px !important;
      height: 245% !important;
      right: -64px !important;
    }
  }
`;
