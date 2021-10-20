import React from 'react'

const UserDisplay = (props) => {
  // UserDisplay, like Blog, is a presentational component
  // so we want to exclude state management, pass users as a prop
  return (
    <>
      <h1>Users</h1>
      {props.users
        ?
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Blogs Added</th>
            </tr>
          </thead>
          <tbody>
            {props.users.map(x =>
              <tr key={x.id}>
                <td>{x.username}</td>
                <td>{x.blogs.length}</td>
              </tr>
            )}
          </tbody>
        </table>
        :
        null
      }
    </>
  )
}

export default UserDisplay