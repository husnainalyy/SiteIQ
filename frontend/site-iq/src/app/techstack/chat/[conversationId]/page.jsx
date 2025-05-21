'use client';

import { useParams } from 'next/navigation';
import ChatBox from '@/components/ui/ChatBox';

export default function ChatPage() {
  const { conversationId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Improvement Chat</h1>
      <ChatBox conversationId={conversationId} />
    </div>
  );
}
