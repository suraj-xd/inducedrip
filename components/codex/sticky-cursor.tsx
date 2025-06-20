import { motion } from "framer-motion";
import { type MutableRefObject } from "react";

import { useStickyCursorEffect } from "./use-sticky-cursor-effect";

type StickyCursorEffectType = {
    stickyElement: MutableRefObject<any>;
}
const StickyCursor = ({stickyElement}: StickyCursorEffectType) => {
    const {
        cursorRef,
        cursorSize,
        cursorTextRef,
        smoothMouse,
        scale,
        smallMouse,
        template,
        isWatchText,
    } = useStickyCursorEffect(stickyElement);

    return (
        <div className={`pointer-events-none hidden md:block`}>
            <motion.div
                transformTemplate={template}
                style={{
                    left: smoothMouse.x,
                    top: smoothMouse.y,
                    scaleX: scale.x,
                    scaleY: scale.y,
                }}
                animate={{
                    width: cursorSize,
                    height: cursorSize,
                }}
                className={`fixed w-[15px] aspect-square bg-white rounded-full  z-[6] mix-blend-difference grid place-items-center`}
                ref={cursorRef}
            >
                <span
                    className={`hidden text-[4px] font-bold tracking-wide text-black `}
                    ref={cursorTextRef}
                >
                    {isWatchText ? "watch" : "view"}
                </span>
            </motion.div>

            <motion.div
                className="fixed w-2 aspect-square bg-white mix-blend-difference rounded-full   z-[6] "
                style={{
                    left: smallMouse.x,
                    top: smallMouse.y,
                }}
            />
        </div>
    );
};

export default StickyCursor;
