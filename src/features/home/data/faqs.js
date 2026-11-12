// features/home/data/faqs.js
export const PRICING_FAQ_PLACEHOLDER = '__PRICING_FAQ__'

export const faqs = [
  {
    q: 'How much does it cost?',
    // NOTE: price strings are generated at render time from pricingConfig.js — do not hardcode here
    a: PRICING_FAQ_PLACEHOLDER
  },
  {
    q: 'How many questions should I practice before the exam?',
    a: 'Most users who feel confident going into the exam have practiced between 300 and 500 questions. That gives you enough exposure to cover all 7 topics and their subtopics without burnout.'
  },
  {
    q: 'What accuracy score should I aim for?',
    a: "Users on AgentSmartly average around 75% accuracy. Aiming for 75–80% consistently across all topics is a strong signal that you're ready. If a specific topic is below 65%, focus there first."
  },
  {
    q: 'How many key concepts should I know?',
    a: "There are 144 key concepts mapped to the DRE exam. Most prepared users know around 70% (roughly 100–105 concepts) going in. You don't need to memorize every single one — focus on understanding, not rote memorization."
  },
  {
    q: 'How is this different from a prep book?',
    a: "Prep books give you static content. AgentSmartly tracks your progress, adapts to your weak areas, and surfaces exactly what you need to work on. You also get AI-powered explanations for any concept you don't understand."
  },
  {
    q: 'Does this cover the full DRE exam blueprint?',
    a: 'Yes. All 7 official DRE Salesperson Exam topics are covered, with questions weighted to match the real exam — so you spend more time on topics like Practice of Real Estate (25%) and less on lower-weight topics.'
  },
  {
    q: 'Do I need to create an account?',
    a: 'Yes, a free account is required to track your progress and save your practice history. Sign up takes under a minute — just an email and password, no credit card needed to start your 60-question free trial.'
  }
]
