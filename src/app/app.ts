import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Home } from './pages/home/home';
import { Advantages } from './pages/advantages/advantages';
import { HowItWorks } from './pages/how-it-works/how-it-works';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Home,
    Advantages,
    HowItWorks,
    About,
    Contact
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('landpage-robert');
}
