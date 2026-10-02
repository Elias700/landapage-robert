import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  private fb = inject(FormBuilder);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    whatsapp: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
    city: ['', [Validators.required]],
    installationType: ['', [Validators.required]]
  });

  isSubmitted = false;

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.contactForm.valid) {
      console.log('Dados do formulário enviados:', this.contactForm.value);
      
      // Exemplo de integração com o WhatsApp (se desejado)
      const { name, whatsapp, city, installationType } = this.contactForm.value;
      const message = `Olá, Robert! Meu nome é ${name}. Gostaria de solicitar uma análise gratuita para ${installationType} em ${city}. Meu WhatsApp é ${whatsapp}.`;
      const encodedMessage = encodeURIComponent(message);
      
      // Redireciona para o WhatsApp de atendimento
      window.open(`https://wa.me/5500000000000?text=${encodedMessage}`, '_blank');

      this.contactForm.reset();
      this.isSubmitted = false;
    }
  }
  
}
