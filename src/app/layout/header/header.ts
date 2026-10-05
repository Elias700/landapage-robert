import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
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
    }
  }
}