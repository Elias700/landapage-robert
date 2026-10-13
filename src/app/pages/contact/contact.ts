import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RevealOnScrollDirective
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly fb = inject(FormBuilder);

  // Número de WhatsApp oficial do Robert configurado
  private readonly whatsappNumber = '557192961945';

  // Configuração reativa do formulário de contato com validações
  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    city: ['', [Validators.required]],
    installationType: ['', [Validators.required]],
    monthlyBill: ['', [Validators.required, Validators.min(1)]]
  });

  isSubmitted = false;

  /**
   * Processa o envio do formulário, valida os campos e redireciona 
   * o usuário com a mensagem formatada direto para o WhatsApp.
   */
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.contactForm.valid) {
      const { name, city, installationType, monthlyBill } = this.contactForm.value;

      // Monta a mensagem personalizada para o atendimento via WhatsApp
      const message = `
        Olá, Robert! Meu nome é ${name}. 
        Gostaria de solicitar uma análise gratuita para ${installationType} em ${city}.\n` +
        `Valor médio da conta de luz: R$ ${monthlyBill}
      `;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${this.whatsappNumber}&text=${encodedMessage}`;
      // Abre a conversa no WhatsApp em uma nova aba
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Reseta o formulário após o envio bem-sucedido
      this.contactForm.reset();
      this.isSubmitted = false;
    }
  }
}