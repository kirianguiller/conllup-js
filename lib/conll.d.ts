export interface FeatureJson {
    [key: string]: string;
}
export declare type NodeJson = {
    ID: string;
    FORM: string;
    LEMMA: string;
    UPOS: string;
    XPOS: string;
    FEATS: FeatureJson;
    HEAD: number;
    DEPREL: string;
    DEPS: FeatureJson;
    MISC: FeatureJson;
    [key: string]: string | number | FeatureJson;
};
export interface NodesJson {
    [key: string]: NodeJson;
}
export interface GroupsJson {
    [key: string]: NodeJson;
}
export interface MetaJson {
    [key: string]: string | number;
}
export interface TreeJson {
    nodesJson: NodesJson;
    groupsJson: GroupsJson;
}
export interface SentenceJson {
    treeJson: TreeJson;
    metaJson: MetaJson;
}
export declare const emptyFeatureJson: () => FeatureJson;
export declare const emptyTokenJson: () => NodeJson;
export declare const emptyMetaJson: () => MetaJson;
export declare const emptyNodesOrGroupsJson: () => NodesJson;
export declare const emptyTreeJson: () => TreeJson;
export declare const emptySentenceJson: () => SentenceJson;
export declare const _seperateMetaAndTreeFromSentenceConll: (sentenceConll: string) => {
    metaLines: string[];
    treeLines: string[];
};
export declare const _metaConllLinesToJson: (metaConllLines: string[]) => MetaJson;
export declare const _tabDictToJson: (featureConll: string) => FeatureJson;
export declare const _extractTokenTabData: (tokenTabData: string, type: string) => string | number | FeatureJson;
export declare const _tokenLineToJson: (tokenLine: string) => NodeJson;
export declare const _treeConllLinesToJson: (treeConllLines: string[]) => TreeJson;
export declare const sentenceConllToJson: (sentenceConll: string) => SentenceJson;
export declare const _tabJsonToDict: (featureJson: FeatureJson) => string;
export declare const _tabDataJsonToConll: (tabData: string | number | FeatureJson, type: string) => string;
export declare const _tokenJsonToLine: (tokenJson: NodeJson) => string;
export declare const _treeJsonToConll: (treeJson: TreeJson) => string;
export declare const _metaJsonToConll: (metaJson: MetaJson) => string;
export declare const sentenceJsonToConll: (sentenceJson: SentenceJson) => string;
export declare const _sortTokenIndexes: (tokenIndexes: string[]) => string[];
export declare const _compareTokenIndexes: (a: string, b: string) => number;
export declare const _isGroupToken: (tokenJson: NodeJson) => boolean;
export declare const replaceArrayOfTokens: (treeJson: TreeJson, oldTokensIndexes: number[], newTokensForms: string[]) => TreeJson;
export declare const incrementIndexesOfToken: (tokenJson: NodeJson, arrayFirst: number, arrayLast: number, differenceInSize: number) => NodeJson;
export declare const incrementIndex: (index: number, arrayFirst: number, arrayLast: number, differenceInSize: number) => number;
export declare const constructTextFromSentenceJson: (sentenceJson: SentenceJson) => string;
