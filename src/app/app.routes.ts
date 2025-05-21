import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './user/main/main.component';
import { PersonaleditComponent } from './user/personaledit/personaledit.component';
import { ChangepassComponent } from './user/changepass/changepass.component';

export const routes: Routes = [

    { path: '', component: HomeComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent},
    { path: 'main', component: MainComponent},
    { path: 'personaledit', component: PersonaleditComponent },
    { path: 'changepass', component: ChangepassComponent},

];
