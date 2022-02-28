const { Comment, Pizza } = require('../models');

const commentController = {
    addComment({ params, body }, res) {
        Comment.create(body)
        .then (({ _id }) => {
            return Pizza.findOneAndUpdate(
                {_id: params.pizzaId },
                { $push: { comments: _id } }, // push adds comments id to the specific pizza we update
                { new: true } // update the pizza document to include a new comment
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No Pizza found with this id' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    //remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id '});
            }
            return Pizza.findOneAndUpdate(
                {_id: params.pizzaId },
                { $pull: { comments: params.commentId } }, // pull removes comments id from the specific pizza
                { new: true } // update the pizza document without the newly removed comment id
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
};


module.exports = commentController;