import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter,withEnabledBlockingInitialNavigation } from '@angular/router';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environments';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { provideCore } from '@client/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

if(environment.production){
  enableProdMode();
}


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideCore({
    "API_URL": environment.apiURL,
    "WS_URL": environment.wsURL
    }),
    importProvidersFrom(BrowserAnimationsModule,MatSnackBarModule)
  ],
}).catch((err) => console.error(err));

