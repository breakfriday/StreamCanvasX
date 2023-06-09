
import BrowserOnly from '@docusaurus/BrowserOnly';
export default () => {
  return (
    <BrowserOnly>
      {() => {
        const Demo = require('/home/break_happy/project/stream10/packages/streamcanvasx/.docusaurus/demos/IcePkgDemo_8bcb51.tsx').default;
        return <Demo />
      }}
    </BrowserOnly>
  )
}
