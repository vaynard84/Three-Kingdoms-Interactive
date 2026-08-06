import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Sparkles, BookOpen, Users, Swords, HelpCircle, ArrowRight, Bot, Compass, AlertCircle } from 'lucide-react';
import { ASSETS } from '../data/assets';

interface GuideResponse {
  answer: string;
  followUps?: string[];
  related?: {
    chapters?: number[];
    characters?: string[];
    events?: string[];
  };
  historicalNote?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'guide';
  text: string;
  responseObj?: GuideResponse;
  timestamp: string;
}

export const AskGuidePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'guide',
      text: "Greetings, young scholar! I am the Story Guide of the Three Kingdoms. Ask me anything about heroes, battles, strategies, or kingdoms!",
      responseObj: {
        answer: "Greetings, young scholar! I am the Story Guide of the Three Kingdoms. Ask me anything about heroes, battles, strategies, or kingdoms!",
        followUps: [
          "Why did Cao Cao attack Yuan Shao at Guandu?",
          "Was Cao Cao a bad person?",
          "Why were Liu Bei, Guan Yu, and Zhang Fei friends?"
        ],
        related: {
          chapters: [3, 11, 14],
          characters: ["Liu Bei", "Cao Cao", "Zhuge Liang"]
        }
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Handle initial question passed via navigation state
  useEffect(() => {
    if (location.state && (location.state as { initialQuestion?: string }).initialQuestion) {
      const q = (location.state as { initialQuestion: string }).initialQuestion;
      if (q) {
        handleAsk(q);
      }
    }
  }, [location.state]);

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText })
      });

      if (!res.ok) throw new Error('API server error');

      const data: GuideResponse = await res.json();

      const guideMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'guide',
        text: data.answer,
        responseObj: data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, guideMsg]);
    } catch {
      // Offline fallback response
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'guide',
        text: "The Three Kingdoms period was a remarkable era! Liu Bei, Guan Yu, and Zhang Fei formed an unbreakable bond in the Peach Garden, while Cao Cao unified the north and Sun Quan built a mighty river navy. Check out Chapter 14 to learn about the Battle of Red Cliffs!",
        responseObj: {
          answer: "The Three Kingdoms period was a remarkable era! Liu Bei, Guan Yu, and Zhang Fei formed an unbreakable bond in the Peach Garden, while Cao Cao unified the north and Sun Quan built a mighty river navy. Check out Chapter 14 to learn about the Battle of Red Cliffs!",
          followUps: [
            "Who won the Battle of Red Cliffs?",
            "What was Zhuge Liang's famous strategy?"
          ],
          related: { chapters: [3, 14], characters: ["Liu Bei", "Guan Yu", "Cao Cao"] }
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header Banner with Scholar Study Backdrop */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-600/60 shadow-2xl p-8 space-y-3 text-center sm:text-left min-h-[220px] flex flex-col justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-all" 
          style={{ backgroundImage: `url(${ASSETS.scholarStudy})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-950/80" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-900/90 border border-amber-500/60 text-amber-200 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest shadow-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>AI Story Scholar Study</span>
          </div>
          <h1 className="font-serif-display font-black text-3xl sm:text-4xl text-amber-100 gold-gradient-text">
            Ask the Three Kingdoms Story Guide
          </h1>
          <p className="text-sm text-amber-200/90 max-w-2xl leading-relaxed font-sans">
            Curious about why a battle happened or who was the bravest hero? Ask any question and receive wise, child-friendly explanations from the historical scholar!
          </p>
        </div>
      </div>

      {/* Preset Questions Chips */}
      <div className="bg-stone-900/90 p-4 rounded-2xl border border-amber-800/80 shadow-lg space-y-2">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Popular Questions:</span>
        <div className="flex flex-wrap gap-2">
          {[
            "Why did Cao Cao attack Yuan Shao?",
            "Was Cao Cao a bad person?",
            "Why were Liu Bei, Guan Yu and Zhang Fei friends?",
            "Who was the smartest strategist?",
            "What happened before the Battle of Red Cliffs?",
            "Which chapter should I read to learn about Zhao Yun?",
            "What is the difference between Wei, Shu and Wu?"
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(preset)}
              disabled={loading}
              className="bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-200 text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer disabled:opacity-50"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="space-y-4 bg-amber-950/40 p-4 sm:p-6 rounded-3xl border border-amber-800/60 min-h-[400px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold text-sm shadow-md ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-amber-950'
                  : 'bg-amber-900 text-amber-200 border border-amber-700'
              }`}
            >
              {msg.sender === 'user' ? '🧑‍🎓' : '📜'}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-amber-950 font-medium font-sans'
                  : 'bg-stone-900/95 border border-amber-800/80 text-amber-100 font-sans shadow-xl'
              }`}
            >
              <div className="whitespace-pre-line">
                {msg.text}
              </div>

              {/* Extended Guide Info (Related Chapters/Characters/Follow-ups) */}
              {msg.sender === 'guide' && msg.responseObj && (
                <div className="pt-3 border-t border-amber-800/60 space-y-3">
                  {/* Historical vs Romance note if present */}
                  {msg.responseObj.historicalNote && (
                    <div className="bg-amber-950/80 p-2.5 rounded-xl border border-amber-800 text-[11px] text-amber-300 italic flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{msg.responseObj.historicalNote}</span>
                    </div>
                  )}

                  {/* Related Links */}
                  {msg.responseObj.related && (
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="text-amber-400 font-semibold">Related:</span>
                      {msg.responseObj.related.chapters?.map(chId => (
                        <button
                          key={chId}
                          onClick={() => navigate('/story', { state: { chapterId: chId } })}
                          className="bg-amber-900/80 hover:bg-amber-800 text-amber-200 px-2.5 py-0.5 rounded-md border border-amber-700 font-bold"
                        >
                          Ch. {chId}
                        </button>
                      ))}
                      {msg.responseObj.related.characters?.map(cName => (
                        <span key={cName} className="bg-stone-800 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                          👤 {cName}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Follow up Questions */}
                  {msg.responseObj.followUps && msg.responseObj.followUps.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                        Suggested Follow-up Questions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.responseObj.followUps.map((fu, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAsk(fu)}
                            className="bg-amber-900/40 hover:bg-amber-900 text-amber-200 text-[11px] px-2.5 py-1 rounded-full border border-amber-800 cursor-pointer"
                          >
                            "{fu}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-[10px] opacity-60 text-right">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 bg-stone-900 p-4 rounded-2xl border border-amber-800 max-w-xs text-amber-300 text-xs animate-pulse">
            <Bot className="w-5 h-5 text-amber-400" />
            <span>Consulting ancient historical records...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleAsk(inputQuestion); }}
        className="flex items-center gap-3 bg-stone-900 p-3 rounded-2xl border-2 border-amber-800 shadow-xl"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask a question about Three Kingdoms..."
          className="flex-1 bg-transparent text-amber-100 placeholder-amber-400/50 px-3 py-2 text-sm focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || loading}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-amber-950 font-bold p-3 rounded-xl transition-all cursor-pointer shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
