import React, { useMemo } from 'react';

export const PeerContext = React.createContext(null);

export const PeerProvider = (props) => {
    const peer = useMemo(() => {
        const connection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:stun.l.google.com:5349",
                    ]
                }
            ]
        });
        // Return the connection object itself, not a cleanup function
        return connection;
    }, []); // Empty dependency array since we only want to create this once

    const createOffer = async () => {
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    };

    const createAnswer = async (offer) =>{
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }

    const setRemoteAnswer = async (ans) =>{
        await peer.setRemoteDescription(ans);
    }

    const sendDataToPeer = async (event,data)=>{
        peer.addTrack(event,data);
    }

    const receiveDataFromPeer = async(event) => {
        peer.addEventListener(event,(data)=>{
            return data
        })
    }

    // Optional: Cleanup on unmount
    // React.useEffect(() => {
    //     return () => {
    //         peer.close(); // Cleanup the peer connection when component unmounts
    //     };
    // }, [peer]);

    return (
        <PeerContext.Provider value={{ peer, createOffer , createAnswer , setRemoteAnswer }}>
            {props.children}
        </PeerContext.Provider>
    );
};