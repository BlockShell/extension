# Web Extension of BlockShell

BlockShell est un gestionnaire de mot de passe basé sur la chaîne de blocs Tezos.
Pour l'installer pour Firefox (l'extension n'a pas été testé sur Chrome), il faut procéder ainsi :

- Cloner le dépôt
```
git clone https://github.com/BlockShell/blockshell-extension.git
```

- Construire l'extension
```bash
cd blockshell-extension
yarn # Installer les dépendances
yarn build
```

- Ouvrir Firefox, aller dans `about:debugging`, cliquer sur *Ce Firefox*, puis *Charger un module complémentaire temporaire*, aller dans `blockshell-extension/build` et sélectionner le fichier `manifest.json`.

L'extension est disponible !