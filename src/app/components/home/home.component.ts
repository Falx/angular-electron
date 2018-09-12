import { Component, OnInit } from '@angular/core';
import { IotClient } from 'iot-stack-client';
import { SessionService } from '../../session.service';
import { pluck } from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private client: IotClient;
  authed: boolean = false;
  admin: boolean = false;
  token: any;
  scopes: any;

  constructor(private session: SessionService) {
    this.client = session.client;
  }

  ngOnInit() {
    if (this.client.isAuthenticated) {
      this.authed = this.client.isAuthenticated;
      this.admin = this.session.isAdmin;
      this.token = this.client.idTokenParsed;

      this.client.endpoint('/context/scopes').get().pipe(pluck('response')).subscribe(sc => this.scopes = sc);
    }
  }

  logout() {
    this.client.logout();
  }
}
