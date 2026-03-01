import { Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

export const footerLinks = {
  platform: [
    { name: 'Campaigns', href: '/campaigns' },
    { name: 'Influencers', href: '/influencers' },
    { name: 'Analytics', href: '/analytics' },
    { name: "Dashboard", href: "/dashboard" }
  ],
  company: [
    {name:"Pricing", href:"/pricing"},
    { name: "About Us", href: "/about-us" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Contact", href: "/contact" }
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" }
  ]
};

export const socialLinks = [
  { 
    icon: Linkedin, 
    href: "https://www.linkedin.com/in/ameer-hamza-web-developer", 
    label: "LinkedIn" 
  },
  { 
    icon: Instagram, 
    href: "https://www.instagram.com/cristiano", 
    label: "Instagram" 
  },
  { 
    icon: Twitter, 
    href: "https://twitter.com/elonmusk", 
    label: "Twitter" 
  },
  { 
    icon: Facebook, 
    href: "https://www.facebook.com/zuck", 
    label: "Facebook" 
  }
];

export const contactInfo = {
  email: "contact@growbusiness.ai",
  phone: "+92 300 1234567",
  address: "Sargodha, Punjab, PK"
};