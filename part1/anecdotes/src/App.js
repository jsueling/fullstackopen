import React, { useState, useRef } from 'react'

const Title = (props) => <h2>{props.text}</h2>

const Anecdote = (props) => <p>{props.anecdote}</p>

const Counter = (props) => <p>This anecdote has {props.votes} votes</p>

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Array
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
  // use a lazy initializer for the votes state
  const [votes, setVotes] = useState(() => new Array(anecdotes.length).fill(0))
  
  // generates a random index corresponding to the anecdotes array
  const anecdotesRandom = () => Math.round(Math.random()*(anecdotes.length-1))

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // addVote is a function expression that modifies the votes state with setVotes
  // When it's called maps the votes array, where x is an element in the array and y is the index.
  // It only increments the index of the votes array that is the same value as the state, selected,
  // which is the anecdote rendered on the page. ".map" makes a copy of the array, applies the
  // mapping function, and returns the new array which maintains the array between states
  const addVote = () => setVotes(votes.map((x, y) => (y === selected) ? x + 1 : x))
  
  // https://dmitripavlutin.com/react-useref-guide/
  // Between the component re-renderings, the value of the reference is persistent.
  // Updating a reference, contrary to updating state, doesn’t trigger component re-rendering.
  // Initialize the ref to store the current anecdote with 0 votes
  let record = useRef(
    {
      anecdote: anecdotes[selected],
      votes: 0
    })

  // We want to check for a new record when votes changes
  if (votes[selected] > record.current.votes) {
    record.current.anecdote = anecdotes[selected]
    record.current.votes = votes[selected]
  }

  // If we used useEffect instead of useRef we would have to create a new state, e.g. record, to trigger re-renders
  // when a new record was set which would be max. 2 re-renders when votes change, we would put votes in the useEffect's dependency array. 
  
  // Having tested implementing that, useRef seems simpler even though we are checking for a new record on each render, 
  // including when the "selected" state changes which is irrelevant.

  // The difference when switching to the useEffect approach is that we only check for a new 
  // record when the votes state changes, and upon changing,
  // trigger a re-render by changing record state by calling setRecord

  return (
    <div>
      <Title text="Anecdote of the day" />
      <Anecdote anecdote={anecdotes[selected]} />
      <Counter votes={votes[selected]} />
      <Button text="Vote" onClick={addVote} />
      <Button text="Next Anecdote" onClick={() => setSelected(anecdotesRandom)} />
      <Title text="Anecdote with the most votes" />
      <Anecdote anecdote={record.current.anecdote} />
      <Counter votes={record.current.votes} />
    </div>
  )
}

export default App