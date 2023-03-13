import { useRef, useState } from "react";

function ScrollableDiv({children}) {
    const containerRef = useRef(null)
    const [isDragging, setItDragging] = useState(false)
    const [lastX, setLastX] = useState(0)
    const [currentX, setCurrentX] = useState(0)
    return ( 
        <div></div>
    );
}

export default ScrollableDiv;