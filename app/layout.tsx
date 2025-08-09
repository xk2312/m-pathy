export const metadata = {
    title: 'Enter M',
    description: 'Empathy System Entry Sequence',
  }
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body
          style={{
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, #0f0f0f, #000000)',
            fontFamily: '"Segoe UI", sans-serif',
            userSelect: 'none',
            touchAction: 'none',
          }}
        >
          {children}
        </body>
      </html>
    )
  }
  