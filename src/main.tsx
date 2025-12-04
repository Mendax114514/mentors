import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import MainGame from './pages/MainGame'
import StudentManagement from './pages/StudentManagement'
import ProjectApplication from './pages/ProjectApplication'
import EquipmentStore from './pages/EquipmentStore'
import EvaluationSystem from './pages/EvaluationSystem'
import GameOver from './pages/GameOver'
import Assessment from './pages/Assessment'
import Onboarding from './pages/Onboarding'
import './index.css'

console.log('Mounting app...')
const rootEl = document.getElementById('root')!
ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
          <Route index element={<MainGame />} />
          <Route path="onboarding" element={<Onboarding />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="projects" element={<ProjectApplication />} />
            <Route path="equipment" element={<EquipmentStore />} />
            <Route path="evaluation" element={<EvaluationSystem />} />
            <Route path="assessment" element={<Assessment />} />
            <Route path="game-over" element={<GameOver />} />
          </Route>
          <Route path="/health" element={<div style={{padding:20}}>OK</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
import ErrorBoundary from './ui/ErrorBoundary'
