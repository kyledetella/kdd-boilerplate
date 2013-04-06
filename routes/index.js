/*
 * GET index/landing view.
 */

exports.index = function(req, res) {
	res.render('', { title: 'KDD', dev: true });
};