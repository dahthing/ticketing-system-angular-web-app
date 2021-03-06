import { AuthGuard } from './../core/auth-guard/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketViewComponent } from './ticket-view/ticket-view.component';
import { TicketViewGuardService } from '../core/auth-guard/ticket-view-guard.service';

const routes: Routes = [
  {
    path: ':id', component: TicketViewComponent, canActivate: [TicketViewGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketViewRoutingModule { }
