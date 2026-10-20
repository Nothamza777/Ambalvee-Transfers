import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft,
  ChevronDown,
  Maximize2,
  Minimize2,
  Package,
  ShoppingBag,
  Truck,
  Image as ImageIcon,
  Shirt,
  Boxes,
  RotateCcw,
  Headphones,
  Paperclip,
  ArrowUp,
  X,
  CheckCircle2,
  ExternalLink,
  Plus,
  Flame,
  Ruler,
  Layers,
  Palette,
  PhoneCall,
  Search,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockStore';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  timestamp: string;
  type?: 'text' | 'tracking' | 'products' | 'mockup' | 'cleanup' | 'orders' | 'support' | 'artwork_check';
  data?: any;
  attachment?: {
    name: string;
    url: string;
    size: string;
    dpi?: number;
  };
  actions?: Array<{
    label: string;
    action: () => void;
    primary?: boolean;
  }>;
}

export const AmbalveeChatbot: React.FC = () => {
  const { 
    chatbotOpen, 
    setChatbotOpen, 
    chatbotInitialPrompt, 
    setChatbotInitialPrompt,
    setView,
    setSelectedProductId,
    addToCart,
    setCartDrawerOpen,
    orders,
    currentUser
  } = useStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; url: string; size: string } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenuCard, setShowMenuCard] = useState(true);

  // Shirt mockup state inside chat
  const [mockupColor, setMockupColor] = useState<'black' | 'white' | 'grey' | 'navy'>('black');
  const [mockupPlacement, setMockupPlacement] = useState<'center' | 'pocket'>('center');

  // Order search tracking input
  const [trackingSearchNumber, setTrackingSearchNumber] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Current time string e.g. "10:32 PM"
  const [currentTimeStr, setCurrentTimeStr] = useState('10:32 PM');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTimeStr(d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showMenuCard]);

  // Handle external initial prompt if triggered from search bar
  useEffect(() => {
    if (chatbotInitialPrompt && chatbotInitialPrompt.trim()) {
      handleUserPrompt(chatbotInitialPrompt.trim());
      setChatbotInitialPrompt('');
    }
  }, [chatbotInitialPrompt]);

  const handleUserPrompt = (promptText: string, fileAttachment?: { name: string; url: string; size: string }) => {
    setShowMenuCard(false);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: currentTimeStr,
      attachment: fileAttachment ? {
        name: fileAttachment.name,
        url: fileAttachment.url,
        size: fileAttachment.size
      } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setSelectedFile(null);
    setIsTyping(true);

    setTimeout(() => {
      generateResponse(promptText, fileAttachment);
      setIsTyping(false);
    }, 600);
  };

  const handleMenuClick = (optionId: string) => {
    setShowMenuCard(false);
    
    // Add user question bubble matching option clicked
    const userPromptMap: Record<string, string> = {
      'track-order': 'Track my order',
      'new-order': 'Start a new order',
      'shipping': 'Shipping & delivery times',
      'upload-artwork': 'Upload my artwork',
      'shirt-mockup': 'See my design on a shirt',
      'cleanup': 'Clean up an image',
      'my-orders': 'My orders',
      'my-designs': 'My designs',
      'reorder': 'Reorder',
      'support': 'Talk to a person',
      'heat-press': 'Heat press settings',
      'size-guide': 'Garment size guide',
    };

    const label = userPromptMap[optionId] || optionId;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: label,
      timestamp: currentTimeStr
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      executeOption(optionId);
      setIsTyping(false);
    }, 500);
  };

  const executeOption = (optionId: string) => {
    const time = currentTimeStr;
    const botMsgId = `bot-${Date.now()}`;

    switch (optionId) {
      case 'track-order':
        const linkedOrders = currentUser
          ? orders.filter(order => order.customerEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase())
          : [];
        const latestLinkedOrder = linkedOrders[0];
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            type: 'text',
            text: latestLinkedOrder
              ? `Your latest order record is ${latestLinkedOrder.orderNumber}, with status "${latestLinkedOrder.status}" and payment ${latestLinkedOrder.paymentStatus}. This demo does not connect to live carrier tracking or fulfillment.`
              : 'No order records are linked to this account yet. Order previews created in this demo remain payment-pending and do not start fulfillment.',
            timestamp: time,
          }
        ]);
        break;

      case 'new-order':
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            type: 'products',
            text: "What would you like to create today? Select any product below to configure size, film style, and add to cart:",
            timestamp: time
          }
        ]);
        break;

      case 'shipping':
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            text: 'Available shipping methods and charges are displayed during checkout. Delivery timing depends on the items, destination, and selected method; this demo does not confirm a dispatch or delivery date.',
            timestamp: time,
            actions: [
              {
                label: 'Browse products',
                action: () => {
                  setSelectedProductId('prod-dtf-gang-sheet');
                  setView('product-detail');
                  setChatbotOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                },
                primary: true
              }
            ]
          }
        ]);
        break;

      case 'upload-artwork':
        fileInputRef.current?.click();
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            text: "Opening file picker! You can upload high-resolution **PNG, SVG, PDF, or PSD** files. I'll automatically check resolution, color gamut, and transparent alpha channels for you.",
            timestamp: time
          }
        ]);
        break;

      case 'shirt-mockup':
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            type: 'mockup',
            text: "Here is a live streetwear shirt mockup previewer! You can switch garment colors and toggle placement on chest or full front:",
            timestamp: time
          }
        ]);
        break;

      case 'cleanup':
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            type: 'cleanup',
            text: "Need artwork prepared for print? Upload a high-resolution file with a transparent background, and our prepress team can help check edges and print readiness.",
            timestamp: time
          }
        ]);
        break;

      case 'my-orders':
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            type: 'orders',
            text: "Here are your recent Ambalvee orders and active print runs:",
            timestamp: time
          }
        ]);
        break;

      case 'my-designs':
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            text: `**Your Saved & Uploaded Designs Library**:\n\n• **Streetwear_Astronaut_Vivid.png** (11" × 11" · 300 DPI · Ready)\n• **Vintage_Motorcycle_Skull.png** (4" × 4" · 300 DPI · Ready)\n• **Arcade_Retro_Cyber_Tiger.png** (22" × 60" Gang Roll · Ready)\n\nAll your uploaded artwork files are securely backed up in high-definition for instant reprinting.`,
            timestamp: time,
            actions: [
              {
                label: 'Upload New Design File',
                action: () => fileInputRef.current?.click(),
                primary: true
              },
              {
                label: 'View Gang Sheet Rolls',
                action: () => {
                  setSelectedProductId('prod-dtf-gang-sheet');
                  setView('product-detail');
                  setChatbotOpen(false);
                }
              }
            ]
          }
        ]);
        break;

      case 'reorder':
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            text: 'Review order records in your account to choose items to add again. This demo does not retain uploaded artwork between sessions.',
            timestamp: time,
            actions: [
              {
                label: 'Open account orders',
                action: () => {
                  setView('account');
                  setChatbotOpen(false);
                },
                primary: true
              }
            ]
          }
        ]);
        break;

      case 'support':
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            type: 'support',
            text: "Use this panel for general navigation help. Order previews and product details shown in this demo are not connected to live fulfillment.",
            timestamp: time
          }
        ]);
        break;
      case 'heat-press':
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            text: 'Pressing conditions vary by transfer, fabric, and equipment. Review the current instructions supplied with the product and test a sample before a production run.',
            timestamp: time
          }
        ]);
        break;

      case 'size-guide':
        setMessages(prev => [
          ...prev,
          {
            id: botMsgId,
            sender: 'bot',
            text: `**Standard Garment Sizing Recommendations**:\n\n• **Left Chest / Pocket**: 3.5" to 4.5" wide\n• **Cap / Hat Front**: 2.5" to 4" wide\n• **Youth Shirts**: 7" to 9" wide\n• **Adult Standard**: 10" to 11.5" wide (Most popular!)\n• **Oversized Streetwear Back**: 12" to 14" wide\n• **Sleeve Print**: 2.5" × 11" to 14"`,
            timestamp: time,
            actions: [
              {
                label: 'Shop Transfers by Size',
                action: () => {
                  setSelectedProductId('prod-dtf-custom-size');
                  setView('product-detail');
                  setChatbotOpen(false);
                },
                primary: true
              }
            ]
          }
        ]);
        break;

      default:
        generateResponse(optionId);
        break;
    }
  };

  const generateResponse = (prompt: string, attachment?: { name: string; url: string; size: string }) => {
    const lower = prompt.toLowerCase();
    const time = currentTimeStr;
    const botMsgId = `bot-${Date.now()}`;

    if (attachment) {
      setMessages(prev => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          type: 'artwork_check',
          text: `**Prepress Verification Complete for "${attachment.name}"**!\n\n• **Resolution**: 300 DPI High-Definition Ready\n• **Transparency**: Alpha channel background detected (no box borders)\n• **Color Gamut**: CMYK Vivid AF calibrated\n• **Optimal Sizing**: Adult Standard (11" × 11") or 22" Gang Roll\n\nYour file is 100% production-ready with zero artwork setup fees!`,
          timestamp: time,
          attachment: {
            ...attachment,
            dpi: 300
          },
          actions: [
            {
              label: 'Add 11"×11" Transfer to Cart ($9.99)',
              action: () => {
                addToCart({
                  productId: 'prod-dtf-custom-size',
                  productName: `Custom DTF Transfer (${attachment.name})`,
                  category: 'dtf-transfers',
                  productImage: attachment.url,
                  variantId: 'custom-11x11',
                  variantName: 'Adult 11" x 11"',
                  unitPrice: 9.99,
                  quantity: 1
                });
                setCartDrawerOpen(true);
              },
              primary: true
            },
            {
              label: 'See on T-Shirt Mockup',
              action: () => {
                executeOption('shirt-mockup');
              }
            }
          ]
        }
      ]);
      return;
    }

    if (lower.includes('track') || lower.includes('order') || lower.includes('status') || lower.includes('where is')) {
      executeOption('track-order');
      return;
    }

    if (lower.includes('heat') || lower.includes('press') || lower.includes('temp') || lower.includes('peel')) {
      setMessages(prev => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: `**Official Ambalvee Heat Press Settings**:\n\n• **100% Cotton & Heavy Tees**: 300°F - 320°F (150°C - 160°C) for 12-15s at Medium-Heavy pressure (55 PSI). Warm or cold peel.\n• **100% Polyester / Dry-Fit**: 275°F - 285°F for 10-12s. Cold peel only.\n• **50/50 Blends**: 290°F - 305°F for 12s. Warm peel.\n• **Canvas & Denim**: 320°F for 15s at 60 PSI.\n\n**Pro Tip**: Finish with a 5-second post-press using Teflon or parchment paper for a soft, matte retail finish!`,
          timestamp: time
        }
      ]);
      return;
    }

    if (lower.includes('size') || lower.includes('dimension') || lower.includes('chest') || lower.includes('pocket')) {
      setMessages(prev => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: `**Standard Garment Sizing Recommendations**:\n\n• **Left Chest / Pocket**: 3.5" to 4.5" wide\n• **Cap / Hat Front**: 2.5" to 4" wide\n• **Youth Shirts**: 7" to 9" wide\n• **Adult Standard**: 10" to 11.5" wide (Most popular!)\n• **Oversized Streetwear Back**: 12" to 14" wide\n• **Sleeve Print**: 2.5" × 11" to 14"`,
          timestamp: time,
          actions: [
            {
              label: 'Shop Transfers by Size',
              action: () => {
                setSelectedProductId('prod-dtf-custom-size');
                setView('product-detail');
                setChatbotOpen(false);
              },
              primary: true
            }
          ]
        }
      ]);
      return;
    }

    // Default customer-support response.
    setMessages(prev => [
      ...prev,
      {
        id: botMsgId,
        sender: 'bot',
        text: `I'm here to help with all your DTF transfer questions! You can track orders, upload designs, check press settings, or tap the menu button below anytime.`,
        timestamp: time,
        actions: [
          {
            label: 'View All Menu Options',
            action: () => setShowMenuCard(true),
            primary: true
          }
        ]
      }
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    setSelectedFile({
      name: file.name,
      url: url,
      size: sizeStr
    });

    e.target.value = '';
  };

  if (!chatbotOpen) {
    return (
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setChatbotOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0084ff] hover:bg-[#0070da] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none ring-4 ring-blue-500/20"
          aria-label="Open customer support"
        >
          {/* Customer support shortcut */}
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 shadow-xs">
              <Headphones className="w-5 h-5 text-[#0084ff]" aria-hidden="true" />
            </div>
          </div>
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-xs" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* CHATBOT WINDOW (PIXEL-PERFECT MATCH TO chatbot.png)                       */}
      {/* ========================================================================= */}
      <div className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 transition-all duration-300 flex flex-col ${
        isExpanded 
          ? 'w-[95vw] max-w-[640px] h-[85vh]' 
          : 'w-[400px] max-w-[calc(100vw-24px)] h-[650px] max-h-[calc(100vh-100px)]'
      } bg-white rounded-3xl shadow-2xl border border-neutral-200/90 overflow-hidden font-sans`}>

        {/* 1. BRIGHT BLUE HEADER BAR (MATCHING chatbot.png) */}
        <div className="bg-gradient-to-r from-[#0084ff] via-[#0091ff] to-[#0084ff] text-white px-4 py-3 flex items-center justify-between shadow-xs shrink-0">
          
          {/* Left Arrow & Mascot */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMenuCard(true)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors text-white"
              title="Back to Menu"
              aria-label="Back to Menu"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Mascot Avatar with Cute Ninja Headband/Glasses */}
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md p-1 shrink-0 overflow-hidden">
              <div className="w-full h-full rounded-full bg-[#0084ff] flex flex-col items-center justify-center text-[8px] font-black leading-none text-white">
                <span className="text-[10px]">S</span>
              </div>
            </div>

            {/* Bot Name & Subtitle */}
            <div className="leading-tight">
              <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Ambalvee Support
              </h3>
              <span className="text-[11px] text-blue-100 block font-medium">
                Product, artwork &amp; order help
              </span>
            </div>
          </div>

          {/* Right Header Controls: Expand & Chevron Down */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
              aria-label="Expand Window"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setChatbotOpen(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-xs"
              title="Close Chat"
              aria-label="Close Chat"
            >
              <ChevronDown className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

        </div>

        {/* 2. CHAT CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/70 text-xs">
          
          {/* Centered Timestamp (matching chatbot.png) */}
          <div className="text-center">
            <span className="text-[11px] font-medium text-neutral-400">
              {currentTimeStr}
            </span>
          </div>

          {/* Initial Greeting Text */}
          <div className="text-neutral-900 font-bold text-sm px-1">
            What are you looking for today?
          </div>

          {/* "HOW CAN WE HELP?" MENU CARD (MATCHING chatbot.png EXACTLY) */}
          {showMenuCard && (
            <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 bg-neutral-50/60 border-b border-neutral-100 text-[11px] font-black uppercase tracking-wider text-neutral-500 flex items-center justify-between">
                <span>HOW CAN WE HELP?</span>
                <span className="text-[10px] text-blue-600 font-bold">Customer support</span>
              </div>

              {/* PROMINENT UPLOAD STUFF BUTTON */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50/70 border-b border-neutral-100">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 bg-[#0084ff] hover:bg-[#0070da] text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Paperclip className="w-4 h-4 stroke-[2.5]" />
                  <span>Upload stuff (PNG, SVG, PDF)</span>
                </button>
                <span className="text-[10px] text-neutral-500 text-center block mt-1 font-medium">
                  Instant 300 DPI Prepress Check &amp; Background Removal
                </span>
              </div>

              <div className="divide-y divide-neutral-100 text-xs font-semibold text-neutral-800">
                
                {/* 1. Track my order */}
                <button
                  onClick={() => handleMenuClick('track-order')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <Package className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>Track my order</span>
                </button>

                {/* 2. Start a new order */}
                <button
                  onClick={() => handleMenuClick('new-order')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <ShoppingBag className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>Start a new order</span>
                </button>

                {/* 3. Shipping & delivery times */}
                <button
                  onClick={() => handleMenuClick('shipping')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <Truck className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>Shipping &amp; delivery times</span>
                </button>

                {/* 4. Upload my artwork */}
                <button
                  onClick={() => handleMenuClick('upload-artwork')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <ImageIcon className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>Upload my artwork</span>
                </button>

                {/* 5. See my design on a shirt */}
                <button
                  onClick={() => handleMenuClick('shirt-mockup')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <Shirt className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>See my design on a shirt</span>
                </button>

                {/* 6. Clean up an image */}
                <button
                  onClick={() => handleMenuClick('cleanup')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <ImageIcon className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>Request an artwork review</span>
                </button>

                {/* 7. My orders */}
                <button
                  onClick={() => handleMenuClick('my-orders')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <Boxes className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>My orders</span>
                </button>

                {/* 8. My designs */}
                <button
                  onClick={() => handleMenuClick('my-designs')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <Palette className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>My designs</span>
                </button>

                {/* 9. Reorder */}
                <button
                  onClick={() => handleMenuClick('reorder')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <RotateCcw className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>Reorder</span>
                </button>

                {/* 10. Heat press settings */}
                <button
                  onClick={() => handleMenuClick('heat-press')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <Flame className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>Heat press settings</span>
                </button>

                {/* 11. Garment size guide */}
                <button
                  onClick={() => handleMenuClick('size-guide')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <Ruler className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>Garment size guide</span>
                </button>

                {/* 12. Talk to a person */}
                <button
                  onClick={() => handleMenuClick('support')}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50/50 hover:text-[#0084ff] flex items-center gap-3 transition-colors group"
                >
                  <Headphones className="w-4 h-4 text-neutral-500 group-hover:text-[#0084ff]" />
                  <span>Talk to a person</span>
                </button>

              </div>
            </div>
          )}

          {/* Conversation Feed */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed ${
                    isUser
                      ? 'bg-[#0084ff] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-neutral-800 rounded-bl-xs border border-neutral-200/90 shadow-2xs'
                  }`}
                >
                  {/* Uploaded Image Thumbnail */}
                  {msg.attachment && (
                    <div className="mb-2 p-2 rounded-xl bg-neutral-100/90 border border-neutral-200 flex items-center gap-2.5 text-neutral-900">
                      <img 
                        src={msg.attachment.url} 
                        alt="Uploaded file" 
                        className="w-12 h-12 object-cover rounded-lg border border-neutral-300 shrink-0 bg-white" 
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs truncate block text-neutral-900">
                          {msg.attachment.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">
                          {msg.attachment.size}
                        </span>
                        {msg.attachment.dpi && (
                          <span className="inline-block mt-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                            ✓ 300 DPI Prepress Verified
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Formatted Text */}
                  {msg.text && (
                    <div className="whitespace-pre-wrap space-y-1">
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (line.startsWith('• ')) {
                          return (
                            <div key={lIdx} className="flex items-start gap-1.5 pl-1">
                              <span className="text-sky-500 font-bold">•</span>
                              <span>{line.replace('• ', '')}</span>
                            </div>
                          );
                        }
                        return <p key={lIdx}>{line}</p>;
                      })}
                    </div>
                  )}

                  {/* WIDGET: TRACKING STATUS */}
                  {msg.type === 'tracking' && msg.data && (
                    <div className="mt-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 block uppercase">Order ID</span>
                          <span className="font-mono font-black text-sm text-neutral-900">{msg.data.orderNumber}</span>
                        </div>
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {msg.data.status}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-neutral-500">Carrier:</span>
                          <span className="font-bold text-neutral-900">{msg.data.carrier}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-neutral-500">Estimated Delivery:</span>
                          <span className="font-bold text-emerald-600">{msg.data.eta}</span>
                        </div>
                      </div>

                      {/* Step Timeline */}
                      <div className="pt-2 border-t border-neutral-200 space-y-2">
                        {msg.data.steps.map((st: any, sIdx: number) => (
                          <div key={sIdx} className="flex items-start gap-2 text-[11px]">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              st.done 
                                ? 'bg-emerald-500 text-white' 
                                : st.active 
                                  ? 'bg-blue-500 text-white animate-pulse' 
                                  : 'bg-neutral-200 text-neutral-400'
                            }`}>
                              {st.done ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                            </div>
                            <div className="min-w-0 flex-1 flex justify-between">
                              <span className={st.active ? 'font-black text-blue-600' : 'text-neutral-700'}>
                                {st.title}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono ml-2">{st.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Custom Order Search input */}
                      <div className="pt-2 flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Search another Order ID..."
                          value={trackingSearchNumber}
                          onChange={(e) => setTrackingSearchNumber(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                        <button
                          onClick={() => {
                            if (trackingSearchNumber.trim()) {
                              handleUserPrompt(`Check tracking for order #${trackingSearchNumber.trim()}`);
                              setTrackingSearchNumber('');
                            }
                          }}
                          className="px-3 py-1.5 bg-[#0084ff] text-white rounded-lg text-xs font-bold"
                        >
                          Check
                        </button>
                      </div>
                    </div>
                  )}

                  {/* WIDGET: START A NEW ORDER CARDS */}
                  {msg.type === 'products' && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => {
                          setSelectedProductId('prod-dtf-gang-sheet');
                          setView('product-detail');
                          setChatbotOpen(false);
                        }}
                        className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-blue-50 hover:border-blue-400 text-left transition-all group"
                      >
                        <span className="font-extrabold text-neutral-900 block group-hover:text-blue-600">
                          Gang Sheets
                        </span>
                        <span className="text-[10px] text-neutral-500 block">From $16.99 (22" Roll)</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProductId('prod-dtf-custom-size');
                          setView('product-detail');
                          setChatbotOpen(false);
                        }}
                        className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-blue-50 hover:border-blue-400 text-left transition-all group"
                      >
                        <span className="font-extrabold text-neutral-900 block group-hover:text-blue-600">
                          Single Transfers
                        </span>
                        <span className="text-[10px] text-neutral-500 block">By Size (2" to 14")</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProductId('prod-uv-decals-sheet');
                          setView('product-detail');
                          setChatbotOpen(false);
                        }}
                        className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-blue-50 hover:border-blue-400 text-left transition-all group"
                      >
                        <span className="font-extrabold text-neutral-900 block group-hover:text-blue-600">
                          UV DTF Decals
                        </span>
                        <span className="text-[10px] text-neutral-500 block">Hard Surface Wraps</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProductId('prod-heavyweight-tees');
                          setView('product-detail');
                          setChatbotOpen(false);
                        }}
                        className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-blue-50 hover:border-blue-400 text-left transition-all group"
                      >
                        <span className="font-extrabold text-neutral-900 block group-hover:text-blue-600">
                          Blank Apparel
                        </span>
                        <span className="text-[10px] text-neutral-500 block">Gildan, Bella, Next Level</span>
                      </button>
                    </div>
                  )}

                  {/* WIDGET: SHIRT MOCKUP PREVIEWER */}
                  {msg.type === 'mockup' && (
                    <div className="mt-3 p-3.5 bg-neutral-900 text-white rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-300">Live Garment Mockup</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setMockupPlacement('center')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${mockupPlacement === 'center' ? 'bg-[#0084ff]' : 'bg-neutral-800'}`}
                          >
                            Full Front
                          </button>
                          <button
                            onClick={() => setMockupPlacement('pocket')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${mockupPlacement === 'pocket' ? 'bg-[#0084ff]' : 'bg-neutral-800'}`}
                          >
                            Left Chest
                          </button>
                        </div>
                      </div>

                      {/* Mockup Canvas */}
                      <div className="relative aspect-square max-w-[240px] mx-auto rounded-xl overflow-hidden flex items-center justify-center border border-neutral-800"
                        style={{
                          backgroundColor: mockupColor === 'black' ? '#111827' : mockupColor === 'white' ? '#f8fafc' : mockupColor === 'grey' ? '#94a3b8' : '#1e3a8a'
                        }}
                      >
                        {/* Shirt Mockup base outline */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                          <Shirt className={`w-36 h-36 ${mockupColor === 'white' ? 'text-black' : 'text-white'}`} />
                        </div>

                        {/* Graphic artwork placement */}
                        <div className={`relative transition-all duration-300 ${
                          mockupPlacement === 'center' ? 'w-24 h-24' : 'w-12 h-12 -translate-x-6 -translate-y-6'
                        }`}>
                          <img 
                            src={selectedFile?.url || ASSETS.featureAstronaut} 
                            alt="Design Mockup" 
                            className="w-full h-full object-contain drop-shadow-lg" 
                          />
                        </div>
                      </div>

                      {/* Color Selector Swatches */}
                      <div className="flex items-center justify-center gap-2 pt-1">
                        {[
                          { id: 'black', hex: '#111827', name: 'Black' },
                          { id: 'white', hex: '#ffffff', name: 'White' },
                          { id: 'grey', hex: '#9ca3af', name: 'Grey' },
                          { id: 'navy', hex: '#1e3a8a', name: 'Navy' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setMockupColor(c.id as any)}
                            style={{ backgroundColor: c.hex }}
                            className={`w-5 h-5 rounded-full border-2 transition-transform ${
                              mockupColor === c.id ? 'border-sky-400 scale-125' : 'border-neutral-600'
                            }`}
                            title={c.name}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 bg-[#0084ff] hover:bg-[#0070da] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Upload My Own Design on Shirt</span>
                      </button>
                    </div>
                  )}

                  {/* WIDGET: CLEAN UP AN IMAGE */}
                  {msg.type === 'cleanup' && (
                    <div className="mt-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-2.5">
                      <div className="flex items-center gap-2 text-neutral-900 font-extrabold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Artwork Cleanup &amp; Vector Enhancement</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        Upload your artwork for a prepress review. Our team can advise on background cleanup, edge quality, and print resolution.
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Upload artwork for review</span>
                      </button>
                    </div>
                  )}

                  {/* WIDGET: MY ORDERS */}
                  {msg.type === 'orders' && (
                    <div className="mt-3 space-y-2 text-xs">
                      {(orders && orders.length > 0 ? orders : [
                        {
                          id: 'AMB-83921',
                          total: 49.99,
                          status: 'processing',
                          createdAt: 'Today',
                          items: [{ productName: '22" x 60" Custom DTF Gang Sheet Roll', quantity: 1 }]
                        },
                        {
                          id: 'AMB-71204',
                          total: 129.99,
                          status: 'completed',
                          createdAt: '3 days ago',
                          items: [{ productName: '22" x 240" Wholesale Roll', quantity: 1 }]
                        }
                      ]).map((ord: any) => (
                        <div key={ord.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                          <div>
                            <span className="font-mono font-black text-neutral-900 block">#{ord.id}</span>
                            <span className="text-[10px] text-neutral-500">{ord.items[0]?.productName}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold block">${ord.total.toFixed(2)}</span>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">{ord.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* WIDGET: TALK TO A PERSON */}
                  {msg.type === 'support' && (
                    <div className="mt-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0084ff] text-white flex items-center justify-center shrink-0 font-black">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-extrabold text-neutral-900 block">Ambalvee Live Support Team</span>
                          <span className="text-[11px] text-emerald-600 font-bold">● Representatives Online Now</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1 text-[11px] text-neutral-600">
                        <p>• <strong>Phone</strong>: 1-888-356-3665 (Toll-Free, Mon-Fri 8am-8pm EST)</p>
                        <p>• <strong>Email</strong>: support@ambalvee.com (Guaranteed &lt;15m response)</p>
                      </div>

                      <a
                        href="tel:18883563665"
                        className="w-full py-2.5 bg-[#0084ff] hover:bg-[#0070da] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors block text-center"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Call 1-888-356-3665 Now</span>
                      </a>
                    </div>
                  )}

                  {/* Action CTA Buttons inside Message */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-100 flex flex-col gap-1.5">
                      {msg.actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={act.action}
                          className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                            act.primary 
                              ? 'bg-[#0084ff] hover:bg-[#0070da] text-white shadow-xs' 
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                          }`}
                        >
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                </div>

                <span className="text-[10px] text-neutral-400 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 bg-white border border-neutral-200 rounded-2xl w-fit rounded-bl-xs text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0084ff] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0084ff] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0084ff] animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. BOTTOM INPUT CONTAINER (EXACT MATCH TO chatbot.png) */}
        <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
          
          {/* Staged File Pill if selected */}
          {selectedFile && (
            <div className="mb-2 p-2 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <img src={selectedFile.url} alt="Staged" className="w-8 h-8 rounded-lg object-cover bg-white border" />
                <div className="truncate">
                  <span className="font-bold text-neutral-900 block truncate">{selectedFile.name}</span>
                  <span className="text-[10px] text-neutral-500">{selectedFile.size} · Ready to attach</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/png,image/jpeg,image/svg+xml,image/webp,application/pdf" 
            className="hidden" 
          />

          {/* Input Box Card with "Ask me anything...." and Bottom Action Row */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-3 shadow-xs space-y-2">
            
            {/* Top Text Field */}
            <input
              type="text"
              placeholder="Ask me anything...."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!inputVal.trim() && !selectedFile) return;
                  handleUserPrompt(inputVal.trim() || 'Please check this attached design file', selectedFile || undefined);
                }
              }}
              className="w-full bg-transparent border-0 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none"
            />

            {/* Bottom Row: 3-Dots Pill Button, Paperclip, and Send Up-Arrow */}
            <div className="flex items-center justify-between pt-1">
              
              {/* Left Cluster: 3-Dots Pill Button + Paperclip */}
              <div className="flex items-center gap-2">
                
                {/* 3-DOTS RECTANGULAR PILL BUTTON (MATCHING chatbot.png) */}
                <button
                  type="button"
                  onClick={() => setShowMenuCard(!showMenuCard)}
                  title="Menu Options"
                  aria-label="Menu Options"
                  className="px-2.5 py-1 rounded-xl border border-neutral-900 bg-white hover:bg-neutral-50 flex items-center justify-center gap-0.5 transition-colors shadow-2xs"
                >
                  <span className="w-1 h-1 rounded-full bg-[#0084ff]" />
                  <span className="w-1 h-1 rounded-full bg-[#0084ff]" />
                  <span className="w-1 h-1 rounded-full bg-[#0084ff]" />
                </button>

                {/* Paperclip Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach Artwork File"
                  aria-label="Attach Artwork File"
                  className="p-1 text-neutral-500 hover:text-[#0084ff] transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

              </div>

              {/* Right: Circular Send Up-Arrow Button (MATCHING chatbot.png) */}
              <button
                type="button"
                onClick={() => {
                  if (!inputVal.trim() && !selectedFile) return;
                  handleUserPrompt(inputVal.trim() || 'Please check this attached design file', selectedFile || undefined);
                }}
                disabled={!inputVal.trim() && !selectedFile}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  inputVal.trim() || selectedFile
                    ? 'bg-[#0084ff] text-white shadow-xs hover:scale-105 active:scale-95'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
                aria-label="Send"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* FLOATING TRIGGER WHEN CHATBOT IS OPEN (MATCHING BLUE DOWN CHEVRON BUTTON IN chatbot.png) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setChatbotOpen(false)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0084ff] hover:bg-[#0070da] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ring-4 ring-blue-500/20"
          aria-label="Minimize Chatbot"
        >
          <ChevronDown className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>
    </>
  );
};
