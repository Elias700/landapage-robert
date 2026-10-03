import { Directive, ElementRef, OnInit, OnDestroy, inject, input } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer!: IntersectionObserver;

  // Permite customizar a classe de animação ou o atraso
  animationClass = input<string>('animate-fade-in-up');
  delay = input<number>(0);

  ngOnInit(): void {
    const element = this.el.nativeElement;
    element.style.opacity = '0';

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          element.classList.add(this.animationClass());
          element.style.opacity = '1';
        }, this.delay());
        this.observer.unobserve(element);
      }
    }, {
      threshold: 0.15 // Dispara quando 15% do elemento estiver visível
    });

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}