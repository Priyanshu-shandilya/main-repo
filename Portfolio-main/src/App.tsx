import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  animate,
  useInView,
  useMotionValueEvent,
} from 'framer-motion';

const ORBS = [
  { color: 'rgba(139,92,246,0.35)', size: 600, x: '10%', y: '5%', dur: 18 },
  { color: 'rgba(6,182,212,0.28)', size: 500, x: '70%', y: '15%', dur: 22 },
  { color: 'rgba(99,102,241,0.3)', size: 450, x: '30%', y: '60%', dur: 26 },
  { color: 'rgba(6,182,212,0.22)', size: 350, x: '80%', y: '55%', dur: 20 },
  { color: 'rgba(168,85,247,0.25)', size: 400, x: '55%', y: '80%', dur: 24 },
  { color: 'rgba(34,211,238,0.2)', size: 300, x: '5%', y: '75%', dur: 16 },
  { color: 'rgba(124,58,237,0.2)', size: 280, x: '90%', y: '30%', dur: 28 },
  { color: 'rgba(6,182,212,0.18)', size: 320, x: '45%', y: '35%', dur: 19 },
];

const NAV_ITEMS = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];

const SKILLS = {
  Frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vue.js', 'Three.js'],
  Backend: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'GraphQL', 'REST APIs', 'Docker'],
  Tools: ['Git', 'AWS', 'Figma', 'CI/CD', 'Vercel', 'Webpack', 'Jest'],
};

const PROJECTS = [
  {
    title: 'NeuralDash',
    desc: 'AI-powered analytics platform with real-time dashboards, predictive insights, and natural language queries across millions of data points.',
    tags: ['React', 'Python', 'GPT-4', 'PostgreSQL'],
    accent: '#22d3ee',
    emoji: '🧠',
  },
  {
    title: 'FlowForge',
    desc: 'Visual workflow automation builder for teams — drag-and-drop triggers, integrations with 200+ services, and real-time collaboration.',
    tags: ['Next.js', 'Node.js', 'WebSockets', 'Redis'],
    accent: '#818cf8',
    emoji: '⚡',
  },
  {
    title: 'Strata',
    desc: 'Design system and component library used by 40+ product teams. Built with accessibility-first principles and exhaustive theming support.',
    tags: ['TypeScript', 'Storybook', 'WCAG', 'Radix UI'],
    accent: '#c084fc',
    emoji: '🎨',
  },
];

const EXPERIENCE = [
  {
    role: 'Senior Frontend Engineer',
    company: 'Veritas Labs',
    period: '2022 – Present',
    desc: 'Led architecture of a Next.js platform serving 2M+ monthly users. Reduced bundle size by 40% and improved Core Web Vitals scores across all metrics.',
  },
  {
    role: 'Full Stack Developer',
    company: 'Orbit Systems',
    period: '2020 – 2022',
    desc: 'Built microservices architecture processing 500K daily transactions. Designed real-time collaboration features using WebSockets and CRDTs.',
  },
  {
    role: 'Frontend Developer',
    company: 'Pixel Foundry',
    period: '2018 – 2020',
    desc: 'Developed interactive data visualization tools in D3.js and React. Shipped 15+ client projects across fintech, health, and media verticals.',
  },
  {
    role: 'Junior Developer',
    company: 'StackBridge',
    period: '2016 – 2018',
    desc: 'Started career building responsive marketing sites and internal tools. Contributed to open-source projects with 3K+ GitHub stars.',
  },
];

