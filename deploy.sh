#!/bin/bash

# Construire l'application Next.js
echo "Construction de l'application Next.js..."
npm run build

# Créer un dossier pour le déploiement
echo "Préparation des fichiers pour le déploiement..."
mkdir -p deploy

# Copier les fichiers nécessaires
cp -r .next deploy/
cp -r public deploy/
cp -r node_modules deploy/
cp package.json deploy/
cp .env.local deploy/
cp .htaccess deploy/
cp next.config.ts deploy/

echo "Fichiers prêts pour le déploiement !"
echo "Utilisez un client FTP pour téléverser le contenu du dossier 'deploy' vers votre hébergement Hostinger." 