import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const ChatModal = ({ isOpen, onClose }) => {
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
  const [complexity, setComplexity] = useState('Tim'); // Default to 'Tim' for professional explanations

  useEffect(() => {
    if (isOpen) {
      setApiKeyEntered(false);
      setApiKey('');
    }
  }, [isOpen]);

  const explanations = {
    'Abi': "Explain things in a very simple and basic manner, suitable for someone unfamiliar with computers in 150 words or less.",
    'Pat': "Provide explanations at a moderate level of detail, appropriate for someone with some technical knowledge in 150 words or less.",
    'Tim': "Explain like you're talking to a software professional with several years of experience. Summarize concisely in 150 words or less."
  };

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    const systemMessage = {
      "role": "system",
      "content": explanations[complexity]
    };
  
    let apiMessages = chatMessages.map((messageObject) => ({
      role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
      content: messageObject.message
    }));
  
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [systemMessage, ...apiMessages],
    };
  
    if (!apiKey) {
      alert("Please enter a valid API Key.");
      return; // Prevent further execution if no API key is provided
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
        setIsTyping(false);
      } else {
        console.error("API error:", data);
        alert("Failed to fetch response from the API: " + data.error.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("An error occurred while processing your request.");
    }
  }
  

  if (!isOpen) return null;

  return (
    <div className="modal">
      <button className="close" onClick={onClose}>Close</button>
      <div className="assistant-buttons">
        <label className='current-assistant'>Current Assistant: {complexity}</label><br></br>
        <button onClick={() => setComplexity('Abi')}>Beginner (Abi)</button>
        <button onClick={() => setComplexity('Pat')}>Intermediate (Pat)</button>
        <button onClick={() => setComplexity('Tim')}>Expert (Tim)</button>
      </div>
      {!apiKeyEntered ? (
        <input
          type="text"
          placeholder="Enter API Key to start..."
          onChange={e => { setApiKey(e.target.value); setApiKeyEntered(true); }}
          style={{width: '100%', padding: '10px'}}
        />
      ) : (
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      )}
    </div>
  );
}

export default ChatModal;
