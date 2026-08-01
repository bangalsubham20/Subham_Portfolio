import React, { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";
import { useTheme } from "../context/ThemeContext";

const vertex = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 uResolution;
uniform float uTime;
void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec3 col = 0.5 + 0.5 * cos(uTime + uv.xyx + vec3(0.0, 2.0, 4.0));
    gl_FragColor = vec4(col * 0.1, 1.0); // Subtle dark background animation
}
`;

interface DarkVeilProps {
    opacity?: number;
}

export default function DarkVeil({ opacity = 0.4 }: DarkVeilProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { isDark } = useTheme();

    useEffect(() => {
        if (!isDark) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Check WebGL capability before proceeding
        const glTest = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!glTest) {
            console.warn("WebGL not supported; disabling DarkVeil shader.");
            return;
        }

        let renderer: Renderer | null = null;
        let animationFrameId: number;
        let isLooping = true;

        try {
            renderer = new Renderer({
                dpr: Math.min(window.devicePixelRatio, 2),
                canvas,
                alpha: true,
            });
        } catch (err) {
            console.error("WebGL context creation failed for DarkVeil:", err);
            return;
        }

        if (!renderer || !renderer.gl) return;

        const gl = renderer.gl;
        let geometry: Triangle | null = new Triangle(gl);
        let program: Program | null = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vec2() },
            },
        });
        let mesh: Mesh | null = new Mesh(gl, { geometry, program });

        // Update resolution using canvas layout dimensions
        const updateSize = () => {
            if (!canvas || !renderer || !program) return;
            const width = canvas.clientWidth || window.innerWidth;
            const height = canvas.clientHeight || window.innerHeight;
            renderer.setSize(width, height);
            program.uniforms.uResolution.value.set(width, height);
        };

        // ResizeObserver for canvas dimensions
        const resizeObserver = new ResizeObserver(() => {
            updateSize();
        });
        resizeObserver.observe(canvas);
        updateSize();

        // Animation loop with visibility pause protection
        const loop = (time: number) => {
            if (!isLooping || !renderer || !program || !mesh) return;
            if (!document.hidden) {
                program.uniforms.uTime.value = time * 0.001;
                renderer.render({ scene: mesh });
            }
            animationFrameId = requestAnimationFrame(loop);
        };
        animationFrameId = requestAnimationFrame(loop);

        // Pause animation when tab is inactive
        const handleVisibilityChange = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animationFrameId = requestAnimationFrame(loop);
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Context loss handling
        const handleContextLost = (e: Event) => {
            e.preventDefault();
            cancelAnimationFrame(animationFrameId);
            isLooping = false;
        };
        canvas.addEventListener("webglcontextlost", handleContextLost);

        // Cleanup on unmount
        return () => {
            isLooping = false;
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            canvas.removeEventListener("webglcontextlost", handleContextLost);
            resizeObserver.disconnect();

            // Destroy WebGL geometries, programs & lose context
            try {
                if (geometry) geometry.remove();
                if (program) program.remove();
                mesh = null;
                geometry = null;
                program = null;

                const loseContext = gl.getExtension("WEBGL_lose_context");
                if (loseContext) {
                    loseContext.loseContext();
                }
            } catch (cleanupErr) {
                console.warn("Error during WebGL cleanup:", cleanupErr);
            }
        };
    }, [isDark]);

    if (!isDark) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{ opacity }}
            className="fixed inset-0 z-0 w-full h-full pointer-events-none mix-blend-screen"
        />
    );
}
