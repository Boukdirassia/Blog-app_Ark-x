import { Link } from 'react-router-dom';
import { Mail, Phone, Home, PlusCircle, FileText, Github, Twitter, Linkedin, Feather, Sparkles, Heart } from 'lucide-react';
import Logo from './Logo';
import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="modern-footer">
      <div className="footer-background">
        <div className="footer-gradient"></div>
        <div className="footer-pattern"></div>
        <div className="footer-orbs">
          <div className="footer-orb footer-orb-1"></div>
          <div className="footer-orb footer-orb-2"></div>
        </div>
      </div>
      
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-brand-section">
            <div className="footer-logo">
              <Logo />
            </div>
            <p className="footer-description">
              Une plateforme moderne pour partager vos idées, histoires et expériences avec le monde.
            </p>
            <div className="footer-social-links">
              <a href="#" className="footer-social-btn" aria-label="Github">
                <Github size={20} />
              </a>
              <a href="#" className="footer-social-btn" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="footer-social-btn" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="footer-nav-section">
            <h4 className="footer-section-title">Navigation</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/" className="footer-nav-link">
                  <Home size={16} />
                  <span>Accueil</span>
                </Link>
              </li>
              <li>
                <Link to="/posts" className="footer-nav-link">
                  <FileText size={16} />
                  <span>Articles</span>
                </Link>
              </li>
              <li>
                <Link to="/add-post" className="footer-nav-link">
                  <PlusCircle size={16} />
                  <span>Nouveau</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-contact-section">
            <h4 className="footer-section-title">Contact</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <div className="contact-icon">
                  <Mail size={18} />
                </div>
                <span>contact@blogapp.com</span>
              </div>
              <div className="footer-contact-item">
                <div className="contact-icon">
                  <Phone size={18} />
                </div>
                <span>+2121234567</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
