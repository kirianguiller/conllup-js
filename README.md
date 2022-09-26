# Conllup JS
Javascript library for converting conll sentence to json format and vice-versa. The code include some test and is written in TS !

## Who need that ?
Linguist, NLP researcher/engineer and computer scientist who want to show dependency tree in the browser. 
It is currently being used in :
- [Arborator-Grew](https://arboratorgrew.elizia.net/#/) : A web-app for online collaborative dependency parsing.
- [Reactive-Dep-Tree](https://github.com/kirianguiller/reactive-dep-tree) : An html plugin made with Vue.js for showing interactive dependency tree in the browser
- [Surface Syntactic SUD](https://surfacesyntacticud.github.io) : A guideline on Surface Syntactic Universal Dependencies (SUD). Just check the website and try to interact with the dependency trees to have a live demo :D.

## Updates history

### 2.0.0
(Still in development)
- Refactor the SentenceJson type to move the Group tokens in their own property (SentenceJson.GroupsToken)
- Add support of UDPipe SpacesAfter (=//n ; //t ; //v, //f, //r, /s) MISC logic

### 1.1.7
- add better error information when importing conll with less or more than 10 columns

### 1.1.6
- add public `constructTextFromTreeJson` method (that take into account the SpaceAfter=No misc)
### 1.1.4
- Fix aggressive normalization of hyphens in FORM and LEMMA


### 1.1.0
- Support for group token
```tsv
1-2 it's  _ _ _ _ _ _ _ _
1 it  _ _ _ _ _ _ _ _
2 's  _ _ _ _ _ _ _ _
```