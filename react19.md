## React19

React是一个UI库。
在本次React19升级内容中，有很多用户UI交互的优化，把用户的视觉、体验放在更靠前的位置。（特别是在表单方面）

## 新特性
### Action 与 FormAction
> ### Action 含义 
> #### 使用异步过渡的函数被称为 “Actions”。
> #### 常见的用例是执行数据变更，然后响应更新状态。例如，提交一个表单来更改数据，需要发起一个 API 请求，然后处理请求返回结果。
> ### React19 针对Actions 的改进：
> #### 待定状态: Actions 提供一个待定状态，该状态在请求开始时启动，并在最终状态更新提交时自动重置。
> #### 乐观更新: Actions 支持新的 useOptimistic Hook，因此你可以在请求提交时向用户显示即时反馈。
> #### 错误处理: Actions 提供错误处理，因此当请求失败时，你可以显示错误边界，并自动将乐观更新恢复到其原始值。
> #### 表单: <form> 元素现在支持将函数传递给 action 和 formAction 属性。将函数传递给 action 属性默认使用 Actions，并在提交后自动重置表单。


#### FormAction
``` text
Actions 与 React 19 的新 <form> 功能集成在 react-dom 中。React19添加了对将函数作为 <form>、<input> 和 <button> 元素的 action 和 formAction 属性的支持，以便使用 Actions 自动提交表单：
```

``` js
<form action={actionFunction}>
```

代码示例：
https://codesandbox.io/p/sandbox/z8xfgt?file=%2Fsrc%2FApp_FormAction.jsx%3A13%2C1-41%2C3

react19之前，不支持原生的formAction事件，需要preventDefault后自行实现代码。

react 19 兼容form，添加了action，可以使用FormData进行表单操作。同时兼容原生表单，可以使用非受控组件。
https://developer.mozilla.org/zh-CN/docs/Web/API/FormData


### Hooks
#### useTransition
> **useTransition** 是一个让你可以在后台渲染部分 UI 的 React Hook。

useTransition 是同步过渡（类似于mutation，而不是action)，是同步进行的，不是异步。

useTransition 可以简单认为，在setState外侧多包了一层。

代码示例：
https://codesandbox.io/p/sandbox/z8xfgt?file=%2Fsrc%2FApp_Transition.js%3A35%2C21-35%2C36

before React 19
引用视频1

after React 19
应用视频2

