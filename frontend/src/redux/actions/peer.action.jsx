import { SETUP_SOCKET_ERROR, SETUP_SOCKET_REQUEST, SETUP_SOCKET_RESET, SETUP_SOCKET_SUCCESS } from '../constants/socket.constants';

export const setUpPeer = ({userId}) => async (dispatch) => {
    try {

        dispatch({
            type: SETUP_SOCKET_REQUEST
        })

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
    
        dispatch({
            type: SETUP_SOCKET_SUCCESS,
            payload: {
                peer , createOffer , createAnswer , setRemoteAnswer
            }
        })
    } catch (error) {
        dispatch({
            type: SETUP_SOCKET_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        setTimeout(() => {
            dispatch({ type: SETUP_SOCKET_RESET });
        }, 5000);
    }

}

export const sendMessage = (eventName, message) => {

    console.log(`sending message: ${message.userId} to ${eventName} `)

    socket.emit(eventName, message);
};

export const receiveMessage = (eventName, callback) => {
    console.log('hit here')

    socket.on(eventName, callback);
};