"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructTextFromTreeJson = exports.incrementIndex = exports.incrementIndexesOfToken = exports.replaceArrayOfTokens = exports._isGroupToken = exports._compareTokenIndexes = exports._sortTokenIndexes = exports.sentenceJsonToConll = exports._metaJsonToConll = exports._treeJsonToConll = exports._tokenJsonToLine = exports._tabDataJsonToConll = exports._tabJsonToDict = exports.sentenceConllToJson = exports._treeConllLinesToJson = exports._tokenLineToJson = exports._extractTokenTabData = exports._tabDictToJson = exports._metaConllLinesToJson = exports._seperateMetaAndTreeFromSentenceConll = exports.emptySentenceJson = exports.emptyTreeJson = exports.emptyNodesOrGroupsJson = exports.emptyMetaJson = exports.emptyTokenJson = exports.emptyFeatureJson = void 0;
const emptyFeatureJson = () => ({});
exports.emptyFeatureJson = emptyFeatureJson;
const emptyTokenJson = () => ({
    ID: '_',
    FORM: '_',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: (0, exports.emptyFeatureJson)(),
    HEAD: -1,
    DEPREL: '_',
    DEPS: (0, exports.emptyFeatureJson)(),
    MISC: (0, exports.emptyFeatureJson)(),
});
exports.emptyTokenJson = emptyTokenJson;
const emptyMetaJson = () => ({});
exports.emptyMetaJson = emptyMetaJson;
const emptyNodesOrGroupsJson = () => ({});
exports.emptyNodesOrGroupsJson = emptyNodesOrGroupsJson;
const emptyTreeJson = () => ({
    nodesJson: (0, exports.emptyNodesOrGroupsJson)(),
    groupsJson: (0, exports.emptyNodesOrGroupsJson)(),
});
exports.emptyTreeJson = emptyTreeJson;
const emptySentenceJson = () => ({
    metaJson: (0, exports.emptyMetaJson)(),
    treeJson: (0, exports.emptyTreeJson)(),
});
exports.emptySentenceJson = emptySentenceJson;
const CONLL_STRUCTURE = {
    0: { label: 'ID', type: 'str' },
    1: { label: 'FORM', type: 'str' },
    2: { label: 'LEMMA', type: 'str' },
    3: { label: 'UPOS', type: 'str' },
    4: { label: 'XPOS', type: 'str' },
    5: { label: 'FEATS', type: 'dict' },
    6: { label: 'HEAD', type: 'int' },
    7: { label: 'DEPREL', type: 'str' },
    8: { label: 'DEPS', type: 'dict' },
    9: { label: 'MISC', type: 'dict' },
};
function isNumeric(str) {
    return /^\d+$/.test(str);
}
const _seperateMetaAndTreeFromSentenceConll = (sentenceConll) => {
    const trimmedSentenceConll = sentenceConll.trim();
    const lineConlls = trimmedSentenceConll.split('\n');
    const metaLines = [];
    const treeLines = [];
    for (const lineConll of lineConlls) {
        const trimmedLineConll = lineConll.trim();
        if (trimmedLineConll.startsWith('#')) {
            metaLines.push(trimmedLineConll);
        }
        else if (!isNumeric(trimmedLineConll.slice(0, 1))) {
            // tslint:disable-next-line: no-console
            console.log(`Warning: line didnt't start with a digit or '#' : "${trimmedLineConll}" `);
        }
        else {
            treeLines.push(trimmedLineConll);
        }
    }
    return { metaLines, treeLines };
};
exports._seperateMetaAndTreeFromSentenceConll = _seperateMetaAndTreeFromSentenceConll;
const _metaConllLinesToJson = (metaConllLines) => {
    const metaJson = (0, exports.emptyMetaJson)();
    for (const metaCouple of metaConllLines) {
        const [metaKey, metaValue] = metaCouple.split(' = ');
        const trimmedMetaKey = metaKey.slice(2);
        metaJson[trimmedMetaKey] = metaValue;
    }
    return metaJson;
};
exports._metaConllLinesToJson = _metaConllLinesToJson;
const _tabDictToJson = (featureConll) => {
    const featureJson = (0, exports.emptyFeatureJson)();
    if (featureConll === '_') {
        return featureJson;
    }
    const splittedFeaturesConll = featureConll.split('|');
    for (const featureCouple of splittedFeaturesConll) {
        const splittedFeature = featureCouple.split('=');
        const featureKey = splittedFeature[0];
        const featureValue = splittedFeature.slice(1).join('=');
        featureJson[featureKey] = featureValue;
    }
    return featureJson;
};
exports._tabDictToJson = _tabDictToJson;
const _normalizeNull = (tokenTabData, tabMeta) => {
    if (['FORM', 'LEMMA'].includes(tabMeta['label']))
        return tokenTabData;
    else if (['-', '–'].includes(tokenTabData))
        return '_';
    else
        return tokenTabData;
};
const _extractTokenTabData = (tokenTabData, type) => {
    if (type === 'str') {
        return tokenTabData;
    }
    else if (type === 'int') {
        if (tokenTabData === '_') {
            return -1;
        }
        else {
            return parseInt(tokenTabData, 10);
        }
    }
    else if (type === 'dict') {
        return (0, exports._tabDictToJson)(tokenTabData);
    }
    else {
        throw new Error(`${type} is not a correct type`);
    }
};
exports._extractTokenTabData = _extractTokenTabData;
const _tokenLineToJson = (tokenLine) => {
    const trimmedTokenLine = tokenLine.trim();
    const splittedTokenLine = trimmedTokenLine.split('\t');
    if (splittedTokenLine.length !== 10) {
        throw new Error(`CONLL PARSING ERROR : line "${tokenLine}" is not valid, ${splittedTokenLine.length} columns found instead of 10`);
    }
    const tokenJson = (0, exports.emptyTokenJson)();
    for (const tabIndex in CONLL_STRUCTURE) {
        if (CONLL_STRUCTURE.hasOwnProperty(tabIndex)) {
            const tabMeta = CONLL_STRUCTURE[tabIndex];
            const tabData = _normalizeNull(splittedTokenLine[tabIndex], tabMeta);
            const label = tabMeta['label'];
            const type = tabMeta['type'];
            tokenJson[label] = (0, exports._extractTokenTabData)(tabData, type);
        }
    }
    return tokenJson;
};
exports._tokenLineToJson = _tokenLineToJson;
const _treeConllLinesToJson = (treeConllLines) => {
    const treeJson = (0, exports.emptyTreeJson)();
    for (const tokenLine of treeConllLines) {
        const tokenJson = (0, exports._tokenLineToJson)(tokenLine);
        if ((0, exports._isGroupToken)(tokenJson) === true) {
            // the token is a group token
            treeJson.groupsJson[tokenJson.ID] = tokenJson;
        }
        else {
            // the token is a normal token
            treeJson.nodesJson[tokenJson.ID] = tokenJson;
        }
    }
    return treeJson;
};
exports._treeConllLinesToJson = _treeConllLinesToJson;
const sentenceConllToJson = (sentenceConll) => {
    if (typeof sentenceConll !== 'string') {
        throw new TypeError(`parameter \`sentenceConll\` in sentenceConllToJson() is not a string (got \`${typeof sentenceConll}\`)`);
    }
    const sentenceJson = (0, exports.emptySentenceJson)();
    const { metaLines, treeLines } = (0, exports._seperateMetaAndTreeFromSentenceConll)(sentenceConll);
    sentenceJson.metaJson = (0, exports._metaConllLinesToJson)(metaLines);
    sentenceJson.treeJson = (0, exports._treeConllLinesToJson)(treeLines);
    return sentenceJson;
};
exports.sentenceConllToJson = sentenceConllToJson;
const _tabJsonToDict = (featureJson) => {
    const splittedFeatureConll = [];
    for (const featureKey in featureJson) {
        if (featureJson.hasOwnProperty(featureKey)) {
            const featureValue = featureJson[featureKey];
            splittedFeatureConll.push(`${featureKey}=${featureValue}`);
        }
        else {
            throw Error(`featureJson don't possess the key '${featureKey}'`);
        }
    }
    let featureConll = splittedFeatureConll.join('|');
    if (featureConll === '') {
        featureConll = '_';
    }
    return featureConll;
};
exports._tabJsonToDict = _tabJsonToDict;
const _tabDataJsonToConll = (tabData, type) => {
    if (type === 'str') {
        return tabData;
    }
    else if (type === 'int') {
        if (tabData === -1) {
            return '_';
        }
        else {
            return tabData.toString();
        }
    }
    else if (type === 'dict') {
        return (0, exports._tabJsonToDict)(tabData);
    }
    else {
        throw new Error(`${type} is not a correct type`);
    }
};
exports._tabDataJsonToConll = _tabDataJsonToConll;
const _tokenJsonToLine = (tokenJson) => {
    const splittedTokenConll = [];
    for (const tabIndex in CONLL_STRUCTURE) {
        if (CONLL_STRUCTURE.hasOwnProperty(tabIndex)) {
            const tabMeta = CONLL_STRUCTURE[tabIndex];
            const tabLabel = tabMeta['label'];
            const tabtype = tabMeta['type'];
            const tabDataJson = tokenJson[tabLabel];
            const tabDataConll = (0, exports._tabDataJsonToConll)(tabDataJson, tabtype);
            splittedTokenConll.push(tabDataConll);
        }
    }
    const tokenConll = splittedTokenConll.join('\t');
    return tokenConll;
};
exports._tokenJsonToLine = _tokenJsonToLine;
const _treeJsonToConll = (treeJson) => {
    const treeConllLines = [];
    const tokensJson = { ...treeJson.nodesJson, ...treeJson.groupsJson };
    const tokenIndexes = Object.values(tokensJson).map((tokenJson) => {
        return tokenJson.ID;
    });
    const sortedTokenIndexes = (0, exports._sortTokenIndexes)(tokenIndexes);
    for (const tokenIndex of sortedTokenIndexes) {
        const tokenJson = tokensJson[tokenIndex];
        const tokenConll = (0, exports._tokenJsonToLine)(tokenJson);
        treeConllLines.push(tokenConll);
    }
    const treeConll = treeConllLines.join('\n');
    return treeConll;
};
exports._treeJsonToConll = _treeJsonToConll;
const _metaJsonToConll = (metaJson) => {
    const metaConllLines = [];
    for (const metaKey in metaJson) {
        if (metaJson.hasOwnProperty(metaKey)) {
            const metaValue = metaJson[metaKey];
            const metaConllLine = `# ${metaKey} = ${metaValue}`;
            metaConllLines.push(metaConllLine);
        }
        else {
            throw Error(`metaJson don't possess the key '${metaKey}'`);
        }
    }
    const metaConll = metaConllLines.join('\n');
    return metaConll;
};
exports._metaJsonToConll = _metaJsonToConll;
const sentenceJsonToConll = (sentenceJson) => {
    const metaConll = (0, exports._metaJsonToConll)(sentenceJson.metaJson);
    const treeConll = (0, exports._treeJsonToConll)(sentenceJson.treeJson);
    if (metaConll === '') {
        return treeConll;
    }
    return `${metaConll}\n${treeConll}`;
};
exports.sentenceJsonToConll = sentenceJsonToConll;
const _sortTokenIndexes = (tokenIndexes) => {
    return tokenIndexes.sort(exports._compareTokenIndexes);
};
exports._sortTokenIndexes = _sortTokenIndexes;
const _compareTokenIndexes = (a, b) => {
    const a1 = parseInt(a.split('-')[0], 10);
    const b1 = parseInt(b.split('-')[0], 10);
    if (a1 - b1 !== 0) {
        return a1 - b1;
    }
    else {
        return b.length - a.length;
    }
};
exports._compareTokenIndexes = _compareTokenIndexes;
const _isGroupToken = (tokenJson) => {
    return tokenJson.ID.indexOf('-') > -1;
};
exports._isGroupToken = _isGroupToken;
const replaceArrayOfTokens = (treeJson, oldTokensIndexes, newTokensForms) => {
    const newNodesJson = (0, exports.emptyNodesOrGroupsJson)();
    const newGroupsJson = (0, exports.emptyNodesOrGroupsJson)();
    // add new tokens to new tree
    let newTokenIndex = oldTokensIndexes[0];
    for (const newTokenForm of newTokensForms) {
        const newTokenJson = (0, exports.emptyTokenJson)();
        newTokenJson.ID = newTokenIndex.toString();
        newTokenJson.FORM = newTokenForm;
        newNodesJson[newTokenJson.ID] = newTokenJson;
        newTokenIndex++;
    }
    // add old tokens with modified index if necessary
    const differenceInSize = newTokensForms.length - oldTokensIndexes.length;
    const arrayFirst = oldTokensIndexes[0];
    const arrayLast = oldTokensIndexes[oldTokensIndexes.length - 1];
    for (const oldTokenJson of Object.values({ ...treeJson.nodesJson, ...treeJson.groupsJson })) {
        const oldTokenJsonCopy = JSON.parse(JSON.stringify(oldTokenJson));
        const newTokenJson = (0, exports.incrementIndexesOfToken)(oldTokenJsonCopy, arrayFirst, arrayLast, differenceInSize);
        if (newTokenJson.ID !== '-1') {
            if ((0, exports._isGroupToken)(newTokenJson) === true) {
                // the token is a group token
                newGroupsJson[newTokenJson.ID] = newTokenJson;
            }
            else {
                // the token is a normal token
                newNodesJson[newTokenJson.ID] = newTokenJson;
            }
        }
    }
    const newTreeJson = {
        nodesJson: newNodesJson,
        groupsJson: newGroupsJson,
    };
    return newTreeJson;
};
exports.replaceArrayOfTokens = replaceArrayOfTokens;
// TODO GROUP TOKEN REFACTOR
const incrementIndexesOfToken = (tokenJson, arrayFirst, arrayLast, differenceInSize) => {
    // handle ID
    if ((0, exports._isGroupToken)(tokenJson)) {
        const [tokenJsonId1, tokenJsonId2] = tokenJson.ID.split('-');
        const newTokenJsonId1 = (0, exports.incrementIndex)(parseInt(tokenJsonId1, 10), arrayFirst, arrayLast, differenceInSize);
        const newTokenJsonId2 = (0, exports.incrementIndex)(parseInt(tokenJsonId2, 10), arrayFirst, arrayLast, differenceInSize);
        if (newTokenJsonId1 !== -1 && newTokenJsonId2 !== -1) {
            const newGroupId = `${newTokenJsonId1}-${newTokenJsonId2}`;
            tokenJson.ID = newGroupId;
        }
        else {
            tokenJson.ID = '-1';
        }
    }
    else {
        const tokenJsonId = tokenJson.ID;
        const newTokenJsonId = (0, exports.incrementIndex)(parseInt(tokenJsonId, 10), arrayFirst, arrayLast, differenceInSize);
        tokenJson.ID = newTokenJsonId.toString();
    }
    // handle HEAD
    const tokenJsonHead = tokenJson.HEAD;
    if (tokenJsonHead !== -1) {
        const newTokenJsonHead = (0, exports.incrementIndex)(tokenJsonHead, arrayFirst, arrayLast, differenceInSize);
        tokenJson.HEAD = newTokenJsonHead;
        if (tokenJson.HEAD === -1) {
            tokenJson.DEPREL = '_';
        }
    }
    return tokenJson;
};
exports.incrementIndexesOfToken = incrementIndexesOfToken;
// Worry : can it return 0 ?
const incrementIndex = (index, arrayFirst, arrayLast, differenceInSize) => {
    if (index < arrayFirst) {
        return index;
    }
    else if (index > arrayLast) {
        return index + differenceInSize;
    }
    else {
        // if index ===
        return -1;
    }
};
exports.incrementIndex = incrementIndex;
const mappingSpacesAfter = [
    ['\\s', 's'],
    ['\\\\t', '\t'],
    ['\\\\n', '\n'],
    ['\\\\v', '\v'],
    ['\\\\f', '\f'],
    ['\\\\r', '\r'],
];
const constructTextFromTreeJson = (treeJson) => {
    let sentence = '';
    for (const tokenId in treeJson.nodesJson) {
        if (treeJson.nodesJson[tokenId] && (0, exports._isGroupToken)(treeJson.nodesJson[tokenId]) === false) {
            const token = treeJson.nodesJson[tokenId];
            const form = token.FORM;
            const space = token.MISC.SpaceAfter === 'No' ? '' : ' ';
            if (token.MISC.SpacesAfter) {
                let spaces = token.MISC.SpacesAfter;
                for (const [SpaceAfter, SpaceAfterConverted] of mappingSpacesAfter) {
                    spaces = spaces.replaceAll(SpaceAfter, SpaceAfterConverted);
                }
                sentence = sentence + form + spaces;
                continue;
            }
            sentence = sentence + form + space;
        }
    }
    return sentence;
};
exports.constructTextFromTreeJson = constructTextFromTreeJson;
