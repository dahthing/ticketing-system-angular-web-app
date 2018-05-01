import { Component, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket';
import { TicketsService } from '../tickets.service';
import { NgForm } from '@angular/forms';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';


@Component({
  selector: 'app-generate-tickets',
  templateUrl: './generate-tickets.component.html',
  styleUrls: ['./generate-tickets.component.css'],
  providers: [NgbTypeaheadConfig]
})
export class GenerateTicketsComponent implements OnInit {
  public teamss: any;
  public model: any;
  teamsis = [];
  isOpen = 'open';
  ticket = new Ticket();
  teams: any[];
  ticketData: Object;
  errorMessage: string;
  isError: boolean;
  userss: any;
  submited = false;
  us: any;

  userId = 1;

  constructor(private readonly ticketService: TicketsService, config: NgbTypeaheadConfig) {
    config.showHint = true;
  }
  ngOnInit() {
    this.ticketService.getUserTeams(1).subscribe(data => {
      this.teams = data.teams;

    });

  }

  validate(data): string {
    if (data.title.length < 4) {
      return 'Error: Title should be at least 4 characters'
    }
    if (data.labels.length < 2) {
      return 'Error: Labels should be at least 2 characters'
    }
    if (data.description.length < 1) {
      return 'Error: Write a description'
    }
    if (data.team.length < 1) {
      return 'Error: You have not chosen a team'
    }
    if (data.assigneeId.length < 1) {
      return 'Error: You have not chosen a assignee'
    }
    if (data.estimated.length < 10) {
      return 'Error: you did not select the correct date'
    }
  }



  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : this.userss.filter(v => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10));

  search2 = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : this.teams.filter(v => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10));


  fun() {
    console.log(this.teams);
    this.us = this.ticketService.getTeamUsers(this.teamss).subscribe(data => {
      this.us = data.users;
      console.log(this.us);
      this.userss = this.us.map(x => x.name);
      console.log(this.userss);
      return this.userss;
    });
  }



  ticketFormsData(ticketForm: NgForm) {
    this.errorMessage = this.validate(ticketForm.value);
    if (this.errorMessage) {
      this.isError = true;
    } else {
      // ticketForm.value.status = 'open';
      const result = this.us.find(x => x.name === ticketForm.value.assigneeId);
      ticketForm.value.assigneeId = result.id;
      ticketForm.value.userId = this.userId;
      console.log(ticketForm.value);
      this.ticketService.addTicket(ticketForm.value);
      ticketForm.resetForm();
    }
  }

}