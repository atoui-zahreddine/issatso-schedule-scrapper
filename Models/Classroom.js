const mongoose = require('mongoose');

const SenssionObject = new mongoose.Schema({
  major: { type: String, required: true }
});

const DayObject = new mongoose.Schema({
  s1: SenssionObject,
  s2: SenssionObject,
  s3: SenssionObject,
  s4: SenssionObject,
  s5: SenssionObject,
  s6: SenssionObject
});

exports.Major = mongoose.model(
  'Classroom',
  new mongoose.Schema({
    classroom: { type: String, required: true },
    schedule: {
      type: new mongoose.Schema({
        '1-lundi': DayObject,
        '2-mardi': DayObject,
        '3-mercredi': DayObject,
        '4-jeudi': DayObject,
        '5-vendredi': DayObject,
        '6-samedi': DayObject
      }),
      required: true
    },
    updatedOn: { type: Date, required: true, default: Date.now }
  })
);
