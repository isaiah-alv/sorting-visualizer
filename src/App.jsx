import { useState } from 'react';
import './App.css';
import SortComponent from './SortingVisualizer/SortComponent';
import BottomPanel from './ChatModal/BottomPanel';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const ASSISTANTS = [
  { key: 'Abi', label: 'Beginner (Abi)' },
  { key: 'Pat', label: 'Intermediate (Pat)' },
  { key: 'Tim', label: 'Expert (Tim)' }
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  borderRadius: 2
};

function App() {
  const [assistant, setAssistant] = useState(null);
  const [showModal, setShowModal] = useState(true);

  const handleSelect = (key) => {
    setAssistant(key);
    setShowModal(false);
  };

  const handleSwap = () => setShowModal(true);

  return (
    <div className="layout-grid">
      <Modal
        open={showModal}
        onClose={() => {}}
        aria-labelledby="assistant-selection-title"
      >
        <Box sx={modalStyle}>
          <h2 id="assistant-selection-title" style={{ textAlign: 'center', marginBottom: '1.5rem' ,color:"#000"}}>
            Choose Your Assistant
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ASSISTANTS.map((a) => (
              <button
                key={a.key}
                onClick={() => handleSelect(a.key)}
                style={{
                  padding: '1rem',
                  fontSize: '1.1rem',
                  borderRadius: '8px',
                  border: '2px solid #08bdbd',
                  background: '#001d3d',
                  color: '#abff4f',
                  cursor: 'pointer',
                  fontFamily: "'Inter', 'Raleway', sans-serif",
                  fontWeight: 600,
                  transition: 'background 0.2s, color 0.2s',
                  outline: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#08bdbd';
                  e.currentTarget.style.color = '#001d3d';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#001d3d';
                  e.currentTarget.style.color = '#abff4f';
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </Box>
      </Modal>

      <div className="left-column">
        <header className="header">
          <h1>Sort It Out : A Sorting Algorithm Visualizer!</h1>
          {assistant && (
            <button
              onClick={handleSwap}
              style={{
                marginTop: '0.5rem',
                fontSize: '1rem',
                borderRadius: '6px',
                border: '1px solid #08bdbd',
                background: '#fff',
                color: '#08bdbd',
                cursor: 'pointer',
                fontFamily: "'Inter', 'Raleway', sans-serif",
                padding: '0.3rem 0.8rem',
                outline: 'none'
              }}
            >
              Swap Assistant
            </button>
          )}
        </header>

        <div className="sort-area">
          <SortComponent />
        </div>
      </div>

      <BottomPanel assistant={assistant} />
    </div>
  );
}

export default App;
