'use client'
import React, { useState, useEffect } from 'react'
import { getToken } from '../helpers'
import { API, Auth_API, BEARER } from '../constant'
import { AuthContext } from '../context/AuthContext'

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const authToken = getToken()

  const fetchLoggedInUser = async token => {
    setIsLoading(true)
    try {
      const response = await fetch(`${Auth_API}/login`, {
        headers: { Authorization: `${BEARER} ${token}` },
      })
      const data = await response.json()

      setUserData(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUser: any = user => {
    setUserData(user)
  }

  useEffect(() => {
    if (authToken) {
      fetchLoggedInUser(authToken)
    }
  }, [authToken])

  return (
    <AuthContext.Provider
      value={{ user: userData, setUser: handleUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
