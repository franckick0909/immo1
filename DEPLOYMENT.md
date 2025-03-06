# Guide de déploiement sur Hostinger

Ce guide vous explique comment déployer votre application Next.js sur Hostinger avec le domaine immo1.shop.

## Prérequis

- Un compte Hostinger avec un hébergement web
- Le domaine immo1.shop configuré dans Hostinger
- Un client FTP (FileZilla, WinSCP, etc.)
- Node.js et npm installés sur votre machine locale

## Étapes de déploiement

### 1. Préparation des fichiers

Exécutez le script de déploiement pour préparer les fichiers :

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Exécuter le script
./deploy.sh
```

Ce script va :

- Construire votre application Next.js
- Créer un dossier `deploy` avec tous les fichiers nécessaires

### 2. Configuration de l'hébergement Hostinger

1. Connectez-vous à votre compte Hostinger
2. Accédez à votre panneau d'hébergement
3. Configurez votre domaine immo1.shop s'il n'est pas déjà configuré
4. Activez HTTPS pour votre domaine (important pour Next.js et Auth.js)

### 3. Téléversement des fichiers

Utilisez un client FTP pour téléverser les fichiers :

1. Connectez-vous à votre serveur FTP avec les identifiants fournis par Hostinger
2. Naviguez vers le dossier racine de votre site (généralement `public_html`)
3. Téléversez tout le contenu du dossier `deploy` vers ce dossier

### 4. Configuration du Node.js sur Hostinger

Hostinger propose Node.js dans certains plans d'hébergement. Si disponible :

1. Accédez au panneau de contrôle Hostinger
2. Recherchez la section "Node.js"
3. Activez Node.js pour votre domaine
4. Configurez le point d'entrée sur `.next/server/app/page.js`

Si Node.js n'est pas disponible dans votre plan, envisagez de passer à un plan supérieur ou d'utiliser un service d'hébergement spécialisé pour les applications Node.js comme Vercel ou Netlify.

### 5. Vérification du déploiement

1. Visitez https://immo1.shop pour vérifier que votre site fonctionne correctement
2. Testez les fonctionnalités d'authentification et d'envoi d'emails
3. Vérifiez les journaux d'erreurs si quelque chose ne fonctionne pas

## Dépannage

- **Erreur 500** : Vérifiez les journaux d'erreurs sur Hostinger
- **Problèmes d'authentification** : Assurez-vous que les variables d'environnement sont correctement configurées
- **Emails non envoyés** : Vérifiez les paramètres SMTP et les journaux d'erreurs

## Mise à jour de l'application

Pour mettre à jour votre application :

1. Effectuez vos modifications localement
2. Exécutez à nouveau le script `deploy.sh`
3. Téléversez les fichiers mis à jour via FTP

## Ressources supplémentaires

- [Documentation Next.js sur le déploiement](https://nextjs.org/docs/deployment)
- [Centre d'aide Hostinger](https://www.hostinger.fr/tutoriels)
- [Documentation Auth.js](https://authjs.dev/getting-started/deployment)
