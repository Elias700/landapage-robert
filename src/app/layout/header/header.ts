import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private readonly router = inject(Router);
  isMobileMenuOpen = signal<boolean>(false);

  navItems = [
    { label: 'Início', href: '#inicio' },
    { label: 'Vantagens', href: '#vantagens' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Nosso trabalho', href: '#nosso-trabalho' },
    { label: 'Sobre', href: '#sobre' }
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(prev => !prev);
  }

  scrollToSection(href: string): void {
    this.isMobileMenuOpen.set(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      void this.router.navigate(['/'], { fragment: href.replace(/^#/, '') });
    }
  }

  @HostListener('document:keydown.escape')
  closeMenuOnEscape(): void {
    this.isMobileMenuOpen.set(false);
  }

  trapMenuTab(event: KeyboardEvent): void {
    if (!this.isMobileMenuOpen() || event.key !== 'Tab') return;
    const menu = document.querySelector<HTMLElement>('#mobile-navigation');
    const focusable = menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
