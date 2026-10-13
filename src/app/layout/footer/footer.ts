import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface FooterNavItem {
  label: string;
  fragment: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
  readonly whatsappNumber = '557192961945';
  readonly defaultMessage = 'Olá, Robert! Gostaria de solicitar um atendimento sobre energia solar.';
  readonly instagramUrl = 'https://www.instagram.com/robertlazarosilvagomes/';

  readonly footerNavItems: FooterNavItem[] = [
    { label: 'Home', fragment: 'home' },
    { label: 'Vantagens', fragment: 'advantages' },
    { label: 'Como funciona', fragment: 'how-it-works' },
    { label: 'Nosso trabalho', fragment: 'our-work' }
  ];

  openWhatsApp(): void {
    const encodedMessage = encodeURIComponent(this.defaultMessage);
    const url = `https://api.whatsapp.com/send?phone=${this.whatsappNumber}&text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}