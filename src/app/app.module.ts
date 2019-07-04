import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppRouting } from '../app-routing.module';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({

  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRouting

  ],
  declarations: [AppComponent, InicioComponent],

  providers: [AngularFirestore,{provide: APP_BASE_HREF, useValue: ''}],
  bootstrap: [AppComponent]
})
export class AppModule { }
