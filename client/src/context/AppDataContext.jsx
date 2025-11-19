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
  const [missions, setMissions] = useState({ rotation: null, catalog: [], loading: true, refreshing: false })
  const [toast, setToast] = useState(null)
  const [automationFarm, setAutomationFarm] = useState({
    isRunning: false,
    challengeId: null,
    points: 0,
    rate: 0,
    lastUpdate: null,
    label: '',
  })
  const [theme, setThemeState] = useState({ selected: null, options: [], loading: true, updating: false, error: null })

  const applyThemeTokens = useCallback((themePayload) => {
    if (!themePayload?.tokens || typeof document === 'undefined') return
    const root = document.documentElement
    if (!root) return
    Object.entries(themePayload.tokens).forEach(([token, value]) => {
      root.style.setProperty(`--${token}`, value)
    })
    if (document.body) {
      document.body.dataset.theme = themePayload.id ?? ''
    }
  }, [])

  const syncThemeState = useCallback(
    (selectedTheme, optionsList) => {
      setThemeState((prev) => ({
        ...prev,
        selected: selectedTheme ?? prev.selected,
        options: optionsList ?? prev.options,
        loading: false,
        updating: false,
        error: null,
      }))
      if (selectedTheme) {
        applyThemeTokens(selectedTheme)
      }
    },
    [applyThemeTokens]
  )

  const fetchAcademy = useCallback(async () => {
    setAcademy((prev) => ({ ...prev, refreshing: true }))
    try {
      const { data } = await api.get('/academy/path')
      setAcademy({ path: data.path, profile: data.profile, loading: false, refreshing: false })
      syncThemeState(data.theme ?? data.profile?.theme ?? null, data.themes ?? null)
    } catch (error) {
      const message = formatError(error)
      setAcademy((prev) => ({ ...prev, loading: false, refreshing: false, error: message }))
      setThemeState((prev) => ({ ...prev, loading: false, updating: false, error: message }))
    }
  }, [syncThemeState])

  const fetchArena = useCallback(async () => {
    setArena((prev) => ({ ...prev, refreshing: true }))
    try {
      const { data } = await api.get('/arena/challenges')
      setArena({ challenges: data.challenges, loading: false, refreshing: false })
    } catch (error) {
      setArena((prev) => ({ ...prev, loading: false, refreshing: false, error: formatError(error) }))
    }
  }, [])

  const fetchMissions = useCallback(async () => {
    setMissions((prev) => ({ ...prev, refreshing: true }))
    try {
      const { data } = await api.get('/missions')
      setMissions({ rotation: data.rotation, catalog: data.catalog ?? [], loading: false, refreshing: false })
      if (data.profile) {
        setAcademy((prev) => ({ ...prev, profile: data.profile }))
        if (data.profile.theme) {
          syncThemeState(data.profile.theme, null)
        }
      }
    } catch (error) {
      setMissions((prev) => ({ ...prev, loading: false, refreshing: false, error: formatError(error) }))
    }
  }, [syncThemeState])

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ id: Date.now(), message, tone })
    setTimeout(() => setToast(null), 2800)
  }, [])

  const changeTheme = useCallback(
    async (themeId) => {
      if (!themeId || themeId === theme?.selected?.id) return
      setThemeState((prev) => ({ ...prev, updating: true, error: null }))
      try {
        const { data } = await api.post(`/academy/themes/${themeId}`)
        syncThemeState(data.theme ?? null, data.themes ?? null)
        setAcademy((prev) => ({
          ...prev,
          path: data.path ?? prev.path,
          profile: data.profile ?? prev.profile,
          loading: false,
          refreshing: false,
        }))
        setArena((prev) => ({
          ...prev,
          challenges: data.challenges ?? prev.challenges,
          loading: false,
          refreshing: false,
        }))
        await fetchMissions()
        showToast('Tema atualizado! 🎨', 'success')
      } catch (error) {
        const message = formatError(error)
        setThemeState((prev) => ({ ...prev, updating: false, error: message }))
        showToast(message, 'danger')
      }
    },
    [fetchMissions, showToast, syncThemeState, theme?.selected?.id]
  )

  const completeLesson = useCallback(
    async (lessonId, stats = {}) => {
      const { data } = await api.post(`/academy/lessons/${lessonId}/complete`, stats)
      await Promise.all([fetchAcademy(), fetchArena()])
      showToast('Lição concluída! +XP garantido.', 'success')
      return data
    },
    [fetchAcademy, fetchArena, showToast]
  )

  const simulateChallenge = useCallback(async (challengeId, code, options = {}) => {
    const payload = { code }
    if (options.params) payload.params = options.params
    if (options.mods) payload.mods = options.mods
    const { data } = await api.post(`/arena/challenges/${challengeId}/simulate`, payload)
    return data.simulation
  }, [])

  const submitChallenge = useCallback(
    async (challengeId, code, options = {}) => {
      const payload = { code }
      if (options.params) payload.params = options.params
      if (options.mods) payload.mods = options.mods
      const { data } = await api.post(`/arena/challenges/${challengeId}/submit`, payload)
      await Promise.all([fetchAcademy(), fetchArena()])
      showToast(data.message, data.meetsGoal ? 'success' : 'warning')
      return data
    },
    [fetchAcademy, fetchArena, showToast]
  )

  const completeMission = useCallback(
    async (missionId, choice) => {
      const { data } = await api.post(`/missions/${missionId}/complete`, { choice })
      setMissions((prev) => ({ ...prev, rotation: data.rotation ?? prev.rotation }))
      await Promise.all([fetchMissions(), fetchAcademy()])
      showToast('Missão concluída! Recompensas aplicadas.', 'success')
      return data
    },
    [fetchAcademy, fetchMissions, showToast]
  )

  const activateBooster = useCallback(
    async (boosterType) => {
      const { data } = await api.post(`/missions/boosters/${boosterType}/use`)
      await Promise.all([fetchMissions(), fetchAcademy()])
      showToast('Booster ativado!', 'success')
      return data
    },
    [fetchAcademy, fetchMissions, showToast]
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

  const getFarmMultiplier = useCallback(() => {
    const expiresAt = academy.profile?.activeBoosters?.turboFarm?.expiresAt
    if (expiresAt && expiresAt > Date.now()) {
      return 1.25
    }
    return 1
  }, [academy.profile?.activeBoosters?.turboFarm?.expiresAt])

  useEffect(() => {
    if (!automationFarm.isRunning) return undefined
    const interval = setInterval(() => {
      setAutomationFarm((prev) => {
        if (!prev.isRunning) return prev
        const now = Date.now()
        const last = prev.lastUpdate ?? now
        const deltaSeconds = (now - last) / 1000
        const multiplier = getFarmMultiplier()
        return {
          ...prev,
          points: prev.points + prev.rate * multiplier * deltaSeconds,
          lastUpdate: now,
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [automationFarm.isRunning, getFarmMultiplier])

  const value = useMemo(
    () => ({
      academy,
      arena,
      missions,
      toast,
      theme,
      refreshAcademy: fetchAcademy,
      refreshArena: fetchArena,
      refreshMissions: fetchMissions,
      refreshAll: () => Promise.all([fetchAcademy(), fetchArena(), fetchMissions()]),
      changeTheme,
      completeLesson,
      simulateChallenge,
      submitChallenge,
      completeMission,
      activateBooster,
      automationFarm,
      startAutomationFarm,
      stopAutomationFarm,
      farmMultiplier: getFarmMultiplier,
    }),
    [
      academy,
      arena,
      missions,
      toast,
  fetchAcademy,
  fetchArena,
  fetchMissions,
      completeLesson,
      simulateChallenge,
      submitChallenge,
      completeMission,
  activateBooster,
      automationFarm,
      startAutomationFarm,
      stopAutomationFarm,
      getFarmMultiplier,
      theme,
      changeTheme,
    ]
  )

  useEffect(() => {
    fetchAcademy()
    fetchArena()
    fetchMissions()
  }, [fetchAcademy, fetchArena, fetchMissions])

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
