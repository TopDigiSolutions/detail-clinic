"use client";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import Image from "next/image";
import type * as THREE from "three";
import { detailAnimation } from "@/lib/detailAnimation";

type Props = {
  progress: MotionValue<number>;
  mode?: "detail" | "tint";
  level?: number;
  reduced?: boolean;
};

// ── Background Module Preloading (Kicks off immediately when JS loads) ──
const threeModulesPromise =
  typeof window !== "undefined"
    ? Promise.all([
      import("three"),
      import("three/addons/loaders/GLTFLoader.js"),
      import("three/addons/loaders/DRACOLoader.js"),
      import("three/addons/environments/RoomEnvironment.js"),
    ])
    : null;

// ── Global Caches (Shared across mounts / instances) ───────────────────────
let cachedModel: THREE.Group | null = null;
let modelLoadingPromise: Promise<THREE.Group | null> | null = null;

let cachedDirtTexture: THREE.CanvasTexture | null = null;
let cachedShadowTexture: THREE.CanvasTexture | null = null;

// Load & cache car model once across entire application
async function getSharedCarModel(): Promise<THREE.Group | null> {
  if (cachedModel) return cachedModel.clone(true);
  if (modelLoadingPromise) {
    const m = await modelLoadingPromise;
    return m ? m.clone(true) : null;
  }

  modelLoadingPromise = (async () => {
    if (!threeModulesPromise) return null;
    const [, { GLTFLoader }, { DRACOLoader }] = await threeModulesPromise;
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    try {
      const gltf = await loader.loadAsync("/cars/porsche-preview.glb");
      cachedModel = gltf.scene;
      return cachedModel;
    } catch (err) {
      console.warn("Vehicle model unavailable:", err);
      modelLoadingPromise = null;
      return null;
    } finally {
      dracoLoader.dispose();
    }
  })();

  const res = await modelLoadingPromise;
  return res ? res.clone(true) : null;
}


// Procedural contact shadow canvas texture
function getContactShadowTexture(T: typeof THREE): THREE.CanvasTexture | null {
  if (cachedShadowTexture) return cachedShadowTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, 512, 256);
  const grad = ctx.createRadialGradient(256, 128, 25, 256, 128, 210);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.85)");
  grad.addColorStop(0.35, "rgba(0, 0, 0, 0.55)");
  grad.addColorStop(0.7, "rgba(0, 0, 0, 0.20)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0.0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(256, 128, 230, 95, 0, 0, Math.PI * 2);
  ctx.fill();

  cachedShadowTexture = new T.CanvasTexture(canvas);
  cachedShadowTexture.needsUpdate = true;
  return cachedShadowTexture;
}

