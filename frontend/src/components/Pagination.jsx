function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="page-btn"
      >«</button>

      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="page-btn"
      >‹</button>

      {start > 1 && <span className="page-dots">...</span>}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`page-btn ${p === page ? 'active' : ''}`}
        >{p}</button>
      ))}

      {end < totalPages && <span className="page-dots">...</span>}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="page-btn"
      >›</button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        className="page-btn"
      >»</button>
    </div>
  )
}

export default Pagination