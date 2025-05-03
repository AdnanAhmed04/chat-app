import React, { useState, useEffect, useRef } from 'react';
import { FcDocument } from 'react-icons/fc';

const persons = [
  { name: 'Person 1', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Person 2', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Person 3', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Person 4', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
  { name: 'Person 5', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Person 6', avatarUrl: 'https://i.pravatar.cc/150?img=6' },
];

const emojiOptions = ['😎', '👩‍💻', '🧑‍🚀', '👨‍🏫', '👩‍🔬', '👨‍🎨', '🧙‍♂️', '👽', '🦊'];

const Landing = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [myProfile, setMyProfile] = useState({ name: 'You', avatar: '👤', imageUrl: null });
  const [editProfile, setEditProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomImages, setZoomImages] = useState([]);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, selectedPerson]);

  const handleSend = () => {
    if (!newMessage.trim() && !selectedFile) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = messages[selectedPerson.name] || [];

    if (selectedFile) {
      updated.push({
        from: 'me',
        file: {
          name: selectedFile.name,
          url: URL.createObjectURL(selectedFile),
          type: selectedFile.type,
        },
        time: timestamp,
        type: 'file',
      });
      setSelectedFile(null);
    }

    if (newMessage.trim()) {
      updated.push({ from: 'me', text: newMessage.trim(), time: timestamp, type: 'text' });
      setNewMessage('');
    }

    setMessages({ ...messages, [selectedPerson.name]: updated });
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
      setSelectedFile(file);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleImageClick = (clickedUrl) => {
    const imageMsgs = (messages[selectedPerson.name] || []).filter(
      (msg) => msg.type === 'file' && msg.file.type.startsWith('image/')
    );
    const urls = imageMsgs.map((msg) => msg.file.url);
    const index = urls.indexOf(clickedUrl);

    setZoomImages(urls);
    setZoomIndex(index);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (zoomImages.length === 0) return;

      if (e.key === 'ArrowLeft') {
        setZoomIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        setZoomIndex((prev) => (prev < zoomImages.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'Escape') {
        setZoomImages([]);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [zoomImages]);

  const getLastMessage = (msgs) => (msgs?.length ? msgs[msgs.length - 1] : null);
  const openChat = (person) => {
    setSelectedPerson(person);
    setUnreadCounts((prev) => ({ ...prev, [person.name]: 0 }));
    setIsMobileChatOpen(true);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="w-screen h-screen bg-gray-800 flex flex-col md:flex-row overflow-hidden text-gray-200">
      {/* Sidebar */}
      {(isMobile && !isMobileChatOpen) || !isMobile ? (
        <div className="md:w-[280px] w-full bg-gray-900 border-b md:border-b-0 md:border-r border-gray-700 flex flex-col">
          <div
            className="px-4 py-5 text-xl font-semibold border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition"
            onClick={() => {
              setEditProfile({ ...myProfile });
              setIsModalOpen(true);
            }}
          >
            <div className="flex items-center gap-3">
              {myProfile.imageUrl ? (
                <img src={myProfile.imageUrl} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span className="text-2xl">{myProfile.avatar}</span>
              )}
              <span>{myProfile.name}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {persons.map((person) => {
              const lastMsg = getLastMessage(messages[person.name]);
              return (
                <div
                  key={person.name}
                  onClick={() => openChat(person)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img src={person.avatarUrl} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[160px]">
                        {lastMsg?.type === 'file' ? '📎 File' : lastMsg?.text || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{lastMsg?.time}</p>
                    {unreadCounts[person.name] > 0 && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadCounts[person.name]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Chat Area */}
      {selectedPerson && (!isMobile || isMobileChatOpen) && (
        <div className="flex-1 flex flex-col bg-gray-800 text-gray-200">
          <div className="px-4 py-4 border-b border-gray-700 flex items-center gap-3">
            {isMobile && (
              <button onClick={() => setIsMobileChatOpen(false)} className="text-white text-xl">←</button>
            )}
            <img src={selectedPerson.avatarUrl} className="w-8 h-8 rounded-full" />
            <h2 className="text-lg font-semibold">{selectedPerson.name}</h2>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
            {(messages[selectedPerson.name] || []).map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] md:max-w-[70%] px-4 py-2 rounded-xl text-sm shadow ${msg.from === 'me' ? ' text-white' : 'bg-gray-700 text-gray-200'}`}>
                  {msg.type === 'file' ? (
                    msg.file.type.startsWith('image/') ? (
                      <img
                        src={msg.file.url}
                        alt={msg.file.name}
                        onClick={() => handleImageClick(msg.file.url)}
                        className="max-h-40 max-w-full rounded mb-1 cursor-pointer hover:opacity-90"
                      />
                    ) : msg.file.type.startsWith('audio/') ? (
                      <div className="flex w-full max-w-xs bg-[#212524] text-white px-4 py-2 rounded-2xl">
                        <button onClick={() => new Audio(msg.file.url).play()} className="mr-3">▶️</button>
                        <div className="flex-1 h-1 bg-white/30 rounded-full mr-2">
                          <div className="w-1/2 h-1 bg-white rounded-full"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 mb-1">
                        <FcDocument className="w-6 h-6" />
                        <a href={msg.file.url} download={msg.file.name} className="underline text-sm break-all">{msg.file.name}</a>
                      </div>
                    )
                  ) : <p>{msg.text}</p>}
                  <span className="block text-[10px] mt-1 text-right opacity-70">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex items-center gap-3 flex-wrap">
              <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-full">📎
                <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
              </label>
              {!isRecording ? (
                <button onClick={startRecording} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full">🎙️ Start</button>
              ) : (
                <button onClick={stopRecording} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full">⏹ Stop</button>
              )}
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 min-w-[60%] border border-gray-600 rounded-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
              />
              <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">Send</button>
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-400 mt-2">Attached: {selectedFile.name}</p>
            )}
          </div>
        </div>
      )}

      {/* Zoom Image Viewer */}
      {zoomImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-2"
          onClick={() => setZoomImages([])}
        >
          <img
            src={zoomImages[zoomIndex]}
            alt="Zoomed"
            className="max-w-full max-h-full rounded-lg"
          />
          <div className="absolute bottom-4 text-sm text-white">
            {zoomIndex + 1} / {zoomImages.length} (← / → to navigate, ESC to close)
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-gray-600 text-left flex flex-col items-start">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            {editProfile?.imageUrl && (
              <img src={editProfile.imageUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover mb-4" />
            )}
            <label className="block mb-2 text-sm">Choose Avatar</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setEditProfile({ ...editProfile, avatar: emoji, imageUrl: null })}
                  className={`text-2xl px-2 py-1 rounded hover:bg-gray-700 ${editProfile?.avatar === emoji && !editProfile?.imageUrl ? 'bg-blue-600' : ''}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <label className="block mb-2 text-sm">Upload Custom Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setEditProfile({ ...editProfile, imageUrl, avatar: '' });
                }
              }}
              className="w-full mb-4 px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
            />
            <input
              type="text"
              placeholder="Name"
              value={editProfile?.name || ''}
              onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
              required
              className="w-full mb-4 px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
            />
            <div className="flex justify-end gap-3 w-full">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Cancel</button>
              <button
                onClick={() => {
                  if (!editProfile.name.trim()) {
                    alert('Name cannot be empty.');
                    return;
                  }
                  setMyProfile(editProfile);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