// Procedural high-res dirt and splatter texture baked once on CPU
function getProceduralDirtTexture(T: typeof THREE): THREE.CanvasTexture {
  if (cachedDirtTexture) return cachedDirtTexture;
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new T.CanvasTexture(canvas);

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 6 + Math.random() * 26;
    const alpha = 0.06 + Math.random() * 0.18;
    ctx.fillStyle =
      Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 1600; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.8 + Math.random() * 3.4;
    const isDark = Math.random() > 0.45;
    ctx.fillStyle = isDark
      ? `rgba(20, 14, 8, ${0.45 + Math.random() * 0.5})`
      : `rgba(180, 150, 110, ${0.40 + Math.random() * 0.45})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(35, 25, 15, 0.22)";
  for (let i = 0; i < 35; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 12 + Math.random() * 38;
    ctx.lineWidth = 1 + Math.random() * 1.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 6, y + len);
    ctx.stroke();
  }

  cachedDirtTexture = new T.CanvasTexture(canvas);
  cachedDirtTexture.wrapS = T.RepeatWrapping;
  cachedDirtTexture.wrapT = T.RepeatWrapping;
  cachedDirtTexture.minFilter = T.LinearMipmapLinearFilter;
  cachedDirtTexture.magFilter = T.LinearFilter;
  cachedDirtTexture.generateMipmaps = true;
  cachedDirtTexture.needsUpdate = true;
  return cachedDirtTexture;
}

export default function VehicleScene({
  progress,
  mode = "detail",
  level = 35,
  reduced = false,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const settings = useRef({ level, reduced });
  const invalidate = useRef<() => void>(() => { });
  const settingsDirty = useRef(false);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    settings.current = { level, reduced };
    settingsDirty.current = true;
    invalidate.current();
  }, [level, reduced]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup = () => { };

    (async () => {
      try {
        if (!threeModulesPromise) return;
        const [T, , , { RoomEnvironment }] = await threeModulesPromise;
        if (disposed) return;

        // ── High-Performance WebGL Renderer ──────────────────────────────
        const renderer = new T.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        renderer.shadowMap.enabled = false;
        element.appendChild(renderer.domElement);
        renderer.domElement.setAttribute("aria-hidden", "true");

        // ── Scene & Camera ────────────────────────────────────────────────
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(28, 1, 0.1, 100);

        // ── HDR Environment (Pre-generated) ───────────────────────────────
        const pmrem = new T.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const environment = pmrem.fromScene(room, 0.04);
        room.dispose();
        pmrem.dispose();
        scene.environment = environment.texture;
        cleanup = () => {
          environment.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
        scene.environmentIntensity = 0.4;

        // ── Studio 3-Point Lighting ───────────────────────────────────────
        const hemi = new T.HemisphereLight(0xe8f0ff, 0x1c1712, 0.6);
        scene.add(hemi);

        const keyLight = new T.DirectionalLight(0xfff5e6, 1.2);
        keyLight.position.set(4, 8, 4);
        scene.add(keyLight);

        const fillLight = new T.DirectionalLight(0xa6c4ff, 0.4);
        fillLight.position.set(-6, 3, -3);
        scene.add(fillLight);

        const rimLight = new T.DirectionalLight(0xffeedd, 0.4);
        rimLight.position.set(0, 3, -8);
        scene.add(rimLight);

        const bounceLight = new T.PointLight(0xffecd0, 0.25, 15);
        bounceLight.position.set(0, -1, 0);
        scene.add(bounceLight);

        // ── Ground Contact Shadow Plane ───────────────────────────────────
        const shadowTex = getContactShadowTexture(T);
        if (shadowTex) {
          const shadowGeo = new T.PlaneGeometry(6.6, 3.8);
          const shadowMat = new T.MeshBasicMaterial({
            map: shadowTex,
            transparent: true,
            opacity: 0.78,
            depthWrite: false,
          });
          const shadowMesh = new T.Mesh(shadowGeo, shadowMat);
          shadowMesh.rotation.x = -Math.PI / 2;
          shadowMesh.position.set(0, 0.002, 0);
          scene.add(shadowMesh);
        }

        // ── Hardware-Accelerated Fast Dirt Shader ─────────────────────────
        const dirtTexture = getProceduralDirtTexture(T);
        const progUniform = { value: 0.0 };
        const rotUniform = { value: 0.0 };
        // Refined Porsche Guards / Carmine Red (rich, authentic, non-metallic lacquer)
        const cleanColorUni = { value: new T.Color(0xb21822) };

        // ── BODY PAINT Material (Starts as dusty, oxidized matte unwashed red) ──
        const bodyPaint = new T.MeshPhysicalMaterial({
          color: 0x381514, // dusty unwashed oxidized maroon-red
          metalness: 0.02,
          roughness: 0.96,
          clearcoat: 0.0,
          clearcoatRoughness: 1.0,
          envMapIntensity: 0.05,
        });

        bodyPaint.onBeforeCompile = (shader) => {
          shader.uniforms.uDirtTexture = { value: dirtTexture };
          shader.uniforms.uProgress = progUniform;
          shader.uniforms.uRot = rotUniform;
          shader.uniforms.uCleanPaint = cleanColorUni;

          shader.vertexShader =
            "varying vec3 vCarScenePos;\n" +
            shader.vertexShader.replace(
              "#include <begin_vertex>",
              "#include <begin_vertex>\nvCarScenePos = (modelMatrix * vec4(position, 1.0)).xyz;"
            );

          shader.fragmentShader =
            `uniform sampler2D uDirtTexture;
uniform float uProgress;
uniform float uRot;
uniform vec3  uCleanPaint;
varying vec3  vCarScenePos;
` +
            shader.fragmentShader.replace(
              "#include <color_fragment>",
              `#include <color_fragment>
{
  float cR = cos(uRot);
  float sR = sin(uRot);
  vec3 carLocal = vec3(
    cR * vCarScenePos.x - sR * vCarScenePos.z,
    vCarScenePos.y,
    sR * vCarScenePos.x + cR * vCarScenePos.z
  );

  // Start on the front bumper, not in empty space ahead of the car.
  float wipeZ = mix(2.8, -3.4, uProgress);
  float wipeEdge = wipeZ + carLocal.x * 0.32 - carLocal.y * 0.12;
  float isClean = uProgress <= 0.0 ? 0.0 : (uProgress >= 1.0 ? 1.0 : smoothstep(wipeEdge - 0.40, wipeEdge + 0.40, carLocal.z));

  vec4 dirt1 = texture2D(uDirtTexture, carLocal.xz * 1.6 + carLocal.y * 0.3);
  vec4 dirt2 = texture2D(uDirtTexture, carLocal.zy * 2.4 + carLocal.x * 0.5);

  float groundDist = clamp(carLocal.y - 0.06, 0.0, 1.4);
  float lowerZone  = smoothstep(0.70, 0.06, groundDist);

  float splat = (1.0 - (dirt1.r + dirt2.r) * 0.5);
  float upperDust = (0.50 + 0.50 * dirt1.g) * smoothstep(0.35, 1.2, carLocal.y);

  float dirtAmount = clamp(lowerZone * (0.35 + splat * 0.75) + upperDust * 0.55, 0.0, 1.0);
  float activeDirt = dirtAmount * (1.0 - isClean);

  vec3 darkMud    = vec3(0.18, 0.12, 0.07);
  vec3 dryDust    = vec3(0.42, 0.33, 0.22);
  vec3 mudColor   = mix(darkMud, dryDust, dirt2.g);
  // Unwashed oxidized dusty faded maroon red base:
  vec3 dustyBase  = vec3(0.25, 0.09, 0.08);

  vec3 dirtyPaint = mix(dustyBase, mudColor, activeDirt * 0.88);

  float edgeLine = smoothstep(0.32, 0.0, abs(carLocal.z - wipeEdge)) *
                   smoothstep(0.01, 0.07, uProgress) *
                   (1.0 - smoothstep(0.93, 0.99, uProgress));
  // Subtle golden detailing highlight along the transition
  vec3 edgeGlow = vec3(1.0, 0.85, 0.50) * 0.35;

  diffuseColor.rgb = mix(dirtyPaint, uCleanPaint, isClean) + edgeGlow * edgeLine;
}`
            );
        };

        const rimsMat = new T.MeshStandardMaterial({
          color: 0x282420,
          metalness: 0.15,
          roughness: 0.94,
          envMapIntensity: 0.1,
        });

        const tiresMat = new T.MeshStandardMaterial({
          color: 0x221f1c,
          metalness: 0.04,
          roughness: 0.98,
          envMapIntensity: 0.05,
        });

        const glassMat = new T.MeshPhysicalMaterial({
          color: 0x383430,
          metalness: 0.0,
          roughness: 0.45,
          transmission: 0,
          thickness: 0.4,
          ior: 1.52,
          transparent: true,
          opacity: 0.80,
          depthWrite: false,
          side: T.DoubleSide,
          envMapIntensity: 0.25,
        });

        const plasticMat = new T.MeshStandardMaterial({
          color: 0x151618,
          metalness: 0.2,
          roughness: 0.75,
          envMapIntensity: 0.4,
        });

        const interiorMat = new T.MeshStandardMaterial({
          color: 0x0e1012,
          metalness: 0.1,
          roughness: 0.85,
        });

        const lightsMat = new T.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0.1,
          roughness: 0.05,
          transmission: 0,
          transparent: true,
          opacity: 0.90,
          envMapIntensity: 2.0,
        });

        const vehicle: { model?: THREE.Object3D } = {};

        let currentTintLevel = settings.current.level;
        const renderFrame = (p: number) => {
          if (mode === "tint") {
            // Keep the side profile centered while bringing the glass closer.
            const shade = T.MathUtils.clamp(currentTintLevel, 35, 70);
            camera.zoom = shade <= 50
              ? T.MathUtils.mapLinear(shade, 35, 50, 1, 1.18)
              : T.MathUtils.mapLinear(shade, 50, 70, 1.18, 1.38);
            camera.updateProjectionMatrix();
          }
          if (vehicle.model) {
            const detail = detailAnimation(p);
            const rotY = detail.rotation;
            vehicle.model.rotation.y = mode === "detail" ? rotY : Math.PI * 0.30;

            rotUniform.value = mode === "detail" ? rotY : 0;
            // Cleaning starts as the nose faces the camera and follows the car as it turns.
            const cleanP = mode === "tint" ? 1 : detail.clean;

            progUniform.value = cleanP;

            const e = cleanP * cleanP * (3 - 2 * cleanP);

            if (mode === "detail") {
              // Non-metallic automotive lacquer: realistic smooth gloss without chrome glare
              bodyPaint.roughness = 0.96 - e * 0.66; // 0.96 → 0.30
              bodyPaint.metalness = 0.02 + e * 0.04; // 0.02 → 0.06 (dielectric resin coat)
              bodyPaint.clearcoat = e * 0.50;        // 0.00 → 0.50 (subtle factory clearcoat)
              bodyPaint.clearcoatRoughness = 1.0 - e * 0.78;  // 1.00 → 0.22 (gentle highlight diffusion)
              bodyPaint.envMapIntensity = 0.05 + e * 0.65; // 0.05 → 0.70 (natural studio reflections)

              rimsMat.roughness = 0.94 - e * 0.78;      // 0.94 → 0.16
              rimsMat.metalness = 0.15 + e * 0.75;      // 0.15 → 0.90
              rimsMat.envMapIntensity = 0.10 + e * 1.80;      // 0.10 → 1.90
              rimsMat.color.setRGB(
                0.16 + e * 0.78,
                0.14 + e * 0.81,
                0.12 + e * 0.85
              );

              tiresMat.roughness = 0.98 - e * 0.20;
              tiresMat.color.setRGB(
                0.14 - e * 0.07,
                0.12 - e * 0.05,
                0.11 - e * 0.04
              );

              glassMat.roughness = 0.45 - e * 0.40;     // 0.45 → 0.05
              glassMat.transmission = 0;     // 0.40 → 0.90
              glassMat.opacity = 0.80 + e * 0.15;
              glassMat.envMapIntensity = 0.25 + e * 1.50;
              glassMat.color.setRGB(
                0.22 - e * 0.19,
                0.20 - e * 0.15,
                0.18 - e * 0.10
              );

              // Soft, balanced studio lighting (eliminates harsh blown-out glare)
              scene.environmentIntensity = 0.35 + e * 0.45; // 0.35 → 0.80
              keyLight.intensity = 0.80 + e * 0.50; // 0.80 → 1.30
              fillLight.intensity = 0.25 + e * 0.20; // 0.25 → 0.45
              rimLight.intensity = 0.15 + e * 0.25; // 0.15 → 0.40
            } else {
              bodyPaint.roughness = 0.30;
              bodyPaint.metalness = 0.06;
              bodyPaint.clearcoat = 0.50;
              bodyPaint.clearcoatRoughness = 0.22;
              bodyPaint.envMapIntensity = 0.70;

              rimsMat.roughness = 0.16;
              rimsMat.metalness = 0.90;
              rimsMat.envMapIntensity = 1.9;
              rimsMat.color.setHex(0xe8ecf2);

              const tint = currentTintLevel / 100;
              // Higher tint percentage = darker glass (less light transmission)
              // 35% = subtle light tint, 50% = balanced medium tint, 70% = rich dark tint
              const lightFactor = 1.05 - tint;
              glassMat.opacity = 1 - lightFactor * 0.65;
              glassMat.color.setRGB(
                lightFactor * lightFactor * 0.55,
                lightFactor * lightFactor * 0.65,
                lightFactor * lightFactor * 0.75
              );
              glassMat.transmission = 0;
              glassMat.envMapIntensity = 0.35;
              glassMat.roughness = 0.05;

              scene.environmentIntensity = 0.80;
              keyLight.intensity = 1.30;
              fillLight.intensity = 0.45;
              rimLight.intensity = 0.40;
            }
          }

          renderer.render(scene, camera);
        };

        // ── Smooth Animation Loop ─────────────────────────────────────────
        let raf = 0;
        let isRunning = true;
        let isVisible = true;
        let currentP = settings.current.reduced ? 1 : progress.get();

        const requestRender = () => {
          if (isRunning && isVisible && !document.hidden) {
            if (!raf) {
              raf = requestAnimationFrame(animate);
            }
            // If a frame is already pending it will run shortly and pick
            // up the latest settings.current — no extra scheduling needed.
          }
        };
        let lastFrameTime = 0;
        const animate = (time: number) => {
          raf = 0;
          if (!isRunning || !isVisible || document.hidden) return;
          const targetP = settings.current.reduced ? 1 : progress.get();
          const delta = targetP - currentP;
          currentP = Math.abs(delta) > 0.0001 ? currentP + delta * 0.15 : targetP;
          const elapsed = Math.min((time - lastFrameTime) / 1000, 0.064);
          lastFrameTime = time;
          const targetTint = settings.current.level;
          if (mode === "tint") {
            // Frame-rate independent easing also reverses smoothly on rapid clicks.
            currentTintLevel = settings.current.reduced
              ? targetTint
              : T.MathUtils.damp(currentTintLevel, targetTint, 8, elapsed);
            if (Math.abs(targetTint - currentTintLevel) < 0.01) currentTintLevel = targetTint;
          }
          // Snapshot and clear the dirty flag before rendering so that any
          // settings change that arrives mid-render is not lost.
          const wasDirty = settingsDirty.current;
          settingsDirty.current = false;
          renderFrame(currentP);
          if (mode === "detail" && currentP !== targetP) requestRender();
          // Stop rendering once the shade and camera finish settling.
          else if (mode === "tint" && (wasDirty || currentTintLevel !== targetTint)) requestRender();
        };
        invalidate.current = requestRender;
        // Clear the dirty flag now that the scene is ready; any changes that
        // arrived before this point are captured in settings.current and will
        // be rendered by the initial renderFrame call below.
        settingsDirty.current = false;
        const unsubscribe = progress.on("change", () => {
          if (mode === "detail") requestRender();
        });

        const resize = () => {
          const w = element.clientWidth;
          const h = element.clientHeight;
          if (!w || !h) return;

          renderer.setSize(w, h);
          camera.aspect = w / h;

          const isNarrow = w / h < 1.35;
          const dist = isNarrow ? 8.2 : 6.4;
          camera.fov = 28;

          if (mode === "detail") {
            camera.position.set(dist * 0.68, dist * 0.30, dist * 0.68);
            camera.lookAt(0, 0.60, 0);
          } else {
            // Leave enough horizontal room for the 70% close-up on phones.
            const tintDistance = Math.max(camera.aspect < 1.6 ? 12 : 10.5, 8.5 / camera.aspect);
            camera.position.set(tintDistance, tintDistance * 0.24, 0);
            camera.lookAt(0, 0.60, 0);
          }
          camera.updateProjectionMatrix();
          renderFrame(currentP);
        };

        const resizeObs = new ResizeObserver(resize);
        resizeObs.observe(element);

        const visObs = new IntersectionObserver(
          ([e]) => {
            isVisible = e.isIntersecting;
            if (isVisible) requestRender();
            else { cancelAnimationFrame(raf); raf = 0; }
          },
          { rootMargin: "300px" }
        );
        visObs.observe(element);

        const onVis = () => {
          if (!document.hidden) requestRender();
          else { cancelAnimationFrame(raf); raf = 0; }
        };
        document.addEventListener("visibilitychange", onVis);

        cleanup = () => {
          isRunning = false;
          unsubscribe();
          invalidate.current = () => { };
          environment.dispose();
          cancelAnimationFrame(raf);
          resizeObs.disconnect();
          visObs.disconnect();
          document.removeEventListener("visibilitychange", onVis);

          scene.traverse((o: THREE.Object3D) => {
            if (o instanceof T.Mesh && o.parent === scene && o !== vehicle.model) {
              o.geometry.dispose();
              (Array.isArray(o.material) ? o.material : [o.material]).forEach(
                (m: THREE.Material) => m.dispose()
              );
            }
          });
          [
            bodyPaint,
            rimsMat,
            tiresMat,
            glassMat,
            plasticMat,
            interiorMat,
            lightsMat,
          ].forEach((r) => r?.dispose());
          renderer.dispose();
          renderer.domElement.remove();
        };

        resize();

        // ── Instant Load via Shared Model Cache ───────────────────────────
        const sharedModel = await getSharedCarModel();

        if (disposed) return;
        if (!sharedModel) {
          cleanup();
          setStatus("fallback");
          return;
        }

        vehicle.model = sharedModel;

        // ── Apply materials & filter out unwanted helper nodes ────────────
        vehicle.model.traverse((o: THREE.Object3D) => {
          if (!(o instanceof T.Mesh)) return;

          const meshName = (o.name ?? "").toLowerCase();

          if (
            meshName.includes("gp_layer") ||
            meshName.includes("clouds") ||
            meshName.includes("plane.004") ||
            meshName.includes("plane_0")
          ) {
            o.visible = false;
            return;
          }

          const original = Array.isArray(o.material) ? o.material : [o.material];

          const mapped = original.map((orig) => {
            const matName = ((orig as THREE.Material).name ?? "").toLowerCase();

            if (matName.includes("glass") && meshName.includes("bumper")) {
              return lightsMat;
            }
            if (
              matName.includes("paint") ||
              matName.includes("carroceria") ||
              matName.includes("body") ||
              matName.includes("coat") ||
              meshName.includes("paint")
            ) {
              return bodyPaint;
            } else if (
              matName.includes("silver") ||
              matName.includes("rim") ||
              matName.includes("chrome") ||
              matName.includes("ruedas")
            ) {
              return rimsMat;
            } else if (
              matName.includes("rubber") ||
              matName.includes("tire") ||
              matName.includes("tyre")
            ) {
              return tiresMat;
            } else if (
              matName.includes("window") ||
              matName.includes("glass") ||
              matName.includes("cristales")
            ) {
              return glassMat;
            } else if (matName.includes("light") || matName.includes("led")) {
              return lightsMat;
            } else if (
              matName.includes("plastic") ||
              matName.includes("chasis") ||
              matName.includes("trim")
            ) {
              return plasticMat;
            } else if (
              matName.includes("black") ||
              matName.includes("interior") ||
              matName.includes("carpet")
            ) {
              return interiorMat;
            } else if (matName.includes("shadow")) {
              o.visible = false;
            } else {
              return plasticMat;
            }
            return plasticMat;
          });
          o.material = Array.isArray(o.material) ? mapped : mapped[0];
        });

        // ── Auto-Scale and Center Strictly Over Visible Car Meshes ─────────
        const carBox = new T.Box3();
        vehicle.model.traverse((o: THREE.Object3D) => {
          if (o instanceof T.Mesh && o.visible) {
            carBox.expandByObject(o);
          }
        });
        if (carBox.isEmpty()) carBox.setFromObject(vehicle.model);

        const carSize = carBox.getSize(new T.Vector3());
        const maxDim = Math.max(carSize.x, carSize.y, carSize.z);

        const targetDim = 6.0;
        const scale = targetDim / maxDim;
        vehicle.model.scale.setScalar(scale);

        const finalBox = new T.Box3();
        vehicle.model.traverse((o: THREE.Object3D) => {
          if (o instanceof T.Mesh && o.visible) {
            finalBox.expandByObject(o);
          }
        });
        if (finalBox.isEmpty()) finalBox.setFromObject(vehicle.model);

        const center = finalBox.getCenter(new T.Vector3());
        vehicle.model.position.x -= center.x;
        vehicle.model.position.z -= center.z;
        vehicle.model.position.y -= finalBox.min.y;

        scene.add(vehicle.model);
        setStatus("ready");

        renderFrame(currentP);
      } catch (err) {
        console.warn("Vehicle preview unavailable:", err);
        cleanup();
        if (!disposed) setStatus("fallback");
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [mode, progress]);

  return (
    <div
      className="vehicle-render"
      ref={host}
      data-status={status}
      role="img"
      aria-label={
        mode === "detail"
          ? "Interactive 3D car: scroll to rotate from road-contaminated mud to ceramic mirror finish"
          : `Window tint preview at ${level}% visible light transmission`
      }
    >
      {status !== "ready" && (
        <div className="vehicle-fallback">
          <Image
            src="/images/hero.jpg"
            fill
            sizes="90vw"
            alt="Glossy sports car"
            title="Detail Clinic — Glossy paint finish"
          />
          <span>{status === "fallback" ? "3D PREVIEW UNAVAILABLE" : "LOADING 3D CAR…"}</span>
        </div>
      )}
    </div>
  );
}
