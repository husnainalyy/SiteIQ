'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ChatHistoryList from '@/components/ui/ChatHistoryList';

export default function ChatHistoryPage() {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const res = await api.get('/userchat/chats');
    setChats(res.data.chats);
  };

  const deleteChat = async (id) => {
    await api.delete(`/userchat/chats/${id}`);
    fetchChats();
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat History</h1>
      <ChatHistoryList chats={chats} onDelete={deleteChat} />
    </div>
  );
}
