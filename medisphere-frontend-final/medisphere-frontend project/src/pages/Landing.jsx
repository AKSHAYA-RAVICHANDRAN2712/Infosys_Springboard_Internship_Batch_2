import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="ms-landing">
      <style>{`
        .ms-landing {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(1100px 500px at 85% -10%, rgba(47,111,237,0.20), transparent 60%),
            radial-gradient(700px 400px at 5% 110%, rgba(28,145,132,0.14), transparent 60%),
            var(--paper);
        }
        .ms-landing-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem clamp(1.25rem, 5vw, 4rem);
        }
        .ms-landing-hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem 1.5rem 4rem;
        }
        .ms-landing-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--teal-500);
          background: var(--mint-100);
          border: 1px solid rgba(47,111,237,0.3);
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          margin-bottom: 1.5rem;
        }
        .ms-landing-hero h1 {
          font-size: clamp(2.1rem, 5vw, 3.4rem);
          font-weight: 600;
          max-width: 780px;
          line-height: 1.15;
          margin-bottom: 1.1rem;
        }
        .ms-landing-hero p {
          max-width: 560px;
          color: var(--ink-soft);
          font-size: 1.05rem;
          margin-bottom: 2.25rem;
        }
        .ms-landing-cta {
          display: flex;
          gap: 0.9rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .ms-landing-cta .btn {
          padding: 0.7rem 1.6rem;
          font-weight: 500;
        }
        .ms-landing-footer {
          text-align: center;
          padding: 1.5rem;
          font-size: 0.8rem;
          color: var(--ink-soft);
          border-top: 1px solid var(--line);
        }
      `}</style>

      <nav className="ms-landing-nav">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-heart-pulse-fill fs-4 text-primary"></i>
          <span className="fs-5 fw-bold brand-font">MediSphere</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <Link to="/login" className="btn btn-outline-primary btn-sm">Sign in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </nav>

      <div className="ms-landing-hero">
        <span className="ms-landing-eyebrow">
          <i className="bi bi-shield-check"></i> FHIR-integrated care platform
        </span>
        <h1 className="brand-font">Care, coordinated — for every role, in one place.</h1>
        <p>
          MediSphere brings patients, doctors, receptionists and admins onto a single platform
          to manage records, appointments and care in real time.
        </p>
        <div className="ms-landing-cta">
          <Link to="/register" className="btn btn-primary btn-lg">
            Create an account
          </Link>
          <Link to="/login" className="btn btn-outline-primary btn-lg">
            Sign in
          </Link>
        </div>
      </div>

      <footer className="ms-landing-footer">
        © {new Date().getFullYear()} MediSphere. All rights reserved.
      </footer>
    </div>
  )
}
