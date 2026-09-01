import { useState } from 'react';
import type { Screen } from './types';
import { LandingPage } from './screens/LandingPage';
import { LoginPage } from './screens/LoginPage';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');

  if (screen === 'login') {
    return <LoginPage navigate={setScreen} />;
  }
  return <LandingPage navigate={setScreen} />;
}
