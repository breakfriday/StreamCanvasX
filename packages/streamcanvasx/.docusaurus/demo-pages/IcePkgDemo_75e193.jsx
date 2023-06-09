
import BrowserOnly from '@docusaurus/BrowserOnly';
export default () => {
  return (
    <BrowserOnly>
      {() => {
        const Demo = require('/home/break_happy/project/stream12/packages/streamcanvasx/.docusaurus/demos/IcePkgDemo_75e193.tsx').default;
        return <Demo />
      }}
    </BrowserOnly>
  )
}
