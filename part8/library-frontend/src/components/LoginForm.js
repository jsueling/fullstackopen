import React, { useState, useEffect } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'

const LoginForm = ({ show, setToken, setPage }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [login, result] = useMutation(LOGIN)

    useEffect(() => {
        if (result.data) {
          const token = result.data.login.value
          setToken(token)
          localStorage.setItem('library-user-token', token)
        }
      }, [result.data]) // eslint-disable-line

    if (!show) return null

    const logIn = async (event) => {
        event.preventDefault()

        login({ variables: { username, password } })

        setUsername('')
        setPassword('')
        setPage('authors')
    }

    return (
        <div>
            <h2>login</h2>
            <form onSubmit={logIn}>
                <div>
                    username:{' '}
                    <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password:{' '}
                    <input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm