import { Shield, Users, BarChart, Zap } from 'lucide-react';

export const features = [
  { 
    title: "AI Vetting", 
    desc: "Our AI ensures every influencer has real engagement and a clean history.", 
    icon: Shield // <--- Notice: No tags < > here
  },
  { 
    title: "Smart Matching", 
    desc: "Connect with creators that actually align with your brand values.", 
    icon: Users 
  },
  { 
    title: "Real-time ROI", 
    desc: "Track every penny spent with live campaign performance dashboards.", 
    icon: BarChart 
  },
  { 
    title: "Instant Payouts", 
    desc: "Secure escrow payments that release instantly upon milestone completion.", 
    icon: Zap 
  },
];

export const faqs = [
  { q: "How do you verify influencers?", a: "We use a multi-step AI process that analyzes audience demographics, fake follower patterns, and historical campaign data to ensure 100% authenticity." },
  { q: "Is there a minimum budget?", a: "Grow is built for everyone. Whether you're a startup or a global enterprise, our tools help you scale according to your budget." },
  { q: "Can I manage multiple campaigns?", a: "Yes, our central dashboard allows you to run, monitor, and adjust multiple influencer campaigns simultaneously across different platforms." }
];