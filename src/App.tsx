import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Marquee from './components/Marquee';
import Showcase from './components/Showcase';
import Footer from './components/Footer';

function App() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      {/* Immersive Fluid Background */}
      <div className="aurora-bg">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>
      <div className="bg-grid"></div>
      
      <Navbar scrolled={scrolled} />
      
      <main>
        <Hero />
        <Marquee />
        <Showcase />
        <HowItWorks />
        <Features />
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
