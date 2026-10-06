import { Directive, ElementRef, OnInit, OnDestroy, inject, input } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer!: IntersectionObserver;

  // Permite customizar a classe adicional se desejar
  delay = input<number>(0);

  ngOnInit(): void {
    const element = this.el.nativeElement as HTMLElement;

    // 1. Estado Inicial (Oculto e ligeiramente deslocado para baixo)
    element.style.opacity = '0';
    element.style.transform = 'translateY(24px)';
    element.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    element.style.willChange = 'opacity, transform';

    // 2. Criar o Observer
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Dispara com ou sem delay
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, this.delay());

        // Para de observar após animar
        this.observer.unobserve(element);
      }
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px' 
    });

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}