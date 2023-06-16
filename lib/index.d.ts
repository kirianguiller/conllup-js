declare const _default: {
    sentenceConllToJson: (sentenceConll: string) => import("./conll").sentenceJson_T;
    sentenceJsonToConll: (sentenceJson: import("./conll").sentenceJson_T) => string;
    emptySentenceJson: () => import("./conll").sentenceJson_T;
    emptyMetaJson: () => import("./conll").metaJson_T;
    emptyTreeJson: () => import("./conll").treeJson_T;
    emptyTokenJson: () => import("./conll").tokenJson_T;
    emptyFeaturesJson: () => import("./conll").featuresJson_T;
    replaceArrayOfTokens: (treeJson: import("./conll").treeJson_T, oldTokensIndexes: number[], newTokensForms: string[], smartBehavior?: boolean) => import("./conll").treeJson_T;
    constructTextFromTreeJson: (treeJson: import("./conll").treeJson_T) => string;
};
export default _default;
