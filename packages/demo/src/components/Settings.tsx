import {Code} from "keyboard-code-enum"; // demo/src/components/Settings.tsx
import {useHotkeys} from 'keycode-hook';
import type React from 'react';
import {useState} from 'react';

const Settings: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);

    useHotkeys(
        { key: Code.KeyD, modifiers: ['Control', 'Alt'] },
        () => {
            setDarkMode((prev) => !prev);
        },
        { preventDefault: true }
    );

    return (
        <div style={{ padding: '16px' }}>
            <h2>Settings</h2>
            <p>
                <strong>Dark Mode:</strong> {darkMode ? 'On' : 'Off'}
            </p>
            <p>Press Ctrl+Alt+D to toggle Dark Mode.</p>
        </div>
    );
};

export default Settings;
