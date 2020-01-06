import React, { useState } from 'react';
import './App.scss';
import Authentication from './sections/Authentication';
import Playback from './sections/Playback';
import Server from './sections/Server';

const App: React.FC = () => {
    const [ serverUrl, setServerUrl ] = useState('http://localhost:4000/');

    const [ authenticationKey, setAuthenticationKey ] = useState('');
    const [ authenticationToken, setAuthenticationToken ] = useState('');

    return (
        <div className="App">
            <h1>mpc-client-ugly</h1>
            <Server
                serverUrl={serverUrl}
                setServerUrl={setServerUrl}
            />
            <Authentication
                serverUrl={serverUrl}
                authenticationKey={authenticationKey}
                authenticationToken={authenticationToken}
                setAuthenticationKey={setAuthenticationKey}
                setAuthenticationToken={setAuthenticationToken}
            />
            <Playback
                serverUrl={serverUrl}
                authenticationToken={authenticationToken}
            />
        </div>
    );
}

export default App;
