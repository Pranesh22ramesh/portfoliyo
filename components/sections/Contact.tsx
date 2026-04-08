'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Send, X, MessageSquare, CheckCircle2, FileText, Eye, Download } from 'lucide-react';
import dynamic from 'next/dynamic';
import emailjs from '@emailjs/browser';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'praneshrsm@gmail.com', href: 'mailto:praneshrsm@gmail.com', color: '#3b82f6' },
  { icon: Phone, label: 'Phone', value: '+91 8300453308', href: 'tel:+918300453308', color: '#0ea5e9' },
  { icon: MapPin, label: 'Location', value: 'Karur, Tamil Nadu, India', href: null, color: '#06b6d4' },
];

const socials = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/Pranesh22ramesh', color: '#3b82f6', desc: 'Check my repos' },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/pranesh-ramesh-67a0a9246/',
    color: '#0ea5e9',
    desc: 'Connect with me',
  },
];

// EmailJS config - using environment variables for security
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_portfolio';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_contact';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

export default function Contact() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    import('@/public/animations/hero.json').then(mod => setAnimationData(mod.default));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'praneshrsm@gmail.com',
        },
        EMAILJS_PUBLIC_KEY
      );
      setSuccess(true);
    } catch (err) {
      // Fallback: open mailto if EmailJS not configured yet
      const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
      window.open(`mailto:praneshrsm@gmail.com?subject=${subject}&body=${body}`);
      setSuccess(true);
    } finally {
      setIsPending(false);
      setTimeout(() => {
        setSuccess(false);
        setIsFormOpen(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [0.8, 1.1, 0.8],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-0 w-96 h-72 rounded-full -translate-x-1/2 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
        />

        <motion.div
          animate={{
            opacity: [0.08, 0.15, 0.08],
            scale: [1.1, 0.9, 1.1]
          }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute right-0 bottom-1/3 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent)' }}
        />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="h-px w-12 bg-primary/60" />
          <span className="text-sm font-medium text-primary tracking-widest uppercase">Contact</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-heading mb-4"
        >
          Let&apos;s <span className="gradient-text">Connect</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mb-16 max-w-xl"
        >
          Reach out for frontend, MERN, cloud, testing, or cybersecurity-focused work. You can also browse more of my code on GitHub and connect with me on LinkedIn.
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              const Wrapper = item.href ? motion.a : motion.div;
              return (
                <Wrapper
                  key={item.label}
                  {...(item.href ? { href: item.href } : {})}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  whileHover={{ x: 10, scale: 1.02, y: -5 }}
                  className="flex items-center gap-4 glass rounded-2xl p-5 border border-border/50 hover:border-primary/60 transition-all group cursor-pointer"
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: `${item.color}22`, color: item.color }}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">
                      {item.value}
                    </p>
                  </div>
                </Wrapper>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h3 className="font-display font-semibold text-xl">Social Profiles</h3>

            <div className="grid grid-cols-2 gap-4">
              {socials.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.08, y: -6 }}
                    className="glass rounded-2xl p-5 border border-border/50 hover:border-primary/60 transition-all text-center group overflow-hidden relative"
                  >
                    <div className="absolute -inset-1 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" style={{ background: social.color }} />

                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 relative"
                      style={{ background: `${social.color}22`, color: social.color }}
                    >
                      <Icon size={20} />
                    </motion.div>
                    <p className="font-semibold text-sm">{social.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{social.desc}</p>
                  </motion.a>
                );
              })}
            </div>

            {/* Resume Access Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-6 border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg">Professional Resume</h4>
                  <p className="text-xs text-muted-foreground">Curriculum Vitae • Updated 2024</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.a
                  href="/images/resume-preview.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <Eye size={16} />
                  View Full
                </motion.a>
                <motion.a
                  href="/images/resume-preview.png"
                  download="Pranesh_BR_Resume.png"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground transition-all text-sm font-bold shadow-lg shadow-primary/20"
                >
                  <Download size={16} />
                  Download
                </motion.a>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-semibold text-white relative overflow-hidden group shadow-[0_20px_40px_rgba(59,130,246,0.2)]"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)' }}
            >
              <MessageSquare size={18} />
              <span>Send a Message</span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </motion.button>
          </motion.div>
        </div>

        {/* Premium Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 pt-12 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="text-2xl font-display font-black gradient-text mb-2">Pranesh.</p>
              <p className="text-sm text-muted-foreground max-w-xs">Frontend developer building elegant and scalable web experiences.</p>
            </div>
            <div className="flex gap-4">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.1 }}
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center text-xs text-muted-foreground/60">
            <p>&copy; {new Date().getFullYear()} Pranesh Ramesh. All rights reserved.</p>
          </div>
        </motion.footer>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFormOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative z-10 glass-heavy rounded-3xl border border-border/60 w-full max-w-lg overflow-hidden"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1" style={{ background: 'linear-gradient(90deg, #3b82f6, #0891b2, #22d3ee)' }} />

              <div className="p-8">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>

                <h3 className="font-display font-bold text-2xl mb-1 text-center">Send a Message</h3>
                <p className="text-muted-foreground text-sm mb-6 text-center">I&apos;ll get back to you soon!</p>

                <div className="w-24 h-24 mx-auto mb-6">
                  {animationData && <Lottie animationData={animationData} loop={true} />}
                </div>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                      <p className="text-sm text-muted-foreground">Thank you for reaching out. I&apos;ll get back to you shortly.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {[
                        { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Pranesh' },
                        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            required
                            value={formData[field.name as keyof typeof formData]}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 rounded-xl glass border border-border/60 focus:border-primary/60 outline-none text-sm transition-colors placeholder:text-muted-foreground/50 bg-transparent"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Message</label>
                        <textarea
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell me about your project..."
                          className="w-full px-4 py-3 rounded-xl glass border border-border/60 focus:border-primary/60 outline-none text-sm transition-colors placeholder:text-muted-foreground/50 bg-transparent resize-none"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={isPending}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white disabled:opacity-70 shadow-[0_10px_20px_rgba(59,130,246,0.2)]"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #0da5e9)' }}
                      >
                        <Send size={16} />
                        {isPending ? 'Sending Message...' : 'Send Message'}
                      </motion.button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

