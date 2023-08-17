---
layout: cheat_sheet
title: Cheat Sheet Javascript
permalink: /cheat_sheets/javascript
---

Manage multiple Node.js versions with NVM

```sh
brew install nvm
```

```sh
nvm install 18.14.0
```

```sh
nvm use 18.14.0
```

```sh
nvm uninstall 18.14.0
```

<u>Fonction fléchée</u>

```js
const square = (x) => {
  return x * x;
};
```

<u>Liste des événements</u>

|Événements| Se produit quand... |
|:---|:---|
|`abort`| le chargement d'un fichier est aborté|
|`change`| une valeur d'un élément a changé depuis que le focus a été perdu ou récupéré |
|`click`| un clic s'est produit sur un élément |
|`dbclick`| un double-clic s'est produit sur un élément |
|`input`| la valeur d'un élément input ou textarea est modifiée |
|`keydown`| une touche est pressée |
|`keyup`| une touche est relâchée après avoir été pressée |
|`mousedown`| un bouton de la souris est presssé alors que le pointeur se trouve au-dessus d'un élément |
|`mouseenter`| le pointeur de la souris est déplacé sur l'élément auquel est attaché le gestionnaire d'évènement |
|`mouseleave`| le pointeur de la souris quitte l'élément auquel est attaché le gestionnaire d'évènement |
|`mousemove`| le pointeur de la souris est déplacé au-dessus d'un élément |
|`mouseout`| le pointeur de la souris quitte l'élément auquel est attaché le gestionnaire d'évènement ou un de ses enfants |
|`mouseover`| le pointeur de la souris est déplacé sur l'élément auquel est attaché le gestionnaire d'évènement ou un de ses enfants |
|`mouseup`| un bouton de la souris est relâché alors que le pointeur se trouve au-dessus d'un élément |
|`mousewheel`| la molette de la souris a été actionée |
|`onreset`| un formulaire a été réinitialisé |
|`select`| du texte a été sélectionné |
|`submit`| un formulaire est soumis |
|`blur`| un élément a perdu le focus |
|`focus`| un élément a reçu le focus |
|`error`| un fichier n'a pas pu être chargé |
|`load`| le chargement d'un fichier, ainsi que de ses fichiers attachés, est terminé |
|`resize`| le document a été redimensionné |
|`scroll`| un défilement a été appliqué au document ou à un élément |
|`afterprint`| l'aperçu avant impresion du document a été refermé |
|`beforeprint`| l'aperçu avant impresion du document est ouvert |
|`hashchange`| la partie de l'URL placée après le signe # change (pour les ancres |
|`pagehide`| le navigateur place une page dans l'historique de navigation |
|`pageshow`| le navigateur accède à une page de l'historique de session |
|`popstate`| l'élément actif de l'historique de la session change |
|`beforeunload`| le document ou un fichier est sur le point d'être déchargé |


<u>Les propriétés de l'objet Document</u>

| Méthode | Utilisation |
|---|:---|
|`baseURI`| récupère l'URI de base du document |
|`cookie`| récupère ou définit des couples noms/valeur de cookies dans le document |
|`doctype`| récupère la déclaration de type associée avec le document |
|`documentURI`| récupère ou définit la localisation du document |
|`domain`| récupère le nom de domaine du serveur qui a chargé le document |
|`forms`| récupère une collection de tous les éléments form du document |
|`images`| récupère une liste de tous les éléments img du document |
|`lastModified`| récupère la date et l'heure de la dernière modification du document |
|`links`| récupère une collection de tous les éléments area et a du document qui contiennent l'attribut href |
|`readyState`| récupère l'état de chargement du document |
|`referrer`| obtient l'URL de la page |
|`title`| récupère  ou définit le titre du document |
|`URL`| récupère l'URL complète du document |

<u>Les propriétés de l'objet Element</u>

| Méthode | Utilisation |
|---|:---|
|`childNodes`| récupère une liste des noeurs enfants de l'élément |
|`classList`| récupère le ou les nomds de classe de l'élément |
|`className`| récupère ou définit la valeur de l'attribut de classe de l'élément |
|`firstChild`| récupère le noeud du premier enfant de l'élément |
|`firstElementChild`| récupère le premier enfant de l'élément |
|`id`| lit ou définit le contenu de l'élément |
|`innerHTML`| récupère ou définit le contenu de l'élément |
|`lastChild`| récupère le noeud du dernier enfant de l'élément |
|`lastElementChild`| récupère le dernier enfant de l'élément |
|`nextSibling`| obtient la noeud suivant situé au même niveau |
|`nextElementSibling`| obtient l'élément suivant situé au même niveau de noeud |
|`nodeValue`| lit ou définit la valeur du noeud |
|`parentElement`| récupère l'élément parent de l'élement |
|`style`| récupère ou définit la valeur de l'attribut style de l'élément |
|`tagName`| obtient le nom de balise de l'élément |
|`textContent`| récupère ou définit le contenut textuel du noeud et de ses descendants |


<h2>Des articles pour aller plus loin</h2>

<a href="https://www.bootrails.com/blog/ruby-on-rails-and-vuejs-tutorial-a-how-to-guide/" class="underlined" target="_blank">Setup de Vue.js avec Rails</a>
<br>
<a href="https://developer.mozilla.org/" class="underlined" target="_blank">Documentation complète avec MDN</a>
<br>
<a href="https://dev.to/shshank/killer-javascript-one-liners-3ii4" class="underlined" target="_blank">JS features en une ligne</a>
<br>
<a href="https://dev.to/saverio683/mastering-javascript-how-the-js-engine-works-5a2p" class="underlined" target="_blank">Comment l'engine JS fonctionne</a>
<br>
<a href="https://books.ninja-squad.com/" class="underlined" target="_blank">Livres sur Vue.js et Angular</a>
