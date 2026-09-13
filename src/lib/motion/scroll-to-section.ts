export const scrollToSection = (id: string): void => {
  const reducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches
  document.getElementById(id)?.scrollIntoView({
    behavior: reducedMotion ? 'auto' : 'smooth'
  })
}
