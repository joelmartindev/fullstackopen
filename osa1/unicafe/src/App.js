import { useState } from 'react'

const Title = ({title}) => <h1>{title}</h1>
const Button = ({name, handleClick}) => <button onClick={handleClick}>{name}</button>
const StatisticsData = ({name, value}) => <tr><td>{name} {value}</td></tr>

const Statistics = ({good, neutral, bad}) => {

  const allFeedback = good + neutral + bad
  const avg = ((good * 1 + bad * -1) / allFeedback).toFixed(1)
  const positive = ((good / allFeedback) * 100).toFixed(1)

  if(allFeedback === 0) return <p>No feedback given</p>

  return (
    <div>
      <table>
        <tbody>
          <StatisticsData name='good' value={good}/>
          <StatisticsData name='neutral' value={neutral}/>
          <StatisticsData name='bad' value={bad}/>
          <StatisticsData name='all' value={good + neutral + bad}/>
          <StatisticsData name='average' value={avg}/>
          <StatisticsData name='positive' value={positive + ' %'}/>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Title title='give feedback'/>
      <Button name='good' handleClick={() => {setGood(good + 1)}}/>
      <Button name='neutral' handleClick={() => setNeutral(neutral + 1)}/>
      <Button name='bad' handleClick={() => setBad(bad + 1)}/>
      <Title title='statistics'/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App