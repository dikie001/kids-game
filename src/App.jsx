import React from 'react'
import Kidgame from './Kidgame'
import Kidgame2 from './Kidgame2'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div className='min-h-dvh w-full transition-all duration-300 ease-in-out flex justify-center items-center bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-600'>
    <Toaster/>
      <Kidgame2/>

    </div>
  )
}

export default App