const TECH_ICONS = [
  { label: 'React', char: '⚛', color: '#61DAFB' },
  { label: 'TS', char: 'TS', color: '#3178C6' },
  { label: 'Node', char: '⬡', color: '#68A063' },
  { label: 'Next', char: '▲', color: '#ffffff' },
  { label: 'SQL', char: '◈', color: '#336791' },
  { label: 'AWS', char: '☁', color: '#FF9900' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, { duration: 2, ease: 'easeOut' });
    const unsub = count.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix;
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, count, to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function FloatingOrb({ orb, index }: { orb: (typeof ORBS)[0]; index: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: orb.x,
        top: orb.y,
        width: orb.size,
        height: orb.size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }}
      animate={{
        x: [0, 60 * (index % 2 === 0 ? 1 : -1), 0],
        y: [0, 40 * (index % 3 === 0 ? 1 : -1), 0],
        scale: [1, 1.15, 1],
      }}
      transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
        transformOrigin: '0%',
        zIndex: 1000,
      }}
    />
  );
}

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > 100 && latest > prev);
  });

  useEffect(() => {
    const onScroll = () => {
      for (const id of NAV_ITEMS.map((n) => n.toLowerCase())) {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 120 && r.bottom >= 120) { setActive(id); break; }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: -80, opacity: 0 } }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        backdropFilter: 'blur(20px)',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 999,
        padding: '10px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ background: 'linear-gradient(90deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: 16 }}>
        AS
      </span>
      {NAV_ITEMS.map((item) => {
        const id = item.toLowerCase();
        const isActive = active === id;
        return (
          <a
            key={item}
            href={`#${id}`}
            onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{ color: isActive ? '#22d3ee' : 'rgba(203,213,225,0.75)', fontSize: 13, fontWeight: 500, textDecoration: 'none', position: 'relative', transition: 'color 0.2s', letterSpacing: '0.02em' }}
          >
            {item}
            {isActive && (
              <motion.span
                layoutId="nav-underline"
                style={{ position: 'absolute', bottom: -4, left: 0, right: 0, height: 2, borderRadius: 999, background: 'linear-gradient(90deg,#a78bfa,#22d3ee)' }}
              />
            )}
          </a>
        );
      })}
    </motion.nav>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={fadeUp}
      style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, background: 'linear-gradient(90deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}
    >
      {children}
    </motion.p>
  );
}

