import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PlusCircle, Home, Info, FileText, Settings, User, LogIn, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <div className="navbar-left">
          <Logo />
        </div>
        
        
        <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Menu">
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Home size={16} />
            <span>Accueil</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/add-post" className={`navbar-link ${location.pathname === '/add-post' ? 'active' : ''}`}>
                <PlusCircle size={16} />
                <span>Nouveau</span>
              </Link>
              <Link to="/profile" className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                <User size={16} />
                <span>{user?.username}</span>
              </Link>
              <button 
                onClick={logout} 
                className="navbar-link logout-button"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}>
                <LogIn size={16} />
                <span>Connexion</span>
              </Link>
              <Link to="/register" className={`navbar-link ${location.pathname === '/register' ? 'active' : ''}`}>
                <User size={16} />
                <span>Inscription</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
