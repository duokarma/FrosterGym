import React, { useEffect, useState, useRef, Suspense } from 'react';
import { Menu, X, ArrowRight, MapPin, Phone, Dumbbell, HeartPulse, ClipboardList, Droplets, Users, Key, ShowerHead, Car, Medal } from 'lucide-react';
import EditorialLoader from '../../components/website/EditorialLoader';

export function PublicWebsite() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 font-sans selection:bg-[#ff5722] selection:text-white">
      {isLoading && <EditorialLoader onComplete={() => setIsLoading(false)} />}
      
      {/* 1. Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5' : 'py-6 bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="cursor-pointer z-50"
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            >
              <img src="/logo.png" alt="Froaster Gym" className="h-20 md:h-24 object-contain invert brightness-200" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10 bg-white/5 px-8 py-3 rounded-full border border-white/5 shadow-2xl backdrop-blur-sm">
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-xs uppercase tracking-widest font-medium text-white hover:text-[#ff5722] transition-colors">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-xs uppercase tracking-widest font-medium text-gray-400 hover:text-white transition-colors">About</button>
              <button onClick={() => scrollToSection('services')} className="text-xs uppercase tracking-widest font-medium text-gray-400 hover:text-white transition-colors">Services</button>
              <button onClick={() => scrollToSection('memberships')} className="text-xs uppercase tracking-widest font-medium text-gray-400 hover:text-white transition-colors">Memberships</button>
              <button onClick={() => scrollToSection('gallery')} className="text-xs uppercase tracking-widest font-medium text-gray-400 hover:text-white transition-colors">Gallery</button>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-[#ff5722] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-full transition-all duration-300"
              >
                Contact Us
              </button>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-white z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-[#0a0a0a] z-40 transition-transform duration-500 ease-in-out md:hidden flex flex-col justify-center items-center gap-8 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <button onClick={() => { window.scrollTo({top: 0, behavior: 'smooth'}); setIsMenuOpen(false); }} className="text-2xl font-bebas uppercase tracking-widest text-white">Home</button>
          <button onClick={() => scrollToSection('about')} className="text-2xl font-bebas uppercase tracking-widest text-white">About</button>
          <button onClick={() => scrollToSection('services')} className="text-2xl font-bebas uppercase tracking-widest text-white">Services</button>
          <button onClick={() => scrollToSection('memberships')} className="text-2xl font-bebas uppercase tracking-widest text-white">Memberships</button>
          <button onClick={() => scrollToSection('gallery')} className="text-2xl font-bebas uppercase tracking-widest text-white">Gallery</button>
          <button onClick={() => scrollToSection('contact')} className="text-2xl font-bebas uppercase tracking-widest text-[#ff5722]">Contact Us</button>
        </div>
      </nav>

      {/* 2. Hero Section - Redesigned */}
      <section className="relative min-h-[100svh] w-full flex items-center overflow-hidden bg-[#0a0a0a]">
        
        {/* Absolute Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[url('/hero-new-bg-2.jpg')] bg-cover bg-center transform scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>
        
        {/* FROASTER watermark */}
        <div className="absolute bottom-0 right-0 opacity-[0.02] pointer-events-none overflow-hidden mix-blend-overlay z-0">
          <h1 className="text-[15rem] lg:text-[25rem] font-bebas leading-none whitespace-nowrap -mb-12 lg:-mb-24">
            FROASTER
          </h1>
        </div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-20">
          <div className="w-full lg:w-[60%] animate-in slide-in-from-left duration-1000 fill-mode-both" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-[#ff5722]"></span>
              <span className="text-[#ff5722] font-oswald uppercase tracking-[0.3em] text-xs md:text-sm font-bold">Premium Fitness Destination</span>
            </div>
            
            <h1 className="text-[5rem] lg:text-[7rem] xl:text-[8rem] font-bebas font-bold leading-[0.85] tracking-tight text-white mb-6">
              DEFINE YOUR<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">LEGACY.</span>
            </h1>
            
            <p className="text-gray-400 font-light text-base md:text-xl max-w-md leading-relaxed mb-12 lg:border-l-2 lg:border-white/20 lg:pl-6">
              Where fat meets its fate. Train harder, move stronger, and become the version of yourself you were meant to be at Dahod's finest facility.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Start Journey (Primary Button) */}
              <button 
                onClick={() => scrollToSection('memberships')}
                className="relative group overflow-hidden bg-gradient-to-r from-[#ff5722] to-[#ff3d00] text-white text-xs font-bold uppercase tracking-[0.2em] py-4.5 md:py-[18px] px-10 rounded-full transition-all duration-500 shadow-[0_4px_20px_rgba(255,87,34,0.25)] hover:shadow-[0_4px_35px_rgba(255,87,34,0.5)] hover:-translate-y-[2px] flex items-center justify-center gap-3"
              >
                {/* Diagonal sliding sheen effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out skew-x-12" />
                <span className="relative z-10 flex items-center gap-3">
                  Start Journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </button>

              {/* WhatsApp Us (Secondary Button) */}
              <a 
                href="https://wa.me/918866445862" target="_blank" rel="noreferrer"
                className="relative group overflow-hidden border border-white/20 hover:border-[#ff5722] text-white text-xs font-bold uppercase tracking-[0.2em] py-4.5 md:py-[18px] px-10 rounded-full transition-all duration-500 hover:-translate-y-[2px] flex items-center justify-center"
              >
                {/* Slide fill background on hover */}
                <span className="absolute inset-0 bg-[#ff5722] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0 rounded-full" />
                <span className="relative z-10 transition-colors duration-500">
                  WhatsApp Us
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Section */}
      <section id="about" className="py-32 bg-[#0d0d0d] relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <div className="flex items-center gap-4 text-[#ff5722] text-xs font-bold uppercase tracking-widest">
                <span className="w-12 h-[1px] bg-[#ff5722]"></span>
                About Froaster
              </div>
              <h2 className="text-5xl md:text-7xl font-bebas font-bold leading-[0.9] tracking-wide">
                MORE THAN<br/>A GYM.
              </h2>
              <p className="text-gray-400 font-light leading-relaxed max-w-lg">
                Located in Dahod, Gujarat, Froaster Gym is a premium fitness environment strictly focused on training, discipline, and absolute transformation. We provide an experienced, supportive atmosphere equipped with modern machinery.
              </p>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-sm text-gray-300"><span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" /> Modern Equipment</div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" /> Open Gym Access</div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" /> Strength Training</div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" /> Cardio Area</div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" /> Purified Water</div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><span className="w-1.5 h-1.5 rounded-full bg-[#ff5722]" /> Dedicated Workout Space</div>
              </div>
            </div>

            <div className="bg-[#111] p-10 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5722]/5 rounded-full blur-[80px] pointer-events-none" />
              <h3 className="text-3xl font-bebas tracking-wide mb-8">Gym Timings</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/5 pb-4 group-hover:border-[#ff5722]/20 transition-colors">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Session</div>
                    <div className="text-xl font-oswald text-white">Morning</div>
                  </div>
                  <div className="text-lg font-medium text-[#ff5722]">5:30 AM – 10:00 AM</div>
                </div>
                
                <div className="flex justify-between items-end border-b border-white/5 pb-4 group-hover:border-[#ff5722]/20 transition-colors">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Session</div>
                    <div className="text-xl font-oswald text-white">Ladies Batch</div>
                  </div>
                  <div className="text-lg font-medium text-[#ff5722]">10:00 AM – 12:00 PM</div>
                </div>

                <div className="flex justify-between items-end border-b border-white/5 pb-4 group-hover:border-[#ff5722]/20 transition-colors">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Session</div>
                    <div className="text-xl font-oswald text-white">Evening</div>
                  </div>
                  <div className="text-lg font-medium text-[#ff5722]">5:00 PM – 10:00 PM</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Services Section */}
      <section id="services" className="py-32 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <div className="flex items-center gap-4 text-[#ff5722] text-xs font-bold uppercase tracking-widest mb-4">
                <span className="w-12 h-[1px] bg-[#ff5722]"></span>
                Core Offerings
              </div>
              <h2 className="text-5xl md:text-7xl font-bebas font-bold leading-[0.9] tracking-wide">
                AUTHENTIC TRAINING.
              </h2>
            </div>
            <p className="text-gray-400 font-light max-w-sm text-sm">
              We focus purely on what works. No gimmicks. Just heavy weights, quality machines, and expert guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Service Cards */}
            {[
              { title: "Gym Training", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop" },
              { title: "Personal Training", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" },
              { title: "Strength Training", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" },
              { title: "Cardio Focus", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop" }
            ].map((service, idx) => (
              <div key={idx} className="group relative h-[450px] overflow-hidden bg-[#111]">
                <img 
                  src={service.img} 
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-40 filter grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-8 h-1 bg-[#ff5722] mb-4 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  <h3 className="text-3xl font-bebas tracking-wide text-white uppercase">{service.title}</h3>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* 5. Memberships */}
      <section id="memberships" className="py-24 bg-[#0d0d0d] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bebas font-bold leading-[0.9] tracking-wide mb-4">
              INVEST IN YOURSELF.
            </h2>
            <div className="text-lg md:text-xl font-oswald text-[#ff5722] mb-6 uppercase tracking-[0.2em]">
               STRONGER BODY. STRONGER MIND. BETTER YOU.
            </div>
            <p className="text-gray-500 text-sm font-light hidden lg:block animate-pulse">
               Hover over the cards to view all plans
            </p>
          </div>

          {/* Cards Container */}
          <div className="flex flex-col lg:flex-row justify-center items-center group relative w-full max-w-5xl mx-auto gap-6 lg:gap-0 lg:min-h-[650px] perspective-[1000px]">
            
            {/* BASIC (Silver/Platinum Theme) - LEFT */}
            <div className="w-full max-w-[320px] bg-[#0a0a0a] border-2 border-slate-500/20 flex flex-col rounded-xl overflow-hidden shadow-xl
                            transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                            lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2 lg:scale-90 lg:opacity-40 lg:-rotate-y-12 lg:z-10
                            group-hover:lg:-translate-x-[155%] group-hover:lg:scale-100 group-hover:lg:opacity-100 group-hover:lg:rotate-y-0
                            hover:!z-40 hover:!border-slate-400 hover:lg:scale-[1.05]">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-500" />
              <div className="p-5 border-b border-white/5">
                <h3 className="text-2xl md:text-3xl font-bebas tracking-wide mb-1 text-white italic">BASIC PLAN</h3>
                <div className="bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-widest py-1 px-3 inline-block mb-6 rounded">Without Training</div>
                
                <ul className="space-y-3">
                  {[
                    { d: '1 MONTH', p: '1100' },
                    { d: '3 MONTH', p: '3000' },
                    { d: '6 MONTH', p: '5500' },
                    { d: '9 MONTH', p: '8500' },
                    { d: '1 YEAR', p: '9500' },
                  ].map((plan, i) => (
                    <li key={i} className="flex justify-between items-center text-xs border border-white/5 p-2 rounded bg-black/50 hover:border-slate-500/20 transition-colors">
                      <span className="text-gray-300 font-oswald tracking-wide flex items-center gap-2">
                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        {plan.d}
                      </span>
                      <span className="font-bebas text-lg text-slate-300 tracking-wide">₹{plan.p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 mt-auto">
                <div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-center gap-2">
                  <span className="w-6 h-[1px] bg-slate-500/30" /> INCLUDES <span className="w-6 h-[1px] bg-slate-500/30" />
                </div>
                <div className="grid grid-cols-3 gap-y-3 gap-x-1 text-center text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-4 leading-tight">
                  <div className="flex flex-col items-center gap-1"><Dumbbell className="w-4 h-4 text-slate-400 opacity-70"/> <span>Modern<br/>Equipment</span></div>
                  <div className="flex flex-col items-center gap-1"><HeartPulse className="w-4 h-4 text-slate-400 opacity-70"/> <span>Cardio<br/>Zone</span></div>
                  <div className="flex flex-col items-center gap-1"><ClipboardList className="w-4 h-4 text-slate-400 opacity-70"/> <span>Workout<br/>Floor</span></div>
                  <div className="flex flex-col items-center gap-1"><Droplets className="w-4 h-4 text-slate-400 opacity-70"/> <span>Drinking<br/>Water</span></div>
                  <div className="flex flex-col items-center gap-1 col-span-2"><Users className="w-4 h-4 text-slate-400 opacity-70"/> <span>Open Gym Access</span></div>
                </div>
                <a href="https://wa.me/918866445862" target="_blank" rel="noreferrer" className="block w-full py-3 text-center bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded border border-slate-700/50">
                  Enquire Now
                </a>
              </div>
            </div>


            {/* PREMIUM (Luxury Gold Theme) - CENTER */}
            <div className="w-full max-w-[340px] bg-[#0a0a0a] border-2 border-[#d4af37] flex flex-col rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(212,175,55,0.1)] relative
                            transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                            lg:relative lg:z-30 lg:scale-100
                            group-hover:lg:scale-[1.02] hover:!z-40 hover:!scale-[1.05] hover:shadow-[0_10px_50px_rgba(212,175,55,0.25)]">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#d4af37]" />
              <div className="p-6 border-b border-white/5">
                <h3 className="text-3xl md:text-4xl font-bebas tracking-wide mb-1 text-white italic">PREMIUM</h3>
                <div className="bg-[#d4af37] text-black text-[9px] font-bold uppercase tracking-widest py-1 px-3 inline-block mb-6 rounded">Personal Training + Diet Plan</div>
                
                <div className="grid grid-cols-3 gap-1 text-center mb-6 border-b border-white/5 pb-4">
                  <div><div className="text-[#d4af37] font-bold text-[9px] uppercase">1-1 Coaching</div></div>
                  <div className="border-x border-white/10"><div className="text-[#d4af37] font-bold text-[9px] uppercase">Custom Diet</div></div>
                  <div><div className="text-[#d4af37] font-bold text-[9px] uppercase">100% Results</div></div>
                </div>

                <ul className="space-y-3">
                  {[
                    { d: '1 MONTH', p: '3999' },
                    { d: '3 MONTHS', p: '7999' },
                    { d: '6 MONTHS', p: '14,999' },
                    { d: '9 MONTHS', p: '19,999' },
                    { d: '1 YEAR', p: '25,999' },
                  ].map((plan, i) => (
                    <li key={i} className="flex justify-between items-center text-xs border border-white/5 p-2 rounded bg-black/50 hover:border-[#d4af37]/20 transition-colors">
                      <span className="text-gray-300 font-oswald tracking-wide flex items-center gap-2">
                         <svg className="w-3 h-3 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        {plan.d}
                      </span>
                      <span className="font-bebas text-xl text-[#d4af37] tracking-wide">₹{plan.p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 mt-auto">
                <div className="text-center text-[9px] font-bold uppercase tracking-widest text-[#d4af37] mb-3 flex items-center justify-center gap-2">
                  <span className="w-6 h-[1px] bg-[#d4af37]/50" /> FACILITIES <span className="w-6 h-[1px] bg-[#d4af37]/50" />
                </div>
                <div className="grid grid-cols-3 gap-y-3 gap-x-1 text-center text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-4 leading-tight">
                  <div className="flex flex-col items-center gap-1"><Dumbbell className="w-4 h-4 text-[#d4af37] opacity-70"/> <span>Premium<br/>Equipment</span></div>
                  <div className="flex flex-col items-center gap-1"><HeartPulse className="w-4 h-4 text-[#d4af37] opacity-70"/> <span>Cardio<br/>Zone</span></div>
                  <div className="flex flex-col items-center gap-1"><Key className="w-4 h-4 text-[#d4af37] opacity-70"/> <span>Locker<br/>Room</span></div>
                  <div className="flex flex-col items-center gap-1"><ShowerHead className="w-4 h-4 text-[#d4af37] opacity-70"/> <span>Clean<br/>Showers</span></div>
                  <div className="flex flex-col items-center gap-1"><Droplets className="w-4 h-4 text-[#d4af37] opacity-70"/> <span>Drinking<br/>Water</span></div>
                  <div className="flex flex-col items-center gap-1"><Car className="w-4 h-4 text-[#d4af37] opacity-70"/> <span>Parking<br/>Available</span></div>
                </div>
                <a href="https://wa.me/918866445862" target="_blank" rel="noreferrer" className="block w-full py-3 text-center bg-[#d4af37] text-black text-xs font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 rounded">
                  Enquire Now
                </a>
              </div>
            </div>


            {/* STANDARD (Froaster Orange Theme) - RIGHT */}
            <div className="w-full max-w-[320px] bg-[#0a0a0a] border-2 border-[#ff5722]/20 flex flex-col rounded-xl overflow-hidden shadow-xl
                            transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                            lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2 lg:scale-90 lg:opacity-40 lg:rotate-y-12 lg:z-10
                            group-hover:lg:translate-x-[55%] group-hover:lg:scale-100 group-hover:lg:opacity-100 group-hover:lg:rotate-y-0
                            hover:!z-40 hover:!border-[#ff5722] hover:lg:scale-[1.05]">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#ff5722]" />
              <div className="p-5 border-b border-white/5">
                <h3 className="text-2xl md:text-3xl font-bebas tracking-wide mb-1 text-white italic">STANDARD PLAN</h3>
                <div className="bg-[#ff5722] text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 inline-block mb-6 rounded">With Training</div>
                
                <ul className="space-y-3">
                  {[
                    { d: '1 MONTH', p: '1200' },
                    { d: '3 MONTHS', p: '3300' },
                    { d: '6 MONTHS', p: '6000' },
                    { d: '9 MONTHS', p: '9000' },
                    { d: '1 YEAR', p: '10,500' },
                  ].map((plan, i) => (
                    <li key={i} className="flex justify-between items-center text-xs border border-white/5 p-2 rounded bg-black/50 hover:border-[#ff5722]/20 transition-colors">
                      <span className="text-gray-300 font-oswald tracking-wide flex items-center gap-2">
                         <svg className="w-3 h-3 text-[#ff5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        {plan.d}
                      </span>
                      <span className="font-bebas text-lg text-[#ff5722] tracking-wide">₹{plan.p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 mt-auto bg-[#0a0a0a]">
                <div className="text-center text-[10px] font-bold uppercase tracking-widest text-[#ff5722] mb-3 flex items-center justify-center gap-2">
                  <span className="w-6 h-[1px] bg-[#ff5722]/30" /> INCLUDES <span className="w-6 h-[1px] bg-[#ff5722]/30" />
                </div>
                <div className="grid grid-cols-3 gap-y-3 gap-x-1 text-center text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-4 leading-tight">
                  <div className="flex flex-col items-center gap-1"><Dumbbell className="w-4 h-4 text-[#ff5722] opacity-70"/> <span>Modern<br/>Equipment</span></div>
                  <div className="flex flex-col items-center gap-1"><Medal className="w-4 h-4 text-[#ff5722] opacity-70"/> <span>Certified<br/>Trainers</span></div>
                  <div className="flex flex-col items-center gap-1"><HeartPulse className="w-4 h-4 text-[#ff5722] opacity-70"/> <span>Cardio<br/>Zone</span></div>
                  <div className="flex flex-col items-center gap-1"><ClipboardList className="w-4 h-4 text-[#ff5722] opacity-70"/> <span>Workout<br/>Plan</span></div>
                  <div className="flex flex-col items-center gap-1"><Users className="w-4 h-4 text-[#ff5722] opacity-70"/> <span>Open Gym<br/>Access</span></div>
                  <div className="flex flex-col items-center gap-1"><Droplets className="w-4 h-4 text-[#ff5722] opacity-70"/> <span>Drinking<br/>Water</span></div>
                </div>
                <a href="https://wa.me/918866445862" target="_blank" rel="noreferrer" className="block w-full py-3 text-center bg-[#ff5722] hover:bg-[#ff3d00] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded">
                  WhatsApp Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Gallery Section */}
      <section id="gallery" className="py-32 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          <div className="mb-16">
             <h2 className="text-5xl md:text-7xl font-bebas font-bold leading-[0.9] tracking-wide mb-2 uppercase">
                INSIDE FROASTER
             </h2>
             <div className="text-[#ff5722] text-sm font-bold uppercase tracking-widest">
                TRAIN. SWEAT. TRANSFORM.
             </div>
          </div>

          {/* Masonry / Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
             <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-black">
                <img src="/gallery1.jpg" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 hover:scale-105" alt="Reception Area" />
             </div>
             <div className="relative group overflow-hidden bg-black">
                <img src="/gallery2.jpg" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 hover:scale-105" alt="Gym Floor View 1" />
             </div>
             <div className="relative group overflow-hidden bg-black">
                <img src="/gallery3.png" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 hover:scale-105" alt="Gym Floor View 2" />
             </div>
          </div>

        </div>
      </section>

      {/* 7. Transformation */}
      <section className="py-40 bg-black relative flex items-center justify-center overflow-hidden border-y border-[#ff5722]/20">
         <div className="absolute inset-0 bg-[url('/transformation_bg.png')] bg-cover bg-fixed bg-[center_top] opacity-40" />
         <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black/50 to-[#0a0a0a]" />
         
         <div className="relative z-10 text-center flex flex-col items-center">
            <div className="text-xl md:text-3xl font-oswald text-[#ff5722] mb-6 uppercase tracking-[0.3em]">
               Your Stronger Self
            </div>
            <h2 className="text-[4rem] md:text-[8rem] font-bebas font-bold leading-[0.85] text-white opacity-90 drop-shadow-2xl">
               TRAIN HARD.<br/>STAY CONSISTENT.<br/>TRANSFORM.
            </h2>
         </div>
      </section>

      {/* 8. Contact & Location */}
      <section id="contact" className="py-32 bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
           
           <div className="flex flex-col justify-center">
              <h2 className="text-6xl md:text-8xl font-bebas font-bold leading-[0.9] tracking-wide mb-6">
                READY TO START?
              </h2>
              <p className="text-gray-400 font-light max-w-sm text-lg mb-12">
                Your transformation starts with the first step. Visit us or reach out today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                 <a href="tel:9409478823" className="bg-white text-black hover:bg-[#ff5722] hover:text-white text-xs font-bold uppercase tracking-widest py-5 px-10 text-center transition-colors">
                   Call Now
                 </a>
                 <a href="https://wa.me/919409478823" target="_blank" rel="noreferrer" className="bg-[#ff5722] text-white hover:bg-white hover:text-black text-xs font-bold uppercase tracking-widest py-5 px-10 text-center transition-colors">
                   WhatsApp Us
                 </a>
              </div>

              <div className="space-y-8">
                 <div className="flex items-start gap-4">
                    <Phone className="text-[#ff5722] w-6 h-6 mt-1" />
                    <div>
                       <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Phone / WhatsApp</div>
                       <div className="text-xl font-oswald text-white tracking-wide">94094 78823</div>
                    </div>
                 </div>
                 
                 <div className="flex items-start gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff5722] w-6 h-6 mt-1"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    <div>
                       <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Instagram</div>
                       <a href="https://www.instagram.com/froaster_fitness/" target="_blank" rel="noreferrer" className="text-xl font-oswald text-white tracking-wide hover:text-[#ff5722] transition-colors">
                         @froaster_fitness
                       </a>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <MapPin className="text-[#ff5722] w-6 h-6 mt-1" />
                    <div>
                       <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Location</div>
                       <div className="text-lg font-light text-white leading-relaxed max-w-xs">
                         Froaster Gym<br/>
                         Dudhimati River Bridge, Near Road, Desaiwad, Dahod, Gujarat 389151
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Google Maps Embed */}
           <div className="relative h-[500px] lg:h-auto bg-[#111] p-2 border border-white/5 grayscale hover:grayscale-0 transition-all duration-700">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117540.35928822997!2d74.19539343361111!3d22.842797619280665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3960a5e2f0a174c1%3A0xc3f58a361e6fbfa4!2sDahod%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
                title="Froaster Gym Location"
              />
              <a 
                href="https://goo.gl/maps/YOUR_LINK_HERE" 
                target="_blank" 
                rel="noreferrer"
                className="absolute bottom-8 right-8 bg-[#ff5722] text-white text-xs font-bold uppercase tracking-widest py-4 px-8 shadow-2xl hover:bg-white hover:text-black transition-colors"
              >
                Get Directions
              </a>
           </div>

        </div>
      </section>

      {/* 9. Premium Footer */}
      <footer className="bg-[#050505] pt-24 relative overflow-hidden border-t border-white/5">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">
             {/* Brand Column */}
             <div className="md:col-span-5 pr-0 md:pr-12">
                <img src="/logo.png" alt="Froaster Gym" className="h-12 md:h-16 object-contain invert brightness-200 mb-4" />
                <div className="text-[#ff5722] text-xs font-bold uppercase tracking-widest mb-6">
                  Where fat meets its fate.
                </div>
                <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 max-w-sm">
                  We are more than just a gym. We are a community built on discipline, strength, and transformation. Located in the heart of Dahod.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/froaster_fitness/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#ff5722] hover:border-[#ff5722] transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="https://wa.me/919409478823" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#ff5722] hover:border-[#ff5722] transition-colors group">
                    <Phone className="w-[18px] h-[18px] text-white" />
                  </a>
                </div>
             </div>

             {/* Links Column */}
             <div className="md:col-span-3">
                <h4 className="text-white text-lg font-bebas tracking-widest mb-6 uppercase">Navigation</h4>
                <ul className="space-y-3 text-sm font-medium text-gray-400">
                  <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-[#ff5722] transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#ff5722]"/> Home</button></li>
                  <li><button onClick={() => scrollToSection('about')} className="hover:text-[#ff5722] transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#ff5722]"/> About Us</button></li>
                  <li><button onClick={() => scrollToSection('services')} className="hover:text-[#ff5722] transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#ff5722]"/> Our Services</button></li>
                  <li><button onClick={() => scrollToSection('memberships')} className="hover:text-[#ff5722] transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#ff5722]"/> Memberships</button></li>
                  <li><button onClick={() => scrollToSection('gallery')} className="hover:text-[#ff5722] transition-colors flex items-center gap-2 group"><ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#ff5722]"/> Gallery</button></li>
                </ul>
             </div>

             {/* Contact Column */}
             <div className="md:col-span-4">
                <h4 className="text-white text-lg font-bebas tracking-widest mb-6 uppercase">Visit Us</h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                     <MapPin className="text-[#ff5722] w-5 h-5 shrink-0" />
                     <p className="text-sm font-light text-gray-400 leading-relaxed">
                       Dudhimati River Bridge, Near Road,<br/>Desaiwad, Dahod, Gujarat 389151
                     </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <Phone className="text-[#ff5722] w-5 h-5 shrink-0" />
                     <a href="tel:9409478823" className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-widest">
                       +91 94094 78823
                     </a>
                  </div>
                  <button 
                    onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                    className="mt-6 border border-white/20 text-white text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-full hover:bg-white hover:text-black transition-colors"
                  >
                    Back to Top
                  </button>
                </div>
             </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-6 text-xs font-medium text-gray-600 uppercase tracking-widest relative z-10">
             <div>© {new Date().getFullYear()} Froaster Gym. All rights reserved.</div>
             <div className="mt-4 md:mt-0">Forge Your Legacy.</div>
          </div>
        </div>

        {/* Huge Typographic Background */}
        <div className="w-full overflow-hidden flex justify-center pointer-events-none select-none opacity-5 mt-[-40px]">
          <span className="font-bebas text-[20vw] font-bold text-white leading-none whitespace-nowrap">
            FROASTER
          </span>
        </div>
      </footer>
    </div>
  );
}
