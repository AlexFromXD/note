import { Button } from '@/components/ui/button'
import { useState } from 'react'
import ExecutionPreferencesSwitch from './components/ExecutionPreferencesSwitch'
import ResponsePreferencesSwitch from './components/ResponsePreferencesSwitch'
import LanguageSelector from './LanguageSelector'

function Settings() {
  // 關於 useState: https://medium.com/@xyz030206/%E9%97%9C%E6%96%BC-usestate-%E4%BD%A0%E9%9C%80%E8%A6%81%E7%9F%A5%E9%81%93%E7%9A%84%E4%BA%8B-5c8c4cdda82c
  // =======================================================================================
  // 1. setXxx 是非同步的，所以會有 race condition
  //     const [count, setCount] = useState(0)
  //     錯誤： <button onClick={() => setCount(count + 1)}>加一</button>
  //     正確： <button onClick={() => setCount(prevCount => prevCount + 1)}>加一</button>
  // =======================================================================================
  // 2. 每次 re-render 時都還是會跑一次 initial value
  //      const [state, setState] = useState(someExpensiveComputation(props));
  //    改用 function 就會變成 lazy initialization，只在初始 render 時執行一次
  //      const [state, setState] = useState(() => {
  //        const initialState = someExpensiveComputation(props);
  //        return initialState;
  //      });
  const [language, setLanguage] = useState('english')
  const [isShowInitialQueryIdeas, setIsShowInitialQueryIdeas] = useState(true)
  const [isAnswerWithInsights, setIsAnswerWithInsights] = useState(true)
  const [isShowQueryReferences, setIsShowQueryReferences] = useState(true)
  const [isGenerateFollowUpQuestions, setIsGenerateFollowUpQuestions] =
    useState(true)
  const [isDefaultCollapseAIAnswer, setIsDefaultCollapseAIAnswer] =
    useState(true)
  const [isDirectExecuteSQL, setIsDirectExecuteSQL] = useState(true)
  const [
    isShowComplexQueryChainOfThought,
    setIsShowComplexQueryChainOfThought,
  ] = useState(true)

  // Q: 每個開關獨立 setState vs 一個 Preferences Object 的差異？
  // A: 共用 Object 會造成動開關 A 時，B, C, D ... 也會重新 render（因為 Object reference 變了）
  const handleCancel = () => {
    // Reset to default values
    setLanguage('english')
    setIsShowInitialQueryIdeas(true)
    setIsAnswerWithInsights(true)
    setIsShowQueryReferences(true)
    setIsGenerateFollowUpQuestions(true)
    setIsDefaultCollapseAIAnswer(true)
    setIsDirectExecuteSQL(true)
    setIsShowComplexQueryChainOfThought(true)
  }

  const handleSave = () => {
    // TODO: Save settings to backend/state management
    console.log('Saving settings...', {
      language,
      isShowInitialQueryIdeas,
      isAnswerWithInsights,
      isShowQueryReferences,
      isGenerateFollowUpQuestions,
      isDefaultCollapseAIAnswer,
      isDirectExecuteSQL,
      isShowComplexQueryChainOfThought,
    })
  }

  return (
    // 有裝 Tailwind CSS IntelliSense 就可以看到 render 出來的 css & 提示
    <div className="mx-auto mt-14 mb-6 flex max-w-[480px] flex-col">
      {/* Page Header */}
      <div className="mb-8">
        <h3 className="mb-2 text-3xl font-bold">Settings</h3>
        <p className="text-muted-foreground text-sm">
          Customize how queries are generated, executed, and displayed.
        </p>
      </div>

      <div className="space-y-8">
        <LanguageSelector value={language} onValueChange={setLanguage} />

        <div className="space-y-6">
          <h4 className="text-lg font-semibold">AI Response Preferences</h4>

          <ResponsePreferencesSwitch
            checked={isShowInitialQueryIdeas}
            onCheckedChange={setIsShowInitialQueryIdeas}
            label="Show Initial Query Ideas"
            onDescription="Provides example questions to guide data exploration."
            offDescription="Offers a cleaner input area, requires manual question input."
          />
          <ResponsePreferencesSwitch
            checked={isAnswerWithInsights}
            onCheckedChange={setIsAnswerWithInsights}
            label="Answer with Insights"
            onDescription="Provides contextual insights and recommendations, but responses are longer."
            offDescription="Delivers direct, concise answers for faster responses."
          />
          <ResponsePreferencesSwitch
            checked={isShowQueryReferences}
            onCheckedChange={setIsShowQueryReferences}
            label="Show Query References"
            onDescription="Displays data sources for transparency and trust."
            offDescription="Hides references for a more concise answer display."
          />
          <ResponsePreferencesSwitch
            checked={isGenerateFollowUpQuestions}
            onCheckedChange={setIsGenerateFollowUpQuestions}
            label="Generate Suggested Follow-up Questions"
            onDescription="Suggests related questions for deeper analysis."
            offDescription="No follow-up suggestions, for independent exploration."
          />
          <ResponsePreferencesSwitch
            checked={isDefaultCollapseAIAnswer}
            onCheckedChange={setIsDefaultCollapseAIAnswer}
            label="Default Collapse AI Answer"
            onDescription="Collapses extra details (insights, references) for a cleaner answer view."
            offDescription="Expands all answer details by default, showing full information."
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            Query Execution Preferences (advance)
          </h2>
          <ExecutionPreferencesSwitch
            checked={isDirectExecuteSQL}
            onCheckedChange={setIsDirectExecuteSQL}
            label="Direct execute AI-generated SQL (skip confirmation)"
          />
          <ExecutionPreferencesSwitch
            checked={isShowComplexQueryChainOfThought}
            onCheckedChange={setIsShowComplexQueryChainOfThought}
            label="Show Complex Business Query Chain-of-Thought"
          />
        </div>
      </div>

      <div className="mt-16 flex justify-end gap-3">
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </div>
  )
}

export default Settings
