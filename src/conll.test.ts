import {
  _seperateMetaAndTreeFromSentenceConll,
  _tabDictToJson,
  _metaConllLinesToJson,
  _tokenLineToJson,
  _extractTokenTabData,
  _treeConllLinesToJson,
  sentenceConllToJson,
  _tabJsonToDict,
  _tabDataJsonToConll,
  _tokenJsonToLine,
  _treeJsonToConll,
  _metaJsonToConll,
  _compareTokenIndexes,
  sentenceJsonToConll,
  MetaJson,
  NodesJson,
  SentenceJson,
  TokenJson,
  replaceArrayOfTokens,
  constructTextFromTreeJson,
  GroupsJson,
  emptyTreeJson,
  emptyMetaJson,
  TreeJson,
  emptyNodesOrGroupsJson,
} from './conll';

const featureConll = 'feat_key1=feat_value1|feat_key2=feat_value2';
const featureJson = { feat_key1: 'feat_value1', feat_key2: 'feat_value2' };

const tokenLine: string =
  '1\tform\tlemma\tupos\txpos\tfeat_key=feat_value\t2\tdeprel\tdep_key=dep_value\tmisc_key=misc_value';

const nodeJson: TokenJson = {
  ID: '1',
  FORM: 'form',
  LEMMA: 'lemma',
  UPOS: 'upos',
  XPOS: 'xpos',
  FEATS: { feat_key: 'feat_value' },
  HEAD: 2,
  DEPREL: 'deprel',
  DEPS: { dep_key: 'dep_value' },
  MISC: { misc_key: 'misc_value' },
};

const metaJson: MetaJson = { meta_key: 'meta_value', meta_key2: 'meta_value2' };
const groupsJson: GroupsJson = emptyNodesOrGroupsJson();
const treeJson: TreeJson = { nodesJson: { 1: nodeJson }, groupsJson };

const sentenceJson: SentenceJson = { metaJson, treeJson };

const metaConll: string = '# meta_key = meta_value\n# meta_key2 = meta_value2';
const metaConllLines: string[] = metaConll.split('\n');
const treeConll: string = `${tokenLine}`;
const treeConllLines: string[] = treeConll.split('\n');
const sentenceConll: string = `${metaConll}\n${treeConll}`;
const untrimmedMetaConll: string = '# meta_key = meta_value\n       # meta_key2 = meta_value2';
const untrimmedMetaConllLines: string[] = metaConll.split('\n');
const untrimmedSentenceConll: string = `${untrimmedMetaConll}\n${treeConll}`;

