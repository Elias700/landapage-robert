import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
 import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';

@Component({
  selector: 'app-how-it-works',
  imports: [ 
    CommonModule, 
    MatIconModule,
    RevealOnScrollDirective
  ],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css',
})
export class HowItWorks {

  activeStepIndex = signal<number>(0);

  steps: Step[] = [
    {
      id: 'diagnostico',
      number: '01',
      tabTitle: 'Diagnóstico',
      stepTag: 'ETAPA 01',
      title: 'Entendo o seu consumo',
      description: 'Analisamos a sua conta de energia, rotina e espaço disponível para identificar a melhor oportunidade.',
      badgeText: 'Conversa simples, sem compromisso',
      badgeIcon: 'schedule'
    },
    {
      id: 'projeto',
      number: '02',
      tabTitle: 'Projeto',
      stepTag: 'ETAPA 02',
      title: 'Solução sob medida',
      description: 'Dimensionamos os equipamentos exatos, cuidamos de toda a aprovação junto à concessionária e preparamos a instalação.',
      badgeText: 'Engenharia e homologação completa',
      badgeIcon: 'verified_user'
    },
    {
      id: 'acompanhamento',
      number: '03',
      tabTitle: 'Acompanhamento',
      stepTag: 'ETAPA 03',
      title: 'Gerando economia real',
      description: 'Acompanho o funcionamento do sistema após a instalação para garantir a máxima eficiência e o retorno do seu investimento.',
      badgeText: 'Suporte próximo e contínuo',
      badgeIcon: 'thumb_up'
    }
  ];

  selectStep(index: number): void {
    this.activeStepIndex.set(index);
  }

  onTabKeydown(event: KeyboardEvent, currentIndex: number): void {
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % this.steps.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + this.steps.length) % this.steps.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = this.steps.length - 1;
    else return;

    event.preventDefault();
    this.selectStep(nextIndex);
    document.getElementById(`how-tab-${nextIndex}`)?.focus();
  }

  get activeStep(): Step {
    return this.steps[this.activeStepIndex()];
  }

}
