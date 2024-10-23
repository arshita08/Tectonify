const questions = require('../../../models').questions;
const fs = require('fs');

const getAll = async (req, res, next) => {
  const questiondata = await questions.findAll();
  res.json({ message: "questions Fetched Successfuly", data: questiondata });
};
const create = async (req, res, next) => {

  const isExist = await questions.findOne(
    {
      where: {
        key: req.body.key
      },

    });
  if (isExist) {
    res.json({ message: "questions Already Exist", data: "already exist" });
  }
  const question = JSON.stringify([req.body.question]);
  const answer = JSON.stringify([req.body.answers]);
  const questioncreate = await questions.create({
    "key": req.body.key,
    "question": question,
    "answers": answer
  });
  const storefile = `./aiquestion.json`;

  fs.access(storefile, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(err, "error")
    } else {
      const savedata = savequestions(storefile, questioncreate);
    }
  })
  res.json({ message: "questions Created Successfully", data: questioncreate });
};

const addmultipleanswer = async (req, res, next) => {

  const questiondata = await questions.findOne(
    {
      where: {
        id: req.body.id
      },

    });
  if (!questiondata) {
    res.status(404).send("Not exist")
  }

  const currentanswers = JSON.parse(questiondata.answers);
  const newanswer = [...currentanswers, req.body.answers];
  questiondata.set('answers', JSON.stringify(newanswer));
  questiondata.save();
  const storefile = `./aiquestion.json`;

  fs.access(storefile, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(err, "error")
    } else {
      const savedata = savequestions(storefile, questiondata);
    }
  })
  res.json({ message: "answer added Successfully", data: questiondata });
};

const addmultiplequestion = async (req, res, next) => {

  const questiondata = await questions.findOne(
    {
      where: {
        id: req.body.id
      },

    });
  if (!questiondata) {
    res.status(404).send("Not exist")
  }

  const currentquestion = JSON.parse(questiondata.question);
  const newquestion = [...currentquestion, req.body.question];
  questiondata.set('question', JSON.stringify(newquestion));
  questiondata.save();
  const storefile = `./aiquestion.json`;

  fs.access(storefile, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(err, "error")
    } else {
      const savedata = savequestions(storefile, questiondata);
    }
  })
  res.json({ message: "questions added Successfully", data: questiondata });
};

const deletequestion = async (req, res, next) => {

  const id = Number(req.params.id);
  const isExist = await questions.findOne(
    {
      where: {
        id: id
      },

    });
  if (!isExist) {
    res.status(404).send("question Not found");
  }
  const storefile = `./aiquestion.json`;

  fs.access(storefile, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(err, "error")
    } else {
      const savedata = savedelete(storefile, isExist);
    }
  });
  await isExist.destroy();
  res.json({ message: "questions deleted Successfully" });
};

function savequestions(storefile, questiondata) {

  fs.readFile(storefile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      return res.status(500).json({ error: 'Failed to read data.json' });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);

      var currentdata = jsonData.data;
      var deletepreviouskeydata = currentdata.filter(item => item.intent !== questiondata.key);
      var addtodata = {
        "intent": questiondata.key,
        "utterances": JSON.parse(questiondata.question),
        "answers": JSON.parse(questiondata.answers)
      }
      deletepreviouskeydata.push(addtodata);
      jsonData.data = deletepreviouskeydata;

    } catch (parseError) {
      console.error('Error parsing data.json:', parseError);
      return res.status(500).json({ error: 'Failed to parse data.json' });
    }
    const updatedData = JSON.stringify(jsonData, null, 2);

    fs.writeFile(storefile, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing data.json:', writeErr);
        return res.status(500).json({ error: 'Failed to write data.json' });
      }
    });
  });
  return true;
}

function savedelete(storefile, questiondata) {

  fs.readFile(storefile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      return res.status(500).json({ error: 'Failed to read data.json' });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(data);

      var currentdata = jsonData.data;
      var deletepreviouskeydata = currentdata.filter(item => item.intent !== questiondata.key);

      jsonData.data = deletepreviouskeydata;

    } catch (parseError) {
      console.error('Error parsing data.json:', parseError);
      return res.status(500).json({ error: 'Failed to parse data.json' });
    }
    const updatedData = JSON.stringify(jsonData, null, 2);

    fs.writeFile(storefile, updatedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing data.json:', writeErr);
        return res.status(500).json({ error: 'Failed to write data.json' });
      }
    });
  });
  return true;
}





module.exports = {
  getAll,
  create,
  addmultiplequestion,
  addmultipleanswer,
  deletequestion
};