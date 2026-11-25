// ─────────────────────────────────────────────
// GAME DIALOGUE & INTERACTIVE PORTFOLIO MODALS
// Displays Developer House (About & Interior), Skills (Skill Tree), Project Castle (Chests),
// Achievement Highlands (Milestones/Services), Communication Tower (Contact form & NPC Dialogue)
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import {
  DEVELOPER_PROFILE,
  SKILL_CATEGORIES,
  existingProjects,
  existingServices
} from '../../data/gameData';
import {
  X,
  Github,
  Linkedin,
  ExternalLink,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  GraduationCap,
  MessageSquare
} from 'lucide-react';

export function GameModals() {
  const activeModal = useGameStore((state) => state.activeModal);
  const activeProject = useGameStore((state) => state.activeProject);
  const closeModal = useGameStore((state) => state.closeModal);
  const quests = useGameStore((state) => state.quests);
  const inventory = useGameStore((state) => state.inventory);
  const totalXP = useGameStore((state) => state.totalXP);
  const resetProgress = useGameStore((state) => state.resetProgress);

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#1C1917] text-white rounded-3xl border-2 border-[#78350F] shadow-2xl flex flex-col overflow-hidden font-sans"
      >
        {/* Header Bar (Slate & Gold trim) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#78350F]/70 bg-neutral-900/90">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-base font-black text-amber-100 tracking-wide capitalize">
              {activeModal === 'house' && 'Developer House — Sanchit\'s Workshop & Bio'}
              {activeModal === 'house_interior' && 'Developer Desk & Workstation'}
              {activeModal === 'skills' && 'Skill Training Grounds — Battle-Tested Tech Stacks'}
              {activeModal === 'castle' && 'Project Castle — Featured Blueprints & Repos'}
              {activeModal === 'mountain' && 'Highlands Monolith — Offerings & Services'}
              {activeModal === 'tower' && 'Communication Tower — Transmit Enquiry'}
              {activeModal === 'inventory' && 'Adventurer Inventory & Relics'}
              {activeModal === 'quests' && 'Quest Journal & Objectives'}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors border border-neutral-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-neutral-900/60">
          {/* NPC Dialogue Header if modal opened from talking to an NPC */}
          {activeProject?.dialogue && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                <MessageSquare size={17} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  {activeProject.name} ({activeProject.title})
                </p>
                {activeProject.dialogue.map((line, idx) => (
                  <p key={idx} className="text-xs text-neutral-200 leading-relaxed italic">
                    "{line}"
                  </p>
                ))}
              </div>
            </div>
          )}

          {(activeModal === 'house' || activeModal === 'house_interior') && <HouseModalContent />}
          {activeModal === 'skills' && <SkillsModalContent />}
          {activeModal === 'castle' && <CastleModalContent />}
          {activeModal === 'mountain' && <MountainModalContent />}
          {activeModal === 'tower' && <TowerModalContent />}
          {activeModal === 'inventory' && <InventoryModalContent inventory={inventory} />}
          {activeModal === 'quests' && <QuestsModalContent quests={quests} totalXP={totalXP} onReset={resetProgress} />}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 bg-neutral-900 border-t border-[#78350F]/70 flex items-center justify-between text-xs text-neutral-400">
          <span className="font-mono text-[11px] text-amber-400/80">Developer Quest · Real-Time Realm</span>
          <button
            onClick={closeModal}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-md active:scale-95 border border-amber-400/40"
          >
            Resume Adventure (ESC)
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
      <div className="p-5 rounded-2xl bg-[#292524] border border-[#78350F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
            Full-Stack Engineer Profile
          </span>
          <h3 className="text-xl font-black text-amber-100 mt-0.5">
            {DEVELOPER_PROFILE.name}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {DEVELOPER_PROFILE.title} · {DEVELOPER_PROFILE.location}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={DEVELOPER_PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-amber-300 hover:text-white hover:border-amber-500 transition-all shadow-sm"
          >
            <Github size={18} />
          </a>
          <a
            href={DEVELOPER_PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-amber-300 hover:text-white hover:border-amber-500 transition-all shadow-sm"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>

      <div>
        <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-400/80 mb-2">
          About Sanchit
        </h4>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {DEVELOPER_PROFILE.summary}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#292524] border border-neutral-800">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-amber-400 mb-2">
          <GraduationCap size={15} className="text-amber-400" />
          <span>Education & Credentials</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-neutral-100">
          {DEVELOPER_PROFILE.education.institution}
        </p>
        <p className="text-xs text-neutral-300 mt-0.5">
          {DEVELOPER_PROFILE.education.degree} ({DEVELOPER_PROFILE.education.period})
        </p>
        <p className="text-xs text-neutral-400 mt-1 italic">
          {DEVELOPER_PROFILE.education.focus}
        </p>
      </div>

      <div>
        <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-400/80 mb-3">
          Core Engineering Principles
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEVELOPER_PROFILE.principles.map((pr, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-neutral-800 bg-[#292524]">
              <p className="text-xs font-bold text-amber-200">{pr.title}</p>
              <p className="text-[11px] text-neutral-400 mt-1 leading-snug">{pr.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. SKILL GROUNDS MODAL
function SkillsModalContent() {
  const [activeTab, setActiveTab] = useState('frontend');
  const selectedCategory = SKILL_CATEGORIES.find((c) => c.id === activeTab);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === cat.id
                ? 'bg-amber-600 text-white shadow-md border border-amber-400/40'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {selectedCategory?.skills.map((skill, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-neutral-800 bg-[#292524] hover:border-amber-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs sm:text-sm text-neutral-100">{skill.name}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {skill.level}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-snug">{skill.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. PROJECT CASTLE MODAL
function CastleModalContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {existingProjects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl border border-neutral-800 bg-[#292524] hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-neutral-800 text-amber-300 border border-neutral-700">
                  {project.statusLabel}
                </span>
                <span className="text-xs font-mono text-neutral-500">#0{project.id}</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-neutral-100 mb-2">
                {project.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-neutral-800">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
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
                  className="flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>Live Demo</span>
                </a>
              )}
              {!project.githubUrl && !project.liveUrl && (
                <span className="text-[11px] text-neutral-500 italic">
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

// 4. HIGHLANDS MODAL
function MountainModalContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-400/80 mb-3">
          Freelance Engineering Offerings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {existingServices.map((service) => (
            <div
              key={service.id}
              className="p-4 rounded-2xl border border-neutral-800 bg-[#292524]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <h4 className="text-xs sm:text-sm font-bold text-neutral-100">{service.title}</h4>
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug mb-3">
                {service.description}
              </p>
              <ul className="space-y-1">
                {service.highlights.map((h, i) => (
                  <li key={i} className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
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

// 5. COMMUNICATION TOWER MODAL
function TowerModalContent() {
  const [form, setForm] = useState({
    name: '',
    email: '',
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
      <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-between">
        <div>
          <p className="text-xs font-black text-cyan-300">Direct Signal Channel</p>
          <p className="text-xs text-cyan-200">{DEVELOPER_PROFILE.email}</p>
        </div>
        <a
          href={`mailto:${DEVELOPER_PROFILE.email}`}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-500 transition-colors shadow-sm"
        >
          Open Mail
        </a>
      </div>

      {status === 'success' ? (
        <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-2">
          <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
          <h4 className="text-base font-black text-neutral-100">Transmission Delivered!</h4>
          <p className="text-xs text-neutral-300 max-w-sm mx-auto">
            Your project enquiry has been logged. Sanchit will respond within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                placeholder="jane@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1">
              Project Overview *
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:border-amber-500 resize-none"
              placeholder="Tell me about what you are planning to build..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
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
      <p className="text-xs text-neutral-400">
        Relics and technology orbs collected while exploring the expanded open world.
      </p>

      {inventory.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-neutral-800 rounded-2xl bg-[#292524]/40">
          <p className="text-xs text-neutral-500">
            No relics collected yet! Explore the islands, woods, bridges, and paths to collect tech badges.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {inventory.map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl border border-neutral-800 bg-[#292524] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-100">{item.name}</span>
                <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
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
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#292524] border border-neutral-800">
        <div>
          <span className="text-xs font-bold text-neutral-300">Total Adventure XP</span>
          <p className="text-xl font-black text-amber-400 font-mono">{totalXP} XP</p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-red-400 hover:text-red-300 font-bold underline"
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
                ? 'bg-emerald-950/40 border-emerald-800/80'
                : 'bg-[#292524] border-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-neutral-100">{q.title}</span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                  q.completed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {q.completed ? 'Completed' : 'Active'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mb-2">{q.objective}</p>
            <div className="text-[10px] text-neutral-500 font-medium flex items-center justify-between pt-1 border-t border-neutral-800">
              <span>Target: <span className="text-neutral-300 font-semibold">{q.locationName}</span></span>
              <span className="text-amber-400 font-bold">{q.reward}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
