import {useEffect, useRef, useState} from "react";

function Sample() {
    const [items, setItems] = useState([])
    const ws = useRef(null)

    useEffect(() => {
        if (!ws.current) {
            const wsURL = "ws://localhost:8080/ws/numbers";
            ws.current = new WebSocket(wsURL)
            ws.current.onopen = () => {
                console.log("ws opened")
            }
            ws.current.onclose = (error) => {
                console.log("ws closed", error)
            }
            ws.current.onerror = (err) => {
                console.log("error", err)
            }
            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data)
                console.log("data", data)
                setItems(prevStatus => [...prevStatus, data])
            }
        }

        return () => {
            ws.current.close()
        }
    }, []);

    const send = () => {
        const num = Math.floor(Math.random() * (10 - 1) + 1)
        console.log("sending", num)
        ws.current.send(JSON.stringify(num))
    }

    return (
        <div>
            <h1>Welcome</h1>
            {
                items.map((item, index) => <div key={index}>{item}</div>)
            }
            <button onClick={send}>
                Send 1 more
            </button>
        </div>
    )
}

export default Sample;
