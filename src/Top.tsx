import './Top.css';

type propsObj = {start: React.Dispatch<React.SetStateAction<boolean>>}

export default function Top(props:propsObj){
  return (
    <div className="top-menu">
      <div className="top-bg"></div>
        <div className="top-inner">
          <h1><img src={`${process.env.PUBLIC_URL}/top-title.svg`}/></h1>
          <div className='top-btn-wrap'>
            <button type='button' className='top-btn'
              onClick={() => props.start(true)}
            >スタート</button>
          </div>
        </div>
    </div>
  )
}