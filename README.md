# Mon Portfolio

Portfolio personnel construit avec React + Vite.

## Personnaliser

Ouvre `src/App.jsx` et modifie :
- **`Your Name`** → ton prénom et nom
- **`YN`** → tes initiales
- **`hero-bio`** → ta description personnelle
- **`PROJECTS`** → tes vrais projets
- **`SKILLS`** → tes vraies compétences
- Les liens GitHub, LinkedIn et email dans la section hero

## Lancer en local

```bash
npm install
npm run dev
```

## Publier sur Vercel

### Étape 1 — GitHub
1. Crée un compte sur [github.com](https://github.com)
2. Clique "New repository", nomme-le `portfolio`
3. Dans ton terminal, dans ce dossier :
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/portfolio.git
git push -u origin main
```

### Étape 2 — Vercel
1. Va sur [vercel.com](https://vercel.com) → "Sign up" avec GitHub
2. Clique **"Add New Project"**
3. Sélectionne ton repo `portfolio`
4. Vercel détecte automatiquement Vite → clique **Deploy**
5. Ton site est en ligne sur `ton-portfolio.vercel.app` 🎉

### Mise à jour du site
À chaque fois que tu fais un `git push`, Vercel redéploie automatiquement en quelques secondes.

```bash
git add .
git commit -m "Update projects"
git push
```
