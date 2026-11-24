import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  startBackgroundVideo(video: HTMLVideoElement): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) {
      video.pause();
      return;
    }
    video.muted = true;
    void video.play().catch(() => {
      // O navegador pode bloquear a reprodução automática por política própria.
    });
  }

  scrollToSection(href: string): void {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
