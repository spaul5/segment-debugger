import { Component, OnInit } from '@angular/core'

import { Subscription } from 'rxjs/Subscription'

import { ApiService } from '../api.service'
import { Event } from '../event/event.component'

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.css']
})
export class DebuggerComponent {
  private eventStreamSubscription: Subscription
  private events: Event[]
  public live: boolean
  public searchQuery: string
  private query: string
  public searchEvents: Event[]

  constructor(private apiService: ApiService) {
    this.events = []
    this.searchEvents = []
    this.live = false
  }

  ngOnDestroy() {
    if (this.live) this.unsubscribeToChannel()
  }

  private unsubscribeToEvents() {
    if (this.eventStreamSubscription && !this.eventStreamSubscription.closed)
      this.eventStreamSubscription.unsubscribe()
    this.apiService.disconnectToSocket()
  }

  private subscribeToChannel() {
    this.apiService.subscribeToEventChannel()
      .subscribe((res) => {
        console.log("res:", res)
        if (res.status == "error") {
          console.log("err:", res.info)
          this.live = false
          this.unsubscribeToEvents()
        }
      }, (err) => {
        console.log("error subscribing to channel. err:", err)
        this.live = false
        this.unsubscribeToEvents()
      })
  }

  public unsubscribeToChannel() {
    if (!this.live) return
    this.live = false

    this.apiService.unsubscribeToEventChannel()
      .subscribe((res) => {
        if (res.status == "error") {
          console.log("err:", res.info)
        }
      }, (err) => {
        console.log("server could not unsubscribe to channel. err:", err)
      }, () => {
        this.unsubscribeToEvents()
      })
  }

  public connectToSocket() {
    if (this.live) return
    this.live = true

    this.eventStreamSubscription = this.apiService.connectToSocket().subscribe((message: any) => {
      if (message.status != "ok") {
        console.log("error:", message.info)
        this.live = false
        this.unsubscribeToEvents()
        return
      }

      if (message.info && message.info.indexOf("connected") > -1) {
        this.subscribeToChannel()
        console.log("message:", message)
        return
      }

      // console.log("message:", message)
      let rawEvent = JSON.parse(message.event)
      let eventStr = (rawEvent.event) ? rawEvent.event : rawEvent.anonymousId
      let newEvent = new Event(rawEvent.userId, rawEvent.type, eventStr, rawEvent.sentAt, rawEvent.receivedAt, rawEvent)
      this.events.unshift(newEvent)

      if (this.query && newEvent.containsStr(this.query))
        this.searchEvents.unshift(newEvent)
    })
  }

  public onKey(e: any) {
    this.query = e.target.value.trim()
    console.log("query:", this.query)
    if (this.query == "") {
      this.searchEvents = []
      return
    }
    for (let e of this.events) {
      if (e.containsStr(this.query.toString())) {
        this.searchEvents.push(e)
      }
    }
    console.log("searchevents:", this.searchEvents.length)
  }

}
