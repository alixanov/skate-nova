import React from 'react'
import {ImagePeople, Start} from '../'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <div className='app__container' >
      <Routes>
        <Route path={"/"} element={<Start />} />
        <Route path={"/images-people"} element={<ImagePeople />} />
      </Routes>
    </div>
  )
}

export default AppRoutes
