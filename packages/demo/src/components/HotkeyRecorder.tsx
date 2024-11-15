import {type Hotkey, useHotkeys, useRecordHotkey} from 'keycode-hook'; // demo/src/components/HotkeyRecorder.tsx
import type React from 'react';
import {useState} from 'react';

const HotkeyRecorder: React.FC = () => {
    const [customHotkey, setCustomHotkey] = useState<Hotkey | null>(null);

    const {
        isRecording,
        recordedHotkey,
        startRecording,
        resetRecording,
    } = useRecordHotkey();

    useHotkeys(
        customHotkey ? customHotkey : [],
        () => {
            alert('Custom hotkey triggered!');
        },
        { preventDefault: true },
        [customHotkey]
    );

    const handleSaveHotkey = () => {
        if (recordedHotkey) {
            console.log('Custom hotkey set:', recordedHotkey);
            setCustomHotkey(recordedHotkey);
            resetRecording();
        }
    };

    const formatHotkey = (hotkey: Hotkey) => {
        if (!hotkey) return '';
        const modifiers = hotkey.modifiers ? `${hotkey.modifiers.join('+')}+` : '';
        const key = hotkey.key.replace(/^Key/, '');
        return modifiers + key;
    };

    return (
        <div style={{ padding: '16px', marginTop: '24px' }}>
            <h2>Hotkey Recorder</h2>
            <button onClick={startRecording} disabled={isRecording} type={"button"}>
                {isRecording ? 'Recording...' : 'Record Hotkey'}
            </button>
            {recordedHotkey && (
                <div>
                    <p>Recorded Hotkey: {formatHotkey(recordedHotkey)}</p>
                    <button onClick={handleSaveHotkey} type={"button"}>Save Hotkey</button>
                    <button onClick={resetRecording} type={"button"}>Reset</button>
                </div>
            )}
            {customHotkey && (
                <p>
                    Custom Hotkey Set: {formatHotkey(customHotkey)} (Press it to see an
                    alert)
                </p>
            )}
        </div>
    );
};

export default HotkeyRecorder;
