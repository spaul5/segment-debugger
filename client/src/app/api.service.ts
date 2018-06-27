import { Http, Response, URLSearchParams, ResponseContentType, Headers, RequestOptions } from '@angular/http'
import { Injectable, Inject } from '@angular/core'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch'


import * as io from 'socket.io-client'


@Injectable()
export class ApiService {
    private serverUrl = "http://localhost:3000"
    private socket: any

    private headers = new Headers({
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true 
    })

    constructor(private http: Http) {
    }

    subscribeToEventChannel() {
        const url = this.serverUrl + "/api?action=subscribe"

        return this.http.get(url, { headers: this.headers })
            .catch(error => {
                let errMsg = "Error in subscribing to event stream."
                console.log(errMsg, "err:", error)
                return Observable.throw(errMsg)
            })
    }

    unsubscribeToEventChannel() {
        const url = this.serverUrl + "/api?action=unsubscribe"

        return this.http.get(url, { headers: this.headers })
            .catch(error => {
                let errMsg = "Error in subscribing to event stream."
                console.log(errMsg, "err:", error)
                return Observable.throw(errMsg)
            })
    }

    connectToSocket() {
        let observable = new Observable(observer => {
            this.socket = io(this.serverUrl)
            this.socket.on('message', (message) => {
                observer.next(message)
            })
            return () => {
                this.socket.disconnect()
            }
        })
        return observable
    }

    disconnectToSocket() {
        this.socket.disconnect()
    }
}