import './index.css';
function Cadidate({ candidate, image }) {
  return (
    <div className={'card'}>
      <img
        width={100}
        height={100}
        className='card-image'
        src={image}
        alt='error'
      />
      <br/>
      <span className='vote-count' >{String(candidate.voteCount)}</span>
      <br/>
      <span style={{ color: 'white' }}>{candidate.name}</span>
    </div>
  );
}

export default Cadidate;
