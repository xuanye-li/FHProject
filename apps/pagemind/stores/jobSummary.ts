import type { JobSummary } from '@/types/job-summary'
import { defineStore } from 'pinia'

interface JobSummaryState {
  data: JobSummary | null
  activeSection: keyof JobSummary | null
}

export const useJobSummaryStore = defineStore('jobSummary', {
  state: (): JobSummaryState => ({
    data: null,
    activeSection: null,
  }),

  actions: {
    setJobSummary(summary: JobSummary) {
      this.data = summary
    },
    clearJobSummary() {
      this.data = null
      this.activeSection = null
    },
    setActiveSection(section: keyof JobSummary) {
      this.activeSection = section
    },
  },
})
