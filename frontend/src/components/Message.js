import "../styles/Message.css"

function Message({m}){
    const userName = m.senderID;
    const timestamp = new Date(m.timestamp).toLocaleString();
    const parentID = m.parentID;
    const thumbsUpCount = m.thumbsUpCount;
    const thumbsDownCount = m.thumbsUpCount;
    const messageBody = m.body;
    const id = m.id;

    const handleThumbsUp = () => {
        // Send API request to increment thumbs up count
        console.log(thumbsUpCount)
    };

    const handleThumbsDown = () => {
        // Send API request to increment thumbs down count
        console.log(thumbsDownCount)
    };

    return(
        <article className="message" key={id}>
            <h5 className={"messageHeader"}>{userName} ({timestamp})</h5>
            <p className={"messageBody"}>{messageBody}</p>
            <div className={"thumbs"}>
                <button onClick={handleThumbsUp}>Thumbs Up: {thumbsUpCount}</button>
                <button onClick={handleThumbsDown}>Thumbs Down: {thumbsDownCount}</button>
            </div>
        </article>
    )
}
export default Message;