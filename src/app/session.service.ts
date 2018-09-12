import { Injectable, isDevMode } from '@angular/core';
import { Config, IotClient, IotClientConfiguration } from 'iot-stack-client';
import { AuthEvent, AuthEventType } from 'iot-stack-client/lib/events';
import { Observable, Subscriber } from "rxjs";

const ROLE_ADMIN = 'admin:manage';
const defaultConfig: IotClientConfiguration = {
  host: 'https://idlab-iot.tengu.io',
  apiVersion: 'v1',
  realm: 'idlab-iot',
  clientId: 'iot-stack-explorer',
  refreshBeforeExpire: true,
}
const initOptions: Keycloak.KeycloakInitOptions = {
  checkLoginIframe: false,
  onLoad: 'check-sso',
  // flow: 'implicit',
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _clientObs: Observable<IotClient>;
  private _inst: IotClient;
  private options;

  constructor() {

  }

  /**
   * Call in contructor or ngOnInit, so it is initialized (will only be executed once)
   */
  init(hostConfig?: { host: string, apiVersion: string, realm: string }): Promise<boolean> {
    console.log('initing');
    const config = Object.assign(defaultConfig, hostConfig);
    console.log(config);
    this.options = { config, initOptions };
    Config.debug = isDevMode();
    // Log the events
    const eventSubscriber = isDevMode() ? new Subscriber<AuthEvent>(event => console.log('** ' + AuthEventType[event.type] + ' => ', event.args ? [event.args] : [])) : undefined;

    return new Promise<boolean>((resolve, reject) => {
      IotClient.create(this.options, eventSubscriber).subscribe(
        cl => {
          this._inst = cl;
          if (cl.isAuthenticated) {
            cl.getNewRpt().then(rpt => resolve(cl.isAuthenticated));
          } else {
            resolve(cl.isAuthenticated);
          }
        },
        err => reject(err)
      )
    });
  }

  get client(): IotClient {
    if (this._inst == null) {
      throw Error("Client not initialised, did you call init() first?");
    } else {
      return this._inst;
    }
  }

  get isAdmin(): boolean {
    try {
      if (this.client && this.client.isAuthenticated) {
        const rpt = this.client.RPTparsed as any;
        const roles = rpt.resource_access['policy-enforcer'].roles;
        return rpt ? roles.indexOf(ROLE_ADMIN) !== -1 : false;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

}
