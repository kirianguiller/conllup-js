export interface featuresJson_T {
    [key: string]: string;
}
export declare type tokenJson_T = {
    ID: string;
    FORM: string;
    LEMMA: string;
    UPOS: string;
    XPOS: string;
    FEATS: featuresJson_T;
    HEAD: number;
    DEPREL: string;
    DEPS: featuresJson_T;
    MISC: featuresJson_T;
    [key: string]: string | number | featuresJson_T;
};
export interface nodesJson_T {
    [key: string]: tokenJson_T;
}
export interface groupsJson_T {
    [key: string]: tokenJson_T;
}
export interface metaJson_T {
    [key: string]: string | number;
}
export interface treeJson_T {
    nodesJson: nodesJson_T;
    groupsJson: groupsJson_T;
}
export interface sentenceJson_T {
    treeJson: treeJson_T;
    metaJson: metaJson_T;
}
export declare const emptyFeaturesJson: () => featuresJson_T;
export declare const emptyTokenJson: () => tokenJson_T;
export declare const emptyMetaJson: () => metaJson_T;
export declare const emptyNodesOrGroupsJson: () => nodesJson_T;
export declare const emptyTreeJson: () => treeJson_T;
export declare const emptySentenceJson: () => sentenceJson_T;
export declare const _seperateMetaAndTreeFromSentenceConll: (sentenceConll: string) => {
    metaLines: string[];
    treeLines: string[];
};
export declare const _metaConllLinesToJson: (metaConllLines: string[]) => metaJson_T;
export declare const _featuresConllToJson: (featuresConll: string) => featuresJson_T;
export declare const _decodeTabData: (tokenTabData: string, type: string) => string | number | featuresJson_T;
export declare const _tokenConllToJson: (tokenConll: string) => tokenJson_T;
export declare const _treeConllLinesToJson: (treeConllLines: string[]) => treeJson_T;
export declare const sentenceConllToJson: (sentenceConll: string) => sentenceJson_T;
export declare const _featuresJsonToConll: (featuresJson: featuresJson_T) => string;
export declare const _encodeTabData: (tabData: string | number | featuresJson_T) => string;
export declare const _tokenJsonToConll: (tokenJson: tokenJson_T) => string;
export declare const _treeJsonToConll: (treeJson: treeJson_T) => string;
export declare const _metaJsonToConll: (metaJson: metaJson_T) => string;
export declare const sentenceJsonToConll: (sentenceJson: sentenceJson_T) => string;
export declare const _sortTokenIndexes: (tokenIndexes: string[]) => string[];
export declare const _compareTokenIndexes: (a: string, b: string) => number;
export declare const _isGroupToken: (tokenJson: tokenJson_T) => boolean;
export declare const replaceArrayOfTokens: (treeJson: treeJson_T, oldTokensIndexes: number[], newTokensForms: string[], smartBehavior?: boolean) => treeJson_T;
export declare const incrementIndexesOfToken: (tokenJson: tokenJson_T, arrayFirst: number, arrayLast: number, differenceInSize: number, smartBehavior: boolean) => tokenJson_T;
export declare const incrementIndex: (idOrHead: 'ID' | 'HEAD', index: number, arrayFirst: number, arrayLast: number, differenceInSize: number, smartBehavior: boolean) => number;
export declare const constructTextFromTreeJson: (treeJson: treeJson_T) => string;
