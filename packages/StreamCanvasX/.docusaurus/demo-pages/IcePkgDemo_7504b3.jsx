
import BrowserOnly from '@docusaurus/BrowserOnly';
export default () => {
  return (
    <BrowserOnly>
      {() => {
        const Demo = require('/home/break_happy/project/stream8/packages/StreamCanvasX/.docusaurus/demos/IcePkgDemo_7504b3.tsx').default;
        return <Demo />
      }}
    </BrowserOnly>
  )
}
