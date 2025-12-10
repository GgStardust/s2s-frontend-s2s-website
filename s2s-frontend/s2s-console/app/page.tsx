export default function ConsoleHome() {
  // This page should be redirected by middleware
  // If you see this, middleware isn't working
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-editorial-text">Redirecting to diagnostic...</p>
    </div>
  )
}

