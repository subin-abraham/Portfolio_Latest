import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ContactForm from '@/components/ContactForm';

declare global {
  interface Window {
    AOS: any;
  }
}

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize AOS (Animate On Scroll)
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
      });
    }

    // Refresh AOS on route change
    return () => {
      if (window.AOS) {
        window.AOS.refresh();
      }
    };
  }, []);

  useEffect(() => {
    if (location.hash === '#contact') {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Experience />
      <Skills />
      <Testimonials />
      <section id="contact">
        <ContactForm />
      </section>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
