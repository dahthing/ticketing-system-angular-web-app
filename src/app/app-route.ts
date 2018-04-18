import { Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";

export const ROUTES: Routes = [
    { path: '', component: HomeComponent },
    { 
        path: 'sign-in', children: [
            { path: '', component: AuthComponent, pathMatch: 'full' },
        ]
    },
];