import { AppRoutes } from 'App.routes'
import { ConfigProvider as ThemeProvider } from 'antd'
import { lazy } from 'react'

export const AppModule = () => {
  return (
    <ThemeProvider theme={{}}>
      <AppRoutes />
    </ThemeProvider>
  )
}

const LazyModule = lazy(async () => {
  return { default: AppModule }
})

export default LazyModule
