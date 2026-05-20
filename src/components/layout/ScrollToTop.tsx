import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top on every route change.
 * Fixes the blank/misaligned screen when navigating from the
 * bottom of the home page (e.g. "Start Order" button) to login/register.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
