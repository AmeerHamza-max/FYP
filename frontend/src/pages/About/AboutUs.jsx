/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Rocket, ArrowUpRight, Globe, Fingerprint, Linkedin } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const AboutUs = () => {
  const stats = [
    { label: "Data Points Analyzed", value: "1B+" },
    { label: "Active Creators", value: "850K" },
    { label: "Matching Accuracy", value: "99%" },
    { label: "Global Reach", value: "24/7" },
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-[#42C8F5] selection:text-white flex flex-col font-sans overflow-x-hidden">
      <Header />

      <main className="flex-grow">
        {/* HERO */}
        <section className="pt-36 pb-20 px-6 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-[#42C8F5]" />
                <span className="text-xs font-medium text-[#42C8F5]">Precision in Influence</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6 text-[#0f1121]">
                We decode <span className="text-[#42C8F5]">influence</span>
              </h1>

              <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-md">
                Bridging the gap between raw data and human storytelling. We help brands find their perfect voice in the digital noise.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop" 
                alt="AI Tech" 
                className="w-full h-[360px] object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* FOUNDER */}
        <section className="py-24 px-6 bg-[#0f1121] text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14">
            <div className="max-w-sm mx-auto md:mx-0">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src="/Ameer%20Hamza.png" 
                  alt="Ameer Hamza" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl font-semibold mb-4">
                The mind behind the <span className="text-[#42C8F5]">machine</span>
              </h2>

              <div className="space-y-4 text-slate-400 text-sm md:text-base leading-relaxed">
                <p>
                  Ameer Hamza is focused on blending AI with human psychology to help brands succeed in the fast-moving social media world.
                </p>
                <p>
                  His philosophy: <span className="text-white">Data should empower creativity, not replace it.</span>
                </p>

                <div className="pt-4 flex gap-3 flex-wrap">
                  <a 
                    href="https://www.linkedin.com/in/ameer-hamza-web-developer" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2 bg-[#42C8F5] text-black text-sm rounded-lg font-medium hover:bg-white transition"
                  >
                    <Linkedin size={16} /> LinkedIn
                  </a>

                  <button className="flex items-center gap-2 px-5 py-2 border border-white/20 text-sm rounded-lg hover:bg-white/10 transition">
                    Projects <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
                <h4 className="text-2xl md:text-3xl font-semibold">{stat.value}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-semibold mb-12">
              How we <span className="text-[#42C8F5]">work</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Deep Discovery", desc: "AI scans profiles to match brand identity.", icon: <Search size={24}/> },
                { title: "Smart Vetting", desc: "Only authentic creators, no fake data.", icon: <Globe size={24}/> },
                { title: "ROI Mastery", desc: "Ensure campaigns drive real value.", icon: <Rocket size={24}/> }
              ].map((item, i) => (
                <motion.div 
                  whileHover={{ y: -5 }}
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-[#42C8F5] mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
