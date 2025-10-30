import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Search, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const mockConversations = [
  {
    id: 1,
    user: { name: 'John Martinez', avatar: 'JM' },
    lastMessage: 'Thanks for the update! Looking forward to the final delivery.',
    timestamp: '10 min ago',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    user: { name: 'Emily Davis', avatar: 'ED' },
    lastMessage: 'Could you share the design mockups?',
    timestamp: '1 hour ago',
    unread: 1,
    online: true,
  },
  {
    id: 3,
    user: { name: 'Michael Brown', avatar: 'MB' },
    lastMessage: 'Perfect! The API integration works great.',
    timestamp: '2 hours ago',
    unread: 0,
    online: false,
  },
  {
    id: 4,
    user: { name: 'Sarah Wilson', avatar: 'SW' },
    lastMessage: 'When can we schedule the next call?',
    timestamp: '1 day ago',
    unread: 0,
    online: false,
  },
];

const mockMessages = [
  {
    id: 1,
    sender: 'other',
    content: 'Hi! I saw your service and I\'m interested in working with you on my project.',
    timestamp: '10:30 AM',
  },
  {
    id: 2,
    sender: 'me',
    content: 'Hello! Thank you for reaching out. I\'d be happy to help. Could you tell me more about your project?',
    timestamp: '10:32 AM',
  },
  {
    id: 3,
    sender: 'other',
    content: 'Sure! I need a full-stack web application for my e-commerce business. It should have user authentication, product catalog, shopping cart, and payment integration.',
    timestamp: '10:35 AM',
  },
  {
    id: 4,
    sender: 'me',
    content: 'That sounds like a great project! I have extensive experience with e-commerce platforms. The timeline would be around 7-10 days for a complete solution. Would you like me to send you a custom offer?',
    timestamp: '10:37 AM',
  },
  {
    id: 5,
    sender: 'other',
    content: 'Yes, please! That would be perfect. Also, what technologies would you use?',
    timestamp: '10:40 AM',
  },
  {
    id: 6,
    sender: 'me',
    content: 'I\'d recommend using React for the frontend, Node.js with Express for the backend, and MongoDB for the database. For payments, we can integrate Stripe. I\'ll prepare a detailed proposal for you.',
    timestamp: '10:42 AM',
  },
  {
    id: 7,
    sender: 'other',
    content: 'Thanks for the update! Looking forward to the final delivery.',
    timestamp: '11:20 AM',
  },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: 'me',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message sent!');
  };

  const filteredConversations = mockConversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-[calc(100vh-180px)] grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Conversations List */}
          <Card className="md:col-span-1 flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      selectedConversation.id === conversation.id
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {conversation.user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm truncate">{conversation.user.name}</p>
                          {conversation.unread > 0 && (
                            <Badge className="ml-2 h-5 min-w-[20px] px-1.5">{conversation.unread}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {selectedConversation.user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{selectedConversation.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.sender === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[44px] max-h-32 resize-none"
                  rows={1}
                />
                <Button onClick={handleSendMessage} className="flex-shrink-0">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}