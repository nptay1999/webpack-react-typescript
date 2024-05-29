import classes from './Button.module.less'
import { useGetFact } from 'api'
import { useState } from 'react'

export const Button = () => {
  const [clicked, setClicked] = useState(false)
  const { data, isLoading } = useGetFact({ enabled: clicked })
  return (
    <>
      <button className={classes['button']} onClick={() => setClicked(true)}>
        Button
      </button>
      {isLoading ? <span>loading</span> : <span>{JSON.stringify(data)}</span>}
    </>
  )
}
