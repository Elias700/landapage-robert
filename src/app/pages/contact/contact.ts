import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  private fb = inject(FormBuilder);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    whatsapp: ['', [Validators.required]],
    city: ['', [Validators.required]],
    installationType: ['', [Validators.required]],
    monthlyBill: ['', [Validators.required, Validators.min(1)]]
  });

  isSubmitted = false;

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.contactForm.valid) {
      const { name, whatsapp, city, installationType, monthlyBill } = this.contactForm.value;

      console.log('Dados do formulário enviados:', this.contactForm.value);

      const message = `Olá, Robert! Meu nome é ${name}. Gostaria de solicitar uma análise gratuita para ${installationType} em ${city}.\n` +
        `Valor médio da conta de luz: R$ ${monthlyBill}\n` +
        `WhatsApp: ${whatsapp}`;

      const encodedMessage = encodeURIComponent(message);

      // Redireciona para o WhatsApp de atendimento (Substitua pelo seu número)
      window.open(`https://wa.me/5500000000000?text=${encodedMessage}`, '_blank');

      this.contactForm.reset();
      this.isSubmitted = false;
    }
  }

}
