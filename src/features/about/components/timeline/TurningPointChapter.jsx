import Chapter from './Chapter'

export default function TurningPointChapter() {
  return (
    <Chapter
      icon="⚡"
      year="2024 — The Turning Point"
      title="I got laid off. Because of AI."
      accentClass="bg-warning/5"
      borderClass="border-warning/25"
      headerClass="bg-warning/10 border-warning/20"
    >
      <p>
        In 2024, my company let me go. The reason? AI. The very technology I'd
        spent years working alongside was now displacing the roles around it —
        including mine. I'd be lying if I said I wasn't shaken. I was shocked,
        lost, and honestly a little angry.
      </p>
      <p>
        But sitting with that uncertainty, something became clear: I wanted work
        that required being genuinely human. Face-to-face. Present.
        Irreplaceable. Real estate kept coming back to me — a career built on
        trust, relationships, and showing up in person. Hard to automate. Easy
        to love.
      </p>
      <div className="rounded-xl border-l-4 border-warning bg-warning/10 px-4 sm:px-5 py-4 !mt-4">
        <p className="text-base-content/75 italic leading-relaxed text-sm">
          "The irony isn't lost on me — a software engineer, displaced by AI,
          pivoting to one of the most human-centered industries there is."
        </p>
      </div>
    </Chapter>
  )
}
