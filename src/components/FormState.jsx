'use client'

import React, { useActionState } from 'react'

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
    { name: 'Admin', age: 20 }
  )
  async function handleAction (prevState, formData) {
    const nextName = await updateName(formData.get('name'))
    console.log('nextName ---', nextName)
    return { ...prevState, name: nextName }
  }
  
  
  return (
    <form action={actionFunction}>
      <div>current user: {state?.name}</div>
      {isPending && <div>loading...</div>}
      <input type="text" name='name' />
      {/* <input type="text" age='age' /> */}
      <button type='submit'>submit</button>
      <div>{state?.error}</div>
    </form>
  )
}

export default App
