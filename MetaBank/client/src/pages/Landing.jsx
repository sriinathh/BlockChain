import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Footer from '../components/Footer';
import Features from '../components/Features';
import BlockchainSection from '../components/BlockchainSection';
import AISection from '../components/AISection';
import Tokenomics from '../components/Tokenomics';
import Roadmap from '../components/Roadmap';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection';

export default function Landing() {
  return (
    <div>
      <Navbar />
      <main className="pt-20 landing-bg min-h-screen">
        <Hero />
        <Stats />
        <Features />
        <BlockchainSection />
        <AISection />
        <Tokenomics />
        <Roadmap />
        <Testimonials />
        <FAQ />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}
