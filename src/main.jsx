import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './fonts.css'
import './index.css'
import App from './App.jsx'
import { DesignProvider, applyDesign } from './design'

applyDesign()

// reducedMotion="user": with prefers-reduced-motion on, transform and layout animations are
// skipped and the page renders still.
createRoot(document.getElementById('root')).render(
  <MotionConfig reducedMotion="user">
    <DesignProvider>
      <App />
    </DesignProvider>
  </MotionConfig>,
)
