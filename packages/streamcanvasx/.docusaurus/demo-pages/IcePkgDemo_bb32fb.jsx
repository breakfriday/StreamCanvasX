
import BrowserOnly from '@docusaurus/BrowserOnly';
export default () => {
  return (
    <BrowserOnly>
      {() => {
        const Demo = require('/home/break_happy/project/stream8/packages/streamcanvasx/.docusaurus/demos/IcePkgDemo_bb32fb.tsx').default;
        return <Demo />
      }}
    </BrowserOnly>
  )
}
