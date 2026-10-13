import { Component, ElementRef, ViewChild, ViewChildren, QueryList, signal, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';
import { WorkItem } from './workItem.model';

@Component({
  selector: 'app-our-work',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RevealOnScrollDirective
  ],
  templateUrl: './our-work.html',
  styleUrl: './our-work.css',
})
export class OurWork implements AfterViewInit, OnDestroy {
  
  // Referência para o container principal do carrossel (para controle de scroll)
  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;
  
  // Referência para todos os elementos de vídeo presentes no carrossel
  @ViewChildren('videoElement') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  // Observador de interseção para controlar play/pause automático dos vídeos
  private videoObserver!: IntersectionObserver;

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
    // Aguarda a renderização completa do DOM para calcular o espaço do scroll inicial
    setTimeout(() => {
      this.checkScrollPosition();
    }, 100);

    // Inicializa o observer de reprodução dos vídeos
    this.initVideoIntersectionObserver();
  }

  ngOnDestroy(): void {
    // Desconecta o observer ao sair do componente para evitar vazamento de memória
    if (this.videoObserver) {
      this.videoObserver.disconnect();
    }
  }

  // Recalcula o estado das setas sempre que a tela for redimensionada
  @HostListener('window:resize')
  onResize(): void {
    this.checkScrollPosition();
  }

  /**
   * Configura o IntersectionObserver para dar play no vídeo quando 
   * ele estiver visível na tela e pause quando sair.
   */
  private initVideoIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      root: this.carouselContainer.nativeElement,
      threshold: 0.5 // Aciona quando pelo menos 50% do vídeo aparecer
    };

    this.videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Ignora exceções caso o navegador restrinja autoplay
          });
        } else {
          video.pause();
        }
      });
    }, options);

    // Inicia observando cada vídeo renderizado
    this.videoElements.forEach(v => {
      this.videoObserver.observe(v.nativeElement);
    });
  }

  /**
   * Verifica a posição atual do scroll horizontal e atualiza 
   * os estados das setas (esquerda e direita).
   */
  checkScrollPosition(): void {
    if (!this.carouselContainer) return;
    const el = this.carouselContainer.nativeElement;
    
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
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollBy({
        left: this.getStepWidth(),
        behavior: 'smooth'
      });
      setTimeout(() => this.checkScrollPosition(), 300);
    }
  }
}