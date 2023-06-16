"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conll_1 = require("./conll");
exports.default = {
    sentenceConllToJson: conll_1.sentenceConllToJson,
    sentenceJsonToConll: conll_1.sentenceJsonToConll,
    emptySentenceJson: conll_1.emptySentenceJson,
    emptyMetaJson: conll_1.emptyMetaJson,
    emptyTreeJson: conll_1.emptyTreeJson,
    emptyTokenJson: conll_1.emptyTokenJson,
    emptyFeaturesJson: conll_1.emptyFeaturesJson,
    replaceArrayOfTokens: conll_1.replaceArrayOfTokens,
    constructTextFromTreeJson: conll_1.constructTextFromTreeJson,
};
