# SGRH — Système de Gestion des Ressources Humaines

Projet réalisé avec :

- Backend : Spring Boot
- Frontend : React + Vite
- Base de données : MySQL
- Authentification : JWT
- Build Tool : Maven

---

# Structure du projet

```bash
SGRH/
│
├── back/      # Backend Spring Boot
├── front/     # Frontend React
└── README.md
```

---

# Technologies utilisées

## Backend
- Java 17
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Maven
- MySQL

## Frontend
- React
- Vite
- Axios
- React Router DOM

---

# Configuration Backend

## 1. Ouvrir le backend

Ouvrir le dossier :

```bash
back
```

dans IntelliJ.

---

## 2. Configurer MySQL

Créer une base de données :

```sql
CREATE DATABASE sgrh_db;
```

---

## 3. Vérifier application.properties

Fichier :

```bash
back/src/main/resources/application.properties
```

Configuration :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sgrh_db
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE

spring.jpa.hibernate.ddl-auto=update

server.port=8080

spring.web.resources.static-locations=file:uploads/
```

---

## 4. Installer les dépendances Maven

Dans IntelliJ :

- Maven → Reload Project

ou terminal :

```bash
mvn clean install
```

---

## 5. Lancer le backend

Lancer :

```bash
BackApplication.java
```

Le backend tourne sur :

```bash
http://localhost:8080
```

---

# Configuration Frontend

## 1. Ouvrir le frontend

Ouvrir :

```bash
front
```

dans VS Code.

---

## 2. Installer les dépendances

Dans le terminal :

```bash
npm install
```

---

## 3. Lancer React

```bash
npm run dev
```

Frontend disponible sur :

```bash
http://localhost:5173
```

---

# Authentification

Le système utilise JWT.

Rôles disponibles :

- ADMIN
- RH
- EMPLOYE

---

# Comptes de test

## RH

```text
Email : rh@gmail.com
Mot de passe : rh@gmail.com
```

## Employés

Les employés utilisent :

```text
mot de passe = email
```

Exemple :

```text
Email : nadia@gmail.com
Mot de passe : nadia@gmail.com
```

---

# Modules implémentés

## Gestion des employés
- CRUD employés
- départements
- postes

## Gestion des congés
- demandes congés
- validation RH
- refus RH

## Gestion des salaires
- fiches de paie

## Recrutement
- offres d'emploi
- candidatures
- changement statut candidatures
- consultation CV

## Dashboard RH
- statistiques dynamiques
- suivi candidatures
- suivi congés

---

# CV des candidats

Les CV sont stockés ici :

```bash
back/uploads/cv/
```

Exemple :

```bash
cv_hajar.pdf
cv_mehdi.pdf
```

Le chemin stocké en base :

```text
cv/cv_hajar.pdf
```

---

# Git

## Récupérer les dernières modifications

```bash
git pull
```

## Push modifications

```bash
git add .
git commit -m "message"
git push
```

---

# Routes principales Frontend

## Login

```bash
/
```

## Dashboard RH

```bash
/rh
```

## Gestion candidatures RH

```bash
/rh/candidatures
```

---

# Routes API principales

## Auth

```bash
POST /api/auth/login
POST /api/auth/register
```

## Employés

```bash
GET /api/employes
POST /api/employes
```

## Congés

```bash
GET /api/conges
POST /api/conges
```

## Recrutement

```bash
GET /api/offres
POST /api/offres

GET /api/candidatures
POST /api/candidatures
```

---

# Fonctionnalités restantes

- dashboard employé
- dashboard admin
- gestion complète employés côté frontend
- gestion congés frontend
- gestion salaires frontend
- upload réel des CV   :  DONE
- responsive design
- notifications
- logout

---

# Important

Toujours :
1. lancer MySQL
2. lancer backend Spring Boot
3. lancer frontend React

sinon le projet ne fonctionnera pas correctement.