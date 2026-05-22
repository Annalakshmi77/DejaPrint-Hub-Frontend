import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import './Home.css';

const Home: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('home-active');

    // Scroll reveal
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .step, .testimonial').forEach(el => observer.observe(el));

    // Count-up animation
    function countUp(el: HTMLElement, target: number, suffix: string) {
      let start = 0;
      const duration = 1800;
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const val = Math.floor(progress * target);
        el.textContent = val.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const raw = el.dataset.count;
          if (raw) {
            const suffix = el.textContent?.replace(/[\d,]+/, '').replace(/0/, '') || '';
            countUp(el, parseInt(raw), suffix);
            statsObserver.unobserve(el);
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => statsObserver.observe(el));

    // Smooth parallax on hero blobs
    const handleParallax = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      const b1 = document.querySelector('.blob-1') as HTMLElement;
      const b2 = document.querySelector('.blob-2') as HTMLElement;
      const b3 = document.querySelector('.blob-3') as HTMLElement;
      if (b1) b1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
      if (b2) b2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
      if (b3) b3.style.transform = `translate(${x * 0.9}px, ${y * 0.9}px)`;
    };
    document.addEventListener('mousemove', handleParallax);

    // ——— THEME TOGGLE ———
    const themeToggle = document.getElementById('themeToggle');
    const toggleTheme = () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('printcraft-theme', isLight ? 'light' : 'dark');
    };
    themeToggle?.addEventListener('click', toggleTheme);

    return () => {
      document.body.classList.remove('home-active');
      document.removeEventListener('mousemove', handleParallax);
      themeToggle?.removeEventListener('click', toggleTheme);
      observer.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  return (
    <div className="home-page-wrapper">

      {/* Navbar */}
      <nav className="site-navbar">
        <div className="logo">Print<span>Craft</span></div>
        <ul className="nav-links">
          <li><a href="#products">Products</a></li>
          <li><a href="#process">How it works</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-right">
          <button className="theme-toggle" id="themeToggle" aria-label="Toggle light/dark mode">
            <span className="icon-moon">🌙</span>
            <span className="icon-sun">☀️</span>
          </button>
          <Link to="/login" className="nav-signin">Sign In</Link>
          <Link to="/register" className="nav-cta">Start your order</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="hero-content">
          <div className="hero-badge">
            <div className="badge-dot"></div>
            Custom Design & Printing Studio
          </div>

          <h1 className="hero-title">
            <div className="line"><span>Your Vision,</span></div>
            <div className="line"><span>Printed with</span></div>
            <div className="line"><span className="gold">Perfection.</span></div>
          </h1>

          <p className="hero-sub">
            From bespoke diaries to luxury invitations — we design, print, and deliver everything exactly as you imagine it. Upload your idea or start from scratch.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Start Designing ✦
            </Link>
            <a href="#process" className="btn-secondary">
              See how it works <span className="btn-arrow">→</span>
            </a>
          </div>
        </div>

        {/* Floating Product Mockups */}
        <div className="floating-products">
          {/* Diary */}
          <div className="product-card">
            <div className="diary-inner">
              <div className="product-label">Custom Diary</div>
              <div className="product-deco"></div>
              <div className="diary-lines">
                <div className="diary-line" style={{ animationDelay: '1.2s' }}></div>
                <div className="diary-line" style={{ animationDelay: '1.35s', width: '80%' }}></div>
                <div className="diary-line" style={{ animationDelay: '1.5s' }}></div>
                <div className="diary-line" style={{ animationDelay: '1.65s', width: '60%' }}></div>
                <div className="diary-line" style={{ animationDelay: '1.8s' }}></div>
                <div className="diary-line" style={{ animationDelay: '1.95s', width: '75%' }}></div>
                <div className="diary-line" style={{ animationDelay: '2.1s' }}></div>
                <div className="diary-line" style={{ animationDelay: '2.25s', width: '50%' }}></div>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="product-card">
            <div className="product-label" style={{ padding: '0.8rem 0.8rem 0', fontSize: '0.6rem' }}>Calendar 2025</div>
            <div className="cal-grid" style={{ padding: '0.3rem 0.6rem 0.6rem' }}>
              <div className="cal-cell" style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.45rem' }}>M</div>
              <div className="cal-cell" style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.45rem' }}>T</div>
              <div className="cal-cell" style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.45rem' }}>W</div>
              <div className="cal-cell" style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.45rem' }}>T</div>
              <div className="cal-cell" style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.45rem' }}>F</div>
              <div className="cal-cell" style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.45rem' }}>S</div>
              <div className="cal-cell" style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.45rem' }}>S</div>
              <div className="cal-cell">1</div><div className="cal-cell">2</div><div className="cal-cell">3</div>
              <div className="cal-cell">4</div><div className="cal-cell">5</div><div className="cal-cell">6</div><div className="cal-cell">7</div>
              <div className="cal-cell">8</div><div className="cal-cell">9</div><div className="cal-cell">10</div>
              <div className="cal-cell today">11</div><div className="cal-cell">12</div><div className="cal-cell">13</div><div className="cal-cell">14</div>
              <div className="cal-cell">15</div><div className="cal-cell">16</div><div className="cal-cell">17</div>
              <div className="cal-cell">18</div><div className="cal-cell">19</div><div className="cal-cell">20</div><div className="cal-cell">21</div>
              <div className="cal-cell">22</div><div className="cal-cell">23</div><div className="cal-cell">24</div>
              <div className="cal-cell">25</div><div className="cal-cell">26</div><div className="cal-cell">27</div><div className="cal-cell">28</div>
            </div>
          </div>

          {/* Invitation */}
          <div className="product-card">
            <div className="invite-inner">
              <div className="invite-ornament">✦</div>
              <div className="invite-text">
                You are cordially<br />
                <em>invited</em><br />
                to celebrate with us
              </div>
              <div style={{ width: '40px', height: '1px', background: 'rgba(201,168,76,0.4)', margin: '0.6rem auto' }}></div>
              <div style={{ fontSize: '0.5rem', color: 'rgba(201,168,76,0.5)', letterSpacing: '0.1em' }}>CUSTOM INVITATION</div>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line"></div>
          Scroll
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <div className="marquee-item"><span className="marquee-dot"></span>Custom Diaries</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Calendars</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Notebooks</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Invitations</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Premium Print</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Fast Delivery</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Bespoke Design</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Custom Diaries</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Calendars</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Notebooks</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Invitations</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Premium Print</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Fast Delivery</div>
          <div className="marquee-item"><span className="marquee-dot"></span>Bespoke Design</div>
        </div>
      </div>

      {/* Products Section */}
      <section className="products-section" id="products">
        <div className="products-header reveal">
          <div>
            <div className="section-label">What we create</div>
            <h2 className="section-title">Crafted for <em>every</em> occasion</h2>
          </div>
          <p className="section-sub">Every piece is designed to order, printed to precision, and delivered to your door.</p>
        </div>

        <div className="products-grid reveal">
          <div className="product-tile">
            <span className="product-icon">📔</span>
            <div className="product-name">Custom Diaries</div>
            <div className="product-desc">Personalised daily planners with your name, logo, or artwork. Leather-look covers, custom layouts.</div>
            <Link to="/register" className="product-link">Order now →</Link>
          </div>
          <div className="product-tile">
            <span className="product-icon">🗓️</span>
            <div className="product-name">Wall Calendars</div>
            <div className="product-desc">12-month wall or desk calendars with your photos, branding, or custom illustrations.</div>
            <Link to="/register" className="product-link">Order now →</Link>
          </div>
          <div className="product-tile">
            <span className="product-icon">📓</span>
            <div className="product-name">Notebooks</div>
            <div className="product-desc">Hardback or softcover notebooks. Dotted, lined, or blank. Perfect for gifts or corporate branding.</div>
            <Link to="/register" className="product-link">Order now →</Link>
          </div>
          <div className="product-tile">
            <span className="product-icon">💌</span>
            <div className="product-name">Invitations</div>
            <div className="product-desc">Wedding, birthday, corporate event invitations. Luxury paper stock, foil options, full custom design.</div>
            <Link to="/register" className="product-link">Order now →</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="process-section" id="process">
        <div className="reveal" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 1rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>The process</div>
          <h2 className="section-title">From idea to <em>your door</em></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>Four simple steps and your custom print is on its way.</p>
        </div>

        <div className="process-steps">
          <div className="step">
            <div className="step-num">01</div>
            <div className="step-title">Choose your product</div>
            <div className="step-desc">Pick from our range of diaries, calendars, notebooks, or invitations.</div>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <div className="step-title">Share your vision</div>
            <div className="step-desc">Upload your design, describe your idea, or work with our design team.</div>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <div className="step-title">Approve the proof</div>
            <div className="step-desc">Review a digital proof before we print. We refine until you love it.</div>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <div className="step-title">We print & deliver</div>
            <div className="step-desc">Premium printing and swift delivery right to your address.</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-stats">
        <div className="home-stats-grid">
          <div className="reveal home-stat-cell">
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.6rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '0.4rem' }} data-count="5000">0+</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--soft)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Happy customers</div>
          </div>
          <div className="reveal home-stat-cell" style={{ transitionDelay: '0.1s' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.6rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '0.4rem' }} data-count="12000">0+</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--soft)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Orders fulfilled</div>
          </div>
          <div className="reveal home-stat-cell" style={{ transitionDelay: '0.2s' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.6rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '0.4rem' }} data-count="98">0%</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--soft)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Satisfaction rate</div>
          </div>
          <div className="reveal home-stat-cell" style={{ transitionDelay: '0.3s' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.6rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '0.4rem' }} data-count="5">0 days</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--soft)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Average delivery</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="reviews">
        <div className="reveal" style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 1rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Reviews</div>
          <h2 className="section-title">Loved by <em>thousands</em></h2>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial">
            <div className="stars">
              <span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span>
            </div>
            <p className="testimonial-text">"The custom diary they made for our team was absolutely stunning. Premium quality, arrived on time, and matched our brand perfectly."</p>
            <div className="testimonial-author">
              <div className="author-avatar" style={{ background: 'var(--gold)' }}>SR</div>
              <div>
                <div className="author-name">Sarah R.</div>
                <div className="author-role">Marketing Director</div>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <div className="stars">
              <span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span>
            </div>
            <p className="testimonial-text">"Our wedding invitations were breathtaking. The team understood exactly what we wanted and brought it to life. Guests kept complimenting them!"</p>
            <div className="testimonial-author">
              <div className="author-avatar" style={{ background: 'var(--rust)' }}>AM</div>
              <div>
                <div className="author-name">Aisha M.</div>
                <div className="author-role">Bride, 2024</div>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <div className="stars">
              <span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span>
            </div>
            <p className="testimonial-text">"Fast, professional, and the notebooks feel luxurious. We've ordered three times now. Will never go anywhere else for custom print."</p>
            <div className="testimonial-author">
              <div className="author-avatar" style={{ background: 'var(--sage)' }}>JK</div>
              <div>
                <div className="author-name">James K.</div>
                <div className="author-role">Small Business Owner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="contact">
        <div className="cta-glow"></div>
        <div className="cta-content reveal">
          <div className="section-label" style={{ justifyContent: 'center' }}>Get started today</div>
          <h2 className="cta-title">Ready to create something <em>beautiful?</em></h2>
          <p className="cta-sub">Tell us your idea. We'll design it, print it, and deliver it — exactly as you imagined.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn-primary">Start your order ✦</Link>
            <Link to="/contact" className="btn-secondary">Talk to a designer <span className="btn-arrow">→</span></Link>
          </div>

        </div>
      </section>

      <Footer />

    </div>
  );
};

export default Home;
