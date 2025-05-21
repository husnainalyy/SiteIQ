'use client';

import Link from 'next/link';
import { Button } from './button';

export default function ChatHistoryList({ chats, onDelete }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Chat History</h2>
        <ul className="space-y-3">
          {chats.map(chat => (
            <li
              key={chat._id}
              className="group flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10"
            >
              <Link
                href={`/techstack/chat/${chat._id}`}
                className="text-white/90 hover:text-white transition-colors flex-1"
              >
                {chat.title || 'Untitled Chat'}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(chat._id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
