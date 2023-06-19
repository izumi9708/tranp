import './Modal.css';
type propsObj = {
  state:string[],
  start:React.Dispatch<React.SetStateAction<boolean>>
};

export default function Result(props:propsObj){
  const playerWin = props.state.filter( val => val === 'win' );
  const dealerWin = props.state.filter( val => val === 'lose' );
  const draw      = props.state.filter( val => val === 'draw' );
  let result;
  let color;

  if(playerWin.length > dealerWin.length){
    result = 'Playerの勝利です';
    color  = '#f2d03f';

  }else if(playerWin.length == dealerWin.length){
    result = '引き分けです';

  }else {
    result = 'Dealerの勝利です';
    color  = '#0d81e2';
  }
  
  return (
    <div className="result-modal">
      <div className="modal-bg"></div>
      <div className="modal-content">
        <h2 style={{color:`${color}`}}>{result}</h2>
        <p className="player-victory result-modal-text">Playerの勝利：<span style={{color:'#f2d03f'}}>{playerWin.length}</span></p>
        <p className="dealer-victory result-modal-text">Dealerの勝利：<span style={{color:'#0d81e2'}}>{dealerWin.length}</span></p>
        <p className="draw result-modal-text">引き分け：{draw.length}</p>

        <button type='button' className='modal-btn'
          onClick={() => props.start(false)}
        >トップへ</button>
      </div>
    </div>
  )
}