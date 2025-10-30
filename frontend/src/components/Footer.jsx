import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const footerLinks = {
    Product: [
      { label: 'Browse Services', path: '/browse' },
      { label: 'How It Works', path: '/#how-it-works' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'Enterprise', path: '/enterprise' },
    ],
    Company: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/careers' },
      { label: 'Press', path: '/press' },
      { label: 'Contact', path: '/contact' },
    ],
    Resources: [
      { label: 'Blog', path: '/blog' },
      { label: 'Help Center', path: '/help' },
      { label: 'Community', path: '/community' },
      { label: 'API Docs', path: '/api' },
    ],
    Legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'Security', path: '/security' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-muted/30 border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                F
              </div>
              <span className="text-xl font-bold">FreelanceHub</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              The trusted platform connecting businesses with talented freelancers worldwide.
            </p>
            {/* Newsletter */}
            <div className="max-w-xs">
              <p className="text-sm font-medium mb-2">Stay Updated</p>
              <div className="flex gap-2">
                <Input type="email" placeholder="Your email" className="h-9 text-sm" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-3 text-sm">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 FreelanceHub. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    <Icon className="w-4 h-4" />
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}