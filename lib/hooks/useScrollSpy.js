import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for scroll spying.
 * @param {string[]} ids - Array of element IDs to spy on.
 * @param {IntersectionObserverInit} [options] - IntersectionObserver options.
 * @returns {string|null} The ID of the currently active element.
 */
export const useScrollSpy = (
  ids,
  options = { rootMargin: '0% 0% -80% 0%' }
) => {
  const [activeId, setActiveId] = useState(null)
  const observer = useRef(null)
  const observerCallback = (entries) => {
    // Find the first intersecting entry from the top of the viewport
    const intersectingEntry = entries.find(entry => entry.isIntersecting);
    if (intersectingEntry) {
      setActiveId(intersectingEntry.target.id);
    }
  };

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(observerCallback, options)

    const { current: currentObserver } = observer
    
    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        currentObserver.observe(element)
      }
    })

    return () => {
      if (currentObserver) {
        currentObserver.disconnect()
      }
    }
  }, [ids.join(','), options]) // Rerun effect if ids change

  return activeId
}
