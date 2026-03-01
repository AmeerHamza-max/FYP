import { Home, DollarSign, Users, Briefcase, Zap } from 'lucide-react';

export const navLinks = [
  { 
    id: 'home', 
    name: 'Home', 
    path: '/', 
    icon: Home 
  },
  { 
    id: 'platform', 
    name: 'Platform', 
    path: '/#platform', // Ye home page ke section pe le jayega
    icon: Zap 
  },
  { 
    id: 'pricing', 
    name: 'Pricing', 
    path: '/pricing', // Ye naye page pe le jayega
    icon: DollarSign 
  },
  { 
    id: 'about', 
    name: 'About', 
    path: '/about', 
    icon: Briefcase 
  },
];