import React, { useState, useCallback } from 'react';

const Authentication: React.FC<{
    serverUrl: string,
    authenticationKey: string, setAuthenticationKey: (key: string) => void,
    authenticationToken: string, setAuthenticationToken: (token: string) => void
}> = ({ serverUrl, authenticationKey, authenticationToken, setAuthenticationKey, setAuthenticationToken }) => {
    const [ authenticationState, setAuthenticationState ] = useState('');

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

    return (
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
    );
}

export default Authentication;
