import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Expandable AI chat assistant panel
export default function ChatAssistant({ mood }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setIsTyping(false);

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'error', text: data.error || 'No response' }]);
      }
    } catch {
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: 'error', text: 'Connection failed' }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        id="chat-toggle-btn"
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ '--accent': mood?.uiAccent, '--glow': mood?.uiGlow }}
      >
        <span className="material-symbols-outlined">
          {isOpen ? 'close' : 'chat'}
        </span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-panel glass-panel"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ '--accent': mood?.uiAccent, '--glow': mood?.uiGlow }}
          >
            <div className="chat-header">
              <span className="material-symbols-outlined">smart_toy</span>
              <span>Weather AI Assistant</span>
            </div>

            <div className="chat-messages" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="chat-empty">
                  <span className="material-symbols-outlined">waving_hand</span>
                  <p>Ask me anything about the weather!</p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`chat-bubble chat-${msg.role}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {msg.text}
                </motion.div>
              ))}

              {isTyping && (
                <div className="chat-bubble chat-ai chat-typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              )}
            </div>

            <div className="chat-input-row">
              <input
                id="chat-message-input"
                type="text"
                placeholder="Ask about weather..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="chat-input"
                autoComplete="off"
              />
              <button
                id="chat-send-btn"
                className="chat-send-btn"
                onClick={sendMessage}
                disabled={isTyping || !input.trim()}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
