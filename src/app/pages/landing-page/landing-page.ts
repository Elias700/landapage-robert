import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Home } from '../home/home';
import { Advantages } from '../advantages/advantages';
import { HowItWorks } from '../how-it-works/how-it-works';
import { About } from '../about/about';
import { Contact } from '../contact/contact';
import { Footer } from '../../layout/footer/footer';
import { OurWork } from '../our-work/our-work';
import { WhatsappButton } from '../../components/whatsapp-button/whatsapp-button';
import { SeoService } from '../../core/seo.service';
import { ScrollAnimationService } from '../../core/animations/scroll-animation.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [Header, Home, Advantages, HowItWorks, OurWork, About, Contact, Footer, WhatsappButton],
  templateUrl: './landing-page.html',
  providers: [ScrollAnimationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage {
  private readonly seo = inject(SeoService);
  private readonly scrollAnimations = inject(ScrollAnimationService);

  constructor() {
    this.seo.setPage({
      title: 'Robert Solar | Energia Solar com Consultoria Personalizada em Salvador, BA',
      description: 'Reduza sua conta de luz com energia solar. Robert Lázaro faz o diagnóstico, o projeto e o acompanhamento da sua instalação. Solicite uma análise gratuita.',
      canonicalPath: '/',
    });
    this.scrollAnimations.initialize();
  }
}
