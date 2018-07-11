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
  private searchableAttributes: string[]

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

    this.searchableAttributes = []
    this.addToSearchableAttributes(this.type)
    this.addToSearchableAttributes(this.event)
    this.addToSearchableAttributes(this.sentAtStr)
  }

  public containsStr(str: string) {
    str = str.toLowerCase()
    for (let attribute of this.searchableAttributes) {
      if (attribute.indexOf(str) > -1) {
        return true
      }
    }
    return false
  }

  private setDateString(date: Date) {
    let seconds = date.getSeconds().toString()
    if (seconds.length == 1) {
      seconds = "0" + seconds
    }
    return date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ":" + seconds
  }

  private addToSearchableAttributes(str: string) {
    this.searchableAttributes.push(str.toLowerCase())
  }
}