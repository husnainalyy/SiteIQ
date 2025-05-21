'use client';

import { useEffect, useState, useRef } from 'react';
import ImproveForm from '@/components/ui/ImproveForm';
import ChatBox from '@/components/ui/ChatBox';
import ChatSidebar from '@/components/ui/ChatSidebar';
import api from '@/lib/api';

export default function TechstackPage() {
  const [chatData, setChatData] = useState(null); // {conversationId, improvementResponse}
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const sidebarRef = useRef(null);
  const CHATS_PER_PAGE = 10;

  useEffect(() => {
    const saved = localStorage.getItem('lastChat');
    if (saved) {
      setChatData(JSON.parse(saved));
    }
    fetchHistory(0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current || isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        fetchHistory(page + 1);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) sidebar.addEventListener('scroll', handleScroll);
    return () => sidebar?.removeEventListener('scroll', handleScroll);
  }, [page, isLoading, hasMore]);

  const fetchHistory = async (pageToFetch) => {
    setIsLoading(true);
    try {
      const res = await api.get('/userchat/chats', {
        params: { skip: pageToFetch * CHATS_PER_PAGE, limit: CHATS_PER_PAGE },
      });

      const newChats = res.data.chats;
      if (newChats.length < CHATS_PER_PAGE) setHasMore(false);

      if (pageToFetch === 0) {
        setHistory(newChats);
      } else {
        setHistory((prev) => [...prev, ...newChats]);
      }

      setPage(pageToFetch);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (data) => {
    const payload = {
      conversationId: data.conversationId,
      improvementResponse: data.recommendation,
    };
    setChatData(payload);
    //localStorage.setItem('lastChat', JSON.stringify(payload));
    fetchHistory(0); // refresh latest
  };

  const handleHistorySelect = async (data) => {
    const payload = {
      conversationId: data.conversationId,
      improvementResponse: data.recommendation,
    };
    setChatData(payload);
    localStorage.setItem('lastChat', JSON.stringify(payload));
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/userchat/chat/${id}`);
      setHistory((prev) => prev.filter((h) => h._id !== id));
      if (chatData?.conversationId === id) {
        setChatData(null);
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900">
      <aside
        className="w-72 border-r border-gray-200 bg-white/80 backdrop-blur-md min-h-screen p-6 shadow-xl flex flex-col"
        ref={sidebarRef}
      >
        <div className="flex-1 overflow-y-auto">
          <ChatSidebar
            chats={history}
            onSelect={handleHistorySelect}
            onDelete={handleDelete}
          />
          {isLoading && (
            <div className="text-sm text-gray-500 text-center mt-2">Loading more...</div>
          )}
          {!hasMore && (
            <div className="text-xs text-gray-400 text-center mt-4">No more chats</div>
          )}
        </div>
      </aside>


      <main className="flex-1 p-10 flex justify-center items-start overflow-y-auto">
        <div className="w-full max-w-3xl space-y-8 bg-gray/90 rounded-2xl shadow-2xl border border-gray-200 p-10">
          <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow mb-2">
            Improve Your Tech Stack
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Enter your website or project details below to receive{' '}
            <span className="font-semibold text-green-700">AI-powered suggestions</span>.
          </p>

        
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 shadow mb-6">
            <ImproveForm onSuccess={handleSuccess} />
          </div>

          {chatData && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-6 shadow">
              <ChatBox
                conversationId={chatData.conversationId}
                improvementResponse={chatData.improvementResponse}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
