// App.jsx
import React from 'react';
import './App.css';
import SortComponent from './SortingVisualizer/SortComponent';
import ChatPanel from './ChatModal/ChatPanel';
import Footer from './Footer/Footer';

function App() {
  return (
    <div className="layout-grid">
      <div className="left-column">
        <header className="header">
          <h1>All Out of SORTS</h1>
        </header>
        <div className="sort-area">
          <SortComponent />
        </div>
    
        <Footer />
      </div>
      {/* Render ChatPanel as an overlay modal */}
      <ChatPanel />
    </div>
  );
}

export default App;
