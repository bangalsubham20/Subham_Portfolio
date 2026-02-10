import React, { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";
import { useTheme } from "../context/ThemeContext";

const vertex = `
attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`;

const fragment = `
#ifdef GL_ES
precision lowp float;
#endif
uniform vec2 uResolution;
uniform float uTime;
void main(){
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec3 col = 0.5 + 0.5 * cos(uTime + uv.xyx + vec3(0,2,4));
    gl_FragColor = vec4(col * 0.1, 1.0); // Very subtle dark background
}
`;

export default function DarkVeil() {
    const ref = useRef<HTMLCanvasElement | null>(null);
    const { isDark } = useTheme();

    useEffect(() => {
        if (!isDark) return;

        const canvas = ref.current;
        if (!canvas) return;

        const renderer = new Renderer({
            dpr: Math.min(window.devicePixelRatio, 2),
            canvas,
            alpha: true,
        });

        const gl = renderer.gl;
        const geometry = new Triangle(gl);

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vec2() },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        const resize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            program.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", resize);
        resize();

        let frame: number;
        const loop = (t: number) => {
            frame = requestAnimationFrame(loop);
            program.uniforms.uTime.value = t * 0.001;
            renderer.render({ scene: mesh });
        };
        frame = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
            // Clean up WebGL context logic if needed
        };
    }, [isDark]);

    if (!isDark) return null;

    return (
        <canvas
            ref={ref}
            className="fixed inset-0 z-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
        />
    );
}
