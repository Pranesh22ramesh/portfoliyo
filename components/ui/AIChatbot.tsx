'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';

// Full resume knowledge base
const RESUME_DATA = {
  name: 'Pranesh BR',
  title: 'Software Systems Student',
  location: 'Karur, Tamil Nadu, India',
  email: 'praneshrsm@gmail.com',
  phone: '+91 8300453308',
  linkedin: 'https://www.linkedin.com/in/pranesh-ramesh-67a0a9246/',
  github: 'https://github.com/Pranesh22ramesh',
  languages: ['Tamil', 'English'],
  summary: 'Driven Software Systems student with practical experience in web development, UI optimization, debugging, AWS cloud services, and DevOps practices. Eager to contribute to scalable frontend solutions and cloud-based applications while continually enhancing technical and professional skills.',
  education: [
    { school: 'Kongu Engineering College, Perundurai', degree: 'Master of Science (Software Systems)', year: '2023 - Present', cgpa: '7.12' },
    { school: 'Bharani Park Matriculation Hr Sec School', degree: 'Matriculation', year: 'Year of Passing: 2023', percentage: '61%' },
  ],
  specializedIn: ['C', 'C++', 'Python (Advanced)', 'MySQL', 'MongoDB', 'Java (Intermediate)', 'HTML', 'CSS', 'DevOps', 'Node.js', 'JavaScript', 'AWS (EC2, S3, RDS)', 'React', 'PHP', 'Express'],
  professionalSkills: ['Agile Methodologies', 'Problem Solving', 'Team Collaboration', 'Adaptability'],
  technicalSkills: ['Front-End Development', 'User Experience (UX) Design', 'Testing and Debugging', 'Mernstack'],
  technicalTools: ['Git & GitHub', 'VS Code', 'Figma', 'Docker', 'Jenkins', 'Jira', 'Wireshark'],
  certifications: [
    'Ethical Hacking 101: Beginners Guide to Ethical Hacking (SkillUp)',
    'Oracle APEX Cloud Developer Certified Professional',
    'Data Structures using Java',
    'Introduction to Cybersecurity (Cisco)',
    'Testing Tools / Selenium with Java & Python / API Testing on NASSCOM',
    'Cyber Threat Management course (Cisco)',
  ],
  projects: [
    { name: 'Certificate Generator', desc: 'Developed a MERN-stack web application for intern management and secure certificate generation with QR verification, PDF export, analytics, and automated email notifications.' },
    { name: 'Bouquet Shop Web', desc: 'Built a full-stack flower shop e-commerce website using MERN with product management, cart, order processing, admin dashboard, AI chatbot, and responsive UI.' },
    { name: 'API Downtime Analyzer', desc: 'Created a Python-based API monitoring system using LSTM and Autoencoder models for predictive downtime detection with real-time alerts and analytics dashboard.' },
    { name: 'Sign Language Translator', desc: 'Developed an AI system using TensorFlow, OpenCV, Django, and Streamlit for real-time sign language translation and facial emotion recognition.' },
    { name: 'Rice Amount Calculation App', desc: 'Built cross-platform React Native (Expo) mobile app for order management and customer collection tracking with reporting, authentication, and SMS notifications.' },
  ],
  achievements: ['Won Third Prize in Hackwave 3.0.1 at KEC'],
};

