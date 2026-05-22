/** In-layout loader — keeps sidebar/header visible while a lazy page chunk loads. */
function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--adm-teal)] border-t-transparent" />
    </div>
  )
}

export default PageFallback
