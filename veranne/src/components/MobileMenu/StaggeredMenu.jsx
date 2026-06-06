import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './StaggeredMenu.css';

export function StaggeredMenu({
  items = [],
  socialItems = [],
  displaySocials = true,
  position = 'right',
  colors = ['#F0F0F0', '#E8E8E8'],
  menuButtonColor = '#000000',
  openMenuButtonColor = '#000000',
  closeOnClickAway = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const prelayer1Ref = useRef(null);
  const prelayer2Ref = useRef(null);
  const menuItemsRef = useRef([]);
  const socialTitleRef = useRef(null);
  const socialLinksRef = useRef([]);
  
  // Toggle lines
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);

  const tl = useRef(gsap.timeline({ paused: true }));

  useEffect(() => {
    // Setup initial positions
    gsap.set([prelayer1Ref.current, prelayer2Ref.current, panelRef.current], {
      xPercent: position === 'right' ? 100 : -100,
    });
    
    gsap.set(menuItemsRef.current, { yPercent: 100 });
    if (displaySocials) {
      gsap.set(socialTitleRef.current, { yPercent: 100 });
      gsap.set(socialLinksRef.current, { yPercent: 100 });
    }

    // Build timeline
    tl.current
      .to([prelayer1Ref.current, prelayer2Ref.current, panelRef.current], {
        xPercent: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.inOut',
      })
      .to(
        menuItemsRef.current,
        {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
        },
        '-=0.4' // start slightly before panel finishes
      );

    if (displaySocials) {
      tl.current.to(
        socialTitleRef.current,
        { yPercent: 0, duration: 0.4, ease: 'power2.out' },
        '-=0.4'
      ).to(
        socialLinksRef.current,
        { yPercent: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        '-=0.3'
      );
    }

    return () => {
      tl.current.kill();
    };
  }, [position, displaySocials]);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      tl.current.play();
      // Animate hamburger to X
      gsap.to(line1Ref.current, { y: 8, rotation: 45, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(line2Ref.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(line3Ref.current, { y: -8, rotation: -45, duration: 0.3, ease: 'power2.inOut' });
    } else {
      tl.current.reverse();
      // Animate X to hamburger
      gsap.to(line1Ref.current, { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(line2Ref.current, { opacity: 1, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(line3Ref.current, { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
    }
  }, [isOpen]);

  // Handle click away
  useEffect(() => {
    if (!closeOnClickAway || !isOpen) return;

    function handleClickOutside(e) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !e.target.closest('.sm-toggle-btn')
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, closeOnClickAway]);
  
  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleItemClick = (item) => {
    if (item.onClick) item.onClick();
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="sm-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: isOpen ? openMenuButtonColor : menuButtonColor }}
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <div className="sm-toggle-line" ref={line1Ref} />
        <div className="sm-toggle-line" ref={line2Ref} />
        <div className="sm-toggle-line" ref={line3Ref} />
      </button>

      <div className={`staggered-menu-wrapper ${isOpen ? 'is-open' : ''}`} ref={containerRef}>
        <div
          className="sm-prelayer"
          ref={prelayer1Ref}
          style={{ background: colors[0] }}
        />
        <div
          className="sm-prelayer"
          ref={prelayer2Ref}
          style={{ background: colors[1] }}
        />
        <div
          className="staggered-menu-panel"
          ref={panelRef}
        >
          <div className="sm-items-container">
            {items.map((item, i) => (
              <div key={i} className="sm-item-wrapper">
                <a
                  href={item.link}
                  className="sm-panel-item"
                  ref={(el) => (menuItemsRef.current[i] = el)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item);
                  }}
                  aria-label={item.ariaLabel || item.label}
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>

          {displaySocials && (
            <div className="sm-socials-container">
              <div style={{ overflow: 'hidden' }}>
                <div className="sm-socials-title" ref={socialTitleRef}>
                  Sociais
                </div>
              </div>
              <div className="sm-socials-links">
                {socialItems.map((social, i) => (
                  <div key={i} className="sm-socials-link-wrapper">
                    <a
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm-socials-link"
                      ref={(el) => (socialLinksRef.current[i] = el)}
                    >
                      {social.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
