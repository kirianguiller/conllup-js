import {
  _seperateMetaAndTreeFromSentenceConll,
  _featuresConllToJson,
  _metaConllLinesToJson,
  _tokenConllToJson,
  _decodeTabData,
  _treeConllLinesToJson,
  sentenceConllToJson,
  _featuresJsonToConll,
  _encodeTabData,
  _tokenJsonToConll,
  _treeJsonToConll,
  _metaJsonToConll,
  _compareTokenIndexes,
  sentenceJsonToConll,
  metaJson_T,
  nodesJson_T,
  sentenceJson_T,
  tokenJson_T,
  replaceArrayOfTokens,
  constructTextFromTreeJson,
  groupsJson_T,
  emptyMetaJson,
  treeJson_T,
  emptyNodesOrGroupsJson,
  _depsConllToJson,
  _sortTokenIndexes,
} from './conll';

const featureConll = 'feat_key1=feat_value1|feat_key2=feat_value2';
const featuresJson = { feat_key1: 'feat_value1', feat_key2: 'feat_value2' };
const featureConllReverseOrder = 'feat_key2=feat_value2|feat_key1=feat_value1';
const featuresJsonWithLowerAndUpperCase = {
  feat_key1: 'feat_value1',
  feat_key3: 'feat_value3',
  Feat_key2: 'feat_value2',
};
const featureConllWithLowerAndUpperCase = 'feat_key1=feat_value1|Feat_key2=feat_value2|feat_key3=feat_value3';

const tokenConll: string = '1\tform\tlemma\tupos\txpos\tfeat_key=feat_value\t2\tdeprel\t1:mod\tmisc_key=misc_value';

const tokenJson: tokenJson_T = {
  ID: '1',
  FORM: 'form',
  LEMMA: 'lemma',
  UPOS: 'upos',
  XPOS: 'xpos',
  FEATS: { feat_key: 'feat_value' },
  HEAD: 2,
  DEPREL: 'deprel',
  DEPS: { '1': 'mod' },
  MISC: { misc_key: 'misc_value' },
};

const metaJson: metaJson_T = { meta_key: 'meta_value', meta_key2: 'meta_value2' };
const groupsJson: groupsJson_T = emptyNodesOrGroupsJson();
const treeJson: treeJson_T = { nodesJson: { '1': tokenJson }, groupsJson, enhancedNodesJson: emptyNodesOrGroupsJson() };

const sentenceJson: sentenceJson_T = { metaJson, treeJson };

const metaConll: string = '# meta_key = meta_value\n# meta_key2 = meta_value2';
const metaConllLines: string[] = metaConll.split('\n');
const treeConll: string = `${tokenConll}`;
const treeConllLines: string[] = treeConll.split('\n');
const sentenceConll: string = `${metaConll}\n${treeConll}`;
const untrimmedMetaConll: string = '# meta_key = meta_value\n       # meta_key2 = meta_value2';
const untrimmedMetaConllLines: string[] = metaConll.split('\n');
const untrimmedSentenceConll: string = `${untrimmedMetaConll}\n${treeConll}`;

// checks for hyphen instead of undescore
const hyphenInsteadOfUnderscoreLineConll: string = '1	form	lemma	upos	–	–	0	deprel	_	_';
const hyphenInsteadOfUnderscoreLineConllCorrected: string = '1	form	lemma	upos	_	_	0	deprel	_	_';
const hyphenInsteadOfUnderscoreLineJson: tokenJson_T = {
  ID: '1',
  FORM: 'form',
  LEMMA: 'lemma',
  UPOS: 'upos',
  XPOS: '_',
  FEATS: {},
  HEAD: 0,
  DEPREL: 'deprel',
  DEPS: {},
  MISC: {},
};

