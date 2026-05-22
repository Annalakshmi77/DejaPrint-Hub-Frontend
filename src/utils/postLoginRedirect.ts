import { prepareDashboardShell } from './theme'

/** Full navigation after login — same result as hard reload (fixes layout alignment). */
export function redirectAfterLogin(path: string) {
  prepareDashboardShell()
  window.location.replace(path)
}
