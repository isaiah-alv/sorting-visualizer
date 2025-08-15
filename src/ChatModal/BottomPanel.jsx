import { useState } from 'react';
import PropTypes from 'prop-types';
import './ChatPanel.css';

const ALGORITHM_LABELS = {
  insertion: 'Insertion Sort',
  merge: 'Merge Sort',
  bubble: 'Bubble Sort',
};

const ASSISTANT_PROMPTS = {
  Abi: (algo) => `Explain how ${algo} works and its time complexity in a way a beginner can understand. Give a short, simple description and mention best, average, and worst case time complexity.`,
  Pat: (algo) => `Describe the ${algo} algorithm and its time complexity for someone with some technical background. Include a concise explanation and the best, average, and worst case time complexities.`,
  Tim: (algo) => `Provide a professional summary of ${algo}, including a technical description and the best, average, and worst case time complexities and space complexity.`,
};

export default function BottomPanel({ assistant }) {
  const [description, setDescription] = useState('');
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState('');

  // Listen for a custom event from SortComponent when play is pressed
  // (You will need to dispatch this event from SortComponent)
  window.onAlgorithmPlay = async (algorithm) => {
    setLoading(true);
    setCurrentAlgorithm(algorithm);
    setChatMode(false);
    setDescription('');
    setChatMessages([]);
    // Compose prompt
    const algoLabel = ALGORITHM_LABELS[algorithm] || algorithm;
    const prompt = ASSISTANT_PROMPTS[assistant || 'Tim'](algoLabel);
    // Call OpenAI API
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setDescription(data.choices[0].message.content);
      } else {
        setDescription('Uh Oh... Looks like assistants are out of office today.');
      }
    } catch (e) {
      setDescription('Error fetching description.');
    }
    setLoading(false);
  };

  // handles follow up chat
  const handleChatSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const newMessages = [
      ...chatMessages,
      { role: 'user', content: input }
    ];
    setChatMessages(newMessages);
    setInput('');
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: ASSISTANT_PROMPTS[assistant || 'Tim'](ALGORITHM_LABELS[currentAlgorithm] || currentAlgorithm) },
            ...newMessages
          ],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setChatMessages([...newMessages, { role: 'assistant', content: data.choices[0].message.content }]);
      } else {
        setChatMessages([...newMessages, { role: 'assistant', content: 'Failed to fetch response.' }]);
      }
    } catch (e) {
      setChatMessages([...chatMessages, { role: 'assistant', content: 'Error fetching response.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      zIndex: 1500,
      pointerEvents: 'none', // allow clicks only on the panel itself
    }}>
      <div
        style={{
          background: '#000814',
          border: '2px solid #08bdbd',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -2px 16px #08bdbd44',
          padding: '0.7rem 1.5rem 0.7rem 1.5rem', 
          color: '#fff',
          fontFamily: "'Inter', 'Raleway', sans-serif",
          minHeight: '90px',
          maxHeight: '32vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.7rem',
          width: '100vw',
          maxWidth: '700px',
          minWidth: '400px',
          margin: '0 auto',
          pointerEvents: 'auto',
        }}
      >
        {loading && <div>Loading...</div>}
        {!loading && description && (
          <>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem', whiteSpace: 'pre-line' }}>{description}</div>
            {!chatMode && (
              <button style={{ alignSelf: 'flex-end', background: '#08bdbd', color: '#001d3d', border: 'none', borderRadius: '8px', padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }} onClick={() => setChatMode(true)}>
                Ask AI a follow-up question
              </button>
            )}
          </>
        )}
        {chatMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ maxHeight: '12vh', overflowY: 'auto', marginBottom: '0.5rem' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ color: msg.role === 'user' ? '#abff4f' : '#fff', marginBottom: 4 }}>
                  <b>{msg.role === 'user' ? 'You' : 'AI'}:</b> {msg.content}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleChatSend(); }}
                style={{ flex: 1, borderRadius: '6px', border: '1px solid #08bdbd', padding: '0.5rem', fontSize: '1rem', fontFamily: "'Inter', 'Raleway', sans-serif" }}
                placeholder="Ask a follow-up question..."
                disabled={loading}
              />
              <button onClick={handleChatSend} disabled={loading || !input.trim()} style={{ background: '#08bdbd', color: '#001d3d', border: 'none', borderRadius: '8px', padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

BottomPanel.propTypes = {
  assistant: PropTypes.string,
}; 