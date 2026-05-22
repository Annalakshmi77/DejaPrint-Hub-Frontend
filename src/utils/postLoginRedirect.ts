//this is Align crtion
import { prepareDashboardShell } from './theme'

/** Full navigation after login — same result as hard reload (fixes layout alignment). */
export function redirectAfterLogin(path: string) {
  prepareDashboardShell()
  window.location.replace(path)
}

/** Full navigation after logout — same result as hard reload (clears all dashboard classes). */
export function redirectAfterLogout() {
  document.body.classList.remove('dashboard-app')
  window.location.replace('/')
}