function Hero() {
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '0 24px' }}>
      {TECH_ICONS.map((tech, i) => {
        const angle = (i / TECH_ICONS.length) * 2 * Math.PI;
        const cx = Math.cos(angle) * 340;
        const cy = Math.sin(angle) * 200;
        return (
          <motion.div
            key={tech.label}
            style={{ position: 'absolute', left: `calc(50% + ${cx}px)`, top: `calc(50% + ${cy}px)`, transform: 'translate(-50%,-50%)', color: tech.color, fontSize: 18, fontWeight: 800, opacity: 0.3, userSelect: 'none', pointerEvents: 'none', zIndex: 1 }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
          >
            {tech.char}
          </motion.div>
        );
      })}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ textAlign: 'center', maxWidth: 760, position: 'relative', zIndex: 2 }}
      >
        <motion.p
          variants={fadeUp}
          style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#22d3ee', marginBottom: 20 }}
        >
          Available for new opportunities
        </motion.p>

        <motion.h1
          variants={fadeUp}
          style={{ fontSize: 'clamp(52px,9vw,92px)', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-2.5px', marginBottom: 12 }}
        >
          <span style={{ color: '#f1f5f9' }}>Alex</span>
          <br />
          <span style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#22d3ee 55%,#818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Shepherd
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#94a3b8', marginBottom: 44, lineHeight: 1.65, maxWidth: 540, margin: '0 auto 44px' }}
        >
          Senior Full Stack Engineer crafting high-performance digital experiences
          <span style={{ display: 'inline-block', width: 2, height: '1em', background: '#22d3ee', marginLeft: 4, verticalAlign: 'middle', opacity: cursor ? 1 : 0, transition: 'opacity 0.08s' }} />
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(139,92,246,0.55)' }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', color: '#fff', padding: '14px 32px', borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: 'none', cursor: 'pointer', border: 'none', display: 'inline-block' }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(6,182,212,0.3)' }}
            whileTap={{ scale: 0.97 }}
            style={{ background: 'transparent', color: '#e2e8f0', padding: '13px 32px', borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: 'none', cursor: 'pointer', border: '1.5px solid rgba(255,255,255,0.18)', display: 'inline-block' }}
          >
            Download Resume
          </motion.a>
        </motion.div>

        <motion.div variants={fadeUp} style={{ marginTop: 64, display: 'flex', justifyContent: 'center' }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} style={{ color: 'rgba(148,163,184,0.45)', fontSize: 20 }}>
            ↓
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 64, alignItems: 'center' }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ position: 'relative' }}>
            <div style={{ width: 280, height: 280, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(6,182,212,0.3))', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 260, height: 260, borderRadius: '50%', background: 'linear-gradient(135deg,#1e1b4b,#0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
                👨‍💻
              </div>
            </div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px dashed rgba(139,92,246,0.3)', pointerEvents: 'none' }} />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1px dashed rgba(6,182,212,0.2)', pointerEvents: 'none' }} />
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } }}>
          <SectionLabel>About Me</SectionLabel>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#f1f5f9', marginBottom: 20, letterSpacing: '-1px', lineHeight: 1.15 }}>
            Building the web's most ambitious products
          </h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 16, fontSize: 16 }}>
            I'm a{' '}
            <span style={{ background: 'linear-gradient(90deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600 }}>senior full-stack engineer</span>
            {' '}with 8 years of experience building products that scale. I specialize in{' '}
            <span style={{ color: '#e2e8f0', fontWeight: 500 }}>React ecosystems</span>,{' '}
            <span style={{ color: '#e2e8f0', fontWeight: 500 }}>distributed systems</span>, and turning complex design visions into pixel-perfect interfaces.
          </p>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 32, fontSize: 16 }}>
            When I'm not pushing commits, I'm contributing to open-source, writing technical deep-dives, and mentoring the next wave of developers.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[{ label: 'Years Exp', val: 8, suffix: '+' }, { label: 'Projects', val: 120, suffix: '+' }, { label: 'Clients', val: 40, suffix: '+' }].map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 16px', textAlign: 'center' as const, backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 6 }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" ref={ref} style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        <div style={{ textAlign: 'center' as const, marginBottom: 64 }}>
          <SectionLabel>My Arsenal</SectionLabel>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1.5px' }}>
            Technologies I Work With
          </motion.h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 40 }}>
          {Object.entries(SKILLS).map(([category, items], ci) => (
            <motion.div key={category} variants={fadeUp}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#475569', marginBottom: 16 }}>{category}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 10 }}>
                {items.map((skill, si) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: ci * 0.08 + si * 0.04, duration: 0.4 }}
                    whileHover={{ y: -4, scale: 1.06 }}
                    style={{ padding: '8px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', fontSize: 13, fontWeight: 500, cursor: 'default', backdropFilter: 'blur(8px)', transition: 'border-color 0.2s, box-shadow 0.2s, color 0.2s' }}
                    onMouseEnter={(e) => { const t = e.currentTarget as HTMLElement; t.style.borderColor = 'rgba(139,92,246,0.6)'; t.style.boxShadow = '0 0 20px rgba(139,92,246,0.25)'; t.style.color = '#e2e8f0'; }}
                    onMouseLeave={(e) => { const t = e.currentTarget as HTMLElement; t.style.borderColor = 'rgba(255,255,255,0.1)'; t.style.boxShadow = 'none'; t.style.color = '#cbd5e1'; }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="projects" ref={ref} style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        <div style={{ textAlign: 'center' as const, marginBottom: 64 }}>
          <SectionLabel>Selected Work</SectionLabel>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1.5px' }}>
            Projects That Shipped
          </motion.h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              variants={fadeUp}
              transition={{ delay: i * 0.12 }}
              whileHover={{ scale: 1.03, y: -6 }}
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, cursor: 'pointer', position: 'relative' as const, overflow: 'hidden', transition: 'border-color 0.3s, box-shadow 0.3s' }}
              onMouseEnter={(e) => { const t = e.currentTarget as HTMLElement; t.style.borderColor = `${project.accent}40`; t.style.boxShadow = `0 20px 60px ${project.accent}15`; }}
              onMouseLeave={(e) => { const t = e.currentTarget as HTMLElement; t.style.borderColor = 'rgba(255,255,255,0.08)'; t.style.boxShadow = 'none'; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${project.accent}18`, border: `1px solid ${project.accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 24 }}>
                {project.emoji}
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 12, letterSpacing: '-0.5px' }}>{project.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.72, marginBottom: 24 }}>{project.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 24 }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: `${project.accent}12`, color: project.accent, border: `1px solid ${project.accent}28`, letterSpacing: '0.03em' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: project.accent, fontSize: 14, fontWeight: 600 }}>
                View Project <span style={{ fontSize: 16 }}>→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start center', 'end center'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section id="experience" ref={sectionRef} style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        <div style={{ textAlign: 'center' as const, marginBottom: 64 }}>
          <SectionLabel>Career</SectionLabel>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1.5px' }}>
            Work Experience
          </motion.h2>
        </div>

        <div style={{ position: 'relative' as const, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ position: 'absolute' as const, left: 20, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }} />
          <motion.div style={{ position: 'absolute' as const, left: 20, top: 0, width: 2, height: '100%', background: 'linear-gradient(180deg,#8b5cf6,#06b6d4)', borderRadius: 999, transformOrigin: 'top', scaleY }} />

          <div style={{ paddingLeft: 60, display: 'flex', flexDirection: 'column' as const, gap: 52 }}>
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={exp.company}
                variants={{ hidden: { opacity: 0, x: i % 2 === 0 ? -40 : 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' } } }}
                style={{ position: 'relative' as const }}
              >
                <div style={{ position: 'absolute' as const, left: -48, top: 8, width: 14, height: 14, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#22d3ee)', boxShadow: '0 0 14px rgba(139,92,246,0.65)', border: '2px solid #0a0a1a' }} />
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#22d3ee' }}>{exp.period}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{exp.role}</h3>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#a78bfa', marginBottom: 12 }}>{exp.company}</p>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.75 }}>{exp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: '14px 18px',
    color: '#e2e8f0',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(139,92,246,0.65)';
    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.14)';
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <section id="contact" ref={ref} style={{ padding: '120px 24px 80px', maxWidth: 700, margin: '0 auto' }}>
      <motion.div variants={staggerContainer} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
        <div style={{ textAlign: 'center' as const, marginBottom: 48 }}>
          <SectionLabel>Get In Touch</SectionLabel>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1.5px', marginBottom: 16 }}>
            Let's Build Something
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
            Have a project in mind or just want to chat? I'm always open to new opportunities and interesting conversations.
          </motion.p>
        </div>

        <motion.form variants={fadeUp} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputBase} onFocus={focusIn} onBlur={focusOut} />
            <input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={inputBase} onFocus={focusIn} onBlur={focusOut} />
          </div>
          <textarea placeholder="Tell me about your project..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} style={{ ...inputBase, resize: 'vertical' }} onFocus={focusIn} onBlur={focusOut} />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}
            whileTap={{ scale: 0.98 }}
            style={{ position: 'relative' as const, background: sent ? 'linear-gradient(135deg,#22d3ee,#0891b2)' : 'linear-gradient(135deg,#8b5cf6,#06b6d4)', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', overflow: 'hidden', transition: 'background 0.4s', fontFamily: 'inherit' }}
          >
            <motion.span
              style={{ position: 'absolute' as const, top: 0, left: '-80%', width: '60%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)', transform: 'skewX(-20deg)', pointerEvents: 'none' }}
              whileHover={{ left: '150%', transition: { duration: 0.55 } }}
            />
            {sent ? '✓ Message Sent!' : 'Send Message'}
          </motion.button>
        </motion.form>

        <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center' as const, gap: 16, marginTop: 48 }}>
          {[{ label: 'GitHub', char: 'GH' }, { label: 'LinkedIn', char: 'in' }, { label: 'Twitter', char: '𝕏' }, { label: 'Dribbble', char: '◉' }].map((s) => (
            <motion.a
              key={s.label}
              href="#"
              whileHover={{ y: -4, scale: 1.12 }}
              title={s.label}
              style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 700, fontSize: 12, textDecoration: 'none', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={(e) => { const t = e.currentTarget as HTMLElement; t.style.borderColor = 'rgba(139,92,246,0.5)'; t.style.color = '#a78bfa'; }}
              onMouseLeave={(e) => { const t = e.currentTarget as HTMLElement; t.style.borderColor = 'rgba(255,255,255,0.1)'; t.style.color = '#94a3b8'; }}
            >
              {s.char}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ textAlign: 'center' as const, padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#334155', fontSize: 13 }}>
      <span>© 2025 Alex Shepherd — Crafted with </span>
      <span style={{ color: '#a78bfa' }}>♥</span>
      <span> and way too much coffee.</span>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          background: #0a0a1a;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          overflow-x: hidden;
          color: #e2e8f0;
        }
        ::placeholder { color: rgba(148,163,184,0.45); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a1a; }
        ::-webkit-scrollbar-thumb { background: #1e1b4b; border-radius: 999px; }
      `}</style>

      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
          {ORBS.map((orb, i) => <FloatingOrb key={i} orb={orb} index={i} />)}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#ffffff" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <ScrollProgress />
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
          <Footer />
        </div>
      </div>
    </>
  );
}
