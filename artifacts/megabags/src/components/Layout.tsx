import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { MessageCircle, Bot, X, Send, Home, Package, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import logoImg from "@assets/megabags-logo-cropped_1777092422600.webp";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-[100dvh] pb-16 md:pb-0 relative overflow-x-hidden">
      {/* Desktop Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm hidden md:block">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src={logoImg} alt="Mega Bags Logo" className="h-12 w-auto object-contain" />
          </Link>

          <nav className="flex items-center gap-8">
            <Link href="/">
              <span className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-foreground/80'}`}>Home</span>
            </Link>
            <Link href="/products">
              <span className={`text-sm font-medium transition-colors hover:text-primary ${location === '/products' ? 'text-primary' : 'text-foreground/80'}`}>Products</span>
            </Link>
            <Link href="/#about">
              <span className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary cursor-pointer">About</span>
            </Link>
            <Link href="/contact">
              <span className={`text-sm font-medium transition-colors hover:text-primary ${location === '/contact' ? 'text-primary' : 'text-foreground/80'}`}>Contact</span>
            </Link>
            <Link href="/contact">
              <Button size="sm" className="rounded-full px-6">Get a Quote</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background h-16 flex items-center px-4 md:hidden">
        <Link href="/" className="flex items-center">
          <img src={logoImg} alt="Mega Bags Logo" className="h-10 w-auto object-contain" />
        </Link>
      </header>

      <main className="flex-1 w-full flex flex-col relative z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1 w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 md:py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="bg-white p-2 inline-block rounded-lg mb-2">
              <img src={logoImg} alt="Mega Bags Logo" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-muted-foreground max-w-sm">
              Premier manufacturer of industrial paper bags, sacks, and multiwall packaging in Ankleshwar, Gujarat.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact</h4>
            <address className="not-italic space-y-3 text-muted-foreground">
              <p>Plot No. 248, Ankleshwar GIDC,<br />Ankleshwar, Gujarat, India</p>
              <p><a href="mailto:mega@megabags.in" className="hover:text-primary transition-colors">mega@megabags.in</a></p>
              <p><a href="tel:+919904077044" className="hover:text-primary transition-colors">+91 99040 77044</a></p>
            </address>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Mega Bags. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Manufactured at Ankleshwar GIDC, Gujarat, India</p>
        </div>
      </footer>

      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-safe md:hidden">
        <div className="flex justify-around items-center h-16">
          <Link href="/">
            <div className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Home size={20} />
              <span className="text-[10px] font-medium">Home</span>
            </div>
          </Link>
          <Link href="/products">
            <div className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location === '/products' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Package size={20} />
              <span className="text-[10px] font-medium">Products</span>
            </div>
          </Link>
          <Link href="/#about">
            <div className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground">
              <Info size={20} />
              <span className="text-[10px] font-medium">About</span>
            </div>
          </Link>
          <Link href="/contact">
            <div className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location === '/contact' ? 'text-primary' : 'text-muted-foreground'}`}>
              <Phone size={20} />
              <span className="text-[10px] font-medium">Contact</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Floating Buttons */}
      <FloatingButtons />
    </div>
  );
}

function FloatingButtons() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! Welcome to Mega Bags. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks! Our team will get back to you shortly. For instant help WhatsApp +91 9161722416.", 
        isBot: true 
      }]);
    }, 1000);
  };

  const handleQuickReply = (text: string) => {
    setMessages(prev => [...prev, { text, isBot: false }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks! Our team will get back to you shortly. For instant help WhatsApp +91 9161722416.", 
        isBot: true 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      
      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-background rounded-2xl shadow-xl border w-[320px] sm:w-[360px] h-[480px] flex flex-col pointer-events-auto overflow-hidden"
          >
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-semibold">Mega Bags Assistant</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:bg-black/10 p-1 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.isBot ? 'bg-white border text-foreground rounded-tl-none' : 'bg-primary text-primary-foreground rounded-tr-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Get a quote", "View products", "Talk to sales"].map(chip => (
                    <button 
                      key={chip}
                      onClick={() => handleQuickReply(chip)}
                      className="bg-white border text-xs px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors text-foreground"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="rounded-full bg-slate-50 border-transparent focus-visible:ring-primary"
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0">
                  <Send size={16} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3 pointer-events-auto">
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-gradient-to-tr from-indigo-600 to-purple-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Bot size={24} />
        </button>

        <a 
          href="https://wa.me/919161722416?text=Hi%20Mega%20Bags%2C%20I%27m%20interested%20in%20your%20paper%20bags." 
          target="_blank" 
          rel="noreferrer"
          className="bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform relative"
        >
          <div className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75"></div>
          <MessageCircle size={24} className="relative z-10" />
        </a>
      </div>
    </div>
  );
}
