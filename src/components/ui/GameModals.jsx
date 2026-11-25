// ─────────────────────────────────────────────
// GAME DIALOGUE & INTERACTIVE PORTFOLIO MODALS
// Displays Developer House (About), Skills (Skill Tree), Project Castle (Chests),
// Achievement Mountain (Milestones/Services), Communication Tower (Contact form)
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import {
  DEVELOPER_PROFILE,
  SKILL_CATEGORIES,
  WORLD_LOCATIONS,
  existingProjects,
  existingServices
} from '../../data/gameData';
import {
  X,
  Github,
  Linkedin,
  ExternalLink,
  Code2,
  FolderGit2,
  Layers,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Trophy,
  Cpu,
  Mail,
  MapPin,
  GraduationCap
} from 'lucide-react';

export function GameModals() {
  const activeModal = useGameStore((state) => state.activeModal);
  const closeModal = useGameStore((state) => state.closeModal);
  const quests = useGameStore((state) => state.quests);
  const inventory = useGameStore((state) => state.inventory);
  const totalXP = useGameStore((state) => state.totalXP);
  const resetProgress = useGameStore((state) => state.resetProgress);

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl border border-neutral-200/90 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h2 className="text-base font-bold text-neutral-900 capitalize">
              {activeModal === 'house' && 'Developer House — About Sanchit'}
              {activeModal === 'skills' && 'Skill Training Grounds — Tech Stacks'}
              {activeModal === 'castle' && 'Project Castle — Featured Builds'}
              {activeModal === 'mountain' && 'Achievement Mountain — Milestones & Offerings'}
              {activeModal === 'tower' && 'Communication Tower — Transmit Enquiry'}
              {activeModal === 'inventory' && 'Adventurer Inventory & Badges'}
              {activeModal === 'quests' && 'Quest Journal'}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {activeModal === 'house' && <HouseModalContent />}
          {activeModal === 'skills' && <SkillsModalContent />}
          {activeModal === 'castle' && <CastleModalContent />}
          {activeModal === 'mountain' && <MountainModalContent />}
          {activeModal === 'tower' && <TowerModalContent />}
          {activeModal === 'inventory' && <InventoryModalContent inventory={inventory} />}
          {activeModal === 'quests' && <QuestsModalContent quests={quests} totalXP={totalXP} onReset={resetProgress} />}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span className="font-mono text-[11px]">Developer Quest · Realm Archive</span>
          <button
            onClick={closeModal}
            className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
          >
            Resume Journey (ESC)
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// 1. DEVELOPER HOUSE MODAL (ABOUT)
function HouseModalContent() {
  return (
    <div className="space-y-6">
      {/* Bio banner */}
      <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Engineer Profile
          </span>
          <h3 className="text-xl font-bold text-neutral-900 mt-0.5">
            {DEVELOPER_PROFILE.name}
          </h3>
          <p className="text-xs text-neutral-600 mt-1">
            {DEVELOPER_PROFILE.title} · {DEVELOPER_PROFILE.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={DEVELOPER_PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-orange-500 transition-all shadow-sm"
          >
            <Github size={18} />
          </a>
          <a
            href={DEVELOPER_PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-orange-500 transition-all shadow-sm"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>

      {/* Summary */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
          About Sanchit
        </h4>
        <p className="text-sm text-neutral-700 leading-relaxed">
          {DEVELOPER_PROFILE.summary}
        </p>
      </div>

      {/* Education */}
      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
          <GraduationCap size={15} className="text-orange-500" />
          <span>Education & Credentials</span>
        </div>
        <p className="text-sm font-semibold text-neutral-900">
          {DEVELOPER_PROFILE.education.institution}
        </p>
        <p className="text-xs text-neutral-600 mt-0.5">
          {DEVELOPER_PROFILE.education.degree} ({DEVELOPER_PROFILE.education.period})
        </p>
        <p className="text-xs text-neutral-500 mt-1 italic">
          {DEVELOPER_PROFILE.education.focus}
        </p>
      </div>

      {/* Engineering Principles */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
          Core Engineering Principles
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEVELOPER_PROFILE.principles.map((pr, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-neutral-200 bg-white">
              <p className="text-xs font-bold text-neutral-900">{pr.title}</p>
              <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{pr.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. SKILL GROUNDS MODAL (SKILL TREE)
function SkillsModalContent() {
  const [activeTab, setActiveTab] = useState('frontend');

  const selectedCategory = SKILL_CATEGORIES.find((c) => c.id === activeTab);

  return (
    <div className="space-y-5">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === cat.id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {selectedCategory?.skills.map((skill, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-orange-500/40 hover:shadow-card transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-neutral-900">{skill.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                {skill.level}
              </span>
            </div>
            <p className="text-xs text-neutral-600 leading-snug">{skill.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. PROJECT CASTLE MODAL (PROJECTS)
function CastleModalContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {existingProjects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-orange-500/40 hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                  {project.statusLabel}
                </span>
                <span className="text-xs font-mono text-neutral-400">#0{project.id}</span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                {project.title}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-50 text-neutral-600 border border-neutral-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-orange-600 transition-colors"
                >
                  <Github size={14} />
                  <span>Repository</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>Live Demo</span>
                </a>
              )}
              {!project.githubUrl && !project.liveUrl && (
                <span className="text-[11px] text-neutral-400 italic">
                  Architectural prototype
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. ACHIEVEMENT MOUNTAIN MODAL (SERVICES & MILESTONES)
function MountainModalContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
          Freelance Engineering Offerings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {existingServices.map((service) => (
            <div
              key={service.id}
              className="p-4 rounded-2xl border border-neutral-200 bg-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <h4 className="text-xs font-bold text-neutral-900">{service.title}</h4>
              </div>
              <p className="text-[11px] text-neutral-600 leading-snug mb-3">
                {service.description}
              </p>
              <ul className="space-y-1">
                {service.highlights.map((h, i) => (
                  <li key={i} className="text-[10px] text-neutral-500 flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5. COMMUNICATION TOWER MODAL (CONTACT FORM)
function TowerModalContent() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    business: '',
    projectType: '',
    budget: '',
    description: ''
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.description) return;
    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-cyan-800">Direct Signal Channel</p>
          <p className="text-xs text-cyan-700">{DEVELOPER_PROFILE.email}</p>
        </div>
        <a
          href={`mailto:${DEVELOPER_PROFILE.email}`}
          className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white font-semibold text-xs hover:bg-cyan-700 transition-colors"
        >
          Open Mail
        </a>
      </div>

      {status === 'success' ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
          <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
          <h4 className="text-base font-bold text-neutral-900">Signal Transmitted!</h4>
          <p className="text-xs text-neutral-600 max-w-sm mx-auto">
            Your project enquiry has been logged. Sanchit will respond within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-orange-500"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-orange-500"
                placeholder="jane@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Project Description *
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-orange-500 resize-none"
              placeholder="Tell me about what you are planning to build..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {status === 'loading' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <>
                <span>Transmit Signal</span>
                <Send size={13} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

// 6. INVENTORY MODAL
function InventoryModalContent({ inventory }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">
        Relics and technology orbs collected while exploring the open world.
      </p>

      {inventory.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
          <p className="text-xs text-neutral-400">
            No relics collected yet! Explore the islands, bridges, and paths to collect tech badges.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {inventory.map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl border border-neutral-200 bg-orange-50/50 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900">{item.name}</span>
                <p className="text-[11px] text-neutral-600 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 7. QUEST JOURNAL MODAL
function QuestsModalContent({ quests, totalXP, onReset }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
        <div>
          <span className="text-xs font-bold text-neutral-900">Total Adventure XP</span>
          <p className="text-xl font-bold text-orange-600 font-mono">{totalXP} XP</p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-red-500 hover:text-red-600 font-semibold underline"
        >
          Reset Progress
        </button>
      </div>

      <div className="space-y-3">
        {quests.map((q) => (
          <div
            key={q.id}
            className={`p-4 rounded-2xl border transition-all ${
              q.completed
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-white border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-neutral-900">{q.title}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  q.completed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {q.completed ? 'Completed' : 'Active'}
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-2">{q.objective}</p>
            <div className="text-[10px] text-neutral-400 font-medium flex items-center justify-between pt-1 border-t border-neutral-100">
              <span>Target: {q.locationName}</span>
              <span className="text-orange-600 font-semibold">{q.reward}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
