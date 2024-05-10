import React, { useState, useEffect } from 'react';
import './Header.css'; // Make sure to link the CSS file for styles

function Header() {
  const title = "Sort It Out";
  const [letters, setLetters] = useState(() => shuffleArray([...title]));
  const [positions, setPositions] = useState(() => letters.map(() => ({ left: randomPosition(), top: randomPosition() })));

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetters([...title]);
      setPositions(new Array(title.length).fill({ left: 0, top: 0 })); // Reset positions
    }, 1000); // Delay before reshuffling to the correct order

    return () => clearTimeout(timer);
  }, [title]);

  return (
    <div className="header">
      {letters.map((letter, index) => (
        <span key={index} className="letter" style={{ position: 'relative', left: `${positions[index].left}px`, top: `${positions[index].top}px` }}>
          {letter}
        </span>
      ))}
    </div>
  );
}

function shuffleArray(array) {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
  }
  return newArray;
}

function randomPosition() {
  return Math.floor(Math.random() * 50) - 25; // Random position between -25 and 25
}

export default Header;
