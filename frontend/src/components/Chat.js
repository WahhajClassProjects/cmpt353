//Chat.js
import {useState, useEffect } from "react";
import Message from "./Message";

function Chat({ channelName, channelId }){
    const [messages, setMessages] = useState([]);
    const sessionToken = sessionStorage.getItem('sessionToken');
    useEffect(() => {
        if (channelId) {
            fetch(`http://localhost:3001/messages/channel/${channelId}`, {
                headers: {
                    "Authorization": `Bearer ${sessionToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => setMessages(data))
                .catch((error) => console.error(error));
        }
    }, [channelId]);
    return(
        <div className="chatBox">
            <h3>{channelName}</h3> // Display the channel name here
            {messages.map((m) => (
                <Message m={m} />
            ))}
        </div>
    )
}
export default Chat;