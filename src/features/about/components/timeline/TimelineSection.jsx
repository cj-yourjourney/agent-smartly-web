import Connector from './Connector'
import BuilderChapter from './BuilderChapter'
import TurningPointChapter from './TurningPointChapter'
import ProblemChapter from './ProblemChapter'
import BuildChapter from './BuildChapter'
import ProofChapter from './ProofChapter'
import MissionChapter from './MissionChapter'

export default function TimelineSection() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-1">
      <BuilderChapter />
      <Connector />
      <TurningPointChapter />
      <Connector />
      <ProblemChapter />
      <Connector />
      <BuildChapter />
      <Connector />
      <ProofChapter />
      <Connector />
      <MissionChapter />
    </div>
  )
}
