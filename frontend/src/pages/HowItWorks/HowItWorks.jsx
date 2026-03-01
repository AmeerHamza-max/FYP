// eslint-disable no-unused-vars //
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Clickable banane ke liye Link import kiya
import { Cpu, BarChart3, Users2, ArrowRight, Zap, Target, MousePointer2, Sparkles } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

// Motion component for Link to keep animations
const MotionLink = motion(Link);

const HowItWorks = () => {
  const steps = [
    {
      title: "Set Your Target",
      desc: "Tell us your niche. Our AI understands your brand's vibe instantly.",
      icon: <Target className="text-[#42C8F5]" size={28} />,
      color: "bg-blue-50"
    },
    {
      title: "AI Deep Analysis",
      desc: "We scan millions of profiles to find real engagement, not fake bots.",
      icon: <Cpu className="text-[#42C8F5]" size={28} />,
      color: "bg-purple-50"
    },
    {
      title: "Perfect Match",
      desc: "Get a hand-picked list of creators that fit your budget and style.",
      icon: <Users2 className="text-[#42C8F5]" size={28} />,
      color: "bg-cyan-50"
    },
    {
      title: "Watch It Scale",
      desc: "Track ROI in real-time with our high-precision analytics dashboard.",
      icon: <BarChart3 className="text-[#42C8F5]" size={28} />,
      color: "bg-green-50"
    }
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-[#42C8F5] selection:text-white flex flex-col font-sans overflow-x-hidden">
      <Header />

      <main className="flex-grow pt-32">
        {/* HERO SECTION */}
        <section className="py-20 px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-[#42C8F5] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Process is Power</span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none text-[#0f1121] mb-6">
              SMART. SIMPLE. <br /> <span className="text-[#42C8F5]">SCALABLE.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
              We took the complexity out of influencer marketing. 4 steps to dominate your market.
            </p>
          </motion.div>
        </section>

        {/* STEP CARDS */}
        <section className="pb-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:shadow-2xl hover:shadow-[#42C8F5]/10 transition-all duration-500 relative group overflow-hidden"
              >
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-black uppercase italic mb-3 text-[#0f1121]">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{step.desc}</p>
                <div className="absolute -bottom-2 -right-2 text-slate-50 font-black text-8xl -z-10 group-hover:text-[#42C8F5]/5 transition-colors">
                  {i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* VISUAL SHOWCASE */}
        <section className="py-24 px-6 bg-[#0f1121] rounded-[3rem] md:rounded-[5rem] mx-4 mb-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bbbda546697c?auto=format&fit=crop&q=80&w=1000" 
                alt="AI Analytics" 
                className="rounded-[2.5rem] shadow-2xl border border-white/10"
              />
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-6 -left-6 bg-[#42C8F5] text-black p-5 rounded-2xl shadow-xl hidden md:block"
              >
                <Sparkles size={24} />
              </motion.div>
            </div>

            <div className="order-1 lg:order-2 text-white">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-tight">
                Data that <br /> <span className="text-[#42C8F5]">Speaks Human.</span>
              </h2>
              <div className="space-y-8">
                {[
                  "Our AI filters out 99% of 'fake influencers' before they even reach your list.",
                  "Predictive modeling tells you exactly how much sales to expect from a campaign.",
                  "Auto-generate contracts and payments in one single click."
                ].map((text, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 border border-[#42C8F5] rounded-full flex items-center justify-center text-[#42C8F5] font-black">{i+1}</div>
                    <p className="text-slate-400 font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CLICKABLE CTA SECTION */}
        <section className="py-20 px-6">
           <div className="max-w-5xl mx-auto bg-slate-50 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
              <MousePointer2 className="absolute top-10 right-10 text-slate-200" size={100} />
              <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 relative z-10 text-[#0f1121]">
                Stop Guessing. <br /> <span className="text-[#42C8F5]">Start Scaling.</span>
              </h2>
              
              {/* YE BUTTON CLICKABLE HAI - REDIRECTS TO LOGIN */}
              <MotionLink 
                to="/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-12 py-5 bg-[#0f1121] text-white rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-[#42C8F5] hover:text-black transition-all duration-300 relative z-10 shadow-xl shadow-black/10"
              >
                Launch Your First Campaign
              </MotionLink>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;