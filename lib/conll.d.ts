export interface FeatureJson {
    [key: string]: string;
}
export declare type TokenJson = {
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
    [key: string]: TokenJson;
}
export interface GroupsJson {
    [key: string]: TokenJson;
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
export declare const emptyTokenJson: () => TokenJson;
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
export declare const _tokenLineToJson: (tokenLine: string) => TokenJson;
export declare const _treeConllLinesToJson: (treeConllLines: string[]) => TreeJson;
export declare const sentenceConllToJson: (sentenceConll: string) => SentenceJson;
export declare const _tabJsonToDict: (featureJson: FeatureJson) => string;
export declare const _tabDataJsonToConll: (tabData: string | number | FeatureJson, type: string) => string;
export declare const _tokenJsonToLine: (tokenJson: TokenJson) => string;
export declare const _treeJsonToConll: (treeJson: TreeJson) => string;
export declare const _metaJsonToConll: (metaJson: MetaJson) => string;
export declare const sentenceJsonToConll: (sentenceJson: SentenceJson) => string;
export declare const _sortTokenIndexes: (tokenIndexes: string[]) => string[];
export declare const _compareTokenIndexes: (a: string, b: string) => number;
export declare const _isGroupToken: (tokenJson: TokenJson) => boolean;
export declare const replaceArrayOfTokens: (treeJson: TreeJson, oldTokensIndexes: number[], newTokensForms: string[], smartBehavior?: boolean) => TreeJson;
export declare const incrementIndexesOfToken: (tokenJson: TokenJson, arrayFirst: number, arrayLast: number, differenceInSize: number, smartBehavior: boolean) => TokenJson;
export declare const incrementIndex: (idOrHead: 'ID' | 'HEAD', index: number, arrayFirst: number, arrayLast: number, differenceInSize: number, smartBehavior: boolean) => number;
export declare const constructTextFromTreeJson: (treeJson: TreeJson) => string;
