'use client'

import React, { Suspense, use, useEffect, useState } from "react";

const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        user: 'Admin',
        age: 20
      })
    }, 1000);
  })
}

// before React 19
// const Content = () => {
//   const [data, setData] = useState({})
//   const [loading, setLoading] = useState(false)

//   useEffect(async () => {
//     setLoading(true)
//     const data = await fetchData()
//     setData(data)
//     setLoading(false)
//   }, [])

//   if (loading) {
//     return <div>loading ...</div>
//   }
  
//   return (
//     <div>
//       <code>
//         {JSON.stringify(data, null, 2)}
//       </code>
//     </div>
//   )
// }

// after React 19
const Content = () => {
  const data = use(fetchData())

  return <div>
    <code>
      {JSON.stringify(data, null, 2)}
    </code>
  </div>
}

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  )
}

export default App
