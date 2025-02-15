import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { sendMessage, auth } from '../../../components/config/firebase';
import SendIcon from '@mui/icons-material/Send';
import { useAuthState } from "react-firebase-hooks/auth";
import './styles.css';

function MessageInput({ roomId }) {
    const [user] = useAuthState(auth);
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage(roomId, user, value);
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="message-input-container">
            <input
                type="text"
                placeholder="Enter a message"
                value={value}
                onChange={handleChange}
                className="message-input"
                required
                minLength={1}
            />
            <button type="submit" disabled={value < 1} className="send-message">
                <SendIcon/>
            </button>
        </form>
    );
}

export { MessageInput };
