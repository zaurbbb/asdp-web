import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/ask/'

const suggestions = [
  'How is AI used to detect early-stage Alzheimer’s disease?',
  'What does research say about climate-resilient agriculture strategies?',
  'Summarize peer-reviewed findings on AI-assisted drug discovery pipelines.',
  'What are emerging best practices for cybersecurity in healthcare IoT devices?',
]

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchSummary = async (query) => {
    const trimmed = query.trim()
    if (!trimmed) {
      setError('Enter a research topic to explore.')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
      })

      if (!res.ok) {
        const fallbackMessage = 'Something went wrong. Please try again.'
        let detail = fallbackMessage
        try {
          const errorBody = await res.json()
          detail = errorBody.detail || errorBody.error || fallbackMessage
        } catch {
          // ignore parsing issues
        }
        throw new Error(detail)
      }

      const data = await res.json()
      setResponse({
        title: data.first_answer ?? 'No title returned',
        summary: data.second_answer ?? 'No summary available for this topic yet.',
      })
    } catch (err) {
      setResponse(null)
      setError(err.message || 'Unable to reach the research service.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    fetchSummary(prompt)
  }

  const handleSuggestion = (text) => {
    setPrompt(text)
    fetchSummary(text)
  }

  const hasResult = Boolean(response)

  return (
    <div className="app">
      <header className="hero">
        <span className="eyebrow">Research AI</span>
        <h1>Find the research that answers your questions</h1>
        <p>
          Describe the topic you&apos;re exploring and we&apos;ll surface peer-reviewed
          research along with a concise summary, ready to share with your team.
        </p>
      </header>

      <main className="layout">
        <section className="query-panel">
          <form className="query-form" onSubmit={handleSubmit}>
            <label className="query-label" htmlFor="prompt">
              What would you like to learn?
            </label>
            <div className="query-input-row">
              <input
                id="prompt"
                name="prompt"
                type="text"
                placeholder="e.g. Key takeaways from recent AI-assisted drug discovery trials"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                aria-label="Research topic prompt"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Searching…' : 'Generate summary'}
              </button>
            </div>
            <p className="helper-text">
              We search for high-quality papers and craft a readable 200-word summary so you
              can stay focused on decisions, not digging through PDFs.
            </p>
          </form>

          <div className="suggestions">
            <span>Try one of these:</span>
            <div className="suggestion-buttons">
              {suggestions.map((item) => (
                <button
                  key={item}
                  className="pill"
                  type="button"
                  onClick={() => handleSuggestion(item)}
                  disabled={isLoading}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="results-panel">
          {error && (
            <div role="alert" className="status-card error">
              <strong>We hit a snag.</strong>
              <span>{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="status-card loading">
              <div className="loader" aria-hidden="true" />
              <p>
                Looking through the latest journals, conference proceedings, and trusted
                databases…
              </p>
            </div>
          )}

          {!isLoading && hasResult && response && (
            <article className="result-card">
              <header>
                <h2>{response.title}</h2>
              </header>
              <p>{response.summary}</p>
            </article>
          )}

          {!isLoading && !hasResult && !error && (
            <div className="status-card placeholder">
              <h3>Evidence-backed answers, moments away</h3>
              <p>
                Submit a question and receive a curated research highlight plus a concise
                summary without leaving the page.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="footnote">
        <span>
          Powered by your Research AI API · Make sure your backend is running at{' '}
          <code>{API_URL}</code>
        </span>
      </footer>
    </div>
  )
}

export default App
