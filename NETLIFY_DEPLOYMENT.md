# Déploiement Netlify

Le projet JOS-Travel est prêt pour Netlify avec Next.js, routes API, Supabase, espace admin et discussion JOS-Travel.

## Méthode recommandée

Netlify recommande de pousser le projet sur un fournisseur Git puis de connecter le dépôt depuis le dashboard Netlify.

1. Créer un dépôt GitHub.
2. Envoyer le projet JOS-Travel dans ce dépôt.
3. Dans Netlify : Add new project > Import an existing project.
4. Choisir le dépôt.
5. Utiliser les réglages suivants :

```text
Build command: npm run build:netlify
Publish directory: .next
Node version: 20
```

Le fichier `netlify.toml` contient déjà ces réglages.

## Variables d'environnement

Dans Netlify : Project configuration > Environment variables.

Ajouter :

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
OPENAI_API_KEY
NEXT_PUBLIC_SITE_URL=https://jostravel.site
PAWAPAY_API_TOKEN
PAWAPAY_API_BASE_URL=https://api.pawapay.io
PAWAPAY_COUNTRY=CMR
PAWAPAY_CURRENCY=XAF
CLOUD_SUBSCRIPTION_MONTHLY_USD=40
CLOUD_SUBSCRIPTION_ANNUAL_USD=400
```

Le paiement PawaPay reste en XAF. L'abonnement est tarifé en USD puis converti automatiquement au moment du lancement du paiement. `USD_TO_XAF_RATE` peut être ajouté uniquement si vous souhaitez forcer un taux fixe.

Ne pas publier `.env.local`.

## Domaine jostravel.site chez GoDaddy

Après le premier déploiement Netlify :

1. Dans Netlify : Domain management > Add domain.
2. Ajouter `jostravel.site`.
3. Ajouter aussi `www.jostravel.site` si Netlify ne le fait pas automatiquement.
4. Dans GoDaddy DNS, supprimer les anciens records Vercel et WebsiteBuilder.
5. Configurer :

```text
A      @      75.2.60.5
CNAME  www    [nom-du-site].netlify.app
```

Remplacer `[nom-du-site].netlify.app` par l'adresse Netlify réelle du site.

## Après DNS

Attendre la propagation DNS. Le SSL HTTPS est ensuite généré automatiquement par Netlify.
