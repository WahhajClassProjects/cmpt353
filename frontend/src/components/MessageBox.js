// MessageBox.js
import React, { useState } from "react";
import "../styles/MessageBox.css";

function MessageBox({ handleMessageSubmit, channelId }) {
	const [messageBody, setMessageBody] = useState("");

	const handleClick = () => {
		if (messageBody.trim() === "") {
			return;
		}

		handleMessageSubmit(messageBody);
		setMessageBody("");
	};


	return (
		<div className={"messageBoxContainer"}>
      <textarea
		  className={"messageTextArea"}
		  placeholder="Type your message here..."
		  value={messageBody}
		  onChange={(event) => setMessageBody(event.target.value)}
	  ></textarea>
			<button className={"submitMessageButton"} onClick={handleClick}>
				Submit
			</button>
		</div>
	);
}

export default MessageBox;
