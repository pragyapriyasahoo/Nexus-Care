import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  Bot,
  Send,
  Volume2,
  Mic,
  Sparkles,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const VionexCompanionWidget: React.FC = () => {
  const { vionexMessages, sendVionexMessage, language, patient } = useHealth();
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isHindi = language === 'hi';

  const quickPrompts = isHindi
    ? [
        { label: 'पिताजी की तबियत कैसी है?', prompt: 'राजेश जी की मौजूदा तबियत कैसी है?' },
        { label: 'क्या दवा ली गई?', prompt: 'क्या आज की निर्धारित दवाइयां ले ली गई हैं?' },
        { label: 'कमरे का तापमान?', prompt: 'कमरे का तापमान और वातावरण कैसा है?' },
        { label: 'पानी कितना पिया?', prompt: 'क्या उन्होंने पर्याप्त पानी पिया है?' },
      ]
    : [
        { label: 'How is Dad doing?', prompt: 'How is Rajesh doing right now?' },
        { label: 'Medication status?', prompt: 'Did he take all his scheduled medications today?' },
        { label: 'Room climate?', prompt: 'What is the current ambient room temperature?' },
        { label: 'Hydration check?', prompt: 'How is his hydration level today?' },
      ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendVionexMessage(inputText);
    setInputText('');
  };

  const handlePromptClick = (prompt: string) => {
    sendVionexMessage(prompt);
  };

  const simulateVoiceOutput = (text: string) => {
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 2800);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[480px] overflow-hidden">
      {/* Widget Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">VIONEX AI Voice Companion</h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                {isHindi ? 'हिंदी / द्विभाषी' : 'Bilingual AI'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {isHindi ? '24/7 सक्रिय देखभाल सहायक एवं आपातकालीन मॉनिटर' : 'Active 24/7 ambient caregiver agent'}
            </p>
          </div>
        </div>

        {/* Voice Wave Animation indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 text-xs">
          <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-teal-600 animate-bounce' : 'text-slate-400'}`} />
          {isSpeaking ? (
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-teal-600 animate-pulse" />
              <span className="w-1 h-4 bg-teal-600 animate-pulse delay-75" />
              <span className="w-1 h-2 bg-teal-600 animate-pulse delay-150" />
            </div>
          ) : (
            <span className="text-[11px] font-bold text-slate-500">Ready</span>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {vionexMessages.map((msg) => {
          const isAi = msg.sender === 'vionex';
          const isCaregiver = msg.sender === 'caregiver';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isCaregiver ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {isAi ? (
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                  V
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium">
                  {msg.sender === 'patient' ? 'P' : 'C'}
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isAi
                    ? 'bg-slate-50 border border-slate-100 text-slate-800'
                    : isCaregiver
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-teal-50 border border-teal-100 text-teal-900'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className={`text-[10px] font-bold ${isCaregiver ? 'text-teal-100' : 'text-slate-400'}`}>
                    {isAi ? 'VIONEX Guardian' : isCaregiver ? 'You (Caregiver)' : 'Rajesh Sharma'}
                  </span>
                  <span className={`text-[9px] ${isCaregiver ? 'text-teal-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                <p className="font-medium">{isHindi ? msg.textHi || msg.text : msg.text}</p>

                {isAi && (
                  <button
                    onClick={() => simulateVoiceOutput(isHindi ? msg.textHi || msg.text : msg.text)}
                    className="mt-1.5 flex items-center gap-1 text-[10px] text-teal-700 hover:text-teal-900 font-bold cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isHindi ? 'बोलकर सुनें' : 'Listen Voice'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${idx}`}
              onClick={() => handlePromptClick(qp.prompt)}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200/80 hover:border-teal-500 hover:bg-teal-50/50 text-[11px] font-medium text-slate-700 transition shrink-0 cursor-pointer shadow-2xs"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white">
        <div className="relative flex-1">
          <input
            id="vionex-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isHindi
                ? 'वियोनेक्स से कुछ भी पूछें (उदा. क्या पापा ने दवा ली?)...'
                : 'Ask VIONEX anything about Rajesh (e.g. vitals, medication)...'
            }
            className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
          <button
            type="button"
            onClick={() => simulateVoiceOutput('Voice recognition listening')}
            className="absolute right-2 top-2 text-slate-400 hover:text-teal-600 transition cursor-pointer"
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          id="vionex-send-btn"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white transition shadow-xs cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
