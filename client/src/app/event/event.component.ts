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
      this.sentAtStr = this.setDateString(this.sentAtDate)
    } else {
      this.sentAtDate = null
      this.sentAtStr = "N/A"
    }

    if (receivedAt) {
      this.receivedAtDate = new Date(receivedAt)
      this.receivedAtStr = this.setDateString(this.receivedAtDate)
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

  private setDateString(date: Date) {
    let seconds = date.getSeconds().toString()
    if (seconds.length == 1) {
      seconds = "0" + seconds
    }
    return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ":" + seconds
  }
}