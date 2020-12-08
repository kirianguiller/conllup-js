import {
  _seperateMetaAndTreeFromSentenceConll,
  _tabDictToJson,
  _metaConllLinesToJson,
  _tokenLineToJson,
  _extractTokenTabData,
  _treeConllLinesToJson,
  sentenceConllToJson,
} from './conll';

const featureConll = 'feat_key1=feat_value1|feat_key2=feat_value2';

const tokenLine: string =
  '1\tform\tlemma\tupos\txpos\tfeat_key=feat_value\t2\tdeprel\tdep_key=dep_value\tmisc_key=misc_value';

const tokenJson: { [key: string]: any } = {
  ID: 1,
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

const metaJson: { [key: string]: string } = { meta_key: 'meta_value' };
const treeJson: { [key: number]: any } = { 1: tokenJson };
const sentenceJson: { [key: string]: any } = { metaJson, treeJson };

const metaConll: string = '# meta_key = meta_value';
const metaConllLines: string[] = metaConll.split('\n');
const treeConll: string = `${tokenLine}`;
const treeConllLines: string[] = treeConll.split('\n');
const sentenceConll: string = `${metaConll}\n${treeConll}`;

test('_seperateMetaAndTreeFromSentenceConll', () => {
  expect(_seperateMetaAndTreeFromSentenceConll(sentenceConll)).toStrictEqual({
    metaLines: metaConllLines,
    treeLines: treeConllLines,
  });
});

test('_tabDictToJson', () => {
  expect(_tabDictToJson(featureConll)).toStrictEqual({ feat_key1: 'feat_value1', feat_key2: 'feat_value2' });
  expect(_tabDictToJson('_')).toStrictEqual({});
});

test('_metaConllLinesToJson', () => {
  expect(_metaConllLinesToJson(metaConllLines)).toStrictEqual({ meta_key: 'meta_value' });
});

test('_extractTokenTabData', () => {
  expect(_extractTokenTabData('3', 'int')).toBe(3);
  expect(_extractTokenTabData('3', 'str')).toBe('3');
  expect(() => {
    _extractTokenTabData('3', 'fake_type');
  }).toThrowError('fake_type is not a correct type');
});

test('_tokenLineToJson', () => {
  expect(_tokenLineToJson(tokenLine)).toStrictEqual(tokenJson);
});

test('_treeConllLinesToJson', () => {
  expect(_treeConllLinesToJson(treeConllLines)).toStrictEqual(treeJson);
});

test('sentenceConllToJson', () => {
  expect(sentenceConllToJson(sentenceConll)).toStrictEqual(sentenceJson);
});
