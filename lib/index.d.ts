declare const _default: {
    sentenceConllToJson: (sentenceConll: string) => import("./conll").SentenceJson;
    sentenceJsonToConll: (sentenceJson: import("./conll").SentenceJson) => string;
    emptySentenceJson: () => import("./conll").SentenceJson;
    emptyMetaJson: () => import("./conll").MetaJson;
    emptyTreeJson: () => import("./conll").NodesJson;
    emptyTokenJson: () => import("./conll").NodeJson;
    emptyFeatureJson: () => import("./conll").FeatureJson;
    replaceArrayOfTokens: (nodesJson: import("./conll").NodesJson, groupsJson: import("./conll").GroupsJson, oldTokensIndexes: number[], newTokensForms: string[]) => {
        newNodesJson: import("./conll").NodesJson;
        newGroupsJson: import("./conll").NodesJson;
    };
    constructTextFromSentenceJson: (sentenceJson: import("./conll").SentenceJson) => string;
};
export default _default;
