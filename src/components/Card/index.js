import './index.css';
function Card({ initial,count, title }) {
  return (
    <div className={initial ? "initial-card": "card"}>
      <h5 className={initial ? "initial-card-title" :  "title"}>{title}</h5>
      {count && count ==0 || count > 0 ? <p className='digit'>{count}</p> : null}
    </div>
  );
}

export default Card;