// exclude FORM and LEMMA from hyphen-to-underscore replacement
// (there could be a literal hyphen in the text!)
const preserveHyphenInFormLemmaLineConll: string = '1	-	–	upos	_	_	0	deprel	_	_';
const preserveHyphenInFormLemmaLineJson: tokenJson_T = {
  ID: '1',
  FORM: '-',
  LEMMA: '–',
  UPOS: 'upos',
  XPOS: '_',
  FEATS: {},
  HEAD: 0,
  DEPREL: 'deprel',
  DEPS: {},
  MISC: {},
};

// checks for "=" symbol is misc or feature field
const equalSymbolInMiscOrFeatureTokenLine: string = '1	form	lemma	upos	_	person=first=second	_	_	_	_';
// const hyphenInsteadOfUnderscoreLineConllCorrected: string = '1	form	lemma	upos	_	_	0	deprel	_	_';
const equalSymbolInMiscOrFeatureTokenJson: tokenJson_T = {
  ID: '1',
  FORM: 'form',
  LEMMA: 'lemma',
  UPOS: 'upos',
  XPOS: '_',
  FEATS: { person: 'first=second' },
  HEAD: -1,
  DEPREL: '_',
  DEPS: {},
  MISC: {},
};

// check for group token, for exemple :
// 1-2  it's  _ _ _ _ _ _ _
// 1    it  it  _ _ _ _ _ _ _
// 2    's  's  _ _ _ _ _ _ _
const groupTokenLine: string = "1-2	it's	it's	upos	_	_	_	deprel	_	_";

const groupTokenJson: tokenJson_T = {
  ID: '1-2',
  FORM: "it's",
  LEMMA: "it's",
  UPOS: 'upos',
  XPOS: '_',
  FEATS: {},
  HEAD: -1,
  DEPREL: 'deprel',
  DEPS: {},
  MISC: {},
};

// check for enhanced token, for exemple :
// 1    it           it  _ _ _ _ _ _ _
// 1.1  secret_node  _   _ _ _ _ _ _ _
const enhancedTokenLine: string = "1.2	it's	it's	upos	_	_	_	deprel	_	_";

const enhancedTokenJson: tokenJson_T = {
  ID: '1.2',
  FORM: "it's",
  LEMMA: "it's",
  UPOS: 'upos',
  XPOS: '_',
  FEATS: {},
  HEAD: -1,
  DEPREL: 'deprel',
  DEPS: {},
  MISC: {},
};

// incomplete line (different than 10 columns per lines)
const incompleteSmallerTokenLine = "1-2	it's	it's	upos	_	_	deprel	_	_"; // has only 9 features
const incompleteBiggerTokenLine = "1-2	it's	it's	upos	_	_	deprel	_	_	_	_"; // has 11 features

test('_seperateMetaAndTreeFromSentenceConll', () => {
  expect(_seperateMetaAndTreeFromSentenceConll(sentenceConll)).toStrictEqual({
    metaLines: metaConllLines,
    treeLines: treeConllLines,
  });
  expect(_seperateMetaAndTreeFromSentenceConll(untrimmedSentenceConll)).toStrictEqual({
    metaLines: untrimmedMetaConllLines,
    treeLines: treeConllLines,
  });
});

test('_featuresConllToJson', () => {
  expect(_featuresConllToJson(featureConll)).toStrictEqual(featuresJson);
  expect(_featuresConllToJson('_')).toStrictEqual({});
});

test('_featuresConllToJsonAndBack', () => {
  expect(_featuresJsonToConll(_featuresConllToJson(featureConll))).toStrictEqual(featureConll);
  expect(_featuresJsonToConll(_featuresConllToJson(featureConllReverseOrder))).toStrictEqual(featureConll);
  expect(_featuresJsonToConll(_featuresConllToJson('_'))).toStrictEqual('_');
});

test('_featuresJsonToConllSortingOrder', () => {
  expect(_featuresJsonToConll(featuresJsonWithLowerAndUpperCase)).toStrictEqual(featureConllWithLowerAndUpperCase);
});

test('_metaConllLinesToJson', () => {
  expect(_metaConllLinesToJson(metaConllLines)).toStrictEqual(metaJson);
});

