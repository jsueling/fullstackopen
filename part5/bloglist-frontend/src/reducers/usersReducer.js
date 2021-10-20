import usersService from '../services/usersService'

const usersReducer = (state = null, action) => {
  switch (action.type) {
  case 'INIT_USERS':
    return action.users
  default:
    return state
  }
}

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await usersService.getAll()
    dispatch({
      type: 'INIT_USERS',
      users
    })
  }
}

export default usersReducer