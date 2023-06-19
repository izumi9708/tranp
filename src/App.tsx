import Top from './Top';
import GameContent from './GameContent'
import { useState } from 'react';


export default function App() {
  const [gameStart,setStart]  = useState<boolean>(false);
  
  return (
    <>
    {!gameStart ? <Top start={setStart}/> : <GameContent start={setStart} />}
    </>
  );
}
