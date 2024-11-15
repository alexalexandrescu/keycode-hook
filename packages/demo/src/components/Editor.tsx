import {Code} from "keyboard-code-enum";
import {useHotkeys, useScope} from 'keycode-hook';
import type React from 'react';
import {useEffect, useRef, useState} from 'react';

const Editor: React.FC = () => {
    const [content, setContent] = useState('');
    const { pushScope, popScope } = useScope();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Effect to handle focus and scope
    useEffect(() => {
        const handleFocus = () => pushScope('editor');
        const handleBlur = () => popScope('editor');

        const textarea = textareaRef.current;
        if (textarea) {
            textarea.addEventListener('focus', handleFocus);
            textarea.addEventListener('blur', handleBlur);
        }

        return () => {
            if (textarea) {
                textarea.removeEventListener('focus', handleFocus);
                textarea.removeEventListener('blur', handleBlur);
            }
        };
    }, [pushScope, popScope]); // Dependencies are stable functions from useScope

    // Bind the hotkey within the 'editor' scope
    useHotkeys(
        { key: Code.KeyS, modifiers: ['Control', 'Meta'], scopes: ['editor'] },
        () => {
            // Save action
            alert('Content saved!');
        },
        { preventDefault: true }
    );

    return (

            <div style={{ border: '1px solid #ccc', padding: '16px' }}>
                <h2>Editor</h2>
                <textarea
                    ref={textareaRef}
                    style={{ width: '100%', height: '200px' }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type something here..."
                />
            </div>

    );
};

export default Editor;
