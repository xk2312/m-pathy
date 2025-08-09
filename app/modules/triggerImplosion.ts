// /modules/triggerImplosion.ts

export function triggerImplosion(
    cx: number,
    cy: number,
    core: HTMLDivElement,
    wrapper: HTMLDivElement
  ) {
    core.classList.add('vanish')
    core.style.transition = 'opacity 1.2s ease-out, transform 1.2s'
    core.style.opacity = '0'
    core.style.transform = 'scale(0.1) rotate(45deg)'
  
    setTimeout(() => {
      document.body.classList.add('stage-2')
      wrapper.innerHTML = `<div class="m-electric">ENTER&nbsp;M</div>`
      const m = wrapper.querySelector('.m-electric') as HTMLElement
      if (m) {
        m.style.animation = 'electric-text 4s ease-in-out infinite'
      }
    }, 1200)
  }
  