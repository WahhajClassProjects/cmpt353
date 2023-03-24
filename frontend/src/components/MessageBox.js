/* MessageBox.js */
import "../styles/MessageBox.css"
function MessageBox () {
	return(
		<div className={"messageBoxContainer"}>
			<textarea className={"messageTextArea"}></textarea>
			<button className={"submitMessageButton"}>Submit</button>
		</div>
	)
}

export default MessageBox;