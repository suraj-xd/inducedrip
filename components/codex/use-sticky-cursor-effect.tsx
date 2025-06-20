import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { useMotionValue, useSpring, animate, transform } from "framer-motion";

export function useStickyCursorEffect(stickyElement: MutableRefObject<any>) {
    const [isHovered, setIsHovered] = useState(false);
    const [isWatchText, setIsWatchText] = useState(false);
    const cursorRef = useRef(null);
    const cursorTextRef = useRef(null);
    const cursorSize = isHovered ? 60 : 15;

    const mouse = {
        x: useMotionValue(0),
        y: useMotionValue(0),
    };

    const smallMouse = {
        x: useMotionValue(0),
        y: useMotionValue(0),
    };

    const scale = {
        x: useMotionValue(1),
        y: useMotionValue(1),
    };

    // Smooth out the mouse values
    const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
    const smoothMouse = {
        x: useSpring(mouse.x, smoothOptions),
        y: useSpring(mouse.y, smoothOptions),
    };

    const rotate = (distance: { x: number; y: number }) => {
        const angle = Math.atan2(distance.y, distance.x);
        void animate(cursorRef.current, { rotate: `${angle}rad` }, { duration: 0 });
    };

    const manageMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const rect = stickyElement.current?.getBoundingClientRect();

        if (rect) {
            const { left, top, height, width } = rect;
            //center position of the stickyElement
            const center = { x: left + width / 2, y: top + height / 2 };

            // sticky menu
            if (isHovered) {
                //distance between the mouse pointer and the center of the custom cursor and
                const distance = {
                    x: clientX - center.x,
                    y: clientY - center.y,
                };
                //rotate
                rotate(distance);
                //stretch based on the distance
                const absDistance = Math.max(Math.abs(distance.x), Math.abs(distance.y));

                const newScaleX = transform(absDistance, [0, height / 2], [1, 1.3]);
                const newScaleY = transform(absDistance, [0, width / 2], [1, 0.8]);
                scale.x.set(newScaleX);
                scale.y.set(newScaleY);

                //move mouse to center of stickyElement + slightly move it towards the mouse pointer
                mouse.x.set(center.x - cursorSize / 2 + distance.x * 0.1);
                mouse.y.set(center.y - cursorSize / 2 + distance.y * 0.1);

                // smallMouse.x.set(center.x - 8 / 2 + distance.x * 0.1);
                // smallMouse.y.set(center.y - 8 / 2 + distance.y * 0.1);
            } else {
                //move custom cursorRef to center of stickyElement
                mouse.x.set(clientX - cursorSize / 2);
                mouse.y.set(clientY - cursorSize / 2);

                // // coz w-2 is used at line 47 in stickyCursor
                // smallMouse.x.set(clientX - 8 / 2);
                // smallMouse.y.set(clientY - 8 / 2);
            }

            // coz w-2 is used at line 47 in stickyCursor
            smallMouse.x.set(clientX - 8 / 2);
            smallMouse.y.set(clientY - 8 / 2);
        }
    };

    const manageMouseOver = () => {
        setIsHovered(true);
    };

    const manageMouseLeave = () => {
        setIsHovered(false);
        void animate(cursorRef.current, { scaleX: 1, scaleY: 1 }, { type: "spring" });
    };

    const onMouseEnterLink = (event: MouseEvent) => {
        const cursor = cursorRef.current as HTMLElement | null;
        const cursorText = cursorTextRef.current as HTMLElement | null;
        if (!cursor || !cursorText) return;

        const link = event.target as HTMLElement; // Use HTMLElement for more flexibility

        const effect = link.dataset.effect;

        // Check if the link has the class "view" and is an anchor element
        if (effect === "view" || effect === "watch") {
            void animate(cursor, { scaleX: 4, scaleY: 4, rotate: 0 }, { duration: 0.2 });

            if(effect === "watch") setIsWatchText(true);
            else setIsWatchText(false);

            cursorText.style.display = "block";
            cursor.style.mixBlendMode = "normal";
        } else if (effect === "expand") {
            void animate(cursor, { scaleX: 10, scaleY: 10, rotate: 0 }, { duration: 0.2 });

            cursor.style.mixBlendMode = "difference";
        } else if (effect === "nav_item") {
            void animate(cursor, { scaleX: 4, scaleY: 4, rotate: 0 }, { duration: 0.2 });

            cursor.style.mixBlendMode = "difference";
        } else if (effect === "button") {
            void animate(cursor, { scaleX: 2, scaleY: 2, rotate: 0 }, { duration: 0.2 });

            cursor.style.mixBlendMode = "difference";
        } else {
            void animate(cursor, { scaleX: 1, scaleY: 1, rotate: 0 }, { duration: 0.2 });

            cursor.style.mixBlendMode = "difference";
        }
    };

    const onLinkMouseLeaveLink = () => {
        const cursor = cursorRef.current as HTMLElement | null;
        const cursorText = cursorTextRef.current as HTMLElement | null;
        if (!cursor || !cursorText) return;

        void animate(cursor, { scaleX: 1, scaleY: 1 }, { duration: 0.2 });

        cursor.style.mixBlendMode = "difference";
        cursorText.style.display = "none";
    };

    useEffect(() => {
        const links = document.querySelectorAll("button, a, span, div,img");

        if (links) {
            links.forEach((link) => {
                link.addEventListener("mouseenter", onMouseEnterLink as EventListener);
                link.addEventListener("mouseleave", onLinkMouseLeaveLink);
            });
        }

        const stickyRef = stickyElement.current;
        stickyRef?.addEventListener("mouseenter", manageMouseOver);
        stickyRef?.addEventListener("mouseleave", manageMouseLeave);
        window.addEventListener("mousemove", manageMouseMove);

        return () => {
            if (links) {
                links.forEach((link) => {
                    link.removeEventListener("mouseenter", onMouseEnterLink as EventListener);
                    link.removeEventListener("mouseleave", onLinkMouseLeaveLink);
                });
            }

            stickyRef?.removeEventListener("mouseenter", manageMouseOver);
            stickyRef?.removeEventListener("mouseleave", manageMouseLeave);
            window.removeEventListener("mousemove", manageMouseMove);

            // Clean up scale and smoothMouse
            scale.x.set(1);
            scale.y.set(1);
            smoothMouse.x.stop();
            smoothMouse.y.stop();
        };
    }, [isHovered]);

    const template = ({rotate, scaleX, scaleY}: { rotate: string; scaleX: number; scaleY: number; }) => {
        return `rotate(${rotate}) scaleX(${scaleX}) scaleY(${scaleY})`;
    };

    return {
        scale,
        cursorRef,
        smallMouse,
        cursorTextRef,
        cursorSize,
        smoothMouse,
        template,
        isWatchText,
    };
}
