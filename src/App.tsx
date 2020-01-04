import React, { useState, useCallback } from 'react';
import './App.scss';

const App: React.FC = () => {
    const [ serverUrl, setServerUrl ] = useState('http://localhost:4000/');
    const [ authenticationKey, setAuthenticationKey ] = useState('');
    const [ authenticationState, setAuthenticationState ] = useState('');

    const onChangeServerUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setServerUrl(e.target.value), [ setServerUrl ]);
    const onChangeAuthenticationKey = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setAuthenticationKey(e.target.value), [ setAuthenticationKey ]);

    const authenticationBegin = useCallback(async () => {
        let res = await fetch(serverUrl + 'auth', {
            method: 'POST',
        });

        let json = await res.json();

        setAuthenticationKey(json.data.key)
    }, [ serverUrl, setAuthenticationKey ]);

    const authenticationContinue = useCallback(() => {
        if (!authenticationKey) return;

        const continueWindow = window.open(serverUrl + 'auth/continue?key=' +  authenticationKey, '', 'width=800&height=600');
    }, [ authenticationKey, serverUrl ]);

    const authenticationCheckState = useCallback(async () => {
        let res = await fetch(serverUrl + 'auth/state?key=' + authenticationKey);

        setAuthenticationState(await res.text());
    }, [ authenticationKey, serverUrl, setAuthenticationState ]);

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
                <button onClick={authenticationBegin}>Begin</button>
                <button onClick={authenticationContinue}>Continue</button>
                <button onClick={authenticationCheckState}>State</button>
                <pre>
                    { authenticationState }
                </pre>
            </section>
        </div>
    );
}

export default App;
