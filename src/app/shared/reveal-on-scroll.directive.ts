import { Directive, DestroyRef, ElementRef, afterNextRender, inject, input } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective {
  private readonly el = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;
  private delayTimer?: ReturnType<typeof setTimeout>;

  // Permite customizar a classe adicional se desejar
  delay = input<number>(0);

  constructor() {
    const element = this.el.nativeElement as HTMLElement;

    // Só oculta o elemento no navegador, depois da renderização, para manter
    // o conteúdo visível no HTML prerenderizado e quando o JavaScript falhar.
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.style.opacity = '1';
        element.style.transform = 'none';
        return;
      }

      element.style.opacity = '0';
      element.style.transform = 'translateY(24px)';
      element.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      element.style.willChange = 'opacity, transform';

      this.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.delayTimer = setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.willChange = 'auto';
          }, this.delay());

          this.observer?.unobserve(element);
        }
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      this.observer.observe(element);
    });

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      if (this.delayTimer) clearTimeout(this.delayTimer);
    });
  }
}