// checks for hyphen instead of undescore
const hyphenInsteadOfUnderscoreLineConll: string = '1	form	lemma	upos	–	–	0	deprel	_	_';
const hyphenInsteadOfUnderscoreLineConllCorrected: string = '1	form	lemma	upos	_	_	0	deprel	_	_';
const hyphenInsteadOfUnderscoreLineJson: TokenJson = {
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
const preserveHyphenInFormLemmaLineJson: TokenJson = {
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
const equalSymbolInMiscOrFeatureTokenJson: TokenJson = {
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

const groupTokenJson: TokenJson = {
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

test('_tabDictToJson', () => {
  expect(_tabDictToJson(featureConll)).toStrictEqual(featureJson);
  expect(_tabDictToJson('_')).toStrictEqual({});
});

test('_metaConllLinesToJson', () => {
  expect(_metaConllLinesToJson(metaConllLines)).toStrictEqual(metaJson);
});

test('_extractTokenTabData', () => {
  expect(_extractTokenTabData('3', 'int')).toBe(3);
  expect(_extractTokenTabData('3', 'str')).toBe('3');
  expect(() => {
    _extractTokenTabData('3', 'fake_type');
  }).toThrowError('fake_type is not a correct type');
});

test('_tokenLineToJson', () => {
  expect(_tokenLineToJson(tokenLine)).toStrictEqual(nodeJson);
  expect(_tokenLineToJson(hyphenInsteadOfUnderscoreLineConll)).toStrictEqual(hyphenInsteadOfUnderscoreLineJson);
  expect(_tokenLineToJson(preserveHyphenInFormLemmaLineConll)).toStrictEqual(preserveHyphenInFormLemmaLineJson);
  expect(_tokenLineToJson(equalSymbolInMiscOrFeatureTokenLine)).toStrictEqual(equalSymbolInMiscOrFeatureTokenJson);
  expect(_tokenLineToJson(groupTokenLine)).toStrictEqual(groupTokenJson);
  expect(() => {
    _tokenLineToJson(incompleteSmallerTokenLine);
  }).toThrowError();
  expect(() => {
    _tokenLineToJson(incompleteBiggerTokenLine);
  }).toThrowError();
});

test('_treeConllLinesToJson', () => {
  expect(_treeConllLinesToJson(treeConllLines)).toStrictEqual(treeJson);
});

test('sentenceConllToJson', () => {
  expect(sentenceConllToJson(sentenceConll)).toStrictEqual(sentenceJson);
});

test('_tabJsonToDict', () => {
  expect(_tabJsonToDict(featureJson)).toBe(featureConll);
  expect(_tabJsonToDict({})).toBe('_');
});

test('_tabDataJsonToConll', () => {
  expect(_tabDataJsonToConll(3, 'int')).toBe('3');
  expect(_tabDataJsonToConll('3', 'str')).toBe('3');
  expect(() => {
    _tabDataJsonToConll('3', 'fake_type');
  }).toThrowError('fake_type is not a correct type');
});

test('_tokenJsonToLine', () => {
  expect(_tokenJsonToLine(nodeJson)).toStrictEqual(tokenLine);
  expect(_tokenJsonToLine(hyphenInsteadOfUnderscoreLineJson)).toStrictEqual(
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
  expect(_compareTokenIndexes('10-11', '10')).toStrictEqual(-3);
});

const conllToJsonToConll = `# meta_key = meta_value
1-2\tform\t_\t_\t_\t_\t_\t_\t_\t_
1\tform\tlemma\tupos\txpos\tfeat_key=feat_value\t2\tdeprel\tdep_key=dep_value\tSpacesAfter=\\\\t
2\tform\tlemma\tupos\txpos\tfeat_key=feat_value\t2\tdeprel\tdep_key=dep_value\tmisc_key=misc_value`;

test('conllToJsonToConll', () => {
  expect(sentenceJsonToConll(sentenceConllToJson(conllToJsonToConll))).toBe(conllToJsonToConll);
});

const nodesJsonToBeReplaceArray: NodesJson = {
  '1': {
    ID: '1',
    FORM: 'I',
    LEMMA: '_',
    UPOS: '_',
    XPOS: '_',
    FEATS: {},
    HEAD: 4,
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
    FORM: 'an',
    LEMMA: 'a',
    UPOS: 'DET',
    XPOS: '_',
    FEATS: {},
    HEAD: 4,
    DEPREL: '_',
    DEPS: {},
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
    DEPREL: '_',
    DEPS: {},
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

const groupsJsonToBeReplaceArray: NodesJson = {
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
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
};

const treeJsonToBeReplaceArrayWithGroup: TreeJson = {
  nodesJson: nodesJsonToBeReplaceArray,
  groupsJson: groupsJsonToBeReplaceArray,
};

const nodesJsonReplacedArray: NodesJson = {
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
    LEMMA: 'a',
    UPOS: 'DET',
    XPOS: '_',
    FEATS: {},
    HEAD: 5,
    DEPREL: '_',
    DEPS: {},
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
    DEPREL: '_',
    DEPS: {},
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
    DEPREL: '_',
    DEPS: {},
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

const groupsJsonReplacedArray: NodesJson = {
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
    DEPREL: '_',
    DEPS: {},
    MISC: {},
  },
};

const treeJsonReplacedArrayWithGroup: TreeJson = {
  nodesJson: nodesJsonReplacedArray,
  groupsJson: groupsJsonReplacedArray,
};

test('replaceArrayOfTokensWithGroupWithSmartBehavior', () => {
  expect(replaceArrayOfTokens(treeJsonToBeReplaceArrayWithGroup, [3], ['a', 'red'], true)).toStrictEqual(
    treeJsonReplacedArrayWithGroup,
  );
});

const treeJsonToBeReplaceArray: TreeJson = {
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

const treeJsonReplacedArrayWithoutSmartBehavior: TreeJson = {
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

const treeJsonReplacedArrayWithSmartBehavior: TreeJson = {
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

const sentenceJsonToReconstructText: SentenceJson = {
  metaJson: emptyMetaJson(),
  treeJson: {
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

const sentenceJsonToReconstructTextWithSpacesAfter: SentenceJson = {
  metaJson: emptyMetaJson(),
  treeJson: {
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
