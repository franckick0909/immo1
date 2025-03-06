# Guide de déploiement sur VPS Hostinger

Ce guide vous explique comment déployer votre application Next.js sur un VPS Hostinger avec le domaine immo1.shop.

## Prérequis

- Un compte Hostinger avec un plan VPS
- Le domaine immo1.shop configuré dans Hostinger
- Accès SSH à votre VPS
- Connaissances de base en administration Linux

## Étapes de déploiement

### 1. Souscrire à un plan VPS chez Hostinger

1. Connectez-vous à votre compte Hostinger
2. Accédez à la section VPS et choisissez un plan (au minimum 2GB RAM / 1 vCPU)
3. Complétez l'achat et attendez la mise en place du VPS

### 2. Configuration initiale du VPS

1. Connectez-vous à votre VPS via SSH :

   ```bash
   ssh root@votre_ip_vps
   ```

2. Mettez à jour le système :

   ```bash
   apt update && apt upgrade -y
   ```

3. Installez Node.js et npm :

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt-get install -y nodejs
   ```

4. Installez PM2 pour gérer votre application :

   ```bash
   npm install -g pm2
   ```

5. Installez Nginx comme proxy inverse :
   ```bash
   apt install -y nginx
   ```

### 3. Configuration du domaine

1. Configurez les enregistrements DNS de votre domaine immo1.shop pour pointer vers l'IP de votre VPS
2. Installez Certbot pour obtenir un certificat SSL :

   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

3. Configurez SSL pour votre domaine :
   ```bash
   certbot --nginx -d immo1.shop -d www.immo1.shop
   ```

### 4. Déploiement de l'application

1. Créez un utilisateur dédié pour l'application :

   ```bash
   adduser immoapp
   usermod -aG sudo immoapp
   ```

2. Passez à cet utilisateur :

   ```bash
   su - immoapp
   ```

3. Clonez votre dépôt Git :

   ```bash
   git clone votre_repo_git
   cd votre_repo_git
   ```

4. Installez les dépendances et construisez l'application :

   ```bash
   npm install
   npm run build
   ```

5. Configurez les variables d'environnement :

   ```bash
   cp .env.local.example .env.local
   nano .env.local
   ```

   Mettez à jour les variables avec les valeurs de production, notamment :

   ```
   NEXTAUTH_URL=https://immo1.shop
   ```

6. Démarrez l'application avec PM2 :
   ```bash
   pm2 start npm --name "immo-app" -- start
   pm2 save
   pm2 startup
   ```

### 5. Configuration de Nginx

1. Créez un fichier de configuration Nginx :

   ```bash
   sudo nano /etc/nginx/sites-available/immo1.shop
   ```

2. Ajoutez la configuration suivante :

   ```nginx
   server {
       listen 80;
       server_name immo1.shop www.immo1.shop;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Activez la configuration :

   ```bash
   sudo ln -s /etc/nginx/sites-available/immo1.shop /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. Exécutez Certbot pour ajouter SSL :
   ```bash
   sudo certbot --nginx -d immo1.shop -d www.immo1.shop
   ```

### 6. Vérification du déploiement

1. Visitez https://immo1.shop pour vérifier que votre site fonctionne correctement
2. Testez les fonctionnalités d'authentification et d'envoi d'emails
3. Vérifiez les journaux avec `pm2 logs` si quelque chose ne fonctionne pas

## Mise à jour de l'application

Pour mettre à jour votre application :

1. Connectez-vous à votre VPS
2. Passez à l'utilisateur de l'application : `su - immoapp`
3. Accédez au répertoire de l'application
4. Tirez les dernières modifications : `git pull`
5. Installez les dépendances si nécessaire : `npm install`
6. Reconstruisez l'application : `npm run build`
7. Redémarrez l'application : `pm2 restart immo-app`

## Ressources supplémentaires

- [Documentation Next.js sur le déploiement](https://nextjs.org/docs/deployment)
- [Documentation PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Documentation Nginx](https://nginx.org/en/docs/)
- [Documentation Certbot](https://certbot.eff.org/docs/)
