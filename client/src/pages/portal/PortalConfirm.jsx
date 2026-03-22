// This page is not actually rendered by React — the confirm/decline
// links go directly to the server (/api/portal/confirm/:token).
// This component handles the case where someone navigates to /portal/confirm
// without a token (e.g. the redirect after HTML page load).
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PortalConfirm() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/portal/dashboard'); }, []);
  return null;
}
