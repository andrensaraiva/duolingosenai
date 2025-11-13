import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/client'

const AppDataContext = createContext(null)

const formatError = (error) => {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return 'Algo inesperado aconteceu'
}

export function AppDataProvider({ children }) {
  const [academy, setAcademy] = useState({ path: [], profile: null, loading: true, refreshing: false })
  const [arena, setArena] = useState({ challenges: [], loading: true, refreshing: false })
  const [toast, setToast] = useState(null)
  const [automationFarm, setAutomationFarm] = useState({
    isRunning: false,
    challengeId: null,
    points: 0,
    rate: 0,
    lastUpdate: null,
    label: '',
  })

  const fetchAcademy = useCallback(async () => {
    setAcademy((prev) => ({ ...prev, refreshing: true }))
    try {
      const { data } = await api.get('/academy/path')
      setAcademy({ path: data.path, profile: data.profile, loading: false, refreshing: false })
    } catch (error) {
      setAcademy((prev) => ({ ...prev, loading: false, refreshing: false, error: formatError(error) }))
    }
  }, [])

  const fetchArena = useCallback(async () => {
    setArena((prev) => ({ ...prev, refreshing: true }))
    try {
      const { data } = await api.get('/arena/challenges')
      setArena({ challenges: data.challenges, loading: false, refreshing: false })
    } catch (error) {
      setArena((prev) => ({ ...prev, loading: false, refreshing: false, error: formatError(error) }))
    }
  }, [])

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ id: Date.now(), message, tone })
    setTimeout(() => setToast(null), 2800)
  }, [])

  const completeLesson = useCallback(
    async (lessonId, stats = {}) => {
      const { data } = await api.post(`/academy/lessons/${lessonId}/complete`, stats)
      await Promise.all([fetchAcademy(), fetchArena()])
      showToast('Lição concluída! +XP garantido.', 'success')
      return data
    },
    [fetchAcademy, fetchArena, showToast]
  )

  const simulateChallenge = useCallback(async (challengeId, code) => {
    const { data } = await api.post(`/arena/challenges/${challengeId}/simulate`, { code })
    return data.simulation
  }, [])

  const submitChallenge = useCallback(
    async (challengeId, code) => {
      const { data } = await api.post(`/arena/challenges/${challengeId}/submit`, { code })
      await Promise.all([fetchAcademy(), fetchArena()])
      showToast(data.message, data.meetsGoal ? 'success' : 'warning')
      return data
    },
    [fetchAcademy, fetchArena, showToast]
  )

  const startAutomationFarm = useCallback((challengeId, { rate, label, resetPoints = false } = {}) => {
    if (!rate || !challengeId) return
    setAutomationFarm((prev) => {
      const shouldReset = resetPoints || prev.challengeId !== challengeId
      return {
        isRunning: true,
        challengeId,
        rate,
        label: label ?? prev.label,
        points: shouldReset ? 0 : prev.points,
        lastUpdate: Date.now(),
      }
    })
  }, [])

  const stopAutomationFarm = useCallback((options = {}) => {
    setAutomationFarm((prev) => {
      if (!prev.isRunning && !options.reset) return prev
      const next = {
        ...prev,
        isRunning: false,
        lastUpdate: null,
      }
      if (options.reset) {
        return {
          isRunning: false,
          challengeId: null,
          points: 0,
          rate: 0,
          lastUpdate: null,
          label: '',
        }
      }
      return next
    })
  }, [])

  useEffect(() => {
    if (!automationFarm.isRunning) return undefined
    const interval = setInterval(() => {
      setAutomationFarm((prev) => {
        if (!prev.isRunning) return prev
        const now = Date.now()
        const last = prev.lastUpdate ?? now
        const deltaSeconds = (now - last) / 1000
        return {
          ...prev,
          points: prev.points + prev.rate * deltaSeconds,
          lastUpdate: now,
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [automationFarm.isRunning])

  const value = useMemo(
    () => ({
      academy,
      arena,
      toast,
      refreshAcademy: fetchAcademy,
      refreshArena: fetchArena,
      refreshAll: () => Promise.all([fetchAcademy(), fetchArena()]),
      completeLesson,
      simulateChallenge,
      submitChallenge,
      automationFarm,
      startAutomationFarm,
      stopAutomationFarm,
    }),
    [
      academy,
      arena,
      toast,
      fetchAcademy,
      fetchArena,
      completeLesson,
      simulateChallenge,
      submitChallenge,
      automationFarm,
      startAutomationFarm,
      stopAutomationFarm,
    ]
  )

  useEffect(() => {
    fetchAcademy()
    fetchArena()
  }, [fetchAcademy, fetchArena])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = () => {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData deve ser usado dentro do AppDataProvider')
  }
  return context
}
