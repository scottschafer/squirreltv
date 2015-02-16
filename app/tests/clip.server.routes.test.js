'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Clip = mongoose.model('Clip'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, clip;

/**
 * Clip routes tests
 */
describe('Clip CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Clip
		user.save(function() {
			clip = {
				name: 'Clip Name'
			};

			done();
		});
	});

	it('should be able to save Clip instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clip
				agent.post('/clips')
					.send(clip)
					.expect(200)
					.end(function(clipSaveErr, clipSaveRes) {
						// Handle Clip save error
						if (clipSaveErr) done(clipSaveErr);

						// Get a list of Clips
						agent.get('/clips')
							.end(function(clipsGetErr, clipsGetRes) {
								// Handle Clip save error
								if (clipsGetErr) done(clipsGetErr);

								// Get Clips list
								var clips = clipsGetRes.body;

								// Set assertions
								(clips[0].user._id).should.equal(userId);
								(clips[0].name).should.match('Clip Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Clip instance if not logged in', function(done) {
		agent.post('/clips')
			.send(clip)
			.expect(401)
			.end(function(clipSaveErr, clipSaveRes) {
				// Call the assertion callback
				done(clipSaveErr);
			});
	});

	it('should not be able to save Clip instance if no name is provided', function(done) {
		// Invalidate name field
		clip.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clip
				agent.post('/clips')
					.send(clip)
					.expect(400)
					.end(function(clipSaveErr, clipSaveRes) {
						// Set message assertion
						(clipSaveRes.body.message).should.match('Please fill Clip name');
						
						// Handle Clip save error
						done(clipSaveErr);
					});
			});
	});

	it('should be able to update Clip instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clip
				agent.post('/clips')
					.send(clip)
					.expect(200)
					.end(function(clipSaveErr, clipSaveRes) {
						// Handle Clip save error
						if (clipSaveErr) done(clipSaveErr);

						// Update Clip name
						clip.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Clip
						agent.put('/clips/' + clipSaveRes.body._id)
							.send(clip)
							.expect(200)
							.end(function(clipUpdateErr, clipUpdateRes) {
								// Handle Clip update error
								if (clipUpdateErr) done(clipUpdateErr);

								// Set assertions
								(clipUpdateRes.body._id).should.equal(clipSaveRes.body._id);
								(clipUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Clips if not signed in', function(done) {
		// Create new Clip model instance
		var clipObj = new Clip(clip);

		// Save the Clip
		clipObj.save(function() {
			// Request Clips
			request(app).get('/clips')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Clip if not signed in', function(done) {
		// Create new Clip model instance
		var clipObj = new Clip(clip);

		// Save the Clip
		clipObj.save(function() {
			request(app).get('/clips/' + clipObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', clip.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Clip instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Clip
				agent.post('/clips')
					.send(clip)
					.expect(200)
					.end(function(clipSaveErr, clipSaveRes) {
						// Handle Clip save error
						if (clipSaveErr) done(clipSaveErr);

						// Delete existing Clip
						agent.delete('/clips/' + clipSaveRes.body._id)
							.send(clip)
							.expect(200)
							.end(function(clipDeleteErr, clipDeleteRes) {
								// Handle Clip error error
								if (clipDeleteErr) done(clipDeleteErr);

								// Set assertions
								(clipDeleteRes.body._id).should.equal(clipSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Clip instance if not signed in', function(done) {
		// Set Clip user 
		clip.user = user;

		// Create new Clip model instance
		var clipObj = new Clip(clip);

		// Save the Clip
		clipObj.save(function() {
			// Try deleting Clip
			request(app).delete('/clips/' + clipObj._id)
			.expect(401)
			.end(function(clipDeleteErr, clipDeleteRes) {
				// Set message assertion
				(clipDeleteRes.body.message).should.match('User is not logged in');

				// Handle Clip error error
				done(clipDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Clip.remove().exec();
		done();
	});
});