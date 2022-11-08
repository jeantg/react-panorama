import { RefObject, useEffect, useMemo, useState } from "react";
import * as THREE from "three";

export const usePanorama = (ref: RefObject<HTMLDivElement>, src: string) => {
  const [loadingManager, setLoadingManager] = useState({
    loaded: false,
  });
  let onPointerDownMouseX = 0,
    onPointerDownMouseY = 0,
    lon = 0,
    onPointerDownLon = 0,
    lat = 0,
    onPointerDownLat = 0,
    phi = 0,
    theta = 0;
  const camera = useMemo(
    () =>
      new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1100
      ),
    []
  );
  const scene = useMemo(() => new THREE.Scene(), []);
  const renderer = useMemo(() => new THREE.WebGLRenderer(), []);
  const manager = useMemo(() => new THREE.LoadingManager(), []);
  const onPointerMove = (event: PointerEvent) => {
    if (event.isPrimary === false) return;

    lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (event.isPrimary === false) return;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
  };

  const onDocumentMouseWheel = (event: WheelEvent) => {
    const fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
  };
  const onPointerDown = (event: PointerEvent) => {
    if (event.isPrimary === false) return;
    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  const onWindowResize = (target: RefObject<HTMLDivElement> | undefined) => {
    renderer.setSize(
      Number(target?.current?.getBoundingClientRect()?.width),
      Number(target?.current?.getBoundingClientRect()?.height)
    );
  };
  useEffect(() => {
    window.addEventListener("resize", () => onWindowResize(ref));
    return () =>
      window.removeEventListener("resize", () => onWindowResize(ref));
  }, [ref]);
  const init = () => {
    const container: HTMLDivElement = ref?.current as HTMLDivElement;
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const texture = new THREE.TextureLoader(manager).load(src);

    manager.onLoad = () =>
      setLoadingManager({
        loaded: true,
      });
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      Number(ref?.current?.getBoundingClientRect()?.width),
      Number(ref?.current?.getBoundingClientRect()?.height)
    );

    container?.appendChild(renderer.domElement);
    container.style.touchAction = "none";
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("wheel", onDocumentMouseWheel);
    container.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (event?.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
    });
    container.addEventListener("drop", (event) => {
      event.preventDefault();
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        if (material?.map && event?.target) {
          material.map.image.src = event.target.result;
          material.map.needsUpdate = true;
        }
      });
      reader.readAsDataURL(event?.dataTransfer?.files?.[0] as File);
    });
  };

  const update = () => {
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);
    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(x, y, z);
    renderer.render(scene, camera);
  };
  const animate = () => {
    requestAnimationFrame(animate);
    update();
  };
  return {
    init,
    animate,
    loadingManager,
  };
};
