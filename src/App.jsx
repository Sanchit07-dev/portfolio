import Navbar   from './components/Navbar.jsx';
import Footer   from './components/Footer.jsx';
import Hero     from './sections/Hero.jsx';
import About    from './sections/About.jsx';
import Skills   from './sections/Skills.jsx';
import Services from './sections/Services.jsx';
import Projects from './sections/Projects.jsx';
import Process  from './sections/Process.jsx';
import Contact  from './sections/Contact.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-orange-500/20 selection:text-neutral-900">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
