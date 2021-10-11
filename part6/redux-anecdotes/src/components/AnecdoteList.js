import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addVote, sortAnecdotes } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const anecdotes = useSelector(state => {
      // state.filter is initialized as the empty string
      if (state.filter.length) {
        // .filter() filters in elements if the callback executed 
        // returns true
        return state.anecdotes.filter((x) => {
          return (
            x.content
            // make case insensitive string comparison
            .toUpperCase()
            // .indexOf() returns -1 if not found or the positive index
            // of the character,
            .indexOf(state.filter.toUpperCase()) >= 0)
        })
      }

      return state.anecdotes
    })

    const dispatch = useDispatch()

    const vote = (anecdote) => {
        console.log('vote', anecdote.id)
        dispatch(addVote(anecdote.id))
        dispatch(sortAnecdotes())
        dispatch(setNotification(`You voted for "${anecdote.content}"`))
        setTimeout(() => dispatch(removeNotification()), 5000)
    }

    return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
    )
}

export default AnecdoteForm