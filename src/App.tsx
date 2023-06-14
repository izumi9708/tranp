import React from 'react';
import './App.css';

export default function App() {
  const [ownTranp,setOwn]          = React.useState<CardObj[]>([]);
  const [oppoTranp,setOppo]        = React.useState<CardObj[]>([]);
  const [selectOwn,setOwnSelect]   = React.useState<number[]>([]);
  const [selectOppo,setOppoSelect] = React.useState<number[]>([]);
  const [gameState,setGameState]   = React.useState<number>(0);
  

  interface CardObj {
    mark:string;
    num :string;
  }

  const createPea = (mark:string[],num:string[]):CardObj[] => {
    const cards:CardObj[] = [];

    for(let i of mark){
      for(let o of num){
        const cardObj = {mark:i,num:o};
        cards.push(cardObj);
      }
    }
    return cards;
  }

  const createRandom = (length:number,max:number):number[] => {
    let randomArray:number[] = [];

    while(randomArray.length < max){
      const num = Math.floor(Math.random()*length);
      
      randomArray.push(num);
      randomArray = Array.from(new Set(randomArray));
    }

    return randomArray;
  }

  const createState = (pea:CardObj[],random:number[]):void => {
    const randomPea:CardObj[] = random.map(val => pea[val]);
    const ownArray  = randomPea.filter((val,index,array) => index < array.length / 2);
    const oppoArray = randomPea.filter((val,index,array) => index >= array.length / 2);

    setOwn(ownArray);
    setOppo(oppoArray);
  }

  const selectedTranp = (num:string,index:number,val:CardObj) => {
    setOwnSelect([...selectOwn,index]);
    
    const oppoIndex = selectOppo[gameState];
    const ownNum  = changeStringNumber(num);
    const oppoNum = changeStringNumber(oppoTranp[oppoIndex].num);

    const ownObj = val;
    const oppooObj = oppoTranp[oppoIndex];

    console.log('あなた',ownObj,'相手',oppooObj)
    
    if(ownNum > oppoNum){
      console.log('あなたの勝ち');

    }else if(ownNum < oppoNum){
      console.log('相手の勝ち')

    }else {
      console.log('引き分け');
    }
    setGameState(gameState　 + 1);
  }

  const changeStringNumber = (str:string):number => {
    let resultNum:number;

    switch(str){
      case 'A':
        resultNum = 1;
      break;

      case 'J':
        resultNum = 11;
      break;

      case 'Q':
        resultNum = 12;
      break;

      case 'K':
        resultNum = 13;
      break;

      default:
        resultNum = Number(str);
      break;
    }

    return resultNum;
  }


  React.useEffect(() => {
    const mark = ['♠️','♦︎','♣︎','❤︎'];
    const num  = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const pea    = createPea(mark,num);
    const random = createRandom(pea.length,10);
    const oppoOrder = createRandom(5,5);
    setOppoSelect(oppoOrder);
    createState(pea,random);

  },[])

  // console.log(ownTranp,oppoTranp)

  
  return (
    <div>
      相手
      <ul>
        {oppoTranp.map((val,index) => <li key={index}>{val.mark}{val.num}</li>)}
      </ul>

      自分
      <ul>
        {ownTranp.map((val,index) =>
          {
            if(selectOwn.indexOf(index) !== -1){
              return (
                <li key={index} className="own-tranp no-pointer" onClick={() => selectedTranp(val.num,index,val)} >{val.mark}{val.num}</li>
              )

            }else {
              return (
                <li key={index} className="own-tranp" onClick={() => selectedTranp(val.num,index,val)}>{val.mark}{val.num}</li>
              )
            }
            
          }
        )}
      </ul>
    </div>
  );
}
