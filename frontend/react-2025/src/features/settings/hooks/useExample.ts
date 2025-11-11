import { useState } from 'react'
import type { Example } from '../types'

export const useExample = () => {
  const [example, setExample] = useState<Example>('a')

  return {
    example,
    setExample,
  }
}

/**
 * 對 React 而言，use 開頭的 function 都是 hook，跟 component 一樣是為了減少重複程式碼。
 * 差別在於包成 component 就會觸發 render，如果只是要取資料或邏輯處理之類的可以包成 hook 就好。
 * 雖説拿了資料一定要 re-render 的吧，但可能會有資料相同但 UI 差異的情況，例如相同的時間但呈現在數位時鐘、指針時鐘上，
 * 這時就可以把拿時間的邏輯包成 hook。TanStack 的 useQuery 本身也是一個 Hook。
 */
