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
  private subscribed: boolean
  public searchQuery: string
  private query: string
  public searchEvents: Event[]

  constructor(private apiService: ApiService) {
    this.events = []
    this.searchEvents = []
    this.live = false
    this.subscribed = false
  }

  ngOnDestroy() {
    this.unsubscribeToEvents()
  }

  private unsubscribeToEvents() {
    if (this.eventStreamSubscription && !this.eventStreamSubscription.closed)
      this.eventStreamSubscription.unsubscribe()
    if (this.subscribed) {
      this.unsubscribeToChannel()
      this.eventStreamSubscription.unsubscribe()
      this.apiService.disconnectToSocket()
    }
  }

  private subscribeToChannel() {
    this.apiService.subscribeToEventChannel()
      .subscribe((res) => {
        console.log("res:", res)
        if (res.status == "error") {
          console.log("err:", res.info)
          this.live = false
        }
        this.subscribed = (res.status == "ok")
      }, (err) => {
        console.log("error subscribing to channel. err:", err)
        this.subscribed = false
      })
  }

  public unsubscribeToChannel() {
    if (!this.live) return
    this.live = false

    this.apiService.unsubscribeToEventChannel()
      .subscribe((res) => {
        console.log("res:", res)
        if (res.status == "error") {
          console.log("err:", res.info)
          this.live = true
        } else {
          this.eventStreamSubscription.unsubscribe()
          this.apiService.disconnectToSocket()
        }
        this.subscribed = (res.status == "error")
      }, (err) => {
        console.log("error unsubscribing to channel. err:", err)
        this.subscribed = true
      }, () => {
        this.eventStreamSubscription.unsubscribe()
        this.apiService.disconnectToSocket()
      })
  }

  public connectToSocket() {
    if (this.live) return
    this.live = true

    this.eventStreamSubscription = this.apiService.connectToSocket().subscribe((message: any) => {
      if (message.status == "ok") {
        if (message.info && message.info.indexOf("connected") > -1) {
          this.subscribeToChannel()
          console.log("message:", message)
        } else {
          // console.log("message:", message)
          let rawEvent = JSON.parse(message.event)
          let eventStr = (rawEvent.event)? rawEvent.event: rawEvent.anonymousId
          let newEvent = new Event(rawEvent.userId, rawEvent.type, eventStr, rawEvent.sentAt, rawEvent.receivedAt, rawEvent)
          this.events.unshift(newEvent)

          if (this.query && newEvent.containsStr(this.query))
            this.searchEvents.unshift(newEvent)
        }
      } else {
        console.log("error:", message.info)
        this.live = false
        this.eventStreamSubscription.unsubscribe()
        this.apiService.disconnectToSocket()
      }
    
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
