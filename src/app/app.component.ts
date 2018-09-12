import { Component, OnInit } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { AppConfig } from '../environments/environment';
import { SessionService } from './session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  authed: boolean = false;
  admin: boolean = false;

  constructor(public electronService: ElectronService, private session: SessionService) {
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  ngOnInit() {
    if (!this.session.client.isAuthenticated) {
      this.session.client.login();
    }
    else {
      this.authed = this.session.client.isAuthenticated;
      this.admin = this.session.isAdmin;
    }
  }
}
