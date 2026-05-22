const THEME_KEY = 'printcraft-theme'

export function applyAppTheme() {
  const saved =
    localStorage.getItem(THEME_KEY) ?? localStorage.getItem('theme') ?? 'dark'

  if (saved === 'light') {
    document.body.classList.add('light-mode')
  } else {
    document.body.classList.remove('light-mode')
  }

  localStorage.setItem(THEME_KEY, saved === 'light' ? 'light' : 'dark')
}

export function toggleAppTheme(): boolean {
  const isLight = document.body.classList.toggle('light-mode')
  localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark')
  localStorage.setItem('theme', isLight ? 'light' : 'dark')
  return isLight
}

export function isLightTheme(): boolean {
  return document.body.classList.contains('light-mode')
}

export function prepareDashboardShell() {
  document.body.classList.remove('home-active')
  document.body.classList.add('dashboard-app')
  applyAppTheme()
}