test('_decodeTabData', () => {
  expect(_decodeTabData('3', 'int')).toBe(3);
  expect(_decodeTabData('3', 'str')).toBe('3');
  expect(() => {
    _decodeTabData('3', 'fake_type' as any);
  }).toThrowError('fake_type is not a correct type');
});

test('_tokenConllToJson', () => {
  expect(_tokenConllToJson(tokenConll)).toStrictEqual(tokenJson);
  expect(_tokenConllToJson(hyphenInsteadOfUnderscoreLineConll)).toStrictEqual(hyphenInsteadOfUnderscoreLineJson);
  expect(_tokenConllToJson(preserveHyphenInFormLemmaLineConll)).toStrictEqual(preserveHyphenInFormLemmaLineJson);
  expect(_tokenConllToJson(equalSymbolInMiscOrFeatureTokenLine)).toStrictEqual(equalSymbolInMiscOrFeatureTokenJson);
  expect(_tokenConllToJson(groupTokenLine)).toStrictEqual(groupTokenJson);
  expect(_tokenConllToJson(enhancedTokenLine)).toStrictEqual(enhancedTokenJson);
  expect(() => {
    _tokenConllToJson(incompleteSmallerTokenLine);
  }).toThrowError();
  expect(() => {
    _tokenConllToJson(incompleteBiggerTokenLine);
  }).toThrowError();
});

test('_treeConllLinesToJson', () => {
  expect(_treeConllLinesToJson(treeConllLines)).toStrictEqual(treeJson);
});

test('sentenceConllToJson', () => {
  expect(sentenceConllToJson(sentenceConll)).toStrictEqual(sentenceJson);
  expect(sentenceConllToJson(enhancedTokenLine)).toStrictEqual({
    metaJson: emptyMetaJson(),
    treeJson: {
      nodesJson: {},
      groupsJson: {},
      enhancedNodesJson: { '1.2': enhancedTokenJson },
    },
  });
});

test('_featuresJsonToConll', () => {
  expect(_featuresJsonToConll(featuresJson)).toBe(featureConll);
  expect(_featuresJsonToConll({})).toBe('_');
});

test('_encodeTabData', () => {
  expect(_encodeTabData(3, 'int')).toBe('3');
  expect(_encodeTabData('3', 'str')).toBe('3');
});

test('_tokenJsonToConll', () => {
  expect(_tokenJsonToConll(tokenJson)).toStrictEqual(tokenConll);
  expect(_tokenJsonToConll(hyphenInsteadOfUnderscoreLineJson)).toStrictEqual(
    hyphenInsteadOfUnderscoreLineConllCorrected,
  );
});

test('_treeJsonToConll', () => {
  expect(_treeJsonToConll(treeJson)).toStrictEqual(treeConll);
});

test('_metaJsonToConll', () => {
  expect(_metaJsonToConll(metaJson)).toStrictEqual(metaConll);
});

test('sentenceJsonToConll', () => {
  expect(sentenceJsonToConll(sentenceJson)).toStrictEqual(sentenceConll);
});

test('_compareTokenIndexes', () => {
  expect(_compareTokenIndexes('1', '2')).toStrictEqual(-1);
  expect(_compareTokenIndexes('1', '3')).toStrictEqual(-2);
  expect(_compareTokenIndexes('10', '5')).toStrictEqual(5);
  expect(_compareTokenIndexes('10-11', '10')).toStrictEqual(-1);
  expect(_compareTokenIndexes('10-11', '10-12')).toStrictEqual(-1);
  expect(_compareTokenIndexes('10', '10-12')).toStrictEqual(1);

  // Add enhanced "empty nodes" (e.g. "5.1" "7.4")
  expect(_compareTokenIndexes('1', '1.1')).toStrictEqual(-1);
  expect(_compareTokenIndexes('1.2', '1.4')).toStrictEqual(-2);
  expect(_compareTokenIndexes('1.4', '1.2')).toStrictEqual(2);
});

