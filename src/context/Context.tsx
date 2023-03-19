import { useState, useContext, createContext } from 'react'

const Context = createContext<{ name: string, setName: (_: string) => void }>({
  name: '',
  setName: () => { return }
})

export const StateContext = ({ children }: { children: JSX.Element }) => {
  const [name, setName] = useState('Mathias')

  return (
    <Context.Provider 
      value={{
        name, setName
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)