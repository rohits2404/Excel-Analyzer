import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDColumnGraph = ({ data, xKey, yKey, zKey, title = '3D Column Chart' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!data || !xKey || !yKey || !zKey) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#ffffff');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(40, 40, 60);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(50, 50, 50);
    scene.add(dirLight);

    const xCats = [...new Set(data.map(row => row[xKey]))];
    const zCats = [...new Set(data.map(row => row[zKey]))];
    const yMax = Math.max(...data.map(row => parseFloat(row[yKey]) || 0));

    const xSpacing = 6;
    const zSpacing = 6;
    const colWidth = 3;
    const colDepth = 3;
    const heightScale = 30 / yMax;

    const colors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2'];
    const colorMap = Object.fromEntries(zCats.map((cat, i) => [cat, colors[i % colors.length]]));

    const group = new THREE.Group();

    zCats.forEach((zCat, zi) => {
      xCats.forEach((xCat, xi) => {
        const point = data.find(
          d => d[xKey] === xCat && d[zKey] === zCat
        );
        if (!point) return;
        const yVal = parseFloat(point[yKey]);
        if (isNaN(yVal)) return;

        const height = yVal * heightScale;
        const geometry = new THREE.BoxGeometry(colWidth, height, colDepth);
        const material = new THREE.MeshPhongMaterial({ color: colorMap[zCat] });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(
          xi * xSpacing - (xCats.length * xSpacing) / 2,
          height / 2,
          zi * zSpacing - (zCats.length * zSpacing) / 2
        );
        group.add(bar);
      });
    });

    scene.add(group);

    // Axis lines only (no grid)
    const axisMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    const xLine = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-30, 0, 0),
      new THREE.Vector3(30, 0, 0)
    ]);
    const yLine = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 35, 0)
    ]);
    const zLine = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -30),
      new THREE.Vector3(0, 0, 30)
    ]);
    scene.add(new THREE.Line(xLine, axisMat));
    scene.add(new THREE.Line(yLine, axisMat));
    scene.add(new THREE.Line(zLine, axisMat));

    // Legend using colored squares only
    zCats.forEach((cat, i) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = colorMap[cat];
      ctx.fillRect(0, 0, 20, 20);
      ctx.fillStyle = 'black';
      ctx.font = '18px Arial';
      ctx.fillText(cat, 30, 18);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(20, 8, 1);
      sprite.position.set(40, 25 - i * 10, -20);
      scene.add(sprite);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [data, xKey, yKey, zKey, title]);

  return (
    <div className="w-full h-full relative">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default ThreeDColumnGraph;