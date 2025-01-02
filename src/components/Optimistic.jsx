'use client'

import React, { useActionState, useOptimistic } from 'react'

const updateName = (name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name === 'error') {
        reject('update fail!')
      } else {
        resolve(name)
      }
    }, 500);
  })
}


const App = () => {
  const [state, actionFunction, isPending] = useActionState(
    handleAction,
    { name: 'Admin', error: null }
  )
  const [optimisticName, setOptimisticName] = useOptimistic(state.name)
  async function handleAction (prevState, formData) {
    setOptimisticName(formData.get('name'))
    try {
      const nextName = await updateName(formData.get('name'))
      console.log('nextName ---', nextName)
      return { name: nextName, error: null }
    } catch(error) {
      return { error, name: prevState.name }
    }
  }
  
  
  return (
    <form action={actionFunction}>
      <div>current user: {optimisticName}</div>
      {isPending && <div>loading...</div>}
      <input type="text" name='name' />
      <button type='submit'>submit</button>
      <div>{state?.error}</div>
    </form>
  )
}

export default App
