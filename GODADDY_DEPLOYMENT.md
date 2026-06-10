# Déploiement GoDaddy direct

Ce site JOS Travel est une application Next.js avec routes serveur, Supabase et discussion JOS Travel via OpenAI. Pour garder toutes les fonctionnalités, GoDaddy doit exécuter Node.js.

## Option compatible

Utiliser l'un de ces hébergements GoDaddy :

- Web Hosting Linux/cPanel avec "Setup Node.js App" disponible.
- VPS GoDaddy avec Node.js 20+.

Le Website Builder GoDaddy seul ne peut pas héberger ce projet complet, car il ne lance pas les routes serveur Next.js comme `/api/chat`, `/api/admin/stats` ou `/api/admin/credits`.

## DNS GoDaddy

Si l'application est hébergée chez GoDaddy, les DNS doivent pointer vers l'hébergement GoDaddy, pas vers Vercel.

À faire dans GoDaddy :

- Supprimer l'ancien enregistrement `A @ WebsiteBuilder Site` si le site n'utilise pas Website Builder.
- Garder les nameservers GoDaddy `ns25.domaincontrol.com` et `ns26.domaincontrol.com`.
- Pointer `@` vers l'IP fournie par votre hébergement GoDaddy/cPanel/VPS.
- Pointer `www` vers `@` ou vers le nom fourni par GoDaddy.

## Générer le ZIP pour le bouton "Importer le fichier zip"

Depuis le dossier du projet :

```bash
npm run build:godaddy-upload
```

Le fichier à envoyer dans GoDaddy Node.js Hosting sera créé ici :

```text
deploy/jos-travel-godaddy-upload.zip
```

Ce ZIP contient le code source sans `node_modules`, sans `.next` et sans `.env.local`.

## Générer un package autonome manuel

Pour un VPS ou un cPanel Node.js manuel :

```bash
npm run build:godaddy
```

Le package autonome sera créé ici :

```text
deploy/jos-travel-godaddy-node.zip
```

## Variables d'environnement à configurer sur GoDaddy

Configurer ces variables dans cPanel Node.js App ou dans le serveur VPS :

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_SITE_URL=https://jostravel.site
```

Ne jamais placer `.env.local` dans un dossier public.

## cPanel Node.js App

1. Créer une application Node.js.
2. Choisir Node.js 20 ou supérieur.
3. Définir le dossier de l'application avec le contenu décompressé de `jos-travel-godaddy-node.zip`.
4. Définir le fichier de démarrage sur `server.js`.
5. Ajouter les variables d'environnement.
6. Redémarrer l'application.

## VPS GoDaddy

Sur un VPS, décompresser le package puis lancer :

```bash
PORT=3000 HOSTNAME=0.0.0.0 node server.js
```

En production VPS, utiliser un reverse proxy Nginx avec SSL et un process manager comme PM2.
