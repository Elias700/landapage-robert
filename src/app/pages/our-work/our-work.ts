import { Component, ElementRef, ViewChild, signal, AfterViewInit, OnDestroy, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { WorkItem } from './workItem.model';

@Component({
  selector: 'app-our-work',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './our-work.html',
  styleUrl: './our-work.css',
})
export class OurWork implements AfterViewInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private galleryIndex = 0;
  private scrollFrame = 0;
  private readonly onWindowScroll = (): void => {
    if (this.scrollFrame) return;
    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = 0;
      this.checkScrollPosition();
    });
  };
  
  // Referência para o container principal do carrossel (para controle de scroll)
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;
  
  // Referência para todos os elementos de vídeo presentes no carrossel

  // Lista de itens do portfólio (imagens e vídeos de projetos)
  readonly workItems: WorkItem[] = [
    { id: 1, type: 'image', src: '/img-placa-solar1.jpeg' },
    { id: 2, type: 'image', src: '/img-placa-solar4.jpeg' },
    { id: 3, type: 'image', src: '/img-placa-solar5.jpeg' },
    { id: 4, type: 'image', src: '/img-placa-solar2.jpeg' },
    { id: 5, type: 'image', src: '/img-placa-solar6.jpeg' },
    { id: 6, type: 'image', src: '/img-placa-solar7.jpeg' },
    { id: 7, type: 'video', src: '/video-placa-solar1.mp4' },
    { id: 8, type: 'video', src: '/video-placa-solar2.mp4' }
  ];

  // Signals reativos para habilitar/desabilitar as setas de navegação
  canScrollLeft = signal<boolean>(false);
  canScrollRight = signal<boolean>(true);

  ngAfterViewInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') return;

    // Aguarda a renderização completa do DOM para calcular o espaço do scroll inicial
    setTimeout(() => {
      this.checkScrollPosition();
    }, 100);
    window.addEventListener('scroll', this.onWindowScroll, { passive: true });

  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onWindowScroll);
      if (this.scrollFrame) cancelAnimationFrame(this.scrollFrame);
    }
  }

  // Recalcula o estado das setas sempre que a tela for redimensionada
  @HostListener('window:resize')
  onResize(): void {
    this.checkScrollPosition();
  }

  /**
   * Verifica a posição atual do scroll horizontal e atualiza 
   * os estados das setas (esquerda e direita).
   */
  checkScrollPosition(): void {
    if (!this.carouselContainer) return;
    const el = this.carouselContainer.nativeElement;

    if (this.isPinnedGallery()) {
      const distance = Math.max(0, el.scrollWidth - window.innerWidth);
      const transform = getComputedStyle(el).transform;
      const translateX = transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41;
      const progress = distance > 0 ? Math.min(1, Math.max(0, -translateX / distance)) : 0;
      this.galleryIndex = Math.round(progress * (this.workItems.length - 1));
      this.canScrollLeft.set(progress > 0.01);
      this.canScrollRight.set(progress < 0.99);
      return;
    }
    
    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    // Se o conteúdo couber inteiro na tela, desativa ambas as setas
    if (maxScrollLeft <= 5) {
      this.canScrollLeft.set(false);
      this.canScrollRight.set(false);
      return;
    }

    // Define se ainda há margem para rolar para a esquerda ou para a direita
    this.canScrollLeft.set(scrollLeft > 5);
    this.canScrollRight.set(scrollLeft < maxScrollLeft - 5);
  }

  /**
   * Calcula a largura de um card somada ao gap para rolar 
   * exatamente a distância correta ao clicar nas setas.
   */
  private getStepWidth(): number {
    if (!this.carouselContainer) return 300;
    const container = this.carouselContainer.nativeElement;
    const firstCard = container.firstElementChild as HTMLElement;
    if (!firstCard) return 300;

    const cardWidth = firstCard.offsetWidth;
    const gap = parseFloat(getComputedStyle(container).gap) || 0;
    return cardWidth + gap;
  }

  // Executa a rolagem para a esquerda
  scrollLeft(): void {
    if (this.isPinnedGallery()) {
      this.navigatePinnedGallery(-1);
      return;
    }
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollBy({
        left: -this.getStepWidth(),
        behavior: 'smooth'
      });
      // Atualiza o estado das setas após o término da animação de scroll
      setTimeout(() => this.checkScrollPosition(), 300);
    }
  }

  // Executa a rolagem para a direita
  scrollRight(): void {
    if (this.isPinnedGallery()) {
      this.navigatePinnedGallery(1);
      return;
    }
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollBy({
        left: this.getStepWidth(),
        behavior: 'smooth'
      });
      setTimeout(() => this.checkScrollPosition(), 300);
    }
  }

  onCarouselKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.scrollLeft();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.scrollRight();
    }
  }

  private isPinnedGallery(): boolean {
    return this.isBrowser && document.documentElement.classList.contains('rs-motion-ready') &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(min-width: 1100px) and (pointer: fine)').matches;
  }

  private navigatePinnedGallery(direction: -1 | 1): void {
    if (!this.carouselContainer) return;
    const nextIndex = Math.min(this.workItems.length - 1, Math.max(0, this.galleryIndex + direction));
    const section = this.carouselContainer.nativeElement.closest<HTMLElement>('[data-gsap-horizontal-section]');
    if (!section) return;
    const distance = Math.max(0, this.carouselContainer.nativeElement.scrollWidth - window.innerWidth);
    const pinStart = Number(section.dataset['pinStart'] ?? section.offsetTop);
    const nextTop = pinStart + distance * (nextIndex / (this.workItems.length - 1));
    window.scrollTo({ top: nextTop, behavior: 'smooth' });
  }
}
