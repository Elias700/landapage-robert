import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';
import { WorkItem } from './workItem.model';

@Component({
  selector: 'app-our-work',
  imports: [
    CommonModule,
    MatIconModule,
    RevealOnScrollDirective
  ],
  templateUrl: './our-work.html',
  styleUrl: './our-work.css',
})
export class OurWork {

  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLDivElement>;

  workItems: WorkItem[] = [
    { id: 1, type: 'image', src: '/img-placa-solar1.jpeg' },
    { id: 2, type: 'image', src: '/img-placa-solar4.jpeg' },
    { id: 3, type: 'image', src: '/img-placa-solar5.jpeg' },
    { id: 4, type: 'image', src: '/img-placa-solar2.jpeg' },
    { id: 5, type: 'image', src: '/img-placa-solar6.jpeg' },
    { id: 6, type: 'image', src: '/img-placa-solar7.jpeg' },
    { id: 7, type: 'video', src: '/video-placa-solar1.mp4' },
    { id: 8, type: 'video', src: '/video-placa-solar2.mp4' }
  ];

  private getStepWidth(): number {
    if (!this.carouselContainer) return 300;
    const container = this.carouselContainer.nativeElement;
    const firstCard = container.firstElementChild as HTMLElement;
    if (!firstCard) return 300;

    const cardWidth = firstCard.offsetWidth;
    const gap = parseFloat(getComputedStyle(container).gap) || 0;
    return cardWidth + gap;
  }

  scrollLeft(): void {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollBy({
        left: -this.getStepWidth(),
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    if (this.carouselContainer) {
      this.carouselContainer.nativeElement.scrollBy({
        left: this.getStepWidth(),
        behavior: 'smooth'
      });
    }
  }

}
