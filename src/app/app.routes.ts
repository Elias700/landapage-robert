import { Routes } from '@angular/router';
import { Advantages } from './pages/advantages/advantages';
import { HowItWorks } from './pages/how-it-works/how-it-works';
import { About } from './pages/about/about';

export const routes: Routes = [
    {
        path: 'advantagens',
        component:Advantages
    },
    {
        path: 'how-it-works',
        component: HowItWorks
    },
    {
        path: 'about',
        component: About
    }
];
