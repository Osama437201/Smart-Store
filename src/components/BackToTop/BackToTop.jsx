import './BackToTop.css'

function BackToTop() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="back-to-top" onClick={handleClick}>
      <span className="back-to-top-text">Back to top</span>
    </div>
  )
}

export default BackToTop