import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';


@Component({
  selector: 'app-advantages',
  imports: [
    CommonModule,
    MatIconModule,
    RevealOnScrollDirective
  ],
  templateUrl: './advantages.html',
  styleUrl: './advantages.css',
})
export class Advantages {

  advantages: Advantage[] = [
    {
      number: '01',
      category: 'ECONOMIA',
      title: 'Sua conta de luz suave',
      description: 'Produza a propria energia e elimine a obrigatoriedade dos aumentos da tarifa elétrica.',
      icon: 'account_balance_wallet'
    },
    {
      number: '02',
      category: 'VALORIZAÇÃO',
      title: 'Um imóvel mais valorizado',
      description: 'Energia solar é um investimento durável que torna sua casa ou empresa mais atrativa.',
      icon: 'verified'
    },
    {
      number: '03',
      category: 'SUSTENTABILIDADE',
      title: 'Energia limpa todos os dias',
      description: 'Aproveite uma fonte renovável e ajude a construir um futuro com menos emissões.',
      icon: 'eco'
    }
  ];

  scrollToContact(): void {
    const element = document.querySelector('#contato');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
