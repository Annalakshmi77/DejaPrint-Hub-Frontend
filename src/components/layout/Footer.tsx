import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Use same 'visible' class as Home.tsx so both observers work
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px 100px 0px' }
    );

    const animatedEls = footerRef.current?.querySelectorAll('.footer-animate');
    animatedEls?.forEach((el) => observer.observe(el));

    // Also immediately make visible if already in view
    animatedEls?.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="site-footer" ref={footerRef}>
      {/* Top decorative line */}
      <div className="footer-rule" />

      {/* Main footer body */}
      <div className="footer-inner">

        {/* Brand column */}
        <div className="footer-col footer-brand-col footer-animate" style={{ '--delay': '0s' } as React.CSSProperties}>
          <div className="footer-logo">
            DejaPrint<span>Hub</span>
          </div>
          <p className="footer-tagline">
            Bespoke printing for diaries, calendars, notebooks &amp; invitations.
            <br />Designed to order. Delivered with care.
          </p>

          {/* Social icons */}
          <div className="footer-socials">
            <a href="#" className="footer-social-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" className="footer-social-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" className="footer-social-link" aria-label="Twitter / X">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="footer-social-link" aria-label="Pinterest">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.63-.31-1.55c0-1.45.84-2.54 1.89-2.54.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.88 1.54 1.88 1.84 0 3.08-2.35 3.08-5.13 0-2.12-1.43-3.71-3.99-3.71-2.91 0-4.72 2.17-4.72 4.6 0 .83.24 1.42.62 1.87.17.2.19.28.13.51-.04.17-.14.58-.18.74-.06.23-.24.32-.44.23-1.25-.51-1.83-1.89-1.83-3.44 0-2.55 2.15-5.61 6.43-5.61 3.44 0 5.72 2.47 5.72 5.13 0 3.51-1.95 6.14-4.82 6.14-.96 0-1.87-.52-2.18-1.1l-.62 2.38c-.22.86-.82 1.93-1.23 2.59.93.29 1.91.44 2.92.44 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Products column */}
        <div className="footer-col footer-animate" style={{ '--delay': '0.08s' } as React.CSSProperties}>
          <h4 className="footer-col-title">Products</h4>
          <ul className="footer-nav-list">
            <li><a href="#">Custom Diaries</a></li>
            <li><a href="#">Wall Calendars</a></li>
            <li><a href="#">Desk Calendars</a></li>
            <li><a href="#">Notebooks</a></li>
            <li><a href="#">Wedding Invitations</a></li>
            <li><a href="#">Corporate Gifts</a></li>
          </ul>
        </div>

        {/* Company column */}
        <div className="footer-col footer-animate" style={{ '--delay': '0.16s' } as React.CSSProperties}>
          <h4 className="footer-col-title">Company</h4>
          <ul className="footer-nav-list">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Process</a></li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Support column */}
        <div className="footer-col footer-animate" style={{ '--delay': '0.24s' } as React.CSSProperties}>
          <h4 className="footer-col-title">Support</h4>
          <ul className="footer-nav-list">
            <li><a href="#">Design Guide</a></li>
            <li><a href="#">File Templates</a></li>
            <li><a href="#">Delivery Info</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Returns Policy</a></li>
            <li><a href="#">Track My Order</a></li>
          </ul>
        </div>

        {/* Newsletter column */}
        {/* <div className="footer-col footer-newsletter-col footer-animate" style={{ '--delay': '0.32s' } as React.CSSProperties}>
          <h4 className="footer-col-title">Stay Inspired</h4>
          <p className="footer-newsletter-desc">
            Get design tips, new product launches, and exclusive offers in your inbox.
          </p>
          <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="footer-newsletter-input"
              aria-label="Email address"
            />
            <button type="submit" className="footer-newsletter-btn">
              Subscribe ✦
            </button>
          </form>
          <p className="footer-newsletter-note">No spam. Unsubscribe anytime.</p>
        </div> */}

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <span className="footer-copy">© 2025 <span className="footer-brand-name">DejaPrint Hub</span>. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="footer-divider">·</span>
            <a href="#">Terms of Service</a>
            <span className="footer-divider">·</span>
            <a href="#">Cookie Settings</a>
          </div>
          <span className="footer-copy">Designed with ✦ for creators everywhere</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
