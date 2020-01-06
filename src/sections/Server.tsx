import React, { useCallback } from 'react';

const Server: React.FC<{
    serverUrl: string,
    setServerUrl: (url: string) => void,
}> = ({ serverUrl, setServerUrl }) => {
    const onChangeServerUrl = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setServerUrl(e.target.value), [ setServerUrl ]);

    return (
        <section>
            <h2>Server</h2>
            <input type="text" value={serverUrl} onChange={onChangeServerUrl} placeholder="Server URL" />
        </section>
    );
}

export default Server;
