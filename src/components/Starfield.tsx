import { useRef, useEffect } from "react";
import * as THREE from "three";

const Starfield: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    mountRef.current?.appendChild(renderer.domElement);

    // Stars
    const geometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions: number[] = [];
    for (let i = 0; i < starCount; i++) {
      positions.push(
        THREE.MathUtils.randFloatSpread(100),
        THREE.MathUtils.randFloatSpread(100),
        THREE.MathUtils.randFloatSpread(100)
      );
    }
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    const material = new THREE.PointsMaterial({ color: 0xbedcff, size: 1.3 });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      camera.position.x = (e.clientX - width / 2) / 250;
      camera.position.y = -(e.clientY - height / 2) / 250;
    };
    document.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.0007;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full z-0"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default Starfield;
