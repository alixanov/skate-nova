import React from 'react'
import {ImagePeople, Start,Game} from '../'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <div className='app__container' >
      <Routes>
        <Route path={"/"} element={<Start />} />
        <Route path={"/images-people"} element={<ImagePeople />} />
        <Route path={"/game"} element={<Game />} />
      </Routes>
    </div>
  )
}

export default AppRoutes
