export interface FeatureJson {
  [key: string]: string;
}

export interface TokenJson {
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
  isGroup: boolean;
  [key: string]: string | number | FeatureJson | boolean;
}

export interface TreeJson {
  [key: string]: TokenJson;
}

export interface MetaJson {
  [key: string]: string | number;
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
  isGroup: false,
});

export const emptyMetaJson = (): MetaJson => ({});

export const emptyTreeJson = (): TreeJson => ({});

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

export const _extractTokenTabData = (tokenTabData: string, type: string): string | number | FeatureJson => {
  if (['-', '–'].includes(tokenTabData)) {
    tokenTabData = '_';
  }

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

  const tokenJson: TokenJson = emptyTokenJson();
  for (const tabIndex in CONLL_STRUCTURE) {
    if (CONLL_STRUCTURE.hasOwnProperty(tabIndex)) {
      const tabMeta = CONLL_STRUCTURE[tabIndex];
      const tabData = splittedTokenLine[tabIndex];

      const label: string = tabMeta['label'];
      const type: string = tabMeta['type'];
      tokenJson[label] = _extractTokenTabData(tabData, type);
    }
  }

  // add the meta information about if token is a group or not
  if (tokenJson.ID.indexOf('-') > -1) {
    tokenJson.isGroup = true;
  }
  return tokenJson;
};

export const _treeConllLinesToJson = (treeConllLines: string[]): TreeJson => {
  const treeJson: TreeJson = emptyTreeJson();

  let tokenIndex: number = 1;
  for (const tokenLine of treeConllLines) {
    const tokenJson = _tokenLineToJson(tokenLine);
    treeJson[tokenJson.ID] = tokenJson;
    tokenIndex = tokenIndex + 1;
  }
  return treeJson;
};

export const sentenceConllToJson = (sentenceConll: string): SentenceJson => {
  const sentenceJson: SentenceJson = emptySentenceJson();
  const { metaLines, treeLines } = _seperateMetaAndTreeFromSentenceConll(sentenceConll);
  sentenceJson['metaJson'] = _metaConllLinesToJson(metaLines);
  sentenceJson['treeJson'] = _treeConllLinesToJson(treeLines);

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
  const tokenIndexes = Object.values(treeJson).map((tokenJson) => {
    return tokenJson.ID;
  });
  const sortedTokenIndexes = _sortTokenIndexes(tokenIndexes);
  for (const tokenIndex of sortedTokenIndexes) {
    const tokenJson = treeJson[tokenIndex];
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
  const metaConll = _metaJsonToConll(sentenceJson['metaJson']);
  const treeConll = _treeJsonToConll(sentenceJson['treeJson']);

  const sentenceConll = `${metaConll}\n${treeConll}`;
  return sentenceConll;
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

export const replaceArrayOfTokens = (
  treeJson: TreeJson,
  oldTokensIndexes: number[],
  newTokensForms: string[],
): TreeJson => {
  const newTreeJson = emptyTreeJson();

  // add new tokens to new tree
  let newTokenIndex = oldTokensIndexes[0];
  for (const newTokenForm of newTokensForms) {
    const newTokenJson = emptyTokenJson();
    newTokenJson.ID = newTokenIndex.toString();
    newTokenJson.FORM = newTokenForm;
    newTreeJson[newTokenJson.ID] = newTokenJson;
    newTokenIndex++;
  }

  // add old tokens with modified index if necessary
  const differenceInSize = newTokensForms.length - oldTokensIndexes.length;
  const arrayFirst = oldTokensIndexes[0];
  const arrayLast = oldTokensIndexes[oldTokensIndexes.length - 1];
  for (const oldTokenJson of Object.values(treeJson)) {
    const oldTokenJsonCopy: TokenJson = JSON.parse(JSON.stringify(oldTokenJson));

    const newTokenJson = incrementIndexesOfToken(oldTokenJsonCopy, arrayFirst, arrayLast, differenceInSize);
    if (newTokenJson.ID !== '-1') {
      newTreeJson[newTokenJson.ID] = newTokenJson;
    }
    // if (oldTokenJsonCopy.isGroup) {
    //   // TODO : handle this
    //   console.log("KK is group token")
    // } else if (parseInt(oldTokenJsonCopy.ID) < oldTokensIndexes[0]) {
    //   // if we are before the first element of the new array, we don't change the token
    //   newTreeJson[oldTokenJsonCopy.ID] = oldTokenJsonCopy
    // } else if (parseInt(oldTokenJsonCopy.ID) > oldTokensIndexes[oldTokensIndexes.length - 1]) {
    //   // if we are after the last element of the new array, we increment the ID by the diff
    //   oldTokenJsonCopy.ID = (parseInt(oldTokenJsonCopy.ID) + differenceInSize).toString()
    //   newTreeJson[oldTokenJsonCopy.ID] = oldTokenJsonCopy
    // }
    // console.log("KK ", newTreeJson)
  }

  return newTreeJson;
};

export const incrementIndexesOfToken = (
  tokenJson: TokenJson,
  arrayFirst: number,
  arrayLast: number,
  differenceInSize: number,
): TokenJson => {
  // handle ID
  if (tokenJson.isGroup) {
    const [tokenJsonId1, tokenJsonId2] = tokenJson.ID.split('-');
    const newTokenJsonId1 = incrementIndex(parseInt(tokenJsonId1, 10), arrayFirst, arrayLast, differenceInSize);
    const newTokenJsonId2 = incrementIndex(parseInt(tokenJsonId2, 10), arrayFirst, arrayLast, differenceInSize);
    if (newTokenJsonId1 !== -1 && newTokenJsonId2 !== -1) {
      tokenJson.ID = `${newTokenJsonId1}-${newTokenJsonId2}`;
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
    return -1;
  }
};
