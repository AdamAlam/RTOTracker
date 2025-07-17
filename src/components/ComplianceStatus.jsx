function ComplianceStatus({ isCompliant }) {
  return (
    <div className={`compliance-status ${isCompliant ? 'compliant' : 'non-compliant'}`}>
      <div className="status-indicator"></div>
      <div className="status-text">
        {isCompliant ? '✅ In Compliance' : '❌ Not in Compliance'}
      </div>
    </div>
  )
}

export default ComplianceStatus