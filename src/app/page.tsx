'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShortUrl('')
    setCopied(false)

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err?.error ?? 'Failed to create short link')
      }

      const { shortUrl } = await res.json()
      setShortUrl(shortUrl)
      setUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container">
      <div className="content-wrapper">
        {/* 頁面大標 */}
        <h1 className="main-title">
          Short URL
        </h1>

        {/* 白底卡片 */}
        <div className="card">
          {/* 卡片內次標 */}
          <h2 className="card-title">
            Paste the URL to be shortened
          </h2>

          {/* 表單 */}
          <form onSubmit={handleSubmit} className="form">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter the link here"
              required
              disabled={loading}
              className="form-input"
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="form-button"
            >
              {loading ? 'Loading…' : 'Shorten URL'}
            </button>
          </form>

          {/* 錯誤訊息 */}
          {error && (
            <p className="error-message">{error}</p>
          )}

          {/* 成功顯示短鏈 */}
          {shortUrl && (
            <div className="result-section">
              <p className="result-label">
                Your short link:
              </p>
              <div className="result-url-container">
                <span className="result-url">
                  {shortUrl}
                </span>
              </div>
              <button
                onClick={copyToClipboard}
                className={`copy-button ${copied ? 'success' : 'default'}`}
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          )}

          {/* 說明文字 */}
          <div className="description">
            <p className="main-desc">
              ShortURL is a free tool to shorten URLs and generate short links
            </p>
            <p className="sub-desc">
              URL shortener allows to create a shortened link making it easy to share
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}