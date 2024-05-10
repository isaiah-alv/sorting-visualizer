// App.jsx
import React, { useState } from 'react';
import './App.css';
import ChatModal from './ChatModal';  // Ensure the path is correct based on your project structure
import SortComponent from './SortComponent';
import Header from './Header'; // Import the Header component


function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="App">
      <Header />
      <button onClick={() => setModalOpen(true)}>Ask SORT-GPT</button>
      <ChatModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <SortComponent></SortComponent>
      <p>More to be added soon! Isaiah Alviola 2024</p>
    </div>
  );
}

export default App;
