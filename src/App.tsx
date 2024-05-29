import { Button } from 'components/Button'
import { QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { queryClient } from 'configs'

const App = () => {
  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        React Application
        <br />
        <Button />
      </QueryClientProvider>
    </Suspense>
  )
}

export default App
