import { useState, useEffect } from 'react'
const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState('')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType('mobile')
      } else if (width >= 768 && width < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    // Initial check
    handleResize()

    // Attach the event listener
    window.addEventListener('resize', handleResize)

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return deviceType
}

export default useDeviceType
