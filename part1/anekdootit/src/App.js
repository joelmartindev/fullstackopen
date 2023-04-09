import { useState } from 'react'

const Button = ({name, handleClick}) => <button onClick={handleClick}>{name}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
  })

  const handleNext = () => {
    let random = selected
    while(random === selected){
      random = Math.floor(Math.random() * 8)
    }
    setSelected(random)
  }

  const handleVote = () => {
    const copy = { ...points }
    // kasvatetaan olion kentän 2 arvoa yhdellä
    copy[selected] += 1
    setPoints(copy)
  }
  
  const maxPoints = () => {
    let arr = Object.values(points)
    let max = Math.max(...arr)
    return max
  }

  const maxAne = () => {
    let arr = Object.values(points)
    let max = Math.max(...arr)
    for(let key in points) {
      if(points[key] === max) {
        return key
      }
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>{points[selected]} points</p>
      <Button name='vote' handleClick={handleVote}/>
      <Button name='next anecdote' handleClick={handleNext}/>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[maxAne()]}</p>
      <p>{maxPoints()} points</p>
    </div>
  )
}

export default App