import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  imports: [],
  templateUrl: './whatsapp-button.html',
  styles: ``,
})
export class WhatsappButton {

  readonly whatsappNumber = '557192961945'; 
  readonly defaultMessage = 'Olá, Robert! Vim pelo site e gostaria de solicitar um orçamento sobre energia solar.';

  openWhatsApp(): void {
    // Limpa caracteres especiais mantendo apenas números
    const cleanNumber = this.whatsappNumber.replace(/\D/g, '');

    // Codifica a mensagem para formato de URL
    const encodedMessage = encodeURIComponent(this.defaultMessage);

    // Estrutura do wa.me que vai direto para o app
    const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    // Abre em uma nova aba
    window.open(url, '_blank', 'noopener,noreferrer');
  }

}
