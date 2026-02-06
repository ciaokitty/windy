import React from 'react';
import { format } from 'date-fns';

function TimeControls({ date, setDate }) {

    const handleDateChange = (e) => {
        if (!e.target.value) return;
        const newDate = new Date(e.target.value);
        // Keep consistent noon time
        newDate.setHours(12, 0, 0, 0);
        setDate(newDate);
    };

    const handleYearChange = (delta) => {
        const newDate = new Date(date);
        newDate.setFullYear(date.getFullYear() + delta);
        setDate(newDate);
    };

    const btnStyle = {
        background: 'transparent',
        border: '3px solid #333',
        color: '#333',
        padding: '6px 14px',
        borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
        cursor: 'pointer',
        fontFamily: '"Patrick Hand", cursive',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        transition: 'transform 0.1s',
    };

    const isFuture = date > new Date();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>

            {/* Hand-drawn Label */}
            <div style={{ textAlign: 'center' }}>
                <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    transform: 'rotate(-2deg)',
                    display: 'inline-block'
                }}>
                    Time Machine
                </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button type="button" onClick={() => handleYearChange(-10)} style={btnStyle}>-10y</button>
                <button type="button" onClick={() => handleYearChange(-1)} style={btnStyle}>-1y</button>

                {/* Date Input styled like a scribble box */}
                <div style={{
                    position: 'relative',
                    border: '3px solid #333',
                    borderRadius: '10px 255px 15px 255px / 255px 15px 225px 15px',
                    padding: '4px 10px',
                    transform: 'rotate(1deg)'
                }}>
                    <input
                        type="date"
                        value={format(date, 'yyyy-MM-dd')}
                        onChange={handleDateChange}
                        style={{
                            border: 'none',
                            color: '#e11d48', // Red ink color
                            fontFamily: '"Patrick Hand", cursive',
                            fontSize: '1.6rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            width: '180px',
                            outline: 'none',
                            background: 'transparent'
                        }}
                    />
                </div>
            </div>

            {isFuture ? (
                <div style={{ textAlign: 'center', color: '#3b82f6', fontSize: '1.2rem', marginTop: '5px' }}>
                    Future is unpredictable!
                </div>
            ) : (
                <div style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
                    Searching archive...
                </div>
            )}
        </div>
    );
}

export default TimeControls;
