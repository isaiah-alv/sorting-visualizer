// ChatPanel.jsx
import React, { useState } from 'react';
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

const ChatPanel = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiKeyEntered, setApiKeyEntered] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm SORT-GPT! Ask me anything about sorting!",
      sentTime: "just now",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [complexity, setComplexity] = useState('Tim');
  const [isOpen, setIsOpen] = useState(false);

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
    const systemMessage = {
      role: "system",
      content: explanations[complexity]
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="toggle-button" onClick={toggleChat}>
        {isOpen ? "Close Chat" : "Open Chat"}
      </button>
      <div className={`chat-panel ${isOpen ? "open" : ""}`}>
        <div className="assistant-buttons">
          <label className="current-assistant">Current Assistant: {complexity}</label>
          <button onClick={() => setComplexity('Abi')}>Beginner (Abi)</button>
          <button onClick={() => setComplexity('Pat')}>Intermediate (Pat)</button>
          <button onClick={() => setComplexity('Tim')}>Expert (Tim)</button>
        </div>

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
    </>
  );
};

export default ChatPanel;
