// src/features/account/components/AvatarCircle.jsx

export default function AvatarCircle({ username }) {
  const initial = username ? username.charAt(0).toUpperCase() : 'U'

  return (
    <div
      className="flex items-center justify-center rounded-full w-24 h-24 select-none"
      style={{
        background:
          'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%)',
        boxShadow:
          '0 0 0 4px white, 0 0 0 6px #e0e7ff, 0 8px 24px rgba(99,102,241,0.25)'
      }}
    >
      <span
        className="text-white font-bold"
        style={{ fontSize: '2.25rem', letterSpacing: '-0.5px', lineHeight: 1 }}
      >
        {initial}
      </span>
    </div>
  )
}
