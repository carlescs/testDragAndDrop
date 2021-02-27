import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import * as Components from './components';
import * as Directives from './directives';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    Components.MainComponentComponent,
    Directives.DragAndDropDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
