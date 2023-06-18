import { url } from 'inspector';
import React from 'react';
import { useState,useEffect } from 'react';
import './App.css';
import Result from './Result';
import Rule from './Rule';

export default function App() {
  // 自分側のトランプ
  const [ownTranp,setOwn]          = useState<CardObj[]>([]);
  // 相手側のトランプ
  const [oppoTranp,setOppo]        = useState<CardObj[]>([]);
  // 相手がランダムに出す順番のインデックス
  const [oppoUseIndex,setUseIndex] = useState<number[]>([]);
  // 自分が選択した手札のインデックス
  const [selectOwn,setOwnSelect]   = useState<number[]>([]);
  // 相手が選択した手札のインデックス
  const [selectOppo,setOppoSelect] = useState<number[]>([]);
  // ゲームが何回目か
  const [gameState,setGameState]   = useState<number>(0);
  // ゲームの勝敗記録
  const [gameStatus,setStatus]     = useState<string[]>([]);
  // Resultを表示するフラグ
  const [resultFlag,setFlag]       = useState<boolean>(false);
  // ルール説明のモーダル
  const [rule,setRule]             = useState<boolean>(true);
  

  interface CardObj {
    mark:string;
    num :string;
  }

  // 絵札と数字をペアにする
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

  // ランダムな値の配列を作成
  // length:配列の長さ、max:配列の最大値
  const createRandom = (length:number,max:number):number[] => {
    let randomArray:number[] = [];

    while(randomArray.length < max){
      const num = Math.floor(Math.random()*length);
      
      randomArray.push(num);
      randomArray = Array.from(new Set(randomArray));
    }

    return randomArray;
  }

  // ペアの配列から自分と相手の手札を生成
  const createState = (pea:CardObj[],random:number[]):void => {
    const randomPea:CardObj[] = random.map(val => pea[val]);
    const ownArray  = randomPea.filter((val,index,array) => index < array.length / 2);
    const oppoArray = randomPea.filter((val,index,array) => index >= array.length / 2);

    setOwn(ownArray);
    setOppo(oppoArray);
  }

  // トランプをクリックした時の挙動
  const selectedTranp = async(num:string,index:number,val:CardObj) => {    
    
    const oppoIndex = oppoUseIndex[gameState];
    const ownNum    = changeStringNumber(num);
    const oppoNum   = changeStringNumber(oppoTranp[oppoIndex].num);

    const ownObj   = val;
    const oppooObj = oppoTranp[oppoIndex];
    const ownElem  = document.querySelectorAll('.own-card-wrap .card-item')[index];
    const oppoElem = document.querySelectorAll('.oppo-card-wrap .card-item')[oppoIndex];

    await new Promise<string>((resolve,reject) => {
      // アニメーション
      battleAnimation(ownObj,oppooObj,ownElem,oppoElem,resolve)
    })


    console.log('あなた',ownObj,'相手',oppooObj);

    await new Promise<string>((resolve,reject) => {
      // 選択した履歴を更新
      setOwnSelect([...selectOwn,index]);
      setOppoSelect([...selectOppo,oppoIndex]);
      resolve('');
    })
    
    await new Promise((resolve,reject) => {
      setTimeout(() => {
        judgeVictory(ownNum,oppoNum,resolve);

        // setTimeout(() => {
        //   const ownCard = document.querySelector('.own-battle-item')!;
        //   const oppoCard = document.querySelector('.oppo-battle-item')!;
        //   const judgePlace = document.querySelector('.judge-place')!;

        //   ownCard.classList.add('summon-own-remove');
        //   oppoCard.classList.add('summon-oppo-remove');
        //   judgePlace.remove();
        // }, 1500);
      }, 500);

      setGameState(gameState + 1);
    })
  }

  type PromiseResolve = (value: string | PromiseLike<string>) => void;

  const battleAnimation = (ownObj:CardObj,oppoObj:CardObj,ownElem:Element,oppoElem:Element,resolve:PromiseResolve):void => {
    const addPlace = document.querySelector('.battle-field')!;

    ownElem.classList.add('slide-out-own');

    const elem = `
      <div class="battle-item oppo-battle-item" style="background-image:url(/card_img/${oppoObj.mark}${oppoObj.num}.svg);"></div>
      <div class="battle-item own-battle-item" style="background-image:url(/card_img/${ownObj.mark}${ownObj.num}.svg);"></div>`

    addPlace.innerHTML = elem;

    setTimeout(() => {
      const ownCard = document.querySelector('.own-battle-item')!;
      const oppoCard = document.querySelector('.oppo-battle-item')!;
      
      ownCard.classList.add('summon-own-card');
      oppoCard.classList.add('summon-oppo-card');

      resolve('');
    },200)

  }

  const judgeVictory = (ownNum:number,oppoNum:number,resolve:PromiseResolve) => {
    const addPlace  = document.querySelector('.battle-field')!
    const parentDiv = document.createElement('div');
          parentDiv.classList.add('judge-place');

    let judgeContent;

    // 結果
    if(ownNum > oppoNum){
      judgeContent = '<div class="judge-content" style="color:#ffda1e;">WIN</div>';
      setStatus([...gameStatus,'win']);

    }else if(ownNum < oppoNum){
      judgeContent = '<div class="judge-content" style="color:#0d81e2;">LOSE</div>';
      setStatus([...gameStatus,'lose']);

    }else {
      judgeContent = '<div class="judge-content" style="color:#ffff;">DRAW</div>';
      setStatus([...gameStatus,'draw']);
    }
    
    parentDiv.innerHTML = judgeContent;
    addPlace.appendChild(parentDiv);
    resolve('');
    
  }

  // トランプの絵札を数字に変換
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



  useEffect(() => {
    const mark = ['S','D','C','H'];
    const num  = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const pea    = createPea(mark,num);
    const random = createRandom(pea.length,10);
    const oppoOrder = createRandom(5,5);
    setUseIndex(oppoOrder);
    createState(pea,random);

  },[])

  useEffect(() => {
    if(gameState == 5){
      setTimeout(() => {
        alert('終わり')
        console.log(gameStatus);
        setFlag(true);
      },1000)
    }
  },[gameState])

  // console.log(ownTranp,oppoTranp)
  
  return (
    <div className="tramp-ground">
      <div className="ground-inner">

        <div className='oppo-field'>
          <ul className="oppo-card-wrap">
            {oppoTranp.map((val,index) => {
              if(selectOppo.indexOf(index) !== -1){
                return (
                  <li className="card-item no-pointer" key={index}
                    style={{
                      backgroundImage:`url(/card_img/${val.mark}${val.num}.svg)`
                    }}
                  ></li>
                ) 

              }else {
                return (
                  <li className="card-item" key={index}
                    style={{
                      backgroundImage:`url(/card_img/${val.mark}${val.num}.svg)`
                    }}
                  ></li>
                ) 
              }
            })}
          </ul>
          <div className='dealer-display'>Dealer</div>
        </div>

        <div className="battle-field">
          
        </div>

        <div className='own-field'>
          <div className='player-display'>Player</div>
          <ul className="own-card-wrap">
            {ownTranp.map((val,index) => {
                if(selectOwn.indexOf(index) !== -1){
                  return (
                    <li key={index} className="card-item own-tranp no-pointer" onClick={(e) => selectedTranp(val.num,index,val)} 
                      style={{
                        backgroundImage:`url(/card_img/${val.mark}${val.num}.svg)`
                      }}
                    ></li>
                  ) 

                }else {
                  return (
                    <li key={index} className="card-item own-tranp" onClick={(e) => selectedTranp(val.num,index,val)}
                      style={{
                        backgroundImage:`url(/card_img/${val.mark}${val.num}.svg)`
                      }}
                    ></li>
                  ) 
                }
            })}
          </ul>
        </div>

      </div>

      {/* {rule && <Rule/>} */}
      {resultFlag && <Result state={gameStatus}/>}
    </div>
  );
}
