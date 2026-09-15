"use client";

import { useEffect, useRef, useState } from "react";

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Cheap monochrome flow-noise field: a handful of animated sine layers
// plus a hash-based grain term. No textures, no dependencies — just enough
// motion to keep the hero from feeling static without fighting the type.
const FRAG = `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * vec2(uResolution.x / uResolution.y, 1.0);

  float t = uTime * 0.06;
  float flow = 0.0;
  flow += sin((p.x * 2.2 + p.y * 1.3 + t) * 3.0) * 0.5;
  flow += sin((p.x * 1.1 - p.y * 2.4 - t * 1.4) * 4.0) * 0.35;
  flow += sin((p.x * 3.0 + p.y * 0.6 + t * 0.8) * 2.0) * 0.25;
  flow = flow * 0.16;

  float grain = hash(floor(gl_FragCoord.xy) + floor(uTime * 24.0)) * 0.035;

  float vignette = smoothstep(1.05, 0.15, distance(uv, vec2(0.5)));
  float base = 0.035 + flow * vignette + grain;

  vec3 color = vec3(clamp(base, 0.0, 0.16));
  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      setSupported(false);
      return;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERT);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vertShader || !fragShader) {
      setSupported(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setSupported(false);
      return;
    }
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setSupported(false);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");

    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      gl.uniform1f(uTime, time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !prefersReduced) raf = requestAnimationFrame(draw);
    };

    if (prefersReduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !prefersReduced && !raf) {
          raf = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && !prefersReduced && !raf) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="tex-placeholder-dark absolute inset-0" aria-hidden="true">
      {supported && (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
