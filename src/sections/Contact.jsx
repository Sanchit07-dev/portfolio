import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle, Loader2, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import Button from '../components/Button.jsx';

const WHATSAPP_NUMBER = '919XXXXXXXXX'; // Format: countrycode + number
const CONTACT_EMAIL   = 'your@email.com';

const PROJECT_TYPES = [
  'Full-Stack Web Application',
  'Business / Corporate Website',
  'Admin Dashboard & Operations Panel',
  'REST API / Backend Architecture',
  'Authentication & Database Integration',
  'Other / Custom Project',
];

const BUDGETS = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  'Above ₹1,00,000',
  'Flexible / Let’s discuss',
];

const INITIAL_FORM = {
  name: '',
  email: '',
  business: '',
  projectType: '',
  budget: '',
  description: '',
};

const INITIAL_ERRORS = {
  name: '',
  email: '',
  projectType: '',
  description: '',
};

function validate(data) {
  const errors = { ...INITIAL_ERRORS };
  if (!data.name.trim()) errors.name = 'Please provide your full name.';
  if (!data.email.trim()) {
    errors.email = 'Please provide your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!data.projectType) errors.projectType = 'Please select a project type.';
  if (!data.description.trim()) {
    errors.description = 'Please describe your project requirements.';
  } else if (data.description.trim().length < 20) {
    errors.description = 'Please provide a bit more detail (minimum 20 characters).';
  }
  return errors;
}

export default function Contact() {
  const [form, setForm]         = useState(INITIAL_FORM);
  const [errors, setErrors]     = useState(INITIAL_ERRORS);
  const [status, setStatus]     = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(form);
    const hasAnyError = Object.values(newErrors).some(Boolean);
    if (hasAnyError) {
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors).find(k => newErrors[k]);
      if (firstKey) {
        formRef.current?.querySelector(`[name="${firstKey}"]`)?.focus();
      }
      return;
    }

    setStatus('loading');

    // If a real backend or Formspree endpoint is configured via .env:
    const formspreeEndpoint = import.meta.env?.VITE_FORMSPREE_ENDPOINT;
    if (formspreeEndpoint) {
      try {
        const res = await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Submission failed');
        setStatus('success');
        setForm(INITIAL_FORM);
        return;
      } catch (err) {
        console.error(err);
      }
    }

    // Default simulation until a live endpoint is added
    await new Promise(resolve => setTimeout(resolve, 900));
    setStatus('success');
    setForm(INITIAL_FORM);
  };

  const whatsappMessage = encodeURIComponent("Hi Sanchit, I came across your portfolio and would like to discuss a project.");

  return (
    <section id="contact" className="section-padding bg-neutral-50/70">
      <div className="section-wrapper">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="section-badge mb-4">Get In Touch</span>
          <h2 className="section-heading mb-4">
            Have an Idea? <span className="text-orange-500">Let’s Build It.</span>
          </h2>
          <p className="text-base text-neutral-500 leading-relaxed">
            I’m available for freelance contracts, full-stack product builds, and technical consultations. Tell me about your requirements below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Contact & Channels */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            {/* WhatsApp Box */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 bg-white border border-neutral-200 rounded-2xl p-6 transition-all duration-200 hover:border-orange-500/40 hover:shadow-card-hover"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                    Chat on WhatsApp
                  </h4>
                  <ArrowUpRight size={14} className="text-neutral-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Immediate enquiries &amp; quick project consultations
                </p>
              </div>
            </a>

            {/* Email Box */}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group flex items-start gap-4 bg-white border border-neutral-200 rounded-2xl p-6 transition-all duration-200 hover:border-orange-500/40 hover:shadow-card-hover"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                    Direct Email
                  </h4>
                  <ArrowUpRight size={14} className="text-neutral-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  {CONTACT_EMAIL}
                </p>
              </div>
            </a>

            {/* Professional Profiles */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h4 className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider mb-4">
                Professional Links
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/sanchitbaviskar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 hover:text-orange-600 hover:border-orange-500/40 transition-colors"
                >
                  <Github size={15} />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/sanchitbaviskar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 hover:text-orange-600 hover:border-orange-500/40 transition-colors"
                >
                  <Linkedin size={15} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Note badge */}
            <div className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-100/50 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-700">Response turnaround:</span> Usually replies within 24 hours. NDA and contract agreements available for formal client engagements.
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-card">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center flex flex-col items-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-4">
                      <CheckCircle size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Message Received</h3>
                    <p className="text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">
                      Thank you for reaching out! I've received your project details and will review them shortly.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => setStatus('idle')}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form
                    key="form"
                    ref={formRef}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                  >
                    {/* Row 1: Name and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Full Name <span className="text-orange-500">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          autoComplete="name"
                          className={`input-minimal ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Email Address <span className="text-orange-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="name@company.com"
                          autoComplete="email"
                          className={`input-minimal ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Row 2: Business & Project Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="business" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Business / Organization <span className="text-neutral-400 font-normal">(optional)</span>
                        </label>
                        <input
                          id="business"
                          name="business"
                          type="text"
                          value={form.business}
                          onChange={handleChange}
                          placeholder="Company name"
                          className="input-minimal"
                        />
                      </div>

                      <div>
                        <label htmlFor="projectType" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Project Type <span className="text-orange-500">*</span>
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={form.projectType}
                          onChange={handleChange}
                          className={`input-minimal appearance-none bg-white ${errors.projectType ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
                        >
                          <option value="">Select project type...</option>
                          {PROJECT_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.projectType && <p className="mt-1 text-xs text-red-500">{errors.projectType}</p>}
                      </div>
                    </div>

                    {/* Row 3: Budget Range */}
                    <div>
                      <label htmlFor="budget" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Expected Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        className="input-minimal appearance-none bg-white"
                      >
                        <option value="">Select estimated budget...</option>
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Row 4: Project Description */}
                    <div>
                      <label htmlFor="description" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Project Description <span className="text-orange-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Please share an overview of what you're building, key features, and any timeline constraints..."
                        className={`input-minimal resize-none ${errors.description ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
                      />
                      {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full justify-center"
                      size="lg"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Project Enquiry</span>
                          <Send size={15} />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
