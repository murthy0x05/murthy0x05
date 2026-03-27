import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── GLSL Liquid Shader ───
const vertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  varying vec2 vUv;
  varying float vDisplacement;

  // Simplex-ish noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    float noise = snoise(position * 1.5 + uTime * 0.4);
    float displacement = noise * (0.08 + uAmplitude * 0.25);
    vDisplacement = displacement;
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uAmplitude;
  varying vec2 vUv;
  varying float vDisplacement;

  void main() {
    vec3 colorA = vec3(0.23, 0.51, 0.96); // blue
    vec3 colorB = vec3(0.58, 0.34, 0.92); // purple
    vec3 colorC = vec3(0.28, 0.87, 0.52); // green

    float t = vUv.y + sin(vUv.x * 3.14159 + uTime * 0.5) * 0.2;
    vec3 color = mix(colorA, colorB, smoothstep(0.0, 0.5, t));
    color = mix(color, colorC, smoothstep(0.5, 1.0, t + vDisplacement));

    // Glow boost based on amplitude
    float glow = 0.8 + uAmplitude * 0.4;
    color *= glow;

    // Fresnel-like edge glow
    float edge = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0);
    color += vec3(0.1, 0.05, 0.15) * edge * (1.0 + uAmplitude);

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface LiquidSphereProps {
  amplitudeRef: React.MutableRefObject<number>;
  state: string;
}

function LiquidSphere({ amplitudeRef, state }: LiquidSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0 },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    uniforms.uTime.value += delta;

    let targetAmp = 0;
    if (state === "speaking") {
      targetAmp = amplitudeRef.current;
    } else if (state === "listening") {
      targetAmp = 0.4 + Math.sin(uniforms.uTime.value * 4) * 0.15;
    } else if (state === "processing") {
      targetAmp = 0.25 + Math.sin(uniforms.uTime.value * 6) * 0.1;
    } else if (state === "interrupted") {
      targetAmp = 0.1;
    } else {
      targetAmp = 0.05 + Math.sin(uniforms.uTime.value * 1.5) * 0.03;
    }

    uniforms.uAmplitude.value += (targetAmp - uniforms.uAmplitude.value) * 0.1;

    if (meshRef.current) {
      const baseScale = state === "interrupted" ? 0.85 : 1;
      const s = baseScale + uniforms.uAmplitude.value * 0.2;
      meshRef.current.scale.setScalar(s);
      if (state === "processing") {
        meshRef.current.rotation.y += delta * 0.5;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

interface LiquidOrbProps {
  amplitudeRef: React.MutableRefObject<number>;
  state: string;
  onClick: () => void;
  size?: number;
}

export default function LiquidOrb({ amplitudeRef, state, onClick, size = 128 }: LiquidOrbProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return <FallbackOrb state={state} onClick={onClick} size={size} />;
  }

  const scale = 1.6; // canvas is 1.6× the orb size to avoid clipping
  const canvasSize = size * scale;
  const outer = canvasSize + 48;
  // Pull camera back so the sphere stays the same visual size on the larger canvas
  const cameraZ = 2.8 * scale;

  return (
    <button
      onClick={onClick}
      className="relative cursor-pointer focus:outline-none overflow-visible"
      style={{ width: outer, height: outer }}
      aria-label={
        state === "idle" ? "Click to start talking" : state === "listening" ? "Listening..." : "AI is responding"
      }
    >
      {/* Glow behind */}
      <div
        className="absolute rounded-full blur-3xl opacity-40"
        style={{
          inset: -24,
          background: "radial-gradient(circle, rgba(88,130,246,0.5), rgba(147,86,230,0.3), rgba(72,222,130,0.2))",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        style={{
          width: canvasSize,
          height: canvasSize,
          position: "absolute",
          top: (outer - canvasSize) / 2,
          left: (outer - canvasSize) / 2,
        }}
        gl={{ alpha: true, antialias: true }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={0.8} />
        <LiquidSphere amplitudeRef={amplitudeRef} state={state} />
      </Canvas>

      {/* State label */}
      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-white/40 whitespace-nowrap">
        {state === "idle" && "Tap to talk"}
        {state === "listening" && "Listening..."}
        {state === "processing" && "Thinking..."}
        {state === "speaking" && "Speaking..."}
        {state === "interrupted" && "Interrupted"}
      </span>
    </button>
  );
}

/** CSS-only fallback when WebGL is not available */
function FallbackOrb({ state, onClick, size }: { state: string; onClick: () => void; size: number }) {
  const pulseClass =
    state === "speaking"
      ? "animate-pulse"
      : state === "listening"
        ? "animate-[pulse_0.8s_ease-in-out_infinite]"
        : "animate-[pulse_3s_ease-in-out_infinite]";

  return (
    <button
      onClick={onClick}
      className={`relative rounded-full cursor-pointer focus:outline-none ${pulseClass}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-green-400/40 blur-2xl" />
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-green-400 shadow-[0_0_60px_rgba(59,130,246,0.5)] flex items-center justify-center">
        <div className="w-1/3 h-1/3 rounded-full bg-white/15 backdrop-blur-sm" />
      </div>
    </button>
  );
}
