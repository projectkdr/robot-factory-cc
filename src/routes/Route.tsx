import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RobotFactory from '../views/RobotFactory/RobotFactory'

const Routers = () => (
    <BrowserRouter>
        <Routes>
            <Route
                path="/"
                element={<RobotFactory />}
            />
        </Routes>
    </BrowserRouter>
)

export default Routers
