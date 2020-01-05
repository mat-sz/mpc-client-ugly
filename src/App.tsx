import React, { useState, useCallback } from 'react';
import './App.scss';

const App: React.FC = () => {
    const [ serverUrl, setServerUrl ] = useState('http://localhost:4000/');

    const [ authenticationKey, setAuthenticationKey ] = useState('');
    const [ authenticationToken, setAuthenticationToken ] = useState('');
    const [ authenticationState, setAuthenticationState ] = useState('');

    const [ playbackState, setPlaybackState ] = useState('');

    const onChangeServerUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setServerUrl(e.target.value), [ setServerUrl ]);
    const onChangeAuthenticationKey = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setAuthenticationKey(e.target.value), [ setAuthenticationKey ]);
    const onChangeAuthenticationToken = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setAuthenticationToken(e.target.value), [ setAuthenticationToken ]);

    const authenticationBegin = useCallback(async () => {
        let res = await fetch(serverUrl + 'auth', {
            method: 'POST',
        });

        let json = await res.json();

        setAuthenticationKey(json.data.key)
    }, [ serverUrl, setAuthenticationKey ]);

    const authenticationCheckState = useCallback(async () => {
        const res = await fetch(serverUrl + 'auth/state?key=' + authenticationKey);
        const state: any = await res.json();
        if (state.data.token) {
            setAuthenticationToken(state.data.token);
        }

        setAuthenticationState(JSON.stringify(state, null, 4));
    }, [ authenticationKey, serverUrl, setAuthenticationState, setAuthenticationToken ]);

    const authenticationContinue = useCallback(() => {
        if (!authenticationKey) return;

        const continueWindow = window.open(serverUrl + 'auth/continue?key=' +  authenticationKey, '', 'width=800&height=600');

        if (continueWindow) {
            continueWindow.onunload = () => {
                authenticationCheckState();
            };
        }
    }, [ authenticationKey, serverUrl, authenticationCheckState ]);

    const playbackCheckState = useCallback(async () => {
        const res = await fetch(serverUrl + 'playback', {
            headers: {
                authorization: authenticationToken
            }
        });
        const state: any = await res.json();

        setPlaybackState(JSON.stringify(state, null, 4));
    }, [ serverUrl, setPlaybackState, authenticationToken ]);

    return (
        <div className="App">
            <h1>mpc-client-ugly</h1>
            <section>
                <h2>Server</h2>
                <input type="text" value={serverUrl} onChange={onChangeServerUrl} placeholder="Server URL" />
            </section>
            <section>
                <h2>Authentication</h2>
                <input type="text" value={authenticationKey} onChange={onChangeAuthenticationKey} placeholder="Authentication key" />
                <input type="text" value={authenticationToken} onChange={onChangeAuthenticationToken} placeholder="Token" />
                <button onClick={authenticationBegin}>Begin</button>
                <button onClick={authenticationContinue}>Continue</button>
                <button onClick={authenticationCheckState}>State</button>
                <pre>
                    { authenticationState }
                </pre>
            </section>
            <section>
                <h2>Playback</h2>
                <button onClick={playbackCheckState}>State</button>
                <pre>
                    { playbackState }
                </pre>
            </section>
        </div>
    );
}

export default App;
