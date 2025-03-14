import { Routes, Route } from 'react-router-dom';
import { Landing } from '../Landing';
import { ChatRoom } from '../ChatRoom';

function AuthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/room/:id" element={<ChatRoom />} />
    </Routes>
  );
}

export { AuthenticatedApp };