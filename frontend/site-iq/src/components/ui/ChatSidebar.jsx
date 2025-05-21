export default function ChatSidebar({ chats, onSelect, onDelete }) {
  return (
    <div className="w-64 bg-white p-4 border-r border-gray-200 overflow-y-auto h-screen shadow-md">
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>
      {chats.map((chat) => (
        <div key={chat._id} className="flex justify-between items-center mb-2">
          <button
            onClick={() => onSelect(chat._id)}
            className="text-left text-sm text-blue-600 hover:underline"
          >
            {chat.title || "Untitled"}
          </button>
          <button
            onClick={() => onDelete(chat._id)}
            className="text-red-500 hover:text-red-700"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
