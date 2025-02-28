# Jump'In

Jump'In est une application qui permet aux utilisateurs de se regrouper par centres d'intérêt en rejoignant des guildes. Chaque guilde propose des défis (challenges) que les utilisateurs peuvent créer, sauvegarder ou compléter. L'application propose également un classement des meilleurs utilisateurs par guilde et globalement, en fonction du nombre de défis complétés.



## Fonctionnalités

- Création et gestion de comptes utilisateurs : Authentification sécurisée via Supabase.

- Guildes : Les utilisateurs peuvent rejoindre des guildes correspondant à leurs centres d'intérêt.

- Défis (Challenges) :  Création, sauvegarde et complétion de défis.



- Classements :

    - Classement des meilleurs utilisateurs par guilde.

    - Classement général des utilisateurs avec le plus de défis complétés.

- CRD (Create, Read, Delete) : Gestion des défis, des posts et des guildes.

- Stockage d'images : Utilisation des buckets de Supabase pour stocker les images partagées par les utilisateurs.

## Architecture et technologies

### Backend
- Supabase : Utilisé pour la base de données PostgreSQL, l'authentification des utilisateurs et le stockage des images via les buckets.

- API Routes : Les routes API sont gérées dans le dossier servers/api/ avec Nuxt.js, permettant une communication fluide entre le frontend et la base de données.

## Frontend
- Nuxt.js : Framework basé sur Vue.js permettant le Server-Side Rendering (SSR), l'auto-import des composants, et une structure de projet organisée.

### Architecture

- `/pages` : les pages de mon app

- `/composants` : les composants de mon app (auto import basé sur le directory)

- `/server/api`: les routes API de mon app

- `/test/api`: les test de mon API

#### Modules Nuxt 

- Module Supabase pour une intégration facile avec l'authentification et la base de données.Permettant nottament de récupérer l'user auth avec `useSupabaseUser()`

- Module de test pour le TDD (Test-Driven Development).


## Design
Maquettage : Réalisé sur Figma pour concevoir l'interface utilisateur avant le développement du frontend.

## Points positifs et réussites
- Intégration fluide de Supabase : L'utilisation de Supabase a permis une gestion efficace de la base de données, de l'authentification et du stockage des images.

- Structure claire avec Nuxt.js : La séparation des dossiers servers/api/, pages/, et components/ a rendu le projet facile à maintenir et à développer.

- TDD (Test-Driven Development) : Les tests d'API ont permis de garantir la fiabilité des fonctionnalités principales.

- Classements dynamiques : La mise en place des classements par guilde et général a permis ajouté une dimension compétitive à l'application.

- Maquettage sur Figma : Le design préalable a facilité la mise en œuvre du frontend.


## Fonctionnalités manquantes :

- Expérience utilisateur : L'interface, bien que fonctionnelle, pourrait être améliorée avec plus d'animations et de transitions pour une meilleure expérience utilisateur.

## Conclusion
Jump'In est une application qui remplit son objectif principal : regrouper les utilisateurs par centres d'intérêt et leur permettre de relever des défis ensemble. Bien que certaines fonctionnalités soient manquantes et que l'interface puisse être améliorée, le projet m'a permis d'acquérir une bonne maîtrise de Nuxt.js, de Supabase et des concepts de développement full-stack. 

### Ce que j’ai appris
Grâce à ce projet, j'ai pu approfondir mes compétences en développement full-stack avec Nuxt.js et Supabase. J'ai appris à :

- Utiliser Nuxt.js pour le SSR, l'auto-import des composants et la gestion des routes API.

- Intégrer Supabase pour la base de données, l'authentification et le stockage d'images.

- Mettre en place des tests d'API pour valider les fonctionnalités principales.

- Concevoir une architecture de projet claire et organisée.

Ce projet m'a également permis de mieux comprendre les défis liés à la gestion d'une base de données relationnelle (PostgreSQL) et à la création d'une application communautaire dynamique.
