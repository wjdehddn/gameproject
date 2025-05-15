import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Mypage from './pages/Mypage';
import Profile from './pages/ProfileSettings';
import ResetPassword from './pages/ResetPassword';
import GameSelect from './pages/GameSelect';
import RpsGame from './pages/RpsGame';
import OddEvenGame from './pages/OddEvenGame';
import RouletteGame from './pages/RouletteGame';
import Ranking from './pages/Ranking';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/user/mypage" element={<Mypage />} />
          <Route path="/mypage/ProfileSettings" element={<Profile />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/game" element={<GameSelect />} />
          <Route path="/game/rps" element={<RpsGame />} />
          <Route path="/game/oddeven" element={<OddEvenGame />} />
          <Route path="/game/roulette" element={<RouletteGame />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;