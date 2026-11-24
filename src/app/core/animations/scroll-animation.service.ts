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
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-gsap-reveal]').forEach((element) => {
        gsap.fromTo(element,
          { autoAlpha: 0, y: 28, clipPath: 'inset(0 0 12% 0)' },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'willChange',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          },
        );
      });

      const heroMedia = document.querySelector<HTMLElement>('[data-gsap-parallax]');
      if (heroMedia && window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) {
        gsap.to(heroMedia, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: heroMedia, start: 'top top', end: 'bottom top', scrub: true },
        });
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
