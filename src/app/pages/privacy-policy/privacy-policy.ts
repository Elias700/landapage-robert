import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../../layout/footer/footer';
import { Header } from '../../layout/header/header';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [Header, Footer, RouterLink],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicy {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setPage({
      title: 'Política de Privacidade | Robert Solar',
      description: 'Saiba como a Robert Solar utiliza os dados enviados para solicitar uma análise de energia solar.',
      canonicalPath: '/privacidade',
    });
  }
}
