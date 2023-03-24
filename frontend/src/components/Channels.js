import "../styles/Channels.css"
function Channels(){
    const handleClick = (name) => {
        console.log("Channel " + name + " button clicked");
    }
    return (
        <div className="channelList">
            <button className="channels" onClick={() => handleClick("1") }>Channel 1</button>
            <button className="channels" onClick={() => handleClick("2") }>Channel 2</button>
            <button className="channels" onClick={() => handleClick("3") }>Channel 3</button>
            <button className="channels" onClick={() => handleClick("4") }>Channel 4</button>
            <button className="channels" onClick={() => handleClick("5") }>Channel 5</button>
        </div>

    );
}

export default Channels;