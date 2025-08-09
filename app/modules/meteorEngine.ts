type XY = { x: number; y: number }

export function startMeteorSequence(
  ctx: CanvasRenderingContext2D,
  target: XY,
  onImpact: () => void
): () => void {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const rect = ctx.canvas.getBoundingClientRect()
  const w = rect.width, h = rect.height

  const x0 = w * 1.08, y0 = -h * 0.08
  const frames = isMobile ? 90 : 120
  let t = 0, rafId = 0, hit = false
  const dx = target.x - x0, dy = target.y - y0
  const ease = (p:number)=>1-(1-p)*(1-p)
  const tail:{x:number;y:number;a:number}[]=[]

  function drawTail(){
    for (let i=tail.length-1;i>=0;i--){
      const d=tail[i]
      ctx.beginPath(); ctx.arc(d.x,d.y,isMobile?1.6:2.2,0,Math.PI*2)
      ctx.fillStyle=`rgba(107,213,255,${d.a})`; ctx.fill()
      d.a-=0.03; if(d.a<=0) tail.splice(i,1)
    }
  }
  function meteor(x:number,y:number){
    ctx.beginPath(); ctx.arc(x,y,isMobile?4:6,0,Math.PI*2)
    ctx.fillStyle='#6BD5FF'
    ctx.shadowColor='rgba(107,213,255,1)'
    ctx.shadowBlur=20
    ctx.fill()
  }

  function loop(){
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
    const p=Math.min(t/frames,1), e=ease(p)
    const x=x0+dx*e, y=y0+dy*e
    tail.push({x,y,a:1}); drawTail(); meteor(x,y)

    if (!hit && p>=1){
      hit = true
      cancelAnimationFrame(rafId)
      // WISCH Meteor vollständig weg
      ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
      onImpact()
      return
    }
    t++; rafId = requestAnimationFrame(loop)
  }

  rafId = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(rafId)
}
