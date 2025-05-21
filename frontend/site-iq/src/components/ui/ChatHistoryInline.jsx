'use client';

export default function ChatHistoryInline({ history, onSelect }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Chats</h2>
        <div className="space-y-3">
          {history.map(chat => (
            <button
              key={chat._id}
              className="w-full text-left bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10 group"
              onClick={() => onSelect({ conversationId: chat._id, improvementResponse: chat.improvementResponse })}
            >
              <div className="flex items-center justify-between">
                <span className="text-white/90 group-hover:text-white transition-colors">
                  {chat.title || 'Untitled Chat'}
                </span>
                <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                  {new Date(chat.lastUpdated).toLocaleString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
