#!/bin/bash

# Construire l'application Next.js en mode statique
echo "Construction de l'application Next.js en mode statique..."
npm run build

# Créer un dossier pour le déploiement
echo "Préparation des fichiers pour le déploiement..."
mkdir -p deploy-static

# Copier les fichiers nécessaires
cp -r out/* deploy-static/
cp .htaccess deploy-static/

echo "Fichiers prêts pour le déploiement statique !"
echo "Utilisez un client FTP pour téléverser le contenu du dossier 'deploy-static' vers le dossier public_html de votre hébergement Hostinger." 