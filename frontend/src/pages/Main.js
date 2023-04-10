import { useState } from "react";
import MessageBox from "../components/MessageBox";
import Channels from "../components/Channels";
import Chat from "../components/Chat";

function Main(){
	const [channelName, setChannelName] = useState("");
	const [channelId, setChannelId] = useState(null);

	const handleMessageSubmit = (messageBody) => {
		const sessionToken = sessionStorage.getItem('sessionToken');
		const userID = sessionStorage.getItem('userID')
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${sessionToken}`
				},
			body: JSON.stringify({
				channelID: channelId,
				senderID: userID, // Hardcoded senderID
				timestamp: new Date().toISOString(),
				parentID: 0,
				thumbsUpCount: 0,
				thumbsDownCount: 0,
				body: messageBody,
			}),
		};
		fetch("http://localhost:3001/messages", requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
			})
			.catch((error) => console.error(error));
	};

	return (
		<div className={"container"}>
			<div className={"channelBox"}><Channels  setChannelName={setChannelName} setChannelId={setChannelId}  /></div>
			<div className={"chatMessageContainer"}>
				<div className={"chatBox"}><Chat channelName={channelName} channelId={channelId} /></div>
				<div className={"messageBox"}><MessageBox
					handleMessageSubmit={handleMessageSubmit}
					channelId={channelId}
				/></div>
			</div>
		</div>	);
}

export default Main;