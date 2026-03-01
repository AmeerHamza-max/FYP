/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Rocket, ArrowUpRight, Globe, Fingerprint, Linkedin, ExternalLink } from 'lucide-react';
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
        {/* HERO SECTION */}
        <section className="pt-44 pb-24 px-6 relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -z-10 skew-x-6 translate-x-20" />
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="h-[1px] w-10 bg-[#42C8F5]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#42C8F5]">Precision in Influence</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter uppercase italic leading-[0.85] mb-10 text-[#0f1121]">
                WE DECODE <br />
                <span className="text-[#42C8F5]">INFLUENCE.</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-500 font-bold uppercase tracking-tighter leading-snug max-w-lg">
                Bridging the gap between raw data and human storytelling. We help brands find their perfect voice in the digital noise.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50"
            >
              <img 
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop" 
                alt="AI Tech Analysis" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-[#42C8F5]/10 mix-blend-multiply" />
            </motion.div>
          </div>
        </section>

        {/* FOUNDER SECTION: Ameer Hamza */}
        <section className="py-28 px-6 bg-[#0f1121] text-white relative overflow-hidden">
           <div className="absolute left-[-100px] top-[-100px] opacity-[0.03]">
              <Fingerprint size={500} strokeWidth={0.5} />
           </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
            <div className="relative group max-w-md mx-auto md:mx-0">
               <div className="aspect-[4/5] bg-slate-800 rounded-[2.5rem] overflow-hidden border border-white/10 group-hover:border-[#42C8F5]/50 transition-all duration-500 shadow-2xl relative">
                  
                  {/* Your image from public folder */}
                  <img 
                    src="/Ameer%20Hamza.png" 
                    alt="Ameer Hamza" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1121] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Ameer Hamza</h3>
                    <p className="text-[#42C8F5] font-black uppercase tracking-[0.25em] text-[9px] mt-1">Founder & Lead Developer</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6 leading-none">
                The mind behind <br /> <span className="text-[#42C8F5]">The Machine.</span>
              </h2>
              <div className="space-y-5 text-slate-400 font-medium text-base md:text-lg leading-relaxed">
                <p>
                  Ameer Hamza is a tech visionary obsessed with the intersection of AI and human psychology. Seeing the struggle of modern businesses in the chaotic world of TikTok and Instagram, he built this platform to simplify success.
                </p>
                <p>
                  His philosophy: <span className="text-white italic">"Data should empower creativity, not replace it."</span> By leveraging advanced algorithms, he ensures every partnership is rooted in authenticity and measurable ROI.
                </p>
                
                {/* Social Links */}
                <div className="pt-6 flex flex-wrap gap-4">
                   <a 
                    href="https://www.linkedin.com/in/ameer-hamza-web-developer" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-8 py-4 bg-[#42C8F5] text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-all active:scale-95 shadow-lg shadow-[#42C8F5]/20"
                   >
                     <Linkedin size={16} /> Connect on LinkedIn
                   </a>
                   <button className="flex items-center gap-3 px-8 py-4 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/5 transition-all">
                     View Projects <ArrowUpRight size={16} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-20 px-6 border-b border-slate-50">
           <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
              {stats.map((stat, i) => (
                <div key={i} className="group">
                   <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 group-hover:text-[#42C8F5] transition-colors">{stat.label}</p>
                   <h4 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">{stat.value}</h4>
                </div>
              ))}
           </div>
        </section>

        {/* DISRUPT SECTION */}
        <section className="py-32 px-6 bg-slate-50/30 relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-20 text-center md:text-left">
               <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9]">
                  HOW WE <br /> <span className="text-[#42C8F5]">DISRUPT.</span>
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Deep Discovery", 
                  desc: "Our AI scans millions of TikTok & Instagram profiles to find creators who align with your brand's DNA.", 
                  icon: <Search size={32}/>,
                  img: "https://images.unsplash.com/photo-1551288049-bbbda546697c?q=80&w=500&auto=format&fit=crop"
                },
                { 
                  title: "Smart Vetting", 
                  desc: "We eliminate the noise. No bots, no fake followers. Only authentic voices that drive conversion.", 
                  icon: <Globe size={32}/>,
                  img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop"
                },
                { 
                  title: "ROI Mastery", 
                  desc: "Predictive analytics to ensure your campaign budget is an investment, not an expense.", 
                  icon: <Rocket size={32}/>,
                  img: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=500&auto=format&fit=crop"
                }
              ].map((item, i) => (
                <motion.div 
                  whileHover={{ y: -10 }}
                  key={i} 
                  className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div className="h-44 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                  </div>
                  <div className="p-8">
                    <div className="text-[#42C8F5] mb-6">{item.icon}</div>
                    <h3 className="text-xl font-black uppercase italic mb-3">{item.title}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
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