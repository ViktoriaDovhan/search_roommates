import { useEffect, useState } from 'react';
import { getApiMode, setApiMode } from '../services/apiMode';

export default function ApiModeSwitch() {
    const [mode, setModeState] = useState(getApiMode());

    useEffect(() => {
        const handleModeChange = (event) => {
            setModeState(event.detail || getApiMode());
        };

        window.addEventListener('api-mode-changed', handleModeChange);

        return () => {
            window.removeEventListener('api-mode-changed', handleModeChange);
        };
    }, []);

    const handleChange = (newMode) => {
        setApiMode(newMode);
        setModeState(newMode);
    };

    return (
        <div className="d-flex align-items-center gap-2">
            <span className="text-white small">API:</span>

            <button
                type="button"
                className={`btn btn-sm ${mode === 'rest' ? 'btn-light' : 'btn-outline-light'}`}
                onClick={() => handleChange('rest')}
            >
                REST
            </button>

            <button
                type="button"
                className={`btn btn-sm ${mode === 'graphql' ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={() => handleChange('graphql')}
            >
                GraphQL
            </button>
        </div>
    );
}