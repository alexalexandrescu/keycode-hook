// demo/src/App.tsx
import {ScopeProvider} from 'keycode-hook';
import Editor from './components/Editor';
import HotkeyRecorder from "./components/HotkeyRecorder.tsx";
import Settings from "./components/Settings.tsx";

function App() {
    return (
        <ScopeProvider>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Editor />
                <Settings />
            </div>
            <HotkeyRecorder />
        </ScopeProvider>
    );
}

export default App;
