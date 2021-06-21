# Conllup JS
Javascript library for converting conll sentence to json format and vice-versa. The code include some test and is written in TS !

## Who need that ?
Linguist, NLP researcher/engineer and computer scientist who want to show dependency tree in the browser. 
It is currently being used in :
- [Arborator-Grew](https://arboratorgrew.elizia.net/#/) : A web-app for online collaborative dependency parsing.
- [Reactive-Dep-Tree](https://github.com/kirianguiller/reactive-dep-tree) : An html plugin made with Vue.js for showing interactive dependency tree in the browser
- [Surface Syntactic SUD](https://surfacesyntacticud.github.io) : A guideline on Surface Syntactic Universal Dependencies (SUD). Just check the website and try to interact with the dependency trees to have a live demo :D.

## Updates history
### 1.1.4
- Fix aggressive normalization of hyphens in FORM and LEMMA


### 1.1.0
- Support for group token
```tsv
1-2 it's  _ _ _ _ _ _ _ _
1 it  _ _ _ _ _ _ _ _
2 's  _ _ _ _ _ _ _ _
```