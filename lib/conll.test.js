"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conll_1 = require("./conll");
const featureConll = 'feat_key1=feat_value1|feat_key2=feat_value2';
const featuresJson = { feat_key1: 'feat_value1', feat_key2: 'feat_value2' };
const featureConllReverseOrder = 'feat_key2=feat_value2|feat_key1=feat_value1';
const featuresJsonWithLowerAndUpperCase = {
    feat_key1: 'feat_value1',
    feat_key3: 'feat_value3',
    Feat_key2: 'feat_value2',
};
const featureConllWithLowerAndUpperCase = 'feat_key1=feat_value1|Feat_key2=feat_value2|feat_key3=feat_value3';
const tokenConll = '1\tform\tlemma\tupos\txpos\tfeat_key=feat_value\t2\tdeprel\t1:mod\tmisc_key=misc_value';
const tokenJson = {
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
const metaJson = { meta_key: 'meta_value', meta_key2: 'meta_value2' };
const groupsJson = (0, conll_1.emptyNodesOrGroupsJson)();
const treeJson = { nodesJson: { '1': tokenJson }, groupsJson, enhancedNodesJson: (0, conll_1.emptyNodesOrGroupsJson)() };
const sentenceJson = { metaJson, treeJson };
const metaConll = '# meta_key = meta_value\n# meta_key2 = meta_value2';
const metaConllLines = metaConll.split('\n');
const treeConll = `${tokenConll}`;
const treeConllLines = treeConll.split('\n');
const sentenceConll = `${metaConll}\n${treeConll}`;
const untrimmedMetaConll = '# meta_key = meta_value\n       # meta_key2 = meta_value2';
const untrimmedMetaConllLines = metaConll.split('\n');
const untrimmedSentenceConll = `${untrimmedMetaConll}\n${treeConll}`;
// checks for hyphen instead of undescore
const hyphenInsteadOfUnderscoreLineConll = '1	form	lemma	upos	–	–	0	deprel	_	_';
const hyphenInsteadOfUnderscoreLineConllCorrected = '1	form	lemma	upos	_	_	0	deprel	_	_';
const hyphenInsteadOfUnderscoreLineJson = {
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
const preserveHyphenInFormLemmaLineConll = '1	-	–	upos	_	_	0	deprel	_	_';
const preserveHyphenInFormLemmaLineJson = {
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
const equalSymbolInMiscOrFeatureTokenLine = '1	form	lemma	upos	_	person=first=second	_	_	_	_';
// const hyphenInsteadOfUnderscoreLineConllCorrected: string = '1	form	lemma	upos	_	_	0	deprel	_	_';
const equalSymbolInMiscOrFeatureTokenJson = {
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
const groupTokenLine = "1-2	it's	it's	upos	_	_	_	deprel	_	_";
const groupTokenJson = {
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
const enhancedTokenLine = "1.2	it's	it's	upos	_	_	_	deprel	_	_";
const enhancedTokenJson = {
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
    expect((0, conll_1._seperateMetaAndTreeFromSentenceConll)(sentenceConll)).toStrictEqual({
        metaLines: metaConllLines,
        treeLines: treeConllLines,
    });
    expect((0, conll_1._seperateMetaAndTreeFromSentenceConll)(untrimmedSentenceConll)).toStrictEqual({
        metaLines: untrimmedMetaConllLines,
        treeLines: treeConllLines,
    });
});
test('_featuresConllToJson', () => {
    expect((0, conll_1._featuresConllToJson)(featureConll)).toStrictEqual(featuresJson);
    expect((0, conll_1._featuresConllToJson)('_')).toStrictEqual({});
});
test('_featuresConllToJsonAndBack', () => {
    expect((0, conll_1._featuresJsonToConll)((0, conll_1._featuresConllToJson)(featureConll))).toStrictEqual(featureConll);
    expect((0, conll_1._featuresJsonToConll)((0, conll_1._featuresConllToJson)(featureConllReverseOrder))).toStrictEqual(featureConll);
    expect((0, conll_1._featuresJsonToConll)((0, conll_1._featuresConllToJson)('_'))).toStrictEqual('_');
});
test('_featuresJsonToConllSortingOrder', () => {
    expect((0, conll_1._featuresJsonToConll)(featuresJsonWithLowerAndUpperCase)).toStrictEqual(featureConllWithLowerAndUpperCase);
});
test('_metaConllLinesToJson', () => {
    expect((0, conll_1._metaConllLinesToJson)(metaConllLines)).toStrictEqual(metaJson);
});
test('_decodeTabData', () => {
    expect((0, conll_1._decodeTabData)('3', 'int')).toBe(3);
    expect((0, conll_1._decodeTabData)('3', 'str')).toBe('3');
    expect(() => {
        (0, conll_1._decodeTabData)('3', 'fake_type');
    }).toThrowError('fake_type is not a correct type');
});
test('_tokenConllToJson', () => {
    expect((0, conll_1._tokenConllToJson)(tokenConll)).toStrictEqual(tokenJson);
    expect((0, conll_1._tokenConllToJson)(hyphenInsteadOfUnderscoreLineConll)).toStrictEqual(hyphenInsteadOfUnderscoreLineJson);
    expect((0, conll_1._tokenConllToJson)(preserveHyphenInFormLemmaLineConll)).toStrictEqual(preserveHyphenInFormLemmaLineJson);
    expect((0, conll_1._tokenConllToJson)(equalSymbolInMiscOrFeatureTokenLine)).toStrictEqual(equalSymbolInMiscOrFeatureTokenJson);
    expect((0, conll_1._tokenConllToJson)(groupTokenLine)).toStrictEqual(groupTokenJson);
    expect((0, conll_1._tokenConllToJson)(enhancedTokenLine)).toStrictEqual(enhancedTokenJson);
    expect(() => {
        (0, conll_1._tokenConllToJson)(incompleteSmallerTokenLine);
    }).toThrowError();
    expect(() => {
        (0, conll_1._tokenConllToJson)(incompleteBiggerTokenLine);
    }).toThrowError();
});
test('_treeConllLinesToJson', () => {
    expect((0, conll_1._treeConllLinesToJson)(treeConllLines)).toStrictEqual(treeJson);
});
test('sentenceConllToJson', () => {
    expect((0, conll_1.sentenceConllToJson)(sentenceConll)).toStrictEqual(sentenceJson);
    expect((0, conll_1.sentenceConllToJson)(enhancedTokenLine)).toStrictEqual({
        metaJson: (0, conll_1.emptyMetaJson)(),
        treeJson: {
            nodesJson: {},
            groupsJson: {},
            enhancedNodesJson: { '1.2': enhancedTokenJson },
        },
    });
});
test('_featuresJsonToConll', () => {
    expect((0, conll_1._featuresJsonToConll)(featuresJson)).toBe(featureConll);
    expect((0, conll_1._featuresJsonToConll)({})).toBe('_');
});
test('_encodeTabData', () => {
    expect((0, conll_1._encodeTabData)(3, 'int')).toBe('3');
    expect((0, conll_1._encodeTabData)('3', 'str')).toBe('3');
});
test('_tokenJsonToConll', () => {
    expect((0, conll_1._tokenJsonToConll)(tokenJson)).toStrictEqual(tokenConll);
    expect((0, conll_1._tokenJsonToConll)(hyphenInsteadOfUnderscoreLineJson)).toStrictEqual(hyphenInsteadOfUnderscoreLineConllCorrected);
});
test('_treeJsonToConll', () => {
    expect((0, conll_1._treeJsonToConll)(treeJson)).toStrictEqual(treeConll);
});
test('_metaJsonToConll', () => {
    expect((0, conll_1._metaJsonToConll)(metaJson)).toStrictEqual(metaConll);
});
test('sentenceJsonToConll', () => {
    expect((0, conll_1.sentenceJsonToConll)(sentenceJson)).toStrictEqual(sentenceConll);
});
test('_compareTokenIndexes', () => {
    expect((0, conll_1._compareTokenIndexes)('1', '2')).toStrictEqual(-1);
    expect((0, conll_1._compareTokenIndexes)('1', '3')).toStrictEqual(-2);
    expect((0, conll_1._compareTokenIndexes)('10', '5')).toStrictEqual(5);
    expect((0, conll_1._compareTokenIndexes)('10-11', '10')).toStrictEqual(-1);
    expect((0, conll_1._compareTokenIndexes)('10-11', '10-12')).toStrictEqual(-1);
    expect((0, conll_1._compareTokenIndexes)('10', '10-12')).toStrictEqual(1);
    // Add enhanced "empty nodes" (e.g. "5.1" "7.4")
    expect((0, conll_1._compareTokenIndexes)('1', '1.1')).toStrictEqual(-1);
    expect((0, conll_1._compareTokenIndexes)('1.2', '1.4')).toStrictEqual(-2);
    expect((0, conll_1._compareTokenIndexes)('1.4', '1.2')).toStrictEqual(2);
});
test('_sortTokenIndexes', () => {
    expect((0, conll_1._sortTokenIndexes)(['3', '4-5', '2.1', '2.3', '4-8', '5', '1', '4', '4.2', '2'])).toStrictEqual([
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
    expect((0, conll_1.sentenceJsonToConll)((0, conll_1.sentenceConllToJson)(conllToJsonToConll))).toBe(conllToJsonToConll);
});
const nodesJsonToBeReplaceArray = {
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
const enhancedNodesJsonToBeReplaceArray = {
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
const groupsJsonToBeReplaceArray = {
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
const treeJsonToBeReplaceArrayWithGroup = {
    nodesJson: nodesJsonToBeReplaceArray,
    groupsJson: groupsJsonToBeReplaceArray,
    enhancedNodesJson: enhancedNodesJsonToBeReplaceArray,
};
const nodesJsonReplacedArray = {
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
const enhancedNodesJsonReplacedArray = {
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
const groupsJsonReplacedArray = {
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
const treeJsonReplacedArrayWithGroup = {
    nodesJson: nodesJsonReplacedArray,
    groupsJson: groupsJsonReplacedArray,
    enhancedNodesJson: enhancedNodesJsonReplacedArray,
};
test('replaceArrayOfTokensWithGroupWithSmartBehavior', () => {
    expect((0, conll_1.replaceArrayOfTokens)(treeJsonToBeReplaceArrayWithGroup, [3], ['a', 'red'], true)).toStrictEqual(treeJsonReplacedArrayWithGroup);
});
const treeJsonToBeReplaceArray = {
    enhancedNodesJson: (0, conll_1.emptyNodesOrGroupsJson)(),
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
const treeJsonReplacedArrayWithoutSmartBehavior = {
    enhancedNodesJson: (0, conll_1.emptyNodesOrGroupsJson)(),
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
const treeJsonReplacedArrayWithSmartBehavior = {
    enhancedNodesJson: (0, conll_1.emptyNodesOrGroupsJson)(),
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
    expect((0, conll_1.replaceArrayOfTokens)(treeJsonToBeReplaceArray, [3], ['tutoie-', 'moi'])).toStrictEqual(treeJsonReplacedArrayWithoutSmartBehavior);
});
test('replaceArrayOfTokenWithSmartBehavior', () => {
    expect((0, conll_1.replaceArrayOfTokens)(treeJsonToBeReplaceArray, [3], ['tutoie-', 'moi'], true)).toStrictEqual(treeJsonReplacedArrayWithSmartBehavior);
});
const sentenceJsonToReconstructText = {
    metaJson: (0, conll_1.emptyMetaJson)(),
    treeJson: {
        enhancedNodesJson: (0, conll_1.emptyNodesOrGroupsJson)(),
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
    expect((0, conll_1.constructTextFromTreeJson)(sentenceJsonToReconstructText.treeJson)).toStrictEqual('I eat a red apple ');
});
const sentenceJsonToReconstructTextWithSpacesAfter = {
    metaJson: (0, conll_1.emptyMetaJson)(),
    treeJson: {
        enhancedNodesJson: (0, conll_1.emptyNodesOrGroupsJson)(),
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
        groupsJson: (0, conll_1.emptyNodesOrGroupsJson)(),
    },
};
test('constructTextFromTreeJson', () => {
    expect((0, conll_1.constructTextFromTreeJson)(sentenceJsonToReconstructTextWithSpacesAfter.treeJson)).toStrictEqual('Ver\tlo\n\n\t');
});
test('sentenceConllToJson_throw_error', () => {
    expect(() => {
        (0, conll_1.sentenceConllToJson)(1);
    }).toThrowError(TypeError);
    expect(() => {
        (0, conll_1.sentenceConllToJson)(1);
    }).toThrow('parameter `sentenceConll` in sentenceConllToJson() is not a string (got `number`)');
    expect(() => {
        (0, conll_1.sentenceConllToJson)(null);
    }).toThrowError(TypeError);
    expect(() => {
        (0, conll_1.sentenceConllToJson)(null);
    }).toThrow('parameter `sentenceConll` in sentenceConllToJson() is not a string (got `object`)');
    expect(() => {
        (0, conll_1.sentenceConllToJson)(undefined);
    }).toThrow('parameter `sentenceConll` in sentenceConllToJson() is not a string (got `undefined`)');
});
// Check for newly added deps (enhanced UD)
test('_depsConllToJson', () => {
    expect((0, conll_1._depsConllToJson)('1:dep')).toStrictEqual({ '1': 'dep' });
    expect((0, conll_1._depsConllToJson)('1:dep:blop')).toStrictEqual({ '1': 'dep:blop' });
    expect((0, conll_1._depsConllToJson)('1:dep:blop|2:mod')).toStrictEqual({ '1': 'dep:blop', '2': 'mod' });
    expect((0, conll_1._depsConllToJson)('1.2:dep:blop|2:mod')).toStrictEqual({ '1.2': 'dep:blop', '2': 'mod' });
});
