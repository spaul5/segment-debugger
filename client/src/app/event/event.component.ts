import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  @Input() event: Event

  constructor() { }
}


export class Event {
  public sentAtDate: Date
  public sentAtStr: string
  public receivedAtDate: Date
  public receivedAtStr: string

  constructor(public userID: string, public type: string, public event: string, public sentAtNum: number, public receivedAt: string, public rawJson: any) {
    if (sentAtNum) {
      this.sentAtDate = new Date(sentAtNum)
      var seconds = this.sentAtDate.getSeconds().toString()
      if (seconds.length == 1) seconds = "0" + seconds
      this.sentAtStr = this.sentAtDate.getMonth() + '/' + this.sentAtDate.getDay() + '/' + this.sentAtDate.getFullYear() + ' ' +
        this.sentAtDate.getHours() + ':' + this.sentAtDate.getMinutes() + ":" + seconds
    } else {
      this.sentAtDate = null
      this.sentAtStr = "N/A"
    }

    if (receivedAt) {
      this.receivedAtDate = new Date(receivedAt)
      this.receivedAtStr = this.receivedAtDate.getMonth() + '/' + this.receivedAtDate.getDay() + '/' + this.receivedAtDate.getFullYear() + ' ' +
        this.receivedAtDate.getHours() + ':' + this.receivedAtDate.getMinutes() + ":" + this.receivedAtDate.getSeconds()
    } else {
      this.receivedAtDate = null
      this.receivedAtStr = "N/A"
    }

    this.type = type.toUpperCase()
  }

  public containsStr(str: string) {
    str = str.toLowerCase()
    if (this.type.toLowerCase().indexOf(str) > -1)
      return true
    else if (this.event.toLowerCase().indexOf(str) > -1)
      return true
    else if (this.sentAtStr.toLowerCase().indexOf(str) > -1)
      return true

    return false
  }
}