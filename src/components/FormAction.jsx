'use client'

import React, { useState } from "react";

const updateName = (name) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(name)
    }, 500);
  })
}

// before react 19
// const App = () => {
//   const [name, setName] = useState("Admin");
//   const [input, setInput] = useState("");
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newName = await updateName(input);
//     setName(newName);
//     setInput("");
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <p>
//         current user is: {name}
//       </p>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <input name="name" value={input} onChange={(e) => setInput(e.target.value)} />
//         </div>
//         <div>
//           <button type="submit">Submit</button>
//         </div>
//       </form>
//     </div>
//   )
// }

// after react 19
const App = () => {
  const [name, setName] = useState("Admin");
  const handleAction = (formData) => {
    const newName = updateName(formData.get("name"));
    setName(newName);
  }

  return (
    <div style={{ padding: "20px" }}>
      <p>
        current user is: {name}
      </p>
      <form action={handleAction}>
        <div>
          <input name="name" />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}


export default App