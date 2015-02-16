'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var clips = require('../../app/controllers/clips.server.controller');

	// Clips Routes
	app.route('/clips')
		.get(clips.list)
		.post(users.requiresLogin, clips.create);

	app.route('/clips/:clipId')
		.get(clips.read)
		.put(users.requiresLogin, clips.hasAuthorization, clips.update)
		.delete(users.requiresLogin, clips.hasAuthorization, clips.delete);

	// Finish by binding the Clip middleware
	app.param('clipId', clips.clipByID);
};
