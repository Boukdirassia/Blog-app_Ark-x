const About = () => {
  return (
    <div className="container py-4">
      <div className="post-detail">
        <h1 className="mb-4">À propos de Blog App</h1>
        
        <div className="post-detail-content">
          <p>
            Bienvenue sur Blog App, une plateforme moderne pour partager vos idées, 
            histoires et expériences avec le monde entier.
          </p>
          
          <p>
            Notre application a été conçue pour offrir une expérience utilisateur 
            fluide et agréable, avec une interface élégante et des fonctionnalités 
            intuitives.
          </p>
          
          <h2>Fonctionnalités</h2>
          <ul>
            <li>Création et édition d'articles</li>
            <li>Recherche par mots-clés</li>
            <li>Système de tags pour catégoriser vos articles</li>
            <li>Pagination pour naviguer facilement entre les articles</li>
            <li>Tri par date ou par titre</li>
            <li>Interface responsive adaptée à tous les appareils</li>
          </ul>
          
          <h2>Technologies utilisées</h2>
          <p>
            Cette application a été développée avec les technologies suivantes :
          </p>
          <ul>
            <li>Frontend : React, React Router, CSS moderne</li>
            <li>Backend : Node.js, Express, MongoDB</li>
            <li>API : RESTful avec JSON</li>
          </ul>
          
          <h2>Contact</h2>
          <p>
            Pour toute question ou suggestion, n'hésitez pas à nous contacter à 
            l'adresse suivante : contact@blogapp.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