function findAnswer(input: string): string {
  const q = input.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|greetings|good\s*(morning|evening|afternoon))/.test(q)) {
    return `Hello! 👋 I'm Pranesh's AI assistant. I know everything about his skills, projects, education, and experience. What would you like to know?`;
  }

  // Name / who
  if (/who (is|are) (pranesh|you|he)|what('?s| is) (your|his|pranesh) name/.test(q)) {
    return `He's **${RESUME_DATA.name}** — a ${RESUME_DATA.title} based in ${RESUME_DATA.location}. ${RESUME_DATA.summary}`;
  }

  // Contact
  if (/contact|email|phone|reach|call|number|mail/.test(q)) {
    return `📧 Email: ${RESUME_DATA.email}\n📱 Phone: ${RESUME_DATA.phone}\n🔗 LinkedIn: ${RESUME_DATA.linkedin}\n💻 GitHub: ${RESUME_DATA.github}`;
  }

  // Education
  if (/education|college|university|degree|study|school|cgpa|gpa|qualification/.test(q)) {
    return RESUME_DATA.education.map(e =>
      `🎓 **${e.degree}** at ${e.school} (${e.year})${e.cgpa ? ` — CGPA: ${e.cgpa}` : ''}${e.percentage ? ` — ${e.percentage}` : ''}`
    ).join('\n\n');
  }

  // Skills
  if (/skill|tech|stack|language|program|code|framework|tool/.test(q)) {
    return `**Specialized In:** ${RESUME_DATA.specializedIn.join(', ')}\n\n**Tools:** ${RESUME_DATA.technicalTools.join(', ')}\n\n**Other:** ${RESUME_DATA.technicalSkills.join(', ')}`;
  }

  // Projects
  if (/project|work|built|develop|create|portfolio|app|application/.test(q)) {
    return RESUME_DATA.projects.map(p => `🚀 **${p.name}:** ${p.desc}`).join('\n\n');
  }

  // Specific projects
  if (/certificate/.test(q)) {
    const p = RESUME_DATA.projects[0];
    return `🚀 **${p.name}:** ${p.desc}`;
  }
  if (/bouquet|flower|shop/.test(q)) {
    const p = RESUME_DATA.projects[1];
    return `🚀 **${p.name}:** ${p.desc}`;
  }
  if (/api|downtime|monitor/.test(q)) {
    const p = RESUME_DATA.projects[2];
    return `🚀 **${p.name}:** ${p.desc}`;
  }
  if (/sign\s*language|translator|opencv|tensorflow/.test(q)) {
    const p = RESUME_DATA.projects[3];
    return `🚀 **${p.name}:** ${p.desc}`;
  }
  if (/rice|calculation|mobile|expo|react\s*native/.test(q)) {
    const p = RESUME_DATA.projects[4];
    return `🚀 **${p.name}:** ${p.desc}`;
  }

  // Certifications
  if (/certif|course|credential|oracle|cisco|nasscom|ethical/.test(q)) {
    return `📜 Pranesh holds these certifications:\n${RESUME_DATA.certifications.map(c => `• ${c}`).join('\n')}`;
  }

  // Achievements
  if (/achieve|award|prize|hack|competition|win/.test(q)) {
    return `🏆 ${RESUME_DATA.achievements[0]}\n\nHe also has ${RESUME_DATA.certifications.length} key certifications across cybersecurity, cloud, testing, and data structures.`;
  }

  // Experience / summary
  if (/experience|summary|about|background|intro|tell me/.test(q)) {
    return RESUME_DATA.summary;
  }

  // Location
  if (/where|location|city|state|based|live/.test(q)) {
    return `📍 Pranesh is based in **${RESUME_DATA.location}**. He speaks ${RESUME_DATA.languages.join(' and ')}.`;
  }

  // Resume / CV
  if (/resume|cv|download/.test(q)) {
    return `📄 You can download Pranesh's resume from the "Download Resume" button in the Hero section at the top of this page, or scroll up and click it!`;
  }

  // Hire / availability
  if (/hire|available|freelance|intern|job|open/.test(q)) {
    return `✅ Yes! Pranesh is open to new opportunities — internships, full-time roles, or freelance projects in Frontend, MERN, Cloud, Testing, and Cybersecurity. Reach out at ${RESUME_DATA.email}!`;
  }

  // GitHub
  if (/github|repo|code|open\s*source/.test(q)) {
    return `💻 Pranesh's GitHub: ${RESUME_DATA.github}\n\nHe has public repositories for all his major projects including Certificate Generator, Bouquet Shop, API Downtime Analyzer, and more.`;
  }

  // LinkedIn
  if (/linkedin|connect|network/.test(q)) {
    return `🔗 Connect with Pranesh on LinkedIn: ${RESUME_DATA.linkedin}`;
  }

  // AWS / Cloud
  if (/aws|cloud|ec2|s3|rds/.test(q)) {
    return `☁️ Pranesh has hands-on experience with AWS services including EC2, S3, and RDS. He's certified and experienced in cloud deployment and DevOps practices.`;
  }

  // DevOps
  if (/devops|docker|jenkins|ci|cd|deploy/.test(q)) {
    return `⚙️ Pranesh is skilled in DevOps with experience in Docker, Jenkins, Git, and CI/CD pipelines. He uses these tools for building and deploying scalable applications.`;
  }

  // Cybersecurity
  if (/cyber|security|hack|ethical|wireshark|threat/.test(q)) {
    return `🔒 Pranesh is passionate about cybersecurity. He holds certifications in Ethical Hacking, Intro to Cybersecurity (Cisco), and Cyber Threat Management (Cisco). He also uses tools like Wireshark for network analysis.`;
  }

  // Thank you
  if (/thank|thanks|bye|goodbye/.test(q)) {
    return `You're welcome! 😊 Feel free to ask anything else about Pranesh, or use the contact form to reach out directly. Have a great day!`;
  }

  // Default
  return `Great question! Pranesh is a ${RESUME_DATA.title} at Kongu Engineering College with expertise in MERN stack, Python, AWS, DevOps, and Cybersecurity. He has built 5+ real-world projects and holds 6 certifications. What specific area would you like to know more about? Try asking about his projects, skills, education, or certifications!`;
}

