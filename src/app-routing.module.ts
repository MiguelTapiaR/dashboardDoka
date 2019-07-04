import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { InicioComponent } from './app/pages/inicio/inicio.component';

const app_routes: Routes = [
  {path: '', component: InicioComponent},



]
@NgModule({
  imports:[
      RouterModule.forRoot( app_routes)
  ],
  exports: [
      RouterModule
  ]
})
export class AppRouting{

}
