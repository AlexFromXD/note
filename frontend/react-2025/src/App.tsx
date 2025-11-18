import router from '@/routes'
import { Helmet } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'

function App() {
  return (
    <>
      <Helmet>
        {/* env with prefix VITE_ will be statically embedded into the client bundle */}
        <title>{import.meta.env.VITE_TITLE_NAME}</title>
        {/* Q: 這裡要加上其他的 meta 標籤嗎？ 只放 title 是不是沒發揮到 helmet 的效果 */}
      </Helmet>
      
      <RouterProvider router={router} />
    </>
  )
}

export default App
