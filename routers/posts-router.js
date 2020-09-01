const express = require("express");

const Actions = require("../data/db.js");

const router = express.Router();

router.get("/", (req, res) => {
	Actions.find()
		.then((array) => {
			res.status(200).json(array);
		})
		.catch((err) => {
			res.status(500).json({ error: "The posts information could not be retrieved." });
		});
}); // working

router.get("/:id", (req, res) => {
	Actions.findById(req.params.id)
		.then((arrayItem) => {
			if (arrayItem) {
				res.status(200).json(arrayItem);
			} else {
				res.status(500).json({ message: "The post information could not be retrieved!" });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(404).json({ message: "The post with the specified ID does not exist!" });
		});
}); // working

router.get("/:id/comments", (req, res) => {
	Actions.findById(req.params.id)
		.then((commentId) => {
			Actions.findPostComments(req.params.id)
				.then((comments) => {
					res.status(201).json(comments);
				})
				.catch((error) => {
					res.status(500).json({ message: "The comments information could not be retrieved!" });
				});
		})
		.catch((error) => {
			res.status(404).json({ message: "The post with the specified ID does not exist!" });
		});
}); // working

router.post("/", (req, res) => {
	const post = req.body;

	if (!post.title || !post.contents) {
		res.status(400).json({ message: "Please provide title and contents to your post" });
	} else {
		try {
			Actions.insert(post);
			res.status(201).json(post);
		} catch {
			res.status(500).json({ message: "There was an error while saving the post to the database" });
		}
	}
}); // working

router.post("/:id/comments", (req, res) => {
	const newComment = req.body;

	Actions.findById(req.params.id)
		.then((comment) => {
			if (!newComment.text) {
				res.status(400).json({ message: "Please provide text for the comment!" });
			} else {
				Actions.insertComment(newComment)
					.then((result) => {
						res.status(201).json(newComment);
					})
					.catch((error) => {
						res
							.status(500)
							.json({ message: "There was an error while saving the comment to the database!" });
					});
			}
		})
		.catch((error) => {
			res.status(404).json({ message: "The post with the specified ID does not exist!" });
		});
}); // working

router.delete("/:id", (req, res) => {
	Actions.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({ message: "The post have been nuked from orbit!" });
			} else {
				res.status(500).json({ message: "The post could not be removed or was already removed!" });
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(404).json({ message: "The post with the specified ID does not exist!" });
		});
}); // working

router.put("/:id", (req, res) => {
	const updatedPost = req.body;

	Actions.findById(req.params.id)
		.then((arrayItem) => {
			if (!updatedPost.title || !updatedPost.contents) {
				res.status(400).json({
					message: "Please provide title and contents for the post! These fields are required!",
				});
			} else {
				try {
					Actions.update(req.params.id, updatedPost)
						.then((thing) => {
							res.status(200).json(thing);
						})
						.catch((error) => {
							res.status(500).json({ error: "The post information could not be modified!" });
						});
				} catch {
					res.status(500).json({ message: "There was an error while trying to update this post!" });
				}
			}
		})
		.catch((error) => {
			res.status(404).json({ message: "The post with the specified ID does not exist!" });
		});
});

module.exports = router;
// export default router
