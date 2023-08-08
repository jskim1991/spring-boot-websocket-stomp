import { useEffect, useRef, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function App() {
  const [items, setItems] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    if (!ws.current) {
      const wsURL = "http://localhost:8080/ws/numbers";
      ws.current = Stomp.over(() => {
        const sock = new SockJS(wsURL);
        return sock;
      });

      ws.current.connect({}, () => {
        ws.current.subscribe("/topic/numbers/1", (message) => {
          console.log("received", message.body);
          const { number } = JSON.parse(message.body);
          setItems((prevState) => [...prevState, number]);
        });
      });
    }
  }, []);

  const send = () => {
    const num = Math.floor(Math.random() * (10 - 1) + 1);
    console.log("sending", num);
    ws.current.send(`/app/numbers/${num}`, {}, JSON.stringify(num));
  };

  return (
    <div>
      <h1>Welcome</h1>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
      <button onClick={send}>Send 1 more</button>
    </div>
  );
}

export default App;
