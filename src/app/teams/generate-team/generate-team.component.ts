import { TokenUser } from './../../models/user/token-user';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { TeamsService } from './teams.service';
import { k } from '@angular/core/src/render3';
import { NotificationService } from '../../notification/notification.service';
import { AuthService } from '../../core/auth/auth.service';
import { myTeamsDash } from '../../models/teams/my-teams';


@Component({
  selector: 'app-generate-team',
  templateUrl: './generate-team.component.html',
  styleUrls: ['./generate-team.component.css'],
  providers: [NgbTypeaheadConfig]
})
export class GenerateTeamComponent implements OnInit {
  userToken: TokenUser;
  errorMessage: string;
  isError: boolean;
  userId: number;
  userName: string;
  users: string[];
  usr: string[] = [];
  user: string;
  userss: myTeamsDash[];
  constructor(private readonly teamsService: TeamsService, config: NgbTypeaheadConfig,
    private readonly nService: NotificationService, private authService: AuthService) {
    config.showHint = true;
  }

  ngOnInit() {
    this.teamsService.getAllUsers().subscribe(data => {
      this.userss = data.users;
      this.userId = this.authService.getUser().id;
      this.userName = this.userss.find(x => x.id === this.userId).name;
      this.users = this.userss.filter(x => x.id !== this.userId).map(x => x.name);
      console.log(this.users);
    });
  }

  validate(data): string {
    if (data.name.length < 4) {
      return 'Error: Title should be at least 4 characters'
    }
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : this.users.filter(v => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10));

  addUser() {
    if (this.usr.find(x => x === this.user)) {
      this.user = '';
    } else {
      this.usr.push(this.user);
      console.log(this.user);
      this.user = '';
    }
  }

  delUser(uss: HTMLElement) {
    const el = uss.textContent;
    this.usr.splice(this.usr.indexOf(el), 1);
  }

  teamsFormsData(teamsForm: NgForm) {
    this.errorMessage = this.validate(teamsForm.value);
    if (this.errorMessage) {
      this.isError = true;
    } else {
      this.userToken = this.authService.getUser();
      teamsForm.value.teamLead = this.userToken.id;
      console.log(teamsForm.value);
      this.teamsService.postNewTeam(teamsForm.value).subscribe(data => {
        console.log(data);
      });

      while (this.usr.length) {
        let item = this.usr.pop();

        const obj = {
          content: `${this.userToken.firstName.trim()} invited you to join a team ${teamsForm.value.name.trim()} `,
          type: 'team',
          nameType: teamsForm.value.name,
          userId: item
        };
        console.log(obj);
        this.nService.addNotification(obj).subscribe(data => {
          console.log(data)
        });
      };
      teamsForm.resetForm();
    }
  }


}


