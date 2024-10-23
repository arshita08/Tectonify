const { dockStart } = require('@nlpjs/basic');

const getanswer = async (question) => {
    const dock = await dockStart({ use: ['Basic'] });
    const nlp = dock.get('nlp');
    const shopfile = `./aiquestion.json`;
    await nlp.addCorpus(shopfile);
    await nlp.train();
    const response = await nlp.process('en', question);
    const answer=response.answer;
    return answer;
}

module.exports={getanswer}