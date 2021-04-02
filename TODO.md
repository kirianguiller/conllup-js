handle undefined conll in input


handle row with less than 10 properties 
exemple :       
# text_en = It is the team of Avengers which is reconstituted under the aegis of SHIELD
# text = C'est l'équipe des Vengeurs qui est reconstituée sous l'égide du SHIELD
1	C'	ce	PRON	_	_	2	subj@expl	_	Gloss=It
2	est	être	AUX	_	_	0	root	_	Gloss=is
3	l'	le	DET	_	_	4	det	_	Gloss=the
4	équipe	équipe	NOUN	_	_	2	comp:pred	_	Gloss=team
5	de	de	ADP	_	_	4	udep	_	Gloss=of
6	les	le	DET	_	_	7	det	_	Gloss=the
7	Vengeurs	vengeur	NOUN	_	_	5	comp:obj	_	Gloss=Avengers
8	qui	qui	PRON	_	_	9	subj	_	Gloss=which
9	est	être	AUX	_	_	2	comp:cleft	_	Gloss=is
10	reconstituée	reconstituer	VERB	_	_	9	comp:aux@tense	_	Gloss=reconstituted
11	sous	sous	ADP	_	_	9	mod	_	Gloss=under
12	l'	le	DET	_	_	13	det	_	Gloss=the
13	égide	égide	NOUN	_	_	11	comp:obj	_	Gloss=aegis
14	de	de	ADP	_	_	13	udep	_	Gloss=of
15	le	le	DET	_	_	16	det	_	Gloss=the
16	SHIELD	SHIELD	PROPN	_	_	14	comp:obj	_	Gloss=shield


# handle empty features (should become a "_" tag)