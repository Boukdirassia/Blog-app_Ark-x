import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './index.css'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import PageTransition from './components/PageTransition'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import AddPost from './pages/AddPost'
import EditPost from './pages/EditPost'
import About from './pages/About'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ErrorBoundary>
          <div className="app-container">
            <Navbar />
            
            <main className="main-content">
              <ErrorBoundary>
                <Suspense fallback={<div className="notion-spinner-container"><LoadingSpinner text="Chargement..." /></div>}>
                  <PageTransition>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/post/:id" element={<PostDetail />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/about" element={<About />} />
                      
                      {/* Routes protégées */}
                      <Route path="/add-post" element={
                        <ProtectedRoute>
                          <AddPost />
                        </ProtectedRoute>
                      } />
                      <Route path="/edit-post/:id" element={
                        <ProtectedRoute>
                          <EditPost />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </PageTransition>
                </Suspense>
              </ErrorBoundary>
            </main>
            
            <Footer />
          </div>
          </ErrorBoundary>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  )
}

// Simple 404 page
const NotFound = () => (
  <div className="container py-4 text-center">
    <h1>404 - Page Non Trouvée</h1>
    <p className="mb-4">La page que vous recherchez n'existe pas.</p>
    <a href="/" className="btn btn-primary">Retour à l'accueil</a>
  </div>
)

export default App
