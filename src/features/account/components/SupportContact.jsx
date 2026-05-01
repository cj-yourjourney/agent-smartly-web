// src/features/account/components/SupportContact.jsx
import { Mail } from 'lucide-react'

const SUPPORT_EMAIL = 'agentsmartly@gmail.com'

export default function SupportContact() {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1 min-h-[52px]">
      <Mail className="h-3.5 w-3.5 text-base-content/30 shrink-0" />
      <p className="text-xs text-base-content/50 leading-relaxed">
        Questions? Email{' '}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="text-primary font-semibold hover:underline"
        >
          {SUPPORT_EMAIL}
        </a>
      </p>
    </div>
  )
}
