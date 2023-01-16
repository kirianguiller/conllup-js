export interface FeatureJson {
  [key: string]: string;
}

export type TokenJson = {
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

export const emptyFeatureJson = (): FeatureJson => ({});

export const emptyTokenJson = (): TokenJson => ({
  ID: '_',
  FORM: '_',
  LEMMA: '_',
  UPOS: '_',
  XPOS: '_',
  FEATS: emptyFeatureJson(),
  HEAD: -1,
  DEPREL: '_',
  DEPS: emptyFeatureJson(),
  MISC: emptyFeatureJson(),
});

export const emptyMetaJson = (): MetaJson => ({});

export const emptyNodesOrGroupsJson = (): NodesJson => ({});

export const emptyTreeJson = (): TreeJson => ({
  nodesJson: emptyNodesOrGroupsJson(),
  groupsJson: emptyNodesOrGroupsJson(),
});

export const emptySentenceJson = (): SentenceJson => ({
  metaJson: emptyMetaJson(),
  treeJson: emptyTreeJson(),
});

const CONLL_STRUCTURE: { [key: number]: { [key: string]: string } } = {
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

export const _metaConllLinesToJson = (metaConllLines: string[]): MetaJson => {
  const metaJson: MetaJson = emptyMetaJson();
  for (const metaCouple of metaConllLines) {
    const [metaKey, metaValue] = metaCouple.split(' = ');
    const trimmedMetaKey = metaKey.slice(2);
    metaJson[trimmedMetaKey] = metaValue;
  }
  return metaJson;
};
export const _tabDictToJson = (featureConll: string): FeatureJson => {
  const featureJson: FeatureJson = emptyFeatureJson();
  if (featureConll === '_') {
    return featureJson;
  }
  const splittedFeaturesConll: string[] = featureConll.split('|');
  for (const featureCouple of splittedFeaturesConll) {
    const splittedFeature = featureCouple.split('=');
    const featureKey = splittedFeature[0];
    const featureValue = splittedFeature.slice(1).join('=');
    featureJson[featureKey] = featureValue;
  }
  return featureJson;
};

const _normalizeNull = (tokenTabData: string, tabMeta: { [key: string]: string }): string => {
  if (['FORM', 'LEMMA'].includes(tabMeta['label'])) return tokenTabData;
  else if (['-', '–'].includes(tokenTabData)) return '_';
  else return tokenTabData;
};
export const _extractTokenTabData = (tokenTabData: string, type: string): string | number | FeatureJson => {
  if (type === 'str') {
    return tokenTabData;
  } else if (type === 'int') {
    if (tokenTabData === '_') {
      return -1;
    } else {
      return parseInt(tokenTabData, 10);
    }
  } else if (type === 'dict') {
    return _tabDictToJson(tokenTabData);
  } else {
    throw new Error(`${type} is not a correct type`);
  }
};

export const _tokenLineToJson = (tokenLine: string): TokenJson => {
  const trimmedTokenLine: string = tokenLine.trim();
  const splittedTokenLine: string[] = trimmedTokenLine.split('\t');
  if (splittedTokenLine.length !== 10) {
    throw new Error(
      `CONLL PARSING ERROR : line "${tokenLine}" is not valid, ${splittedTokenLine.length} columns found instead of 10`,
    );
  }
  const tokenJson: TokenJson = emptyTokenJson();
  for (const tabIndex in CONLL_STRUCTURE) {
    if (CONLL_STRUCTURE.hasOwnProperty(tabIndex)) {
      const tabMeta = CONLL_STRUCTURE[tabIndex];
      const tabData = _normalizeNull(splittedTokenLine[tabIndex], tabMeta);

      const label: string = tabMeta['label'];
      const type: string = tabMeta['type'];
      tokenJson[label] = _extractTokenTabData(tabData, type);
    }
  }

  return tokenJson;
};

export const _treeConllLinesToJson = (treeConllLines: string[]): TreeJson => {
  const treeJson = emptyTreeJson();

  for (const tokenLine of treeConllLines) {
    const tokenJson = _tokenLineToJson(tokenLine);
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

export const sentenceConllToJson = (sentenceConll: string): SentenceJson => {
  if (typeof sentenceConll !== 'string') {
    throw new TypeError(
      `parameter \`sentenceConll\` in sentenceConllToJson() is not a string (got \`${typeof sentenceConll}\`)`,
    );
  }
  const sentenceJson: SentenceJson = emptySentenceJson();
  const { metaLines, treeLines } = _seperateMetaAndTreeFromSentenceConll(sentenceConll);

  sentenceJson.metaJson = _metaConllLinesToJson(metaLines);
  sentenceJson.treeJson = _treeConllLinesToJson(treeLines);

  return sentenceJson;
};

export const _tabJsonToDict = (featureJson: FeatureJson): string => {
  const splittedFeatureConll: string[] = [];
  for (const featureKey in featureJson) {
    if (featureJson.hasOwnProperty(featureKey)) {
      const featureValue = featureJson[featureKey];
      splittedFeatureConll.push(`${featureKey}=${featureValue}`);
    } else {
      throw Error(`featureJson don't possess the key '${featureKey}'`);
    }
  }
  let featureConll = splittedFeatureConll.join('|');
  if (featureConll === '') {
    featureConll = '_';
  }
  return featureConll;
};

export const _tabDataJsonToConll = (tabData: string | number | FeatureJson, type: string) => {
  if (type === 'str') {
    return tabData as string;
  } else if (type === 'int') {
    if (tabData === -1) {
      return '_';
    } else {
      return tabData.toString() as string;
    }
  } else if (type === 'dict') {
    return _tabJsonToDict(tabData as FeatureJson);
  } else {
    throw new Error(`${type} is not a correct type`);
  }
};

export const _tokenJsonToLine = (tokenJson: TokenJson): string => {
  const splittedTokenConll: string[] = [];
  for (const tabIndex in CONLL_STRUCTURE) {
    if (CONLL_STRUCTURE.hasOwnProperty(tabIndex)) {
      const tabMeta = CONLL_STRUCTURE[tabIndex];
      const tabLabel: string = tabMeta['label'];
      const tabtype: string = tabMeta['type'];

      const tabDataJson = tokenJson[tabLabel] as string | number | FeatureJson;
      const tabDataConll = _tabDataJsonToConll(tabDataJson, tabtype);
      splittedTokenConll.push(tabDataConll);
    }
  }
  const tokenConll = splittedTokenConll.join('\t');
  return tokenConll;
};

export const _treeJsonToConll = (treeJson: TreeJson): string => {
  const treeConllLines: string[] = [];
  const tokensJson = { ...treeJson.nodesJson, ...treeJson.groupsJson };
  const tokenIndexes = Object.values(tokensJson).map((tokenJson) => {
    return tokenJson.ID;
  });
  const sortedTokenIndexes = _sortTokenIndexes(tokenIndexes);
  for (const tokenIndex of sortedTokenIndexes) {
    const tokenJson = tokensJson[tokenIndex];
    const tokenConll = _tokenJsonToLine(tokenJson);
    treeConllLines.push(tokenConll);
  }

  const treeConll = treeConllLines.join('\n');
  return treeConll;
};

export const _metaJsonToConll = (metaJson: MetaJson): string => {
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

export const sentenceJsonToConll = (sentenceJson: SentenceJson): string => {
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

export const _isGroupToken = (tokenJson: TokenJson): boolean => {
  return tokenJson.ID.indexOf('-') > -1;
};

export const replaceArrayOfTokens = (
  treeJson: TreeJson,
  oldTokensIndexes: number[],
  newTokensForms: string[],
): TreeJson => {
  const newNodesJson = emptyNodesOrGroupsJson();
  const newGroupsJson = emptyNodesOrGroupsJson();

  // add new tokens to new tree
  let newTokenIndex = oldTokensIndexes[0];
  for (const newTokenForm of newTokensForms) {
    const newTokenJson = emptyTokenJson();
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
    const oldTokenJsonCopy: TokenJson = JSON.parse(JSON.stringify(oldTokenJson));
    const newTokenJson = incrementIndexesOfToken(oldTokenJsonCopy, arrayFirst, arrayLast, differenceInSize);

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
  const newTreeJson: TreeJson = {
    nodesJson: newNodesJson,
    groupsJson: newGroupsJson,
  };
  return newTreeJson;
};

// TODO GROUP TOKEN REFACTOR
export const incrementIndexesOfToken = (
  tokenJson: TokenJson,
  arrayFirst: number,
  arrayLast: number,
  differenceInSize: number,
): TokenJson => {
  // handle ID
  if (_isGroupToken(tokenJson)) {
    const [tokenJsonId1, tokenJsonId2] = tokenJson.ID.split('-');
    const newTokenJsonId1 = incrementIndex(parseInt(tokenJsonId1, 10), arrayFirst, arrayLast, differenceInSize);
    const newTokenJsonId2 = incrementIndex(parseInt(tokenJsonId2, 10), arrayFirst, arrayLast, differenceInSize);
    if (newTokenJsonId1 !== -1 && newTokenJsonId2 !== -1) {
      const newGroupId = `${newTokenJsonId1}-${newTokenJsonId2}`;
      tokenJson.ID = newGroupId;
    } else {
      tokenJson.ID = '-1';
    }
  } else {
    const tokenJsonId = tokenJson.ID;
    const newTokenJsonId = incrementIndex(parseInt(tokenJsonId, 10), arrayFirst, arrayLast, differenceInSize);
    tokenJson.ID = newTokenJsonId.toString();
  }

  // handle HEAD
  const tokenJsonHead = tokenJson.HEAD;
  if (tokenJsonHead !== -1) {
    const newTokenJsonHead = incrementIndex(tokenJsonHead, arrayFirst, arrayLast, differenceInSize);
    tokenJson.HEAD = newTokenJsonHead;
    if (tokenJson.HEAD === -1) {
      tokenJson.DEPREL = '_';
    }
  }

  return tokenJson;
};

// Worry : can it return 0 ?
export const incrementIndex = (
  index: number,
  arrayFirst: number,
  arrayLast: number,
  differenceInSize: number,
): number => {
  if (index < arrayFirst) {
    return index;
  } else if (index > arrayLast) {
    return index + differenceInSize;
  } else {
    // if index ===
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

export const constructTextFromTreeJson = (treeJson: TreeJson) => {
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
