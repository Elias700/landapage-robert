import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  currentYear = new Date().getFullYear();

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Exemplo para um número de Salvador/BA (DDD 71):
// 55 (Brasil) + 71 (DDD) + 988887777 (Número) -> '5571988887777'

readonly whatsappNumber = '55719296-1945'; // Substitua pelos dígitos reais, apenas números!
readonly defaultMessage = 'Olá, Robert! Gostaria de solicitar um atendimento sobre energia solar.';

openWhatsApp(): void {
  // Limpa qualquer caractere que não seja número por segurança
  const cleanNumber = this.whatsappNumber.replace(/\D/g, ''); 
  const encodedMessage = encodeURIComponent(this.defaultMessage);
  
  const url = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
  
  window.open(url, '_blank', 'noopener,noreferrer');
}
  
}
