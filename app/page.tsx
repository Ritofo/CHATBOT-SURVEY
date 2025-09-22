"use client";
import { useChat } from '@vercel/ai/react';
import { useState } from 'react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({ api: '/api/chat' });
  const [isEnded, setIsEnded] = useState(false);
  const [survey, setSurvey] = useState({ rating: 0, feedback: '' });
  const [submitted, setSubmitted] = useState(false);

  const endChat = () => {
    stop();
    setIsEnded(true);
  };

  const submitSurvey = async () => {
    const res = await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: survey.rating, feedback: survey.feedback, messages }),
    });
    if (res.ok) setSubmitted(true);
  };

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Chat & Survey</h1>
      {!isEnded && (
        <div className="space-y-4">
          <div className="space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={m.role === 'user' ? 'inline-block rounded bg-blue-600 text-white px-3 py-2' : 'inline-block rounded bg-gray-100 px-3 py-2'}>
                  {m.content}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              value={input}
              onChange={handleInputChange}
              placeholder="メッセージを入力"
            />
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
              送信
            </button>
            <button type="button" onClick={endChat} className="px-4 py-2 rounded border">
              チャット終了
            </button>
          </form>
        </div>
      )}

      {isEnded && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">アンケート</h2>
          {!submitted ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="w-24">満足度</label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={survey.rating}
                  onChange={(e) => setSurvey((s) => ({ ...s, rating: Number(e.target.value) }))}
                />
                <span>{survey.rating}</span>
              </div>
              <textarea
                className="w-full border rounded p-2"
                rows={4}
                placeholder="ご意見・ご感想"
                value={survey.feedback}
                onChange={(e) => setSurvey((s) => ({ ...s, feedback: e.target.value }))}
              />
              <button onClick={submitSurvey} className="px-4 py-2 rounded bg-black text-white">送信</button>
            </div>
          ) : (
            <p>ご回答ありがとうございました！</p>
          )}
        </div>
      )}
    </div>
  );
}


