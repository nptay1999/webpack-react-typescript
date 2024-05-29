import LazyModule from 'App.module'
import { OverlayLoading } from 'components'
import { QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { queryClient } from 'configs'

const App = () => {
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<OverlayLoading />}>
          <LazyModule />
        </Suspense>
      </QueryClientProvider>
    </Suspense>
  )
}

export default App
