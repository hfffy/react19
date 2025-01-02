'use client'

import React, { useState, useTransition } from "react";

const TabB = () => {
  // 生成随机16位颜色哈希
  const randomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }
  return (
    <div style={{
      display: 'flex',
      flexFlow: 'row wrap',
      maxWidth: '100px'
    }}>
      {new Array(500000).fill(0).map((_, index) => (
        <div style={{
          flexShrink: 0,
          width: '20px',
          height: '20px',
          background: randomColor()
        }} key={index}></div>
      ))}
    </div>
  )
}


const App = () => {
  const [tab, setTab] = useState('A')
  const [isPending, startTransition] = useTransition()
  const switchTab = (nextTab) => {
    startTransition(() => {
      setTab(nextTab)
    })
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <button onClick={() => switchTab('A')}>Tab A</button>
        <button onClick={() => switchTab('B')}>Tab B</button>
        <button onClick={() => switchTab('C')}>Tab C</button>
      </div>
      <div>
        {isPending && <div>Loading...</div>}
        {!isPending && tab === 'A' && <div>Tab A</div>}
        {!isPending && tab === 'B' && <TabB />}
        {!isPending && tab === 'C' && <div>Tab C</div>}
      </div>
    </>
  )
}

export default App
