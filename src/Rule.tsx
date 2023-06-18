import './Modal.css';

type propsObj = {state:boolean};

export default function Rule(props:propsObj){  
  return (
    <div className="modal">
      <div className="modal-bg"></div>
      <div className="modal-content">
        <h2>トランプジャンケンのルール</h2>
        <ul>
          <li>Playerの手札からカードを一枚選択します</li>
          <li>Dealerは手札からランダムにカードを一枚選択します</li>
          <li>選択したカードでトランプの数字が大きかった方の勝利です</li>
          <li>ゲームは全５回で勝利数の多かった方の勝利です</li>
        </ul>
        <button type='button' className='modal-btn'>スタート</button>
      </div>
    </div>
  )
}