在表单中的实际使用
[text](https://zh-hans.react.dev/reference/react/useTransition#examples)

#### Suspense 与 ErrorBoundary
[text](https://zh-hans.react.dev/reference/react/useTransition#building-a-suspense-enabled-router)

在startTransition中抛出的异常，会被外侧ErrorBoundary捕获。
[text](https://zh-hans.react.dev/reference/react/useTransition#displaying-an-error-to-users-with-error-boundary)

应用根节点建议
```js next
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <Suspense fallback={<div>Loading...</div>}>
    {children}
  </Suspense>
</ErrorBoundary>
```

##### 简单原理
任何传递给 startTransition 的函数都会会立即执行 
例如运行这段代码，它将会打印 1, 2, 3：
``` js
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```
结果打印 1, 2, 3。传递给 startTransition 的函数不会被延迟执行。与浏览器的 setTimeout 不同，它不会延迟执行回调。React 会立即执行你的函数，但是在它运行的同时安排的任何状态更新都被标记为 transition。你可以将其想象为以下方式：

``` js
// React 运行的简易版本

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ……安排 Transition 状态更新……
  } else {
    // ……安排紧急状态更新……
  }
}
```

##### 注意点：
1、不能关联在合成事件上
不应该将控制输入框的状态变量标记为Transition
```js
const [text, setText] = useState()

function handleChange(e) {
  // ❌ 不应将受控输入框的状态变量标记为 Transition
  startTransition(() => {
    setText(e.target.value)
  })
}

return (
  <input type="text" value={text} onChange={handleChange} />
)
```

这是因为 Transition 是非阻塞的，但是在响应更改事件时更新输入应该是同步的。如果想在输入时运行一个 transition，那么有两种做法：

声明两个独立的状态变量：一个用于输入状态（它总是同步更新），另一个用于在 Transition 中更新。这样，便可以使用同步状态控制输入，并将用于 Transition 的状态变量（它将“滞后”于输入）传递给其余的渲染逻辑。
或者使用一个状态变量，并添加 useDeferredValue，它将“滞后”于实际值，并自动触发非阻塞的重新渲染以“追赶”新值。


2、 React 没有将状态更新视为 Transition 
当在 Transition 中包装状态更新时，请确保传递给 startTransition 的函数必须是同步的。
```js
startTransition(() => {
  // ✅ 在调用 startTransition 中更新状态
  setPage('/about');
});

startTransition(() => {
  // ❌ 在调用 startTransition 后更新状态
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```
可以这样做：
```js
setTimeout(() => {
  startTransition(() => {
    // ✅ 在调用 startTransition 中更新状态
    setPage('/about');
  });
}, 1000);
```
3、React 不会将 await 之后的状态更新视为 Transition 
```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ 不要在 await 之后调用 startTransition
  setPage('/about');
});
```
使用以下方法可以正常工作：
```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ 在 startTransition **之后** 再 await
  startTransition(() => {
    setPage('/about');
  });
});
```

#### useActionState
useActionState 是一个可以根据某个表单动作的结果(异步状态的触发)更新 state 的 Hook。
可以在服务端使用，目前主要使用场景是在form表单中。

> 注意
> 在早期的 React Canary 版本中，此 API 是 React DOM 的一部分，称为 useFormState。

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

参数：
fn：当按钮被按下或者表单被提交时触发的函数。当函数被调用时，该函数会接收到表单的上一个 state（初始值为传入的 initialState 参数，否则为上一次执行完该函数的结果）作为函数的第一个参数，余下参数为普通表单动作接到的参数（FormData)。
initialState：state 的初始值。任何可序列化的值都可接收。当 action 被调用一次后该参数会被忽略。
可选的 permalink: 服务端使用，表单事件完成后，重定向至新页面url。
 if fn is a server function and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL, rather than the current page’s URL.

 示例代码：
 https://codesandbox.io/p/sandbox/z8xfgt?file=%2Fsrc%2FApp_FormState.jsx


#### useOptimistic
执行数据变更时的另一个常见 UI 模式是在异步请求进行时乐观地显示最终状态。在 React 19 中，添加了一个名为 useOptimistic 的新 Hook，以便更容易实现这一点。

示例代码：
https://codesandbox.io/p/sandbox/z8xfgt?file=%2Fsrc%2FApp_Optimistic.jsx

useOptimistic Hook 会在 updateName 请求进行时立即渲染 optimisticName。当更新完成或出错时，React 将自动切换回 currentName 值。

##### useFormStatus
**React DOM** 新 Hook: useFormStatus 
在设计系统中，常常需要编写设计一类能够访问其所在的 <form> 的信息而无需将属性传递到组件内的组件。这可以通过 Context 来实现，但为了使这类常见情况更简单，React19添加了一个新的 Hook useFormStatus。

```js
import { useFormStatus } from "react-dom";
const { pending, data, method, action } = useFormStatus();
```

引用 useFormStatus 的组件需要在 <form> 表单组件中。React 19将自动寻找外侧表单的数据。整体上类似于Provider和useContext。

[text](https://zh-hans.react.dev/reference/react-dom/hooks/useFormStatus#display-a-pending-state-during-form-submission)

#### use
和hooks相比，use可以在if else 中使用。
目前主要在两个场景使用：
1、获取promise结果
2、代替useContext
use并不是一个实际的hook，更加像是一个抽象的await

示例代码：
https://codesandbox.io/p/sandbox/z8xfgt?file=%2Fsrc%2FApp_Use.jsx


使用 use 读取 context 
当 context 被传递给 use 时，它的工作方式类似于useContext。而 useContext 必须在组件的顶层调用，use 可以在条件语句如 if 和循环如 for 内调用。相比之下，use 比 useContext更加灵活。

import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
use 返回传递的 context 的 context 值。React 会搜索组件树并找到 最接近的 context provider 以确定需要返回的 context 值。

如果要将上下文传递给 Button，请将其或其父组件之一包装在相应的 context provdier 内。

function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ……在这里面渲染按钮……
}
无论在 provider 和 Button 之间有多少层组件，都不会有影响。当 Form 内的任何位置的 Button 调用 use(ThemeContext) 时，它将接收到值为 "dark"。

不同于 useContext，use 可以在条件语句和循环中调用，比如 if。

function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
if 语句内部调用了 use，允许有条件地从 context 中读取值。


### 其他改动
#### ref 作为一个属性 
从 React 19 开始，你现在可以在函数组件中将 ref 作为 prop 进行访问：
```js
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```
新的函数组件将不再需要 forwardRef，我们将发布一个 codemod 来自动更新你的组件以使用新的 ref prop。在未来的版本中，我们将弃用并移除 forwardRef。

#### <Context> 作为提供者 
在 React 19 中，你可以将 <Context> 渲染为提供者，就无需再使用 <Context.Provider> 了：
```js
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
新的 Context 提供者可以使用 <Context>，我们将发布一个 codemod 来转换现有的提供者。在未来的版本中，我们将弃用 <Context.Provider>。
```

#### refs 支持清理函数 
这将使得在 ref 改变时执行清理操作变得更加容易。例如，你可以在 ref 改变时取消订阅事件：
```js 
<input
  ref={(ref) => {
    // ref 创建

    // 新特性: 当元素从 DOM 中被移除时
    // 返回一个清理函数来重置 ref
    return () => {
      // ref cleanup
    };
  }}
/>
```