test('_sortTokenIndexes', () => {
  expect(_sortTokenIndexes(['3', '4-5', '2.1', '2.3', '4-8', '5', '1', '4', '4.2', '2'])).toStrictEqual([
    '1',
    '2',
    '2.1',
    '2.3',
    '3',
    '4-5',
    '4-8',
    '4',
    '4.2',
    '5',
  ]);
});

const conllToJsonToConll = `# meta_key = meta_value
1-2\tform\t_\t_\t_\t_\t_\t_\t_\t_
1\tform\tlemma\tupos\txpos\tfeat_key=feat_value\t2\tdeprel\tdep_key:dep_value\tSpacesAfter=\\\\t
1.1\tempty\tlemma\tupos\txpos\tfeat_key=feat_value\t2\tdeprel\tdep_key:dep_value\tSpacesAfter=\\\\t
2\tform\tlemma\tupos\txpos\tfeat_key=feat_value\t2\tdeprel\tdep_key:dep_value\tmisc_key=misc_value`;

test('conllToJsonToConll', () => {
  expect(sentenceJsonToConll(sentenceConllToJson(conllToJsonToConll))).toBe(conllToJsonToConll);
});

const nodesJsonToBeReplaceArray: nodesJson_T = {
  '1': {
    ID: '1',
    FORM: 'I',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 4,
    DEPREL: 'mod',
    DEPS: { '4': 'mod', '2': 'subj' },
    MISC: {},
  },
  '2': {
    ID: '2',
    FORM: 'eat',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 0,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
  '3': {
    ID: '3',
    FORM: 'an',
    LEMMA: 'a',
    UPOS: 'DET',
    XPOS: '_',
    FEATS: {},
    HEAD: 4,
    DEPREL: 'det',
    DEPS: { '4': 'det' },
    MISC: {},
  },
  '4': {
    ID: '4',
    FORM: 'apple',
    LEMMA: 'apple',
    UPOS: 'NOUN',
    XPOS: '_',
    FEATS: {},
    HEAD: 2,
    DEPREL: 'obj',
    DEPS: { '2': 'obj' },
    MISC: {},
  },
  '5': {
    ID: '5',
    FORM: 'with',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 2,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
  '6': {
    ID: '6',
    FORM: 'you',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 2,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
};

const enhancedNodesJsonToBeReplaceArray: nodesJson_T = {
  '2.2': {
    ID: '2.2',
    FORM: 'phantom_token',
    LEMMA: 'phantom',
    UPOS: 'UNK',
    XPOS: '_',
    FEATS: {},
    HEAD: 5,
    DEPREL: 'unk',
    DEPS: { '5': 'unk', '5.1': 'unkunk' },
    MISC: {},
  },
  '5.1': {
    ID: '5.1',
    FORM: 'phantom_token',
    LEMMA: 'phantom',
    UPOS: 'UNK',
    XPOS: '_',
    FEATS: {},
    HEAD: 2,
    DEPREL: 'unk',
    DEPS: { '2': 'unk' },
    MISC: {},
  },
};

const groupsJsonToBeReplaceArray: nodesJson_T = {
  '1-2': {
    ID: '1-2',
    FORM: 'I eat',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
  '3-4': {
    ID: '3-4',
    FORM: 'an apple',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
  '5-6': {
    ID: '5-6',
    FORM: 'with you',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 4,
    DEPREL: 'mod',
    DEPS: { '4': 'mod' },
    MISC: {},
  },
};

const treeJsonToBeReplaceArrayWithGroup: treeJson_T = {
  nodesJson: nodesJsonToBeReplaceArray,
  groupsJson: groupsJsonToBeReplaceArray,
  enhancedNodesJson: enhancedNodesJsonToBeReplaceArray,
};

const nodesJsonReplacedArray: nodesJson_T = {
  '1': {
    ID: '1',
    FORM: 'I',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 5,
    DEPREL: 'mod',
    DEPS: { '5': 'mod', '2': 'subj' },
    MISC: {},
  },
  '2': {
    ID: '2',
    FORM: 'eat',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 0,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
  '3': {
    ID: '3',
    FORM: 'a',
    LEMMA: 'a',
    UPOS: 'DET',
    XPOS: '_',
    FEATS: {},
    HEAD: 5,
    DEPREL: 'det',
    DEPS: { '5': 'det' },
    MISC: {},
  },
  '4': {
    ID: '4',
    FORM: 'red',
    LEMMA: 'red',
    UPOS: 'DET',
    XPOS: '_',
    FEATS: {},
    HEAD: 5,
    DEPREL: 'det',
    DEPS: { '5': 'det' },
    MISC: {},
  },
  '5': {
    ID: '5',
    FORM: 'apple',
    LEMMA: 'apple',
    UPOS: 'NOUN',
    XPOS: '_',
    FEATS: {},
    HEAD: 2,
    DEPREL: 'obj',
    DEPS: { '2': 'obj' },
    MISC: {},
  },
  '6': {
    ID: '6',
    FORM: 'with',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 2,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
  '7': {
    ID: '7',
    FORM: 'you',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 2,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
};

const enhancedNodesJsonReplacedArray: nodesJson_T = {
  '2.2': {
    ID: '2.2',
    FORM: 'phantom_token',
    LEMMA: 'phantom',
    UPOS: 'UNK',
    XPOS: '_',
    FEATS: {},
    HEAD: 6,
    DEPREL: 'unk',
    DEPS: { '6': 'unk', '6.1': 'unkunk' },
    MISC: {},
  },
  '6.1': {
    ID: '6.1',
    FORM: 'phantom_token',
    LEMMA: 'phantom',
    UPOS: 'UNK',
    XPOS: '_',
    FEATS: {},
    HEAD: 2,
    DEPREL: 'unk',
    DEPS: { '2': 'unk' },
    MISC: {},
  },
};

const groupsJsonReplacedArray: nodesJson_T = {
  '1-2': {
    ID: '1-2',
    FORM: 'I eat',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: -1,
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
  '6-7': {
    ID: '6-7',
    FORM: 'with you',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 5,
    DEPREL: 'mod',
    DEPS: { '5': 'mod' },
    MISC: {},
  },
};

const treeJsonReplacedArrayWithGroup: treeJson_T = {
  nodesJson: nodesJsonReplacedArray,
  groupsJson: groupsJsonReplacedArray,
  enhancedNodesJson: enhancedNodesJsonReplacedArray,
};

test('replaceArrayOfTokensWithGroupWithSmartBehavior', () => {
  expect(replaceArrayOfTokens(treeJsonToBeReplaceArrayWithGroup, [3], ['a', 'red'], true)).toStrictEqual(
    treeJsonReplacedArrayWithGroup,
  );
});

const treeJsonToBeReplaceArray: treeJson_T = {
  enhancedNodesJson: emptyNodesOrGroupsJson(),
  nodesJson: {
    '1': {
      ID: '1',
      FORM: 'bah',
      LEMMA: '_',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: 3,
      DEPREL: 'discourse',
      DEPS: {},
      MISC: {},
    },
    '2': {
      ID: '2',
      FORM: ',',
      LEMMA: '_',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: 1,
      DEPREL: 'punct',
      DEPS: {},
      MISC: {},
    },
    '3': {
      ID: '3',
      FORM: 'tutoie-moi',
      LEMMA: '_',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: 0,
      DEPREL: 'root',
      DEPS: {},
      MISC: {},
    },
    '4': {
      ID: '4',
      FORM: 'quoi',
      LEMMA: '_',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: 3,
      DEPREL: 'interjection',
      DEPS: {},
      MISC: {},
    },
  },
  groupsJson: {},
};

const treeJsonReplacedArrayWithoutSmartBehavior: treeJson_T = {
  enhancedNodesJson: emptyNodesOrGroupsJson(),
  nodesJson: {
    '1': {
      ID: '1',
      FORM: 'bah',
      LEMMA: '_',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: -1,
      DEPREL: '_',
      DEPS: {},
      MISC: {},
    },
    '2': {
      ID: '2',
      FORM: ',',
      LEMMA: '_',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: 1,
      DEPREL: 'punct',
      DEPS: {},
      MISC: {},
    },
    '3': {
      ID: '3',
      FORM: 'tutoie-',
      LEMMA: 'tutoie-',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: -1,
      DEPREL: '_',
      DEPS: {},
      MISC: {},
    },
    '4': {
      ID: '4',
      FORM: 'moi',
      LEMMA: 'moi',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: -1,
      DEPREL: '_',
      DEPS: {},
      MISC: {},
    },
    '5': {
      ID: '5',
      FORM: 'quoi',
      LEMMA: '_',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: -1,
      DEPREL: '_',
      DEPS: {},
      MISC: {},
    },
  },
  groupsJson: {},
};

const treeJsonReplacedArrayWithSmartBehavior: treeJson_T = {
  enhancedNodesJson: emptyNodesOrGroupsJson(),
  nodesJson: {
    '1': {
      ID: '1',
      FORM: 'bah',
      LEMMA: '_',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: 3,
      DEPREL: 'discourse',
      DEPS: {},
      MISC: {},
    },
    '2': {
      ID: '2',
      FORM: ',',
      LEMMA: '_',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: 1,
      DEPREL: 'punct',
      DEPS: {},
      MISC: {},
    },
    '3': {
      ID: '3',
      FORM: 'tutoie-',
      LEMMA: 'tutoie-',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: 0,
      DEPREL: 'root',
      DEPS: {},
      MISC: {},
    },
    '4': {
      ID: '4',
      FORM: 'moi',
      LEMMA: 'moi',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: 0,
      DEPREL: 'root',
      DEPS: {},
      MISC: {},
    },
    '5': {
      ID: '5',
      FORM: 'quoi',
      LEMMA: '_',
      UPOS: '_',
      XPOS: '_',
      FEATS: {},
      HEAD: 3,
      DEPREL: 'interjection',
      DEPS: {},
      MISC: {},
    },
  },
  groupsJson: {},
};

test('replaceArrayOfTokenWithoutSmartBehavior', () => {
  expect(replaceArrayOfTokens(treeJsonToBeReplaceArray, [3], ['tutoie-', 'moi'])).toStrictEqual(
    treeJsonReplacedArrayWithoutSmartBehavior,
  );
});

test('replaceArrayOfTokenWithSmartBehavior', () => {
  expect(replaceArrayOfTokens(treeJsonToBeReplaceArray, [3], ['tutoie-', 'moi'], true)).toStrictEqual(
    treeJsonReplacedArrayWithSmartBehavior,
  );
});

const sentenceJsonToReconstructText: sentenceJson_T = {
  metaJson: emptyMetaJson(),
  treeJson: {
    enhancedNodesJson: emptyNodesOrGroupsJson(),
    nodesJson: {
      '1': {
        ID: '1',
        FORM: 'I',
        LEMMA: '_',
        UPOS: '_',
        XPOS: '_',
        FEATS: {},
        HEAD: 5,
        DEPREL: '_',
        DEPS: {},
        MISC: {},
      },
      '2': {
        ID: '2',
        FORM: 'eat',
        LEMMA: '_',
        UPOS: '_',
        XPOS: '_',
        FEATS: {},
        HEAD: 0,
        DEPREL: '_',
        DEPS: {},
        MISC: {},
      },

      '3': {
        ID: '3',
        FORM: 'a',
        LEMMA: '_',
        UPOS: '_',
        XPOS: '_',
        FEATS: {},
        HEAD: -1,
        DEPREL: '_',
        DEPS: {},
        MISC: {},
      },
      '4': {
        ID: '4',
        FORM: 'red',
        LEMMA: '_',
        UPOS: '_',
        XPOS: '_',
        FEATS: {},
        HEAD: -1,
        DEPREL: '_',
        DEPS: {},
        MISC: {},
      },
      '5': {
        ID: '5',
        FORM: 'apple',
        LEMMA: '_',
        UPOS: '_',
        XPOS: '_',
        FEATS: {},
        HEAD: 2,
        DEPREL: '_',
        DEPS: {},
        MISC: {},
      },
    },
    groupsJson: {
      '1-2': {
        ID: '1-2',
        FORM: 'I eat',
        LEMMA: '_',
        UPOS: '_',
        XPOS: '_',
        FEATS: {},
        HEAD: -1,
        DEPREL: '_',
        DEPS: {},
        MISC: {},
      },
      '2-5': {
        ID: '2-5',
        FORM: 'eat an apple',
        LEMMA: '_',
        UPOS: '_',
        XPOS: '_',
        FEATS: {},
        HEAD: -1,
        DEPREL: '_',
        DEPS: {},
        MISC: {},
      },
    },
  },
};

test('constructTextFromTreeJson', () => {
  expect(constructTextFromTreeJson(sentenceJsonToReconstructText.treeJson)).toStrictEqual('I eat a red apple ');
});

const sentenceJsonToReconstructTextWithSpacesAfter: sentenceJson_T = {
  metaJson: emptyMetaJson(),
  treeJson: {
    enhancedNodesJson: emptyNodesOrGroupsJson(),
    nodesJson: {
      '1': {
        ID: '1',
        FORM: 'Ver',
        LEMMA: '_',
        UPOS: '_',
        XPOS: '_',
        FEATS: {},
        HEAD: 5,
        DEPREL: '_',
        DEPS: {},
        MISC: { SpaceAfter: 'No', SpacesAfter: '\\\\t' },
      },
      '2': {
        ID: '2',
        FORM: 'lo',
        LEMMA: '_',
        UPOS: '_',
        XPOS: '_',
        FEATS: {},
        HEAD: 0,
        DEPREL: '_',
        DEPS: {},
        MISC: { SpacesAfter: '\\\\n\\\\n\\\\t' },
      },
    },
    groupsJson: emptyNodesOrGroupsJson(),
  },
};

test('constructTextFromTreeJson', () => {
  expect(constructTextFromTreeJson(sentenceJsonToReconstructTextWithSpacesAfter.treeJson)).toStrictEqual(
    'Ver\tlo\n\n\t',
  );
});

test('sentenceConllToJson_throw_error', () => {
  expect(() => {
    sentenceConllToJson(1 as any);
  }).toThrowError(TypeError);
  expect(() => {
    sentenceConllToJson(1 as any);
  }).toThrow('parameter `sentenceConll` in sentenceConllToJson() is not a string (got `number`)');
  expect(() => {
    sentenceConllToJson(null as any);
  }).toThrowError(TypeError);
  expect(() => {
    sentenceConllToJson(null as any);
  }).toThrow('parameter `sentenceConll` in sentenceConllToJson() is not a string (got `object`)');
  expect(() => {
    sentenceConllToJson(undefined as any);
  }).toThrow('parameter `sentenceConll` in sentenceConllToJson() is not a string (got `undefined`)');
});

// Check for newly added deps (enhanced UD)

test('_depsConllToJson', () => {
  expect(_depsConllToJson('1:dep')).toStrictEqual({ '1': 'dep' });
  expect(_depsConllToJson('1:dep:blop')).toStrictEqual({ '1': 'dep:blop' });
  expect(_depsConllToJson('1:dep:blop|2:mod')).toStrictEqual({ '1': 'dep:blop', '2': 'mod' });
  expect(_depsConllToJson('1.2:dep:blop|2:mod')).toStrictEqual({ '1.2': 'dep:blop', '2': 'mod' });
});
