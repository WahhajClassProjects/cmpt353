import React from "react";
import Channels from "./components/Channels";
import Chat from "./components/Chat";
import MessageBox from "./components/MessageBox"
import "./styles/App.css"
function App() {
    const [data, setData] = React.useState(null);

    /*React.useEffect(() => {
        fetch("/hello")
            .then((res) => res.json())
            .then((data) => setData(data.message));
    }, []);*/

    return (

        <div className={"container"}>
            <div className={"channelBox"}><Channels  /></div>
            <div className={"chatMessageContainer"}>
                <div className={"chatBox"}><Chat /></div>
                <div className={"messageBox"}><MessageBox /></div>
            </div>
        </div>

  );
}

export default App;
