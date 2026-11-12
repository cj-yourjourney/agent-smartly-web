// features/home/components/how-it-works/HowItWorksSection.jsx
import ContrastCards from './ContrastCards'
import StepReview from './StepReview'
import StepPractice from './StepPractice'
import StepProgress from './StepProgress'
import StepDivider from './StepDivider'
import RepeatAndQuote from './RepeatAndQuote'

export default function HowItWorksSection() {
  return (
    <div className="py-24 px-4 bg-base-100 border-t border-base-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <p className="text-center text-primary font-bold tracking-widest text-xs uppercase mb-3">
          How It Works
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-center mb-4">
          Less Material. More Clarity. Faster Pass.
        </h2>
        <p className="text-center text-base-content/60 text-lg mb-10 max-w-2xl mx-auto">
          Most CA exam prep sites give you prep books, video lectures, and
          thousands of random questions — so much you don't know where to
          start. AgentSmartly does the opposite: only the essentials, in a
          clear order, with one tool for each step.
        </p>

        <ContrastCards />
        <StepReview />
        <StepDivider />
        <StepPractice />
        <StepDivider />
        <StepProgress />
        <RepeatAndQuote />
      </div>
    </div>
  )
}
