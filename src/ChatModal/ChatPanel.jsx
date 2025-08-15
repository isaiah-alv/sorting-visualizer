// ChatPanel.jsx
import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import './ChatPanel.css';
import PropTypes from 'prop-types';

const ChatPanel = () => {
  // Try to get the API key from environment variable
  const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const [apiKey, setApiKey] = useState(envApiKey || '');
  const [apiKeyEntered, setApiKeyEntered] = useState(!!envApiKey);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm SORT-GPT! Ask me anything about sorting!",
      sentTime: "just now",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const explanations = {
    Abi: "Explain things in a very simple and basic manner, suitable for someone unfamiliar with computers in 150 words or less.",
    Pat: "Provide explanations at a moderate level of detail, appropriate for someone with some technical knowledge in 150 words or less.",
    Tim: "Explain like you're talking to a software professional with several years of experience. Summarize concisely in 150 words or less."
  };

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);
    await processMessageToChatGPT([...messages, newMessage]);
  };

  async function processMessageToChatGPT(chatMessages) {
    // Use assistant prop for complexity
    const systemMessage = {
      role: "system",
      content: explanations['Tim'] 
    };

    const apiMessages = chatMessages.map(msg => ({
      role: msg.sender === "ChatGPT" ? "assistant" : "user",
      content: msg.message
    }));

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages]
    };

    if (!apiKey) {
      alert("Please enter a valid API Key.");
      setIsTyping(false);
      return;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });
      const data = await response.json();

      if (response.ok) {
        const newMessage = {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming"
        };
        setMessages(prev => [...prev, newMessage]);
      } else {
        console.error("API error:", data);
        alert("Failed to fetch response from the API: " + data.error.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while processing your request.");
    }

    setIsTyping(false);
  }

  return (
    <div className="chat-panel open">
      {!apiKeyEntered ? (
        <input
          type="text"
          placeholder="Enter API Key to start..."
          onChange={e => {
            setApiKey(e.target.value);
            setApiKeyEntered(true);
          }}
          style={{ width: '100%', padding: '10px' }}
        />
      ) : (
        <div className="chat-grid">
          <MainContainer className="chat-container-style">
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
              >
                {messages.map((msg, i) => (
                  <Message key={i} model={msg} />
                ))}
              </MessageList>
              <MessageInput placeholder="Type your message..." onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </div>
  );
};

// Reusable Modal component for assistant selection
export function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '2rem',
        minWidth: '320px',
        maxWidth: '90vw',
        boxShadow: '0 4px 32px rgba(0,0,0,0.2)',
        position: 'relative',
        fontFamily: "'Inter', 'Raleway', sans-serif"
      }} onClick={e => e.stopPropagation()}>
        {children}
        <button style={{
          position: 'absolute',
          top: 12,
          right: 16,
          background: 'none',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
          color: '#888'
        }} onClick={onClose} aria-label="Close">×</button>
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default ChatPanel;
