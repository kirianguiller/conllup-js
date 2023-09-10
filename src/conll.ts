export interface featuresJson_T {
  [key: string]: string;
}

export interface depsJson_T {
  [key: string]: string;
}

export type tokenJson_T = {
  ID: string;
  FORM: string;
  LEMMA: string;
  UPOS: string;
  XPOS: string;
  FEATS: featuresJson_T;
  HEAD: number;
  DEPREL: string;
  DEPS: depsJson_T;
  MISC: featuresJson_T;
  [key: string]: string | number | featuresJson_T | depsJson_T;
};

export interface nodesJson_T {
  [key: string]: tokenJson_T;
}

export interface enhancedNodesJson_T {
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

export const emptyFeaturesJson = (): featuresJson_T => ({});
export const emptyDepsJson = (): depsJson_T => ({});

export const emptyTokenJson = (): tokenJson_T => ({
  ID: '_',
  FORM: '_',
  LEMMA: '_',
  UPOS: '_',
  XPOS: '_',
  FEATS: emptyFeaturesJson(),
  HEAD: -1,
  DEPREL: '_',
  DEPS: emptyFeaturesJson(),
  MISC: emptyFeaturesJson(),
});

export const emptyMetaJson = (): metaJson_T => ({});

export const emptyNodesOrGroupsJson = (): nodesJson_T => ({});

export const emptyTreeJson = (): treeJson_T => ({
  nodesJson: emptyNodesOrGroupsJson(),
  groupsJson: emptyNodesOrGroupsJson(),
});

export const emptySentenceJson = (): sentenceJson_T => ({
  metaJson: emptyMetaJson(),
  treeJson: emptyTreeJson(),
});

type tabType_T = 'str' | 'int' | 'dict' | 'deps';
type tabLabel_T = 'ID' | 'FORM' | 'LEMMA' | 'UPOS' | 'XPOS' | 'FEATS' | 'HEAD' | 'DEPREL' | 'DEPS' | 'MISC';

interface tabMeta_T {
  label: tabLabel_T;
  type: tabType_T;
}

const CONLL_STRUCTURE: { [key: number]: tabMeta_T } = {
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

function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}

export const _seperateMetaAndTreeFromSentenceConll = (sentenceConll: string) => {
  const trimmedSentenceConll = sentenceConll.trim();
  const lineConlls = trimmedSentenceConll.split('\n');

  const metaLines: string[] = [];
  const treeLines: string[] = [];
  for (const lineConll of lineConlls) {
    const trimmedLineConll = lineConll.trim();
    if (trimmedLineConll.startsWith('#')) {
      metaLines.push(trimmedLineConll);
    } else if (!isNumeric(trimmedLineConll.slice(0, 1))) {
      // tslint:disable-next-line: no-console
      console.log(`Warning: line didnt't start with a digit or '#' : "${trimmedLineConll}" `);
    } else {
      treeLines.push(trimmedLineConll);
    }
  }
  return { metaLines, treeLines };
};

export const _metaConllLinesToJson = (metaConllLines: string[]): metaJson_T => {
  const metaJson: metaJson_T = emptyMetaJson();
  for (const metaCouple of metaConllLines) {
    const [metaKey, metaValue] = metaCouple.split(' = ');
    const trimmedMetaKey = metaKey.slice(2);
    metaJson[trimmedMetaKey] = metaValue;
  }
  return metaJson;
};

export const _featuresConllToJson = (featuresConll: string): featuresJson_T => {
  const featuresJson: featuresJson_T = emptyFeaturesJson();
  if (featuresConll === '_') {
    return featuresJson;
  }
  const splittedFeaturesConll: string[] = featuresConll.split('|');
  for (const featureCouple of splittedFeaturesConll) {
    const splittedFeature = featureCouple.split('=');
    const featureKey = splittedFeature[0];
    const featureValue = splittedFeature.slice(1).join('=');
    featuresJson[featureKey] = featureValue;
  }
  return featuresJson;
};

export const _depsConllToJson = (depsConll: string): depsJson_T => {
  const depsJson: depsJson_T = emptyFeaturesJson();
  if (depsConll === '_') {
    return depsJson;
  }
  const splittedDepsConll: string[] = depsConll.split('|');
  for (const depsCouple of splittedDepsConll) {
    const splittedDeps = depsCouple.split(':');
    const depsKey = splittedDeps[0];
    const depsValue = splittedDeps.slice(1).join(':');
    depsJson[depsKey] = depsValue;
  }
  return depsJson;
};

const _normalizeHyphensInTab = (tokenTabData: string, tabMeta: tabMeta_T): string => {
  if (['FORM', 'LEMMA'].includes(tabMeta['label'])) return tokenTabData;
  else if (['-', '–'].includes(tokenTabData)) return '_';
  else return tokenTabData;
};
export const _decodeTabData = (
  tokenTabData: string,
  type: tabType_T,
): string | number | featuresJson_T | depsJson_T => {
  if (type === 'str') {
    return tokenTabData;
  } else if (type === 'int') {
    if (tokenTabData === '_') {
      return -1;
    } else {
      return parseInt(tokenTabData, 10);
    }
  } else if (type === 'dict') {
    return _featuresConllToJson(tokenTabData);
  } else if (type === 'deps') {
    return _depsConllToJson(tokenTabData);
  } else {
    throw new Error(`${type} is not a correct type`);
  }
};

export const _tokenConllToJson = (tokenConll: string): tokenJson_T => {
  const trimmedTokenLine: string = tokenConll.trim();
  const splittedTokenLine: string[] = trimmedTokenLine.split('\t');
  if (splittedTokenLine.length !== 10) {
    throw new Error(
      `CONLL PARSING ERROR : line "${tokenConll}" is not valid, ${splittedTokenLine.length} columns found instead of 10`,
    );
  }
  const tokenJson: tokenJson_T = emptyTokenJson();
  for (const tabIndex in CONLL_STRUCTURE) {
    if (CONLL_STRUCTURE.hasOwnProperty(tabIndex)) {
      const tabMeta = CONLL_STRUCTURE[tabIndex];
      const tabData = _normalizeHyphensInTab(splittedTokenLine[tabIndex], tabMeta);

      const label: string = tabMeta['label'];
      const type: tabType_T = tabMeta['type'];
      tokenJson[label] = _decodeTabData(tabData, type);
    }
  }

  return tokenJson;
};

export const _treeConllLinesToJson = (treeConllLines: string[]): treeJson_T => {
  const treeJson = emptyTreeJson();

  for (const tokenConll of treeConllLines) {
    const tokenJson = _tokenConllToJson(tokenConll);
    if (_isGroupToken(tokenJson) === true) {
      // the token is a group token
      treeJson.groupsJson[tokenJson.ID] = tokenJson;
    } else {
      // the token is a normal token
      treeJson.nodesJson[tokenJson.ID] = tokenJson;
    }
  }
  return treeJson;
};

export const sentenceConllToJson = (sentenceConll: string): sentenceJson_T => {
  if (typeof sentenceConll !== 'string') {
    throw new TypeError(
      `parameter \`sentenceConll\` in sentenceConllToJson() is not a string (got \`${typeof sentenceConll}\`)`,
    );
  }
  const sentenceJson: sentenceJson_T = emptySentenceJson();
  const { metaLines, treeLines } = _seperateMetaAndTreeFromSentenceConll(sentenceConll);

  sentenceJson.metaJson = _metaConllLinesToJson(metaLines);
  sentenceJson.treeJson = _treeConllLinesToJson(treeLines);

  return sentenceJson;
};

export const _featuresJsonToConll = (featuresJson: featuresJson_T): string => {
  const splittedFeatureConll: string[] = [];
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

// TODO : refactor deps and features by using one generic function that take ":" "=" (and " = " for meta ?) as parameter
export const _depsJsonToConll = (depsJson: depsJson_T): string => {
  const splittedDepConll: string[] = [];
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

export const _encodeTabData = (tabData: string | number | featuresJson_T | depsJson_T, type: tabType_T): string => {
  if (type === 'str') {
    return tabData as string;
  } else if (type === 'int') {
    if (tabData === -1) {
      return '_';
    } else {
      return tabData.toString() as string;
    }
  } else if (type === 'deps') {
    return _depsJsonToConll(tabData as depsJson_T);
  } else if (type === 'dict') {
    return _featuresJsonToConll(tabData as featuresJson_T);
  } else {
    throw new Error(`${type} is not a correct type`);
  }
};

export const _tokenJsonToConll = (tokenJson: tokenJson_T): string => {
  const splittedTokenConll: string[] = [];
  for (const tabIndex in CONLL_STRUCTURE) {
    if (CONLL_STRUCTURE.hasOwnProperty(tabIndex)) {
      const tabMeta = CONLL_STRUCTURE[tabIndex];
      const tabLabel = tabMeta.label;
      const tabType = tabMeta.type;

      const tabDataJson = tokenJson[tabLabel];
      const tabDataConll = _encodeTabData(tabDataJson, tabType);
      splittedTokenConll.push(tabDataConll);
    }
  }
  const tokenConll = splittedTokenConll.join('\t');
  return tokenConll;
};

export const _treeJsonToConll = (treeJson: treeJson_T): string => {
  const treeConllLines: string[] = [];
  const tokensJson = { ...treeJson.nodesJson, ...treeJson.groupsJson };
  const tokenIndexes = Object.values(tokensJson).map((tokenJson) => {
    return tokenJson.ID;
  });
  const sortedTokenIndexes = _sortTokenIndexes(tokenIndexes);
  for (const tokenIndex of sortedTokenIndexes) {
    const tokenJson = tokensJson[tokenIndex];
    const tokenConll = _tokenJsonToConll(tokenJson);
    treeConllLines.push(tokenConll);
  }

  const treeConll = treeConllLines.join('\n');
  return treeConll;
};

export const _metaJsonToConll = (metaJson: metaJson_T): string => {
  const metaConllLines: string[] = [];

  for (const metaKey in metaJson) {
    if (metaJson.hasOwnProperty(metaKey)) {
      const metaValue = metaJson[metaKey];
      const metaConllLine = `# ${metaKey} = ${metaValue}`;
      metaConllLines.push(metaConllLine);
    } else {
      throw Error(`metaJson don't possess the key '${metaKey}'`);
    }
  }

  const metaConll = metaConllLines.join('\n');

  return metaConll;
};

export const sentenceJsonToConll = (sentenceJson: sentenceJson_T): string => {
  const metaConll = _metaJsonToConll(sentenceJson.metaJson);
  const treeConll = _treeJsonToConll(sentenceJson.treeJson);
  if (metaConll === '') {
    return treeConll;
  }
  return `${metaConll}\n${treeConll}`;
};

export const _sortTokenIndexes = (tokenIndexes: string[]): string[] => {
  return tokenIndexes.sort(_compareTokenIndexes);
};

export const _compareTokenIndexes = (a: string, b: string): number => {
  const a1 = parseInt(a.split('-')[0], 10);
  const b1 = parseInt(b.split('-')[0], 10);
  if (a1 - b1 !== 0) {
    return a1 - b1;
  } else {
    return b.length - a.length;
  }
};

export const _isGroupToken = (tokenJson: tokenJson_T): boolean => {
  return tokenJson.ID.indexOf('-') > -1;
};

// See https://github.com/Arborator/arborator-frontend/issues/184 for a description of the features
// ... and the associated behaviors
type replaceAction_t =
  | 'SPLIT_ONE_TOKEN_INTO_MANY' // this one also include the ADD_TOKEN_TO_RIGHT feature
  | 'RENAME_ONE_TOKEN'
  | 'DELETE_ONE_TOKEN'
  | 'OTHER';

export const replaceArrayOfTokens = (
  treeJson: treeJson_T,
  oldTokensIndexes: number[],
  newTokensForms: string[],
  smartBehavior: boolean = false,
): treeJson_T => {
  const newNodesJson = emptyNodesOrGroupsJson();
  const newGroupsJson = emptyNodesOrGroupsJson();

  let replaceAction: replaceAction_t = 'OTHER';

  if (oldTokensIndexes.length === 1) {
    if (newTokensForms.length === 0) {
      replaceAction = 'DELETE_ONE_TOKEN';
    } else if (newTokensForms.length === 1) {
      replaceAction = 'RENAME_ONE_TOKEN';
    } else if (newTokensForms.length >= 1) {
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
    let newTokenJson = emptyTokenJson();
    if (
      smartBehavior === true &&
      (replaceAction === 'RENAME_ONE_TOKEN' || replaceAction === 'SPLIT_ONE_TOKEN_INTO_MANY')
    ) {
      const oldTokenIndex = oldTokensIndexes[0];
      newTokenJson = JSON.parse(JSON.stringify(treeJson.nodesJson[oldTokenIndex.toString()]));
      newTokenJson.HEAD = incrementIndex(
        'HEAD',
        newTokenJson.HEAD,
        arrayFirst,
        arrayLast,
        differenceInSize,
        smartBehavior,
      );
    }
    newTokenJson.ID = newTokenIndex.toString();
    newTokenJson.FORM = newTokenForm;
    newTokenJson.LEMMA = newTokenForm;
    newNodesJson[newTokenJson.ID] = newTokenJson;
    newTokenIndex++;
  }

  // add old tokens with corrected indexes
  for (const oldTokenJson of Object.values({ ...treeJson.nodesJson, ...treeJson.groupsJson })) {
    const oldTokenJsonCopy: tokenJson_T = JSON.parse(JSON.stringify(oldTokenJson));
    const newTokenJson = incrementIndexesOfToken(
      oldTokenJsonCopy,
      arrayFirst,
      arrayLast,
      differenceInSize,
      smartBehavior,
    );

    if (newTokenJson.ID !== '-1') {
      if (_isGroupToken(newTokenJson) === true) {
        // the token is a group token
        newGroupsJson[newTokenJson.ID] = newTokenJson;
      } else {
        // the token is a normal token
        newNodesJson[newTokenJson.ID] = newTokenJson;
      }
    }
  }
  const newTreeJson: treeJson_T = {
    nodesJson: newNodesJson,
    groupsJson: newGroupsJson,
  };
  return newTreeJson;
};

// TODO GROUP TOKEN REFACTOR
export const incrementIndexesOfToken = (
  tokenJson: tokenJson_T,
  arrayFirst: number,
  arrayLast: number,
  differenceInSize: number,
  smartBehavior: boolean,
): tokenJson_T => {
  // handle ID
  if (_isGroupToken(tokenJson)) {
    const [tokenJsonId1, tokenJsonId2] = tokenJson.ID.split('-');
    const newTokenJsonId1 = incrementIndex(
      'ID',
      parseInt(tokenJsonId1, 10),
      arrayFirst,
      arrayLast,
      differenceInSize,
      smartBehavior,
    );
    const newTokenJsonId2 = incrementIndex(
      'ID',
      parseInt(tokenJsonId2, 10),
      arrayFirst,
      arrayLast,
      differenceInSize,
      smartBehavior,
    );
    if (newTokenJsonId1 !== -1 && newTokenJsonId2 !== -1) {
      const newGroupId = `${newTokenJsonId1}-${newTokenJsonId2}`;
      tokenJson.ID = newGroupId;
    } else {
      tokenJson.ID = '-1';
    }
  } else {
    const tokenJsonId = tokenJson.ID;
    const newTokenJsonId = incrementIndex(
      'ID',
      parseInt(tokenJsonId, 10),
      arrayFirst,
      arrayLast,
      differenceInSize,
      smartBehavior,
    );
    tokenJson.ID = newTokenJsonId.toString();
  }

  // handle HEAD
  const tokenJsonHead = tokenJson.HEAD;
  if (tokenJsonHead !== -1) {
    const newTokenJsonHead = incrementIndex(
      'HEAD',
      tokenJsonHead,
      arrayFirst,
      arrayLast,
      differenceInSize,
      smartBehavior,
    );
    tokenJson.HEAD = newTokenJsonHead;

    if (tokenJson.HEAD === -1) {
      tokenJson.DEPREL = '_';
    }
  }
  // handle DEPS
  const newDepsJson: depsJson_T = emptyDepsJson();
  for (const depHead in tokenJson.DEPS) {
    if (tokenJson.DEPS.hasOwnProperty(depHead)) {
      const newDepHead = incrementIndex(
        'HEAD',
        parseInt(depHead, 10),
        arrayFirst,
        arrayLast,
        differenceInSize,
        smartBehavior,
      );
      if (newDepHead !== -1) {
        newDepsJson[newDepHead.toString()] = tokenJson.DEPS[depHead];
      }
    }
  }
  tokenJson.DEPS = newDepsJson;
  return tokenJson;
};

// Worry : can it return 0 ?
export const incrementIndex = (
  idOrHead: 'ID' | 'HEAD',
  index: number,
  arrayFirst: number,
  arrayLast: number,
  differenceInSize: number,
  smartBehavior: boolean,
): number => {
  if (index < arrayFirst) {
    return index;
  } else if (index > arrayLast) {
    return index + differenceInSize;
  } else if (idOrHead === 'HEAD' && smartBehavior) {
    return index;
  } else {
    return -1;
  }
};

const mappingSpacesAfter: [string, string][] = [
  ['\\s', 's'],
  ['\\\\t', '\t'],
  ['\\\\n', '\n'],
  ['\\\\v', '\v'],
  ['\\\\f', '\f'],
  ['\\\\r', '\r'],
];

export const constructTextFromTreeJson = (treeJson: treeJson_T) => {
  let sentence = '';
  for (const tokenId in treeJson.nodesJson) {
    if (treeJson.nodesJson[tokenId] && _isGroupToken(treeJson.nodesJson[tokenId]) === false) {
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
