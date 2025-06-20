import { useRef } from "react";


import StickyCursor from "./sticky-cursor";

const AnimatedScreen: React.FC = (): React.ReactNode => {
        const stickyElement = useRef<any>(null);

    return (
        <>
            <StickyCursor stickyElement={stickyElement} />
        </>
    );
};

export default AnimatedScreen;
