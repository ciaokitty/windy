import React, { useRef, useEffect } from 'react';

function Pinwheel({ speed, direction }) {
    const wheelRef = useRef(null);
    const rotation = useRef(0);
    const animationFrame = useRef();

    // Speed factor: arbitrary scaling
    const ROTATION_FACTOR = 0.5;

    useEffect(() => {
        const animate = () => {
            if (speed > 0) {
                rotation.current += speed * ROTATION_FACTOR;
                if (rotation.current >= 360) rotation.current -= 360;
            }

            if (wheelRef.current) {
                wheelRef.current.style.transform = `rotate(${rotation.current}deg)`;
            }

            animationFrame.current = requestAnimationFrame(animate);
        };

        animationFrame.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame.current);
    }, [speed]);

    // Crayon colors for the 7 blades (Rainbow-ish)
    const colors = [
        "#ef4444", // Red
        "#f97316", // Orange
        "#eab308", // Yellow
        "#84cc16", // Lime
        "#3b82f6", // Blue
        "#a855f7", // Purple
        "#db2777"  // Pink
    ];

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            <svg width="400" height="600" viewBox="0 0 400 600" style={{ overflow: 'visible' }}>
                <defs>
                    {/* Crayon Texture Filter */}
                    <filter id="crayon">
                        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                    </filter>

                    {/* Rough Outline Filter */}
                    <filter id="outline">
                        <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="dilated" />
                        <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="noise" />
                        <feDisplacementMap in="dilated" in2="noise" scale="2" result="displacedOutline" />
                        <feComposite in="SourceGraphic" in2="displacedOutline" operator="over" />
                    </filter>
                </defs>

                {/* Stick - Hand drawn look */}
                <path
                    d="M195 200 Q 190 400 205 600"
                    stroke="#5d4037"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#crayon)"
                />

                {/* Spinning Head */}
                <g ref={wheelRef} style={{ transformOrigin: '200px 200px' }}>
                    {/* Blades */}
                    {colors.map((color, i) => {
                        const angle = (360 / colors.length) * i;
                        return (
                            <g key={i} transform={`rotate(${angle} 200 200)`}>
                                {/* Hand-drawn blade shape using path */}
                                <path
                                    d="M200 200 Q 240 100 280 120 Q 290 190 200 200"
                                    fill={color}
                                    stroke="rgba(0,0,0,0.3)"
                                    strokeWidth="2"
                                    filter="url(#crayon)"
                                />
                            </g>
                        );
                    })}

                    {/* Center Pin */}
                    <circle cx="200" cy="200" r="12" fill="#333" filter="url(#crayon)" />
                    <circle cx="200" cy="200" r="4" fill="#666" filter="url(#crayon)" />
                </g>
            </svg>

            {/* Hand-drawn HUD */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                textAlign: 'center',
                fontFamily: '"Patrick Hand", cursive',
                color: '#2c2c2c',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(2px)',
                padding: '10px 20px',
                borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px', // Irregular border radius
                border: '2px solid #2c2c2c',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{speed.toFixed(1)} <span style={{ fontSize: '1.2rem' }}>km/h</span></div>
                <div style={{ fontSize: '1.2rem' }}>Direction: {direction}°</div>
            </div>
        </div>
    );
}

export default Pinwheel;
