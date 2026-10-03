import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';

@Component({
  selector: 'app-about',
  imports: [ 
    MatIconModule,
    CommonModule,
    RevealOnScrollDirective
  ],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  // profileImageUrl: string | null = null;
  profileImageUrl = 'robert2.jpg';
}

