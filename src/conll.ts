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

export const sentenceConllToSentenceJson = (sentenceConll: string) => sentenceConll;

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
    metaKey = metaKey.slice(2);
    metaJson[metaKey] = metaValue;
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
