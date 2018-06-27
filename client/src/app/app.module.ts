import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpModule, JsonpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { FlexLayoutModule } from "@angular/flex-layout"

import { AppComponent } from './app.component'
import { ApiService } from './api.service'
import { DebuggerComponent } from './debugger/debugger.component';
import { EventComponent } from './event/event.component'


@NgModule({
  declarations: [
    AppComponent,
    DebuggerComponent,
    EventComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    JsonpModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
