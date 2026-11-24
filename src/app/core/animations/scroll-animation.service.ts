import { DestroyRef, Injectable, NgZone, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class ScrollAnimationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private cleanupAnimation?: () => void;
  private initialized = false;
  private disposed = false;

  initialize(): void {
    if (this.initialized || !isPlatformBrowser(this.platformId)) return;
    this.initialized = true;
    this.disposed = false;
    afterNextRender(() => this.zone.runOutsideAngular(() => void this.start()));
    this.destroyRef.onDestroy(() => this.stop());
  }

  private async start(): Promise<void> {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ]);
    if (this.disposed) return;
    document.documentElement.classList.add('rs-motion-ready');
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const hero = document.querySelector<HTMLElement>('[data-gsap-hero]');
      if (hero) {
        const sequence = gsap.utils.toArray<HTMLElement>('[data-gsap-sequence]', hero);
        gsap.fromTo(sequence,
          { autoAlpha: 0, y: 54, clipPath: 'inset(0 0 18% 0)' },
          { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.15, stagger: 0.16, ease: 'power4.out', delay: 0.12 },
        );
      }

      const heroMedia = document.querySelector<HTMLElement>('[data-gsap-parallax]');
      if (heroMedia) {
        gsap.fromTo(heroMedia,
          { clipPath: 'inset(7% 5% 0 5% round 18px)' },
          { clipPath: 'inset(0% 0% 0 0 round 0px)', duration: 1.45, ease: 'expo.out' },
        );
      }

      const heroShade = document.querySelector<HTMLElement>('[data-gsap-hero-shade]');
      if (heroShade) {
        gsap.fromTo(heroShade, { opacity: 0.04 }, {
          opacity: 0.46,
          ease: 'none',
          scrollTrigger: { trigger: heroShade.parentElement, start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      gsap.utils.toArray<HTMLElement>('[data-gsap-reveal]').forEach((element) => {
        const delay = Number(element.dataset['gsapDelay'] ?? 0);
        gsap.fromTo(element,
          { autoAlpha: 0, y: 42, clipPath: 'inset(0 0 16% 0)' },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.05,
            delay,
            ease: 'expo.out',
            clearProps: 'willChange',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          },
        );
      });

      if (heroMedia && window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) {
        gsap.to(heroMedia, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: heroMedia, start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      const masks = gsap.utils.toArray<HTMLElement>('[data-gsap-mask]');
      masks.forEach((element) => gsap.fromTo(element,
        { clipPath: 'inset(12% 8% 0 8% round 48% 48% 12px 12px)' },
        { clipPath: 'inset(0 0 0 0 round 32% 32% 12px 12px)', duration: 1.35, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 82%', once: true } },
      ));

      const galleryTrack = document.querySelector<HTMLElement>('[data-gsap-horizontal-track]');
      const gallerySection = document.querySelector<HTMLElement>('[data-gsap-horizontal-section]');
      if (galleryTrack && gallerySection && window.matchMedia('(min-width: 1100px) and (pointer: fine)').matches) {
        const distance = () => Math.max(0, galleryTrack.scrollWidth - window.innerWidth);
        if (distance() > 0) {
          gsap.to(galleryTrack, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: gallerySection,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: gallerySection,
              scrub: 0.85,
              invalidateOnRefresh: true,
              onRefresh: (trigger) => { gallerySection.dataset['pinStart'] = String(trigger.start); },
            },
          });
        }
      }
    });

    let lenis: InstanceType<typeof Lenis> | undefined;
    let ticker: ((time: number) => void) | undefined;
    if (window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) {
      lenis = new Lenis({ smoothWheel: true, syncTouch: false, lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      ticker = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });
    void document.fonts?.ready.then(refresh);
    this.cleanupAnimation = () => {
      window.removeEventListener('load', refresh);
      if (ticker) gsap.ticker.remove(ticker);
      lenis?.destroy();
      context.revert();
      document.documentElement.classList.remove('rs-motion-ready');
    };
    ScrollTrigger.refresh();
  }

  private stop(): void {
    this.disposed = true;
    this.cleanupAnimation?.();
    this.cleanupAnimation = undefined;
    this.initialized = false;
  }
}
