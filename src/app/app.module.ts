import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import 'reflect-metadata';
import 'zone.js/dist/zone-mix';
import '../polyfills';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { WebviewDirective } from './directives/webview.directive';
import { ElectronService } from './providers/electron.service';
import { SessionService } from './session.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    ElectronService,
    SessionService,
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      deps: [SessionService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function initialize(session: SessionService) {
  return () => session.init();
}