//List of channels

import React, { useState, useEffect } from 'react';
import "../styles/Channels.css"

function Channels({ setChannelName, setChannelId }) {
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");

    const sessionToken = sessionStorage.getItem('sessionToken');
    useEffect(() => {
        fetch("http://localhost:3001/channels", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => setChannels(data))
            .catch((error) => console.error(error));
    }, []);


    const handleClick = (channel) => {
        setSelectedChannel(channel);
        setChannelName(channel.name);
        setChannelId(channel.id);
    };

    const handleNewChannel = () => {
        setShowModal(true);
    };

    const handleCreateChannel = () => {
        const sessionToken = sessionStorage.getItem('sessionToken');
        fetch("http://localhost:3001/channels", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionToken}`
            },
            body: JSON.stringify({ name: newChannelName })
        })
            .then((response) => response.json())
            .then((data) => {
                setNewChannelName("");
                setShowModal(false);
                setChannels([...channels, { id: data.id, name: newChannelName }]);
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className="channelList">
            <button className="newChannelButton" onClick={handleNewChannel}>Create New Channel</button>
            {channels.map((channel) => (
                <button
                    key={channel.id}
                    className="channels"
                    onClick={() => handleClick(channel)}
                >
                    {channel.name}
                </button>
            ))}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Create New Channel</h3>
                        <input
                            type="text"
                            placeholder="Channel Name"
                            value={newChannelName}
                            onChange={(e) => setNewChannelName(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleCreateChannel}>Create</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Channels;