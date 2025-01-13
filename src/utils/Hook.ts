import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import Stomp from 'stompjs'
import SockJS from 'sockjs-client'


export function useSoket(url: string, subscribe: string, sendUrl: string, callback: Function) {
    const web3React = useWeb3React()
    useEffect(() => {
        let stompClient: any
        let Time: number
        if (web3React.account) {
            var socket = new SockJS(url);
            stompClient = Stomp.over(socket);
            stompClient.connect({},
                () => {
                    if (stompClient.connected) {
                        stompClient.subscribe(subscribe, (data: any) => {
                            var resdata = JSON.parse(data.body)
                            callback(resdata)
                        })
                    }
                    if (stompClient.connected && sendUrl) {
                        Time = +setInterval(() => {
                            if (stompClient.connected) {
                                stompClient.send(sendUrl)
                            }
                        }, 3000)
                    }

                }, function (err: any) {
                    console.log(err);
                });
        }
        return () => {
            if (stompClient && stompClient.connected) {
                try {
                    stompClient.disconnect()
                } catch {

                }
                clearInterval(Time)
            }
        }
        // eslint-disable-next-line
    }, [web3React.account, sendUrl])
}

