import "../styles/Message.css"
function Message({m}){
    const userName = m.userName;
    const messageBody = m.body;
    const id = m.id;
    return(
        <article className="message" key={id}>
            <h3 className={"messageHeader"}>{userName}</h3>
            <p className={"messageBody"}>{messageBody}</p>
        </article>
    )
}
export default Message;