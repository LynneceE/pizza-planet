const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat'); // import dateFormat file

const PizzaSchema = new Schema({
  pizzaName: {
    type: String
  },
  createdBy: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => dateFormat(createdAtVal) // getter that pulls dateFormatjs
  },
  size: {
    type: String,
    default: 'Large'
  },
  toppings: [],
  comments: [
    {
      type:Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
}, 
{
  toJSON: { //tell json it can use virtuals
    virtuals: true,
    getters: true // tell json to use getters
  },
  id: false //prevent virtuals from creating duplicate of '__id' as its not needed
}
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;
