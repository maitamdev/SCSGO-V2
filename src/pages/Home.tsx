import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Marquee from '../components/Marquee';
import Showcase from '../components/Showcase';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <Marquee />
      <Showcase />
      <HowItWorks />
      <Features />
      <Testimonials />
    </main>
  );
};

export default Home;
