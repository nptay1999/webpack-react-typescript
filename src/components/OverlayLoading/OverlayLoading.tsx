import classes from './OverlayLoading.module.less'
import { Spin } from 'antd'

export const OverlayLoading = () => {
  return <Spin size="large" fullscreen className={classes['overlay-loading']} />
}
