import Chapter from './Chapter'

export default function ProblemChapter() {
  return (
    <Chapter
      icon="😤"
      year="2024 — The Problem"
      title="Every prep tool I tried made me feel more lost"
    >
      <p>
        I enrolled in my pre-licensing course and threw myself into studying. I
        bought the prep books. I used the flashcard apps. I paid for a
        third-party exam site. None of them felt right.
      </p>
      <p>
        The problem wasn't the volume of content — it was that there was{' '}
        <span className="font-semibold text-base-content">too much of it</span>.
        Hundreds of random questions across topics that weren't weighted to the
        real exam. No clear starting point. No way to know if the studying was
        working. I remember sitting at my kitchen table at 11pm, grinding
        through practice questions, thinking:{' '}
        <span className="font-semibold text-base-content">
          I have no idea if I'm actually ready or just spinning my wheels.
        </span>
      </p>
      <p>
        The questions didn't match the official DRE blueprint. The explanations
        were shallow. I was six weeks out from my exam date and genuinely
        couldn't tell if I was close or miles away.
      </p>
      <div className="rounded-xl border-l-4 border-error/40 bg-error/5 px-4 sm:px-5 py-4 !mt-4">
        <p className="text-base-content/75 italic leading-relaxed text-sm">
          "The worst part wasn't the hard questions. It was the uncertainty —
          not knowing if the studying was working. That's exactly what I built
          Agent Smartly to fix."
        </p>
      </div>
      <p>
        As an engineer, there's a thought pattern that's hard to turn off:{' '}
        <span className="font-semibold text-base-content">
          if I can't find the right solution, I'll build it.
        </span>
      </p>
    </Chapter>
  )
}
