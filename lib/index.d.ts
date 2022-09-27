declare const _default: {
    sentenceConllToJson: (sentenceConll: string) => import("./conll").SentenceJson;
    sentenceJsonToConll: (sentenceJson: import("./conll").SentenceJson) => string;
    emptySentenceJson: () => import("./conll").SentenceJson;
    emptyMetaJson: () => import("./conll").MetaJson;
    emptyTreeJson: () => import("./conll").TreeJson;
    emptyTokenJson: () => import("./conll").NodeJson;
    emptyFeatureJson: () => import("./conll").FeatureJson;
    replaceArrayOfTokens: (treeJson: import("./conll").TreeJson, oldTokensIndexes: number[], newTokensForms: string[]) => import("./conll").TreeJson;
    constructTextFromSentenceJson: (sentenceJson: import("./conll").SentenceJson) => string;
};
export default _default;
