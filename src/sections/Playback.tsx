import React, { useState, useCallback } from 'react';

const Playback: React.FC<{
    serverUrl: string,
    authenticationToken: string,
}> = ({ serverUrl, authenticationToken }) => {
    const [ playbackState, setPlaybackState ] = useState('');

    const playbackCheckState = useCallback(async () => {
        const res = await fetch(serverUrl + 'playback', {
            headers: {
                authorization: authenticationToken
            }
        });
        const state: any = await res.json();

        setPlaybackState(JSON.stringify(state, null, 4));
    }, [ serverUrl, setPlaybackState, authenticationToken ]);

    const playbackNext = useCallback(async () => {
        await fetch(serverUrl + 'playback/next', {
            method: 'POST',
            headers: {
                authorization: authenticationToken
            }
        });
        
        playbackCheckState();
    }, [ serverUrl, authenticationToken, playbackCheckState ]);

    const playbackPrevious = useCallback(async () => {
        await fetch(serverUrl + 'playback/previous', {
            method: 'POST',
            headers: {
                authorization: authenticationToken
            }
        });
        
        playbackCheckState();
    }, [ serverUrl, authenticationToken, playbackCheckState ]);

    return (
        <section>
            <h2>Playback</h2>
            <button onClick={playbackCheckState}>State</button>
            <button onClick={playbackPrevious}>Previous</button>
            <button onClick={playbackNext}>Next</button>
            <pre>
                { playbackState }
            </pre>
        </section>
    );
}

export default Playback;
