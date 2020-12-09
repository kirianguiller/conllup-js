const CONLL_STUCTURE: { [key: number]: any } = {
  0: { label: 'ID', type: 'int' },
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

export const _seperateMetaAndTreeFromSentenceConll = (sentenceConll: string) => {
  const trimmedSentenceConll = sentenceConll.trim();
  const lineConlls = trimmedSentenceConll.split('\n');

  const metaLines: string[] = [];
  const treeLines: string[] = [];
  for (const lineConll of lineConlls) {
    if (lineConll.startsWith('#')) {
      metaLines.push(lineConll);
    } else {
      treeLines.push(lineConll);
    }
  }
  return { metaLines, treeLines };
};

export const _metaConllLinesToJson = (metaConllLines: string[]) => {
  const metaJson: { [key: string]: string } = {};
  for (const metaCouple of metaConllLines) {
    const [metaKey, metaValue] = metaCouple.split(' = ');
    const trimmedMetaKey = metaKey.slice(2);
    metaJson[trimmedMetaKey] = metaValue;
  }
  return metaJson;
};
export const _tabDictToJson = (featureConll: string) => {
  const featureJson: { [key: string]: string } = {};
  if (featureConll === '_') {
    return featureJson;
  }
  const splittedFeaturesConll: string[] = featureConll.split('|');
  for (const featureCouple of splittedFeaturesConll) {
    const [featureKey, featureValue] = featureCouple.split('=');
    featureJson[featureKey] = featureValue;
  }
  return featureJson;
};

export const _extractTokenTabData = (tokenTabData: string, type: string) => {
  if (type === 'str') {
    return tokenTabData;
  } else if (type === 'int') {
    return parseInt(tokenTabData, 10);
  } else if (type === 'dict') {
    return _tabDictToJson(tokenTabData);
  } else {
    throw new Error(`${type} is not a correct type`);
  }
};

export const _tokenLineToJson = (tokenLine: string) => {
  const trimmedTokenLine: string = tokenLine.trim();
  const splittedTokenLine: string[] = trimmedTokenLine.split('\t');

  const tokenJson: { [key: string]: any } = {};
  for (const tabIndex in CONLL_STUCTURE) {
    if (CONLL_STUCTURE.hasOwnProperty(tabIndex)) {
      const tabMeta = CONLL_STUCTURE[tabIndex];
      const tabData = splittedTokenLine[tabIndex];

      const label: string = tabMeta['label'];
      const type: string = tabMeta['type'];
      tokenJson[label] = _extractTokenTabData(tabData, type);
    }
  }
  return tokenJson;
};

export const _treeConllLinesToJson = (treeConllLines: string[]) => {
  const treeJson: { [key: number]: any } = {};

  let tokenIndex: number = 1;
  for (const tokenLine of treeConllLines) {
    treeJson[tokenIndex] = _tokenLineToJson(tokenLine);
    tokenIndex = tokenIndex + 1;
  }
  return treeJson;
};

export const sentenceConllToJson = (sentenceConll: string) => {
  const sentenceJson: { [key: string]: any } = {};
  const { metaLines, treeLines } = _seperateMetaAndTreeFromSentenceConll(sentenceConll);
  sentenceJson['metaJson'] = _metaConllLinesToJson(metaLines);
  sentenceJson['treeJson'] = _treeConllLinesToJson(treeLines);

  return sentenceJson;
};

export const _tabJsonToDict = (featureJson: { [key: string]: string }) => {
  const splittedFeatureConll = [];
  for (const featureKey in featureJson) {
    if (featureJson.hasOwnProperty(featureKey)) {
      const featureValue = featureJson[featureKey];
      splittedFeatureConll.push(`${featureKey}=${featureValue}`);
    } else {
      throw Error(`featureJson don't possess the key '${featureKey}'`);
    }
  }
  const featureConll = splittedFeatureConll.join('|');
  return featureConll;
};

export const _tabDataJsonToConll = (tabData: string | number | { [key: string]: string }, type: string) => {
  if (type === 'str') {
    return tabData as string;
  } else if (type === 'int') {
    return tabData.toString() as string;
  } else if (type === 'dict') {
    return _tabJsonToDict(tabData as { [key: string]: string });
  } else {
    throw new Error(`${type} is not a correct type`);
  }
};

export const _tokenJsonToLine = (tokenJson: { [key: string]: any }) => {
  const splittedTokenConll: string[] = [];

  for (const tabIndex in CONLL_STUCTURE) {
    if (CONLL_STUCTURE.hasOwnProperty(tabIndex)) {
      const tabMeta = CONLL_STUCTURE[tabIndex];
      const tabLabel: string = tabMeta['label'];
      const tabtype: string = tabMeta['type'];

      const tabDataJson = tokenJson[tabLabel];
      const tabDataConll = _tabDataJsonToConll(tabDataJson, tabtype);
      splittedTokenConll.push(tabDataConll);
    }
  }
  const tokenConll = splittedTokenConll.join('\t');
  return tokenConll;
};

export const _treeJsonToConll = (treeJson: { [key: number]: any }) => {
  const treeConllLines: string[] = [];

  for (const tokenIndex in treeJson) {
    if (treeJson.hasOwnProperty(tokenIndex)) {
      const tokenJson = treeJson[tokenIndex];
      const tokenConll = _tokenJsonToLine(tokenJson);
      treeConllLines.push(tokenConll);
    } else {
      throw Error(`treeJson don't possess the key '${tokenIndex}'`);
    }
  }

  const treeConll = treeConllLines.join('\n');
  return treeConll;
};

export const _metaJsonToConll = (metaJson: { [key: string]: string }) => {
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

export const sentenceJsonToConll = (sentenceJson: { [key: string]: any }) => {
  const metaConll = _metaJsonToConll(sentenceJson['metaJson']);
  const treeConll = _treeJsonToConll(sentenceJson['treeJson']);

  const sentenceConll = `${metaConll}\n${treeConll}`;
  return sentenceConll;
};
