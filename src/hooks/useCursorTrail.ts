import { useRef } from 'react';
import { gsap } from 'gsap';

export interface UseCursorTrailOptions {
    images: string[];
    isTouchDevice?: boolean;
    throttleMs?: number;
    enterDuration?: number;
    exitDuration?: number;
    pauseDelay?: string | number;
    mouseLeaveDuration?: number;
}

/**
 * Calculates the target image index based on the cursor's horizontal position across the section.
 * Evenly maps the cursor X coordinate to the available image array size.
 *
 * @param cursorX - Cursor X coordinate relative to section container
 * @param containerWidth - Total width of the container
 * @param totalImages - Total count of images in the array
 * @returns Target image array index bounded within [0, totalImages - 1]
 */
export const getImageIndex = (
    cursorX: number,
    containerWidth: number,
    totalImages: number
): number => {
    if (containerWidth <= 0 || totalImages <= 0) return 0;
    const normalizedX = Math.max(0, Math.min(cursorX / containerWidth, 0.9999));
    return Math.floor(normalizedX * totalImages);
};

export const useCursorTrail = <
    SectionType extends HTMLElement = HTMLElement,
    TrailContainerType extends HTMLDivElement = HTMLDivElement
>({
    images,
    isTouchDevice = false,
    throttleMs = 50,
    enterDuration = 0.35,
    exitDuration = 0.6,
    pauseDelay = '>0.35',
    mouseLeaveDuration = 0.3,
}: UseCursorTrailOptions) => {
    const sectionRef = useRef<SectionType | null>(null);
    const trailContainerRef = useRef<TrailContainerType | null>(null);
    const lastTimeRef = useRef<number>(0);

    /** Creates an HTML image element configured for Layer 30 floating cursor trail */
    const createTrailImage = (x: number, y: number, imageSrc: string): HTMLImageElement => {
        const trailImage = document.createElement('img');
        trailImage.src = imageSrc;
        trailImage.alt = 'Trail';
        trailImage.className =
            'absolute w-24 h-32 object-cover rounded-lg shadow-2xl border border-gray-200/50 dark:border-zinc-700/70 pointer-events-none select-none';
        trailImage.style.left = `${x}px`;
        trailImage.style.top = `${y}px`;
        trailImage.style.transform = 'translate(-50%, -50%) scale(0.5)';
        trailImage.style.opacity = '0';
        trailImage.style.zIndex = '30'; // Layer 30: Renders above Layer 20 Content
        return trailImage;
    };

    /** Triggers GSAP sequence for an individual trail image */
    const animateTrailImage = (trailImage: HTMLImageElement): void => {
        gsap.timeline({ onComplete: () => trailImage.remove() })
            .to(trailImage, {
                opacity: 0.88, // Editorial opacity ensuring content text underneath remains legible
                scale: 1,
                rotation: gsap.utils.random(-20, 20),
                x: gsap.utils.random(-15, 15),
                y: gsap.utils.random(-15, 15),
                duration: enterDuration,
                ease: 'back.out(1.7)',
            })
            .to(
                trailImage,
                {
                    opacity: 0,
                    scale: 0.75,
                    y: '+=40',
                    rotation: '+=10',
                    duration: exitDuration,
                    ease: 'power2.in',
                },
                pauseDelay
            );
    };

    /** Handles mouse movement across section to append trail images */
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isTouchDevice) return;

        const currentTime = Date.now();
        if (currentTime - lastTimeRef.current < throttleMs) return;
        lastTimeRef.current = currentTime;

        if (!sectionRef.current || !trailContainerRef.current) return;

        const sectionBounds = sectionRef.current.getBoundingClientRect();
        const cursorX = e.clientX - sectionBounds.left;
        const cursorY = e.clientY - sectionBounds.top;

        // Position-based image selection
        const imageIndex = getImageIndex(cursorX, sectionBounds.width, images.length);
        const trailImage = createTrailImage(cursorX, cursorY, images[imageIndex]);

        trailContainerRef.current.appendChild(trailImage);
        animateTrailImage(trailImage);
    };

    /** Clears remaining active trail images on mouse leave */
    const handleMouseLeave = () => {
        if (!trailContainerRef.current) return;

        gsap.to(trailContainerRef.current.children, {
            opacity: 0,
            scale: 0.5,
            duration: mouseLeaveDuration,
            ease: 'power2.in',
            onComplete: () => {
                if (trailContainerRef.current) {
                    trailContainerRef.current.innerHTML = '';
                }
            },
        });
    };

    return {
        sectionRef,
        trailContainerRef,
        handleMouseMove,
        handleMouseLeave,
    };
};
