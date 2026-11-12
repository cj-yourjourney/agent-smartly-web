// features/home/components/FooterSection.jsx
export default function FooterSection() {
  return (
    <footer className="footer footer-center p-10 pb-24 lg:pb-10 bg-base-200 text-base-content border-t border-base-300">
      <div>
        <p className="font-bold text-lg">
          <span className="text-primary">Agent</span>Smartly
        </p>
        <p className="text-base-content/50 text-sm">
          California Real Estate Salesperson Exam Prep
        </p>
        <p className="text-base-content/40 text-xs mt-2">
          © {new Date().getFullYear()} AgentSmartly. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