import ReactMarkdown from 'react-markdown';

const QUICK_ACTIONS = [
  { label: '🚀 Projects', query: 'Tell me about your projects.' },
  { label: '⚙️ Skills', query: 'What are your technical skills?' },
  { label: '📜 Certifications', query: 'What certifications do you have?' },
  { label: '📞 Contact', query: 'How can I contact you?' }
];

const INITIAL_MESSAGE = "Hi! 👋 I'm Pranesh's AI assistant. I know all about his projects, skills, certifications, and experience from his resume. Ask me anything!";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    const userMessage = textToSend.trim();
    const updatedMessages: { role: 'user' | 'bot'; content: string }[] = [
      ...messages,
      { role: 'user', content: userMessage }
    ];

    setMessages(updatedMessages);
    if (!overrideInput) setInput('');
    setIsTyping(true);
    setShowQuickActions(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        throw new Error('No reader available');
      }

      // Add empty message for bot's streaming content
      setMessages((prev) => [...prev, { role: 'bot', content: '' }]);
      setIsTyping(false);

      let botReply = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith('data:')) {
            const dataStr = trimmed.slice(5).trim();
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                botReply += parsed.delta.text;
                setMessages((prev) => {
                  const next = [...prev];
                  if (next.length > 0) {
                    next[next.length - 1] = {
                      role: 'bot',
                      content: botReply,
                    };
                  }
                  return next;
                });
              }
            } catch (e) {
              // Ignore partial or malformed JSON chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Offline fallback
      const fallbackReply = findAnswer(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: `*(Offline Fallback)* ${fallbackReply}` },
      ]);
      setIsTyping(false);
    }
  };

  const handleActionClick = (query: string) => {
    handleSend(query);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[340px] md:w-[380px] h-[520px] rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            style={{ background: 'rgba(8,12,28,0.95)', backdropFilter: 'blur(24px)' }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-400 relative">
                  <Bot size={22} />
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Ask About Pranesh</h3>
                  <p className="text-[10px] text-white/40 flex items-center gap-1">
                    <Sparkles size={8} className="text-blue-400" /> Resume-powered AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-grow overflow-y-auto px-4 py-4 space-y-3 scroll-smooth flex flex-col"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: { type: 'spring', stiffness: 260, damping: 20 }
                  }}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white font-medium rounded-br-md'
                        : 'bg-white/8 text-white/85 border border-white/8 rounded-bl-md'
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        strong: ({ children }) => <strong className="font-bold text-blue-400">{children}</strong>,
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">{children}</a>
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/8 border border-white/8 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Chips */}
            {showQuickActions && (
              <div className="px-4 py-2 flex flex-wrap gap-2 justify-center border-t border-white/5 bg-white/[0.02]">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleActionClick(action.query)}
                    className="px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 text-white/80 hover:text-white transition-all transform active:scale-95 duration-200"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/8">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about projects, skills..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 pr-11 transition-colors placeholder:text-white/25"
                />
                <button
                  onClick={() => handleSend()}
                  className="absolute right-1.5 w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl relative"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          </motion.div>
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold">1</span>
        )}
      </motion.button>
    </div>
  );
}

