import {useState} from "react";
import Message from "./Message";

function Chat(){
    const [messages, setMessage] = useState([
        {userName: "User 1", body: "first message from user 1", id: 1},
        {userName: "User 2", body: "first message from user 2", id: 2},
        {userName: "User 3", body: "first message from user 3", id: 3},
        {userName: "User 4", body: "first message from user 4", id: 4},
        {userName: "User 1", body: "second message from user 1", id: 5},
        {userName: "User 2", body: "second message from user 2", id: 6},
        {userName: "User 1", body: "third message from user 1", id: 7},
        {userName: "User 4", body: "second message from user 4", id: 8}
    ]);

    return(
        <div className="chatBox">
            {messages.map( (m) => (
                <Message m = {m}/>
            ))}
        </div>
    )
}
export default Chat;