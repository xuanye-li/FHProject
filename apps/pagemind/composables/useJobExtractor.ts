import { useJobSummaryStore } from '@/stores/jobSummary'
import { useLlmStore } from '@/stores/llm'


function hasJobPostingSignals(title: string, content: string): boolean {
  const jobKeywords = [
    'job',
    'hiring',
    'vacancy',
    'career',
    'apply now',
    'position',
    'role',
    'salary',
    'compensation',
    'requirements',
    'responsibilities',
    'benefits',
    'full-time',
    'part-time'
  ]

  const combined = (title + ' ' + content).toLowerCase()
  let matches = 0

  for (const keyword of jobKeywords) {
    if (combined.includes(keyword)) {
      matches++
      if (matches >= 2) return true
    }
  }

  return false
}

async function verifyAndExtractJobPosting(title: string, content: string) {
  const llm = useLlmStore()
  const jobStore = useJobSummaryStore()

  const prompt = `
Determine if the following webpage is a job posting.

If it IS a job posting, respond ONLY with a JSON object:
{
  "job_title": "...",
  "company": "...",
  "salary": "...",
  "location": "...",
  "requirements": ["..."],
  "keywords": ["..."]
}

If it is NOT a job posting, respond exactly with:
job_posting: false

---
Title: ${title}
Content:
${content.slice(0, 6000)}
`

  try {
    const res = await fetch(llm.selectedModel.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: llm.selectedModel.id,
        messages: [
          { role: 'system', content: 'You are a strict classifier for job postings.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0,
      }),
    })

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!reply) return

    if (reply.startsWith('{')) {
      const parsed = JSON.parse(reply)
      if (parsed.job_title) {
        jobStore.setJobSummary(parsed)
        console.log('✅ Verified job posting:', parsed)
      }
    } else {
      console.log('Not a job posting:', reply)
    }
  } catch (err) {
    console.error('Job posting verification failed:', err)
  }
}

export async function useJobExtractor(title: string, content: string) {
  const looksLikeJob = hasJobPostingSignals(title, content)
  if (looksLikeJob) {
    console.log('Likely job posting detected → verifying with LLM...')
    await verifyAndExtractJobPosting(title, content)
  } else {
    console.log('No strong job posting signals found.')
  }
}
