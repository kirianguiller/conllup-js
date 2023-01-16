declare const _default: {
    sentenceConllToJson: (sentenceConll: string) => import("./conll").SentenceJson;
    sentenceJsonToConll: (sentenceJson: import("./conll").SentenceJson) => string;
    emptySentenceJson: () => import("./conll").SentenceJson;
    emptyMetaJson: () => import("./conll").MetaJson;
    emptyTreeJson: () => import("./conll").TreeJson;
    emptyTokenJson: () => import("./conll").TokenJson;
    emptyFeatureJson: () => import("./conll").FeatureJson;
    replaceArrayOfTokens: (treeJson: import("./conll").TreeJson, oldTokensIndexes: number[], newTokensForms: string[], smartBehavior?: boolean) => import("./conll").TreeJson;
    constructTextFromTreeJson: (treeJson: import("./conll").TreeJson) => string;
};
export default _default;
