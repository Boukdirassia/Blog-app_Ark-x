import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import '../styles/auth.css';

const Profile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        showSuccess(result.message);
        setEditMode(false);
      } else {
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => showError(error));
        } else {
          showError(result.message);
        }
      }
    } catch (error) {
      showError('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        showSuccess(result.message);
        setPasswordMode(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => showError(error));
        } else {
          showError(result.message);
        }
      }
    } catch (error) {
      showError('Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    showSuccess('Déconnexion réussie');
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Mon Profil</h2>
          <div className="profile-info">
            Membre depuis {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="profile-section">
          <h3>Informations personnelles</h3>
          {editMode ? (
            <form onSubmit={handleProfileSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  required
                  minLength="3"
                  maxLength="30"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="profile-actions">
                <button 
                  type="submit" 
                  className="profile-button"
                  disabled={loading}
                >
                  {loading ? 'Mise à jour...' : 'Sauvegarder'}
                </button>
                <button 
                  type="button" 
                  className="profile-button"
                  onClick={() => {
                    setEditMode(false);
                    setProfileData({
                      username: user.username,
                      email: user.email
                    });
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rôle:</strong> {user.role}</p>
              
              <div className="profile-actions">
                <button 
                  className="profile-button"
                  onClick={() => setEditMode(true)}
                >
                  Modifier le profil
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Sécurité</h3>
          {passwordMode ? (
            <form onSubmit={handlePasswordSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Mot de passe actuel</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="profile-actions">
                <button 
                  type="submit" 
                  className="profile-button"
                  disabled={loading}
                >
                  {loading ? 'Changement...' : 'Changer le mot de passe'}
                </button>
                <button 
                  type="button" 
                  className="profile-button"
                  onClick={() => {
                    setPasswordMode(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-actions">
              <button 
                className="profile-button"
                onClick={() => setPasswordMode(true)}
              >
                Changer le mot de passe
              </button>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Actions</h3>
          <div className="profile-actions">
            <button 
              className="profile-button danger"
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
