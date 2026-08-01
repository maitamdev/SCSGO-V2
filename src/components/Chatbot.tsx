import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Chatbot.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setMessages([{
        role: 'assistant',
        content: 'Xin chào! Mình là SBot 🤖⚡ Trợ lý thông minh của SCSGO!\n\nMình có thể giúp bạn:\n• 🗺️ Tìm trạm sạc gần nhất\n• ⭐ Đánh giá trạm sạc\n• 💰 Thông tin giá sạc\n• 🚗 Tư vấn xe điện\n\nBạn cần hỏi gì nào? 😊'
      }]);
      setHasGreeted(true);
    }
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen, hasGreeted]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { messages: newMessages.slice(-12) },
      });
      if (error) throw error;
      const assistantMessage: Message = {
        role: 'assistant',
        content: typeof data?.reply === 'string' ? data.reply : 'Mình chưa xử lý được câu hỏi này. Bạn thử hỏi lại nhé!',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '😵 Ôi, mình gặp lỗi rồi! Bạn thử lại sau nhé hoặc liên hệ hotline SCSGO để được hỗ trợ nha! 📞'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        id="chatbot-toggle"
        className={`chatbot-fab ${isOpen ? 'chatbot-fab--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở chatbot"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <img src="/chatbot-mascot.png" alt="SBot" className="chatbot-fab-img" />
        )}
        {!isOpen && <span className="chatbot-fab-pulse" />}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'chatbot-window--open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-avatar">
            <img src="/chatbot-mascot.png" alt="SBot" />
          </div>
          <div className="chatbot-header-info">
            <h4>SBot ⚡</h4>
            <span className="chatbot-status">
              <span className="chatbot-status-dot" />
              Online
            </span>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Đóng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-msg chatbot-msg--${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="chatbot-msg-avatar">
                  <img src="/chatbot-mascot.png" alt="SBot" />
                </div>
              )}
              <div className="chatbot-msg-bubble">
                {msg.content.split('\n').map((line, j) => (
                  <React.Fragment key={j}>
                    {line}
                    {j < msg.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chatbot-msg chatbot-msg--assistant">
              <div className="chatbot-msg-avatar">
                <img src="/chatbot-mascot.png" alt="SBot" />
              </div>
              <div className="chatbot-msg-bubble chatbot-typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            id="chatbot-input"
            type="text"
            className="chatbot-input"
            placeholder="Hỏi SBot về trạm sạc..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            id="chatbot-send"
            className="chatbot-send"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            aria-label="Gửi"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
