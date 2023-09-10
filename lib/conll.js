"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructTextFromTreeJson = exports.incrementIndex = exports.incrementIndexesOfToken = exports.replaceArrayOfTokens = exports._isEnhancedToken = exports._isGroupToken = exports._compareTokenIndexes = exports._sortTokenIndexes = exports.sentenceJsonToConll = exports._metaJsonToConll = exports._treeJsonToConll = exports._tokenJsonToConll = exports._encodeTabData = exports._depsJsonToConll = exports._featuresJsonToConll = exports.sentenceConllToJson = exports._treeConllLinesToJson = exports._tokenConllToJson = exports._decodeTabData = exports._depsConllToJson = exports._featuresConllToJson = exports._metaConllLinesToJson = exports._seperateMetaAndTreeFromSentenceConll = exports.emptySentenceJson = exports.emptyTreeJson = exports.emptyNodesOrGroupsJson = exports.emptyMetaJson = exports.emptyTokenJson = exports.emptyDepsJson = exports.emptyFeaturesJson = void 0;
const emptyFeaturesJson = () => ({});
exports.emptyFeaturesJson = emptyFeaturesJson;
const emptyDepsJson = () => ({});
exports.emptyDepsJson = emptyDepsJson;
const emptyTokenJson = () => ({
    ID: '_',
    FORM: '_',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: (0, exports.emptyFeaturesJson)(),
    HEAD: -1,
    DEPREL: '_',
    DEPS: (0, exports.emptyFeaturesJson)(),
    MISC: (0, exports.emptyFeaturesJson)(),
});
exports.emptyTokenJson = emptyTokenJson;
const emptyMetaJson = () => ({});
exports.emptyMetaJson = emptyMetaJson;
const emptyNodesOrGroupsJson = () => ({});
exports.emptyNodesOrGroupsJson = emptyNodesOrGroupsJson;
const emptyTreeJson = () => ({
    nodesJson: (0, exports.emptyNodesOrGroupsJson)(),
    groupsJson: (0, exports.emptyNodesOrGroupsJson)(),
    enhancedNodesJson: (0, exports.emptyNodesOrGroupsJson)(),
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
    8: { label: 'DEPS', type: 'deps' },
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
const _featuresConllToJson = (featuresConll) => {
    const featuresJson = (0, exports.emptyFeaturesJson)();
    if (featuresConll === '_') {
        return featuresJson;
    }
    const splittedFeaturesConll = featuresConll.split('|');
    for (const featureCouple of splittedFeaturesConll) {
        const splittedFeature = featureCouple.split('=');
        const featureKey = splittedFeature[0];
        const featureValue = splittedFeature.slice(1).join('=');
        featuresJson[featureKey] = featureValue;
    }
    return featuresJson;
};
exports._featuresConllToJson = _featuresConllToJson;
const _depsConllToJson = (depsConll) => {
    const depsJson = (0, exports.emptyFeaturesJson)();
    if (depsConll === '_') {
        return depsJson;
    }
    const splittedDepsConll = depsConll.split('|');
    for (const depsCouple of splittedDepsConll) {
        const splittedDeps = depsCouple.split(':');
        const depsKey = splittedDeps[0];
        const depsValue = splittedDeps.slice(1).join(':');
        depsJson[depsKey] = depsValue;
    }
    return depsJson;
};
exports._depsConllToJson = _depsConllToJson;
const _normalizeHyphensInTab = (tokenTabData, tabMeta) => {
    if (['FORM', 'LEMMA'].includes(tabMeta['label']))
        return tokenTabData;
    else if (['-', '–'].includes(tokenTabData))
        return '_';
    else
        return tokenTabData;
};
const _decodeTabData = (tokenTabData, type) => {
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
        return (0, exports._featuresConllToJson)(tokenTabData);
    }
    else if (type === 'deps') {
        return (0, exports._depsConllToJson)(tokenTabData);
    }
    else {
        throw new Error(`${type} is not a correct type`);
    }
};
exports._decodeTabData = _decodeTabData;
const _tokenConllToJson = (tokenConll) => {
    const trimmedTokenLine = tokenConll.trim();
    const splittedTokenLine = trimmedTokenLine.split('\t');
    if (splittedTokenLine.length !== 10) {
        throw new Error(`CONLL PARSING ERROR : line "${tokenConll}" is not valid, ${splittedTokenLine.length} columns found instead of 10`);
    }
    const tokenJson = (0, exports.emptyTokenJson)();
    for (const tabIndex in CONLL_STRUCTURE) {
        if (CONLL_STRUCTURE.hasOwnProperty(tabIndex)) {
            const tabMeta = CONLL_STRUCTURE[tabIndex];
            const tabData = _normalizeHyphensInTab(splittedTokenLine[tabIndex], tabMeta);
            const label = tabMeta['label'];
            const type = tabMeta['type'];
            tokenJson[label] = (0, exports._decodeTabData)(tabData, type);
        }
    }
    return tokenJson;
};
exports._tokenConllToJson = _tokenConllToJson;
const _treeConllLinesToJson = (treeConllLines) => {
    const treeJson = (0, exports.emptyTreeJson)();
    for (const tokenConll of treeConllLines) {
        const tokenJson = (0, exports._tokenConllToJson)(tokenConll);
        if ((0, exports._isGroupToken)(tokenJson) === true) {
            // the token is a group token
            treeJson.groupsJson[tokenJson.ID] = tokenJson;
        }
        else if ((0, exports._isEnhancedToken)(tokenJson)) {
            // the token is an enhanced token
            treeJson.enhancedNodesJson[tokenJson.ID] = tokenJson;
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
const _featuresJsonToConll = (featuresJson) => {
    const splittedFeatureConll = [];
    Object.keys(featuresJson)
        .sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    })
        .forEach((featureKey, i) => {
        const featureValue = featuresJson[featureKey];
        splittedFeatureConll.push(`${featureKey}=${featureValue}`);
    });
    let featuresConll = splittedFeatureConll.join('|');
    if (featuresConll === '') {
        featuresConll = '_';
    }
    return featuresConll;
};
exports._featuresJsonToConll = _featuresJsonToConll;
// TODO : refactor deps and features by using one generic function that take ":" "=" (and " = " for meta ?) as parameter
const _depsJsonToConll = (depsJson) => {
    const splittedDepConll = [];
    Object.keys(depsJson)
        .sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    })
        .forEach((depKey, i) => {
        const depValue = depsJson[depKey];
        splittedDepConll.push(`${depKey}:${depValue}`);
    });
    let depsConll = splittedDepConll.join('|');
    if (depsConll === '') {
        depsConll = '_';
    }
    return depsConll;
};
exports._depsJsonToConll = _depsJsonToConll;
const _encodeTabData = (tabData, type) => {
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
    else if (type === 'deps') {
        return (0, exports._depsJsonToConll)(tabData);
    }
    else if (type === 'dict') {
        return (0, exports._featuresJsonToConll)(tabData);
    }
    else {
        throw new Error(`${type} is not a correct type`);
    }
};
exports._encodeTabData = _encodeTabData;
const _tokenJsonToConll = (tokenJson) => {
    const splittedTokenConll = [];
    for (const tabIndex in CONLL_STRUCTURE) {
        if (CONLL_STRUCTURE.hasOwnProperty(tabIndex)) {
            const tabMeta = CONLL_STRUCTURE[tabIndex];
            const tabLabel = tabMeta.label;
            const tabType = tabMeta.type;
            const tabDataJson = tokenJson[tabLabel];
            const tabDataConll = (0, exports._encodeTabData)(tabDataJson, tabType);
            splittedTokenConll.push(tabDataConll);
        }
    }
    const tokenConll = splittedTokenConll.join('\t');
    return tokenConll;
};
exports._tokenJsonToConll = _tokenJsonToConll;
const _treeJsonToConll = (treeJson) => {
    const treeConllLines = [];
    const tokensJson = { ...treeJson.nodesJson, ...treeJson.groupsJson, ...treeJson.enhancedNodesJson };
    const tokenIndexes = Object.values(tokensJson).map((tokenJson) => {
        return tokenJson.ID;
    });
    const sortedTokenIndexes = (0, exports._sortTokenIndexes)(tokenIndexes);
    for (const tokenIndex of sortedTokenIndexes) {
        const tokenJson = tokensJson[tokenIndex];
        const tokenConll = (0, exports._tokenJsonToConll)(tokenJson);
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
    let a1 = 0;
    let a2 = 0;
    let a3 = 0;
    if (a.indexOf('-') > -1) {
        a1 = parseInt(a.split('-')[0], 10);
        a2 = parseInt(a.split('-')[1], 10);
    }
    else if (a.indexOf('.') > -1) {
        a1 = parseInt(a.split('.')[0], 10);
        a3 = parseInt(a.split('.')[1], 10);
    }
    else {
        a1 = parseInt(a, 10);
    }
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    if (b.indexOf('-') > -1) {
        b1 = parseInt(b.split('-')[0], 10);
        b2 = parseInt(b.split('-')[1], 10);
    }
    else if (b.indexOf('.') > -1) {
        b1 = parseInt(b.split('.')[0], 10);
        b3 = parseInt(b.split('.')[1], 10);
    }
    else {
        b1 = parseInt(b, 10);
    }
    if (a1 - b1 !== 0 || (!a2 && !a3 && !b2 && !b3)) {
        // first numbers are different, or both number are same and without extension (normally impossible)
        return a1 - b1;
    }
    else if (a3 && b3) {
        // both are enhanced tokens with same first number (X.1 and X.2 with X a number)
        return a3 - b3;
    }
    else if (a2 && b2) {
        // both are group tokens with same first number (10-11 ; 10-12) , normally impossible
        return a2 - b2;
    }
    else if (a2 || b3) {
        // either a is group token (they are before normal tokens) or b is enhanced (they are after normal tokens)
        return -1;
    }
    else {
        return 1;
    }
};
exports._compareTokenIndexes = _compareTokenIndexes;
const _isGroupToken = (tokenJson) => {
    return tokenJson.ID.indexOf('-') > -1;
};
exports._isGroupToken = _isGroupToken;
const _isEnhancedToken = (tokenJson) => {
    return tokenJson.ID.indexOf('.') > -1;
};
exports._isEnhancedToken = _isEnhancedToken;
const replaceArrayOfTokens = (treeJson, oldTokensIndexes, newTokensForms, smartBehavior = false) => {
    const newNodesJson = (0, exports.emptyNodesOrGroupsJson)();
    const newGroupsJson = (0, exports.emptyNodesOrGroupsJson)();
    const newEnhancedNodesJson = (0, exports.emptyNodesOrGroupsJson)();
    let replaceAction = 'OTHER';
    if (oldTokensIndexes.length === 1) {
        if (newTokensForms.length === 0) {
            replaceAction = 'DELETE_ONE_TOKEN';
        }
        else if (newTokensForms.length === 1) {
            replaceAction = 'RENAME_ONE_TOKEN';
        }
        else if (newTokensForms.length >= 1) {
            replaceAction = 'SPLIT_ONE_TOKEN_INTO_MANY';
        }
    }
    // tslint:disable-next-line: no-console
    console.log(`replaceArrayOfTokens() : detected action = "${replaceAction}"`);
    const differenceInSize = newTokensForms.length - oldTokensIndexes.length;
    const arrayFirst = oldTokensIndexes[0];
    const arrayLast = oldTokensIndexes[oldTokensIndexes.length - 1];
    // add new tokens to new tree
    let newTokenIndex = oldTokensIndexes[0];
    for (const newTokenForm of newTokensForms) {
        let newTokenJson = (0, exports.emptyTokenJson)();
        if (smartBehavior === true &&
            (replaceAction === 'RENAME_ONE_TOKEN' || replaceAction === 'SPLIT_ONE_TOKEN_INTO_MANY')) {
            // This smart behavior allow duplication of the fields of the existing token into the renamed (or splitted) token(s)
            const oldTokenIndex = oldTokensIndexes[0];
            newTokenJson = JSON.parse(JSON.stringify(treeJson.nodesJson[oldTokenIndex.toString()]));
            newTokenJson = (0, exports.incrementIndexesOfToken)(newTokenJson, arrayFirst, arrayLast, differenceInSize, smartBehavior);
        }
        newTokenJson.ID = newTokenIndex.toString();
        newTokenJson.FORM = newTokenForm;
        newTokenJson.LEMMA = newTokenForm;
        newNodesJson[newTokenJson.ID] = newTokenJson;
        newTokenIndex++;
    }
    // add old tokens with corrected indexes
    for (const oldTokenJson of Object.values({
        ...treeJson.nodesJson,
        ...treeJson.groupsJson,
        ...treeJson.enhancedNodesJson,
    })) {
        const oldTokenJsonCopy = JSON.parse(JSON.stringify(oldTokenJson));
        const newTokenJson = (0, exports.incrementIndexesOfToken)(oldTokenJsonCopy, arrayFirst, arrayLast, differenceInSize, smartBehavior);
        if (newTokenJson.ID !== '-1') {
            if ((0, exports._isGroupToken)(newTokenJson) === true) {
                // the token is a group token
                newGroupsJson[newTokenJson.ID] = newTokenJson;
            }
            else if ((0, exports._isEnhancedToken)(newTokenJson)) {
                newEnhancedNodesJson[newTokenJson.ID] = newTokenJson;
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
        enhancedNodesJson: newEnhancedNodesJson,
    };
    return newTreeJson;
};
exports.replaceArrayOfTokens = replaceArrayOfTokens;
// TODO GROUP TOKEN REFACTOR
const incrementIndexesOfToken = (tokenJson, arrayFirst, arrayLast, differenceInSize, smartBehavior) => {
    // handle ID
    if ((0, exports._isGroupToken)(tokenJson)) {
        const [tokenJsonId1, tokenJsonId2] = tokenJson.ID.split('-');
        const newTokenJsonId1 = (0, exports.incrementIndex)('ID', parseInt(tokenJsonId1, 10), arrayFirst, arrayLast, differenceInSize, smartBehavior);
        const newTokenJsonId2 = (0, exports.incrementIndex)('ID', parseInt(tokenJsonId2, 10), arrayFirst, arrayLast, differenceInSize, smartBehavior);
        if (newTokenJsonId1 !== -1 && newTokenJsonId2 !== -1) {
            const newGroupId = `${newTokenJsonId1}-${newTokenJsonId2}`;
            tokenJson.ID = newGroupId;
        }
        else {
            tokenJson.ID = '-1';
        }
    }
    else if ((0, exports._isEnhancedToken)(tokenJson)) {
        const [tokenJsonId1, tokenJsonId2] = tokenJson.ID.split('.');
        const newTokenJsonId1 = (0, exports.incrementIndex)('ID', parseInt(tokenJsonId1, 10), arrayFirst, arrayLast, differenceInSize, smartBehavior);
        if (newTokenJsonId1 !== -1) {
            const newEnhancedTokenId = `${newTokenJsonId1}.${tokenJsonId2}`;
            tokenJson.ID = newEnhancedTokenId;
        }
        else {
            tokenJson.ID = '-1';
        }
    }
    else {
        const tokenJsonId = tokenJson.ID;
        const newTokenJsonId = (0, exports.incrementIndex)('ID', parseInt(tokenJsonId, 10), arrayFirst, arrayLast, differenceInSize, smartBehavior);
        tokenJson.ID = newTokenJsonId.toString();
    }
    // handle HEAD
    const tokenJsonHead = tokenJson.HEAD;
    if (tokenJsonHead !== -1) {
        const newTokenJsonHead = (0, exports.incrementIndex)('HEAD', tokenJsonHead, arrayFirst, arrayLast, differenceInSize, smartBehavior);
        tokenJson.HEAD = newTokenJsonHead;
        if (tokenJson.HEAD === -1) {
            tokenJson.DEPREL = '_';
        }
    }
    // handle DEPS
    const newDepsJson = (0, exports.emptyDepsJson)();
    for (const depHead in tokenJson.DEPS) {
        if (tokenJson.DEPS.hasOwnProperty(depHead)) {
            let subHead = '';
            if (depHead.indexOf('.') > -1) {
                subHead = depHead.split('.')[1];
            }
            let newDepHead = (0, exports.incrementIndex)('HEAD', parseInt(depHead, 10), arrayFirst, arrayLast, differenceInSize, smartBehavior).toString();
            if (newDepHead !== '-1') {
                if (subHead !== '') {
                    newDepHead = `${newDepHead}.${subHead}`;
                }
                newDepsJson[newDepHead] = tokenJson.DEPS[depHead];
            }
        }
    }
    tokenJson.DEPS = newDepsJson;
    return tokenJson;
};
exports.incrementIndexesOfToken = incrementIndexesOfToken;
// Worry : can it return 0 ?
const incrementIndex = (idOrHead, index, arrayFirst, arrayLast, differenceInSize, smartBehavior) => {
    if (index < arrayFirst) {
        return index;
    }
    else if (index > arrayLast) {
        return index + differenceInSize;
    }
    else if (idOrHead === 'HEAD' && smartBehavior) {
        return index;
    }
    else {